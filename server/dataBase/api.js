// api.js
const connection = require('./db');

// 查询审批单列表（支持动态筛选 + 分页）
const fetchApprovalList = (params) => {
  const {
    status,
    approvalItem,
    approvalDepartment, // 假设前端传的是字符串路径，如 "产品部/技术部/AI创新团队"
    createTimeStart,
    createTimeEnd,
    approvalTimeStart,
    approvalTimeEnd,
    currentPage = 1,           // 默认第1页，前端可指定
  } = params;
  const pageSize = 6;  // 固定每页6条数据

  let querySql = 'SELECT * FROM project';
  const conditions = [];
  const values = [];

  // 1. 审批状态筛选
  if (status && status !== 'all') {
    conditions.push('status = ?');
    values.push(status);
  }

  // 2. 项目名称模糊查询
  if (approvalItem) {
    conditions.push('approvalItem LIKE ?');
    values.push(`%${approvalItem}%`);
  }

  // 3. 部门模糊匹配（假设数据库中 department 字段存储为 "产品部/技术部/AI创新团队" 这样的路径）
  if (approvalDepartment) {
    conditions.push('approvalDepartment LIKE ?');
    values.push(`%${approvalDepartment}%`);
  }

  // 4. 创建时间范围
  if (createTimeStart) {
    conditions.push('createTime >= ?');
    values.push(createTimeStart);
  }
  if (createTimeEnd) {
    conditions.push('createTime <= ?');
    values.push(createTimeEnd);
  }

  // 5. 审批时间范围
  if (approvalTimeStart) {
    conditions.push('approvalTime >= ?');
    values.push(approvalTimeStart);
  }
  if (approvalTimeEnd) {
    conditions.push('approvalTime <= ?');
    values.push(approvalTimeEnd);
  }

  // 拼接 WHERE 子句
  if (conditions.length > 0) {
    querySql += ' WHERE ' + conditions.join(' AND ');
  }

  // 计算分页参数
  const offset = (currentPage - 1) * pageSize;
  querySql += ` LIMIT ? OFFSET ?`;
  values.push(pageSize, offset);

  // 构建获取总条数的SQL
  const countSql = conditions.length > 0 
    ? `SELECT COUNT(*) as total FROM project WHERE ${conditions.join(' AND ')}` 
    : 'SELECT COUNT(*) as total FROM project';

  return new Promise((resolve, reject) => {
    // 执行获取总条数的查询
    connection.query(countSql, conditions.length > 0 ? values.slice(0, -2) : [], (countErr, countResult) => {
      if (countErr) {
        console.error('Error executing count query:', countErr.message);
        reject(countErr);
        return;
      }

      // 执行获取分页数据的查询
      connection.query(querySql, values, (err, data) => {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
          return;
        }

        // 将NULL的approvalTime转换为'--'
        const processedData = data.map(item => ({
          ...item,
          approvalTime: item.approvalTime || '--'
        }));

        // 返回分页数据和总条数
        resolve({
          list: processedData,
          total: countResult[0].total,
          currentPage: parseInt(currentPage),
          pageSize: pageSize
        });
      });
    });
  });
};

// 查询审批单详情接口
const fetchApprovalDetail = (key) => {
  return new Promise((resolve, reject) => {
    // 第一步：查主表 project
    connection.query('SELECT * FROM project WHERE `key` = ?', [key], (err, projectRows) => {
      if (err) {
        console.error('Error fetching project:', err.message);
        return reject(err);
      }

      if (projectRows.length === 0) {
        return resolve(null); // 或 reject(new Error('Approval not found'))
      }

      const project = projectRows[0];

      // 第二步：查 project_files
      connection.query(
        'SELECT uid, name, status, url FROM project_files WHERE project_id = ? AND is_deleted = 0',
        [project.key],
        (err, fileRows) => {
          if (err) {
            console.error('Error fetching files:', err.message);
            return reject(err);
          }

          // 第三步：查 project_excelFile（单条）
          connection.query(
            'SELECT uid, name, status, url FROM project_excelFile WHERE project_id = ? AND is_deleted = 0',
            [project.key],
            (err, excelRows) => {
              if (err) {
                console.error('Error fetching excel file:', err.message);
                return reject(err);
              }

              const result = {
                ...project,
                fileList: fileRows,
                excelFile: excelRows.length > 0 ? excelRows[0] : null // 单个对象或 null
              };

              resolve(result);
            }
          );
        }
      );
    });
  });
};

// 更新审批单接口
const updateApproval = (key, params) => {
  const { fileList, excelFile, ...restParams } = params;

  const updateData = {
    ...restParams,
    approvalTime: null,
    status: 'pending',
  };

  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Failed to start transaction:', err.message);
        return reject(err);
      }

      // Step 1: 更新 project 表
      connection.query(
        'UPDATE project SET ? WHERE `key` = ?',
        [updateData, key],
        (err, result) => {
          if (err) {
            return connection.rollback(() => reject(err));
          }

          // Step 2: 处理 project_files（原有逻辑）
          connection.query(
            'SELECT uid FROM project_files WHERE project_id = ? AND is_deleted = 0',
            [key],
            (err, existingRows) => {
              if (err) {
                return connection.rollback(() => reject(err));
              }

              const existingUids = new Set(existingRows.map(row => row.uid));
              const incomingUids = new Set(fileList?.map(f => f.uid) || []);

              const queries = [];

              // 插入新文件
              const toInsert = (fileList || []).filter(f => !existingUids.has(f.uid));
              for (const file of toInsert) {
                queries.push({
                  sql: `
                    INSERT INTO project_files (project_id, uid, name, status, url, is_deleted)
                    VALUES (?, ?, ?, ?, ?, 0)
                  `,
                  values: [key, file.uid, file.name, file.status, file.url]
                });
              }

              // 软删除旧文件
              const toDelete = [...existingUids].filter(uid => !incomingUids.has(uid));
              if (toDelete.length > 0) {
                const placeholders = toDelete.map(() => '?').join(',');
                queries.push({
                  sql: `
                    UPDATE project_files
                    SET is_deleted = 1
                    WHERE project_id = ? AND uid IN (${placeholders})
                  `,
                  values: [key, ...toDelete]
                });
              }

              // Step 3: 处理 project_excelFile —— 新增智能对比逻辑
              connection.query(
                'SELECT uid FROM project_excelFile WHERE project_id = ? AND is_deleted = 0',
                [key],
                (err, excelRows) => {
                  if (err) {
                    return connection.rollback(() => reject(err));
                  }

                  const existingExcelUid = excelRows.length > 0 ? excelRows[0].uid : null;
                  const incomingExcelUid = excelFile ? excelFile.uid : null;

                  // 情况 1: 没有传 excelFile → 不做任何操作（保留原记录）
                  // 情况 2: 传了，且 uid 相同 → 不做任何操作
                  if (incomingExcelUid && existingExcelUid !== incomingExcelUid) {
                    // uid 不同：需要软删除旧记录 + 插入新记录

                    // 软删除旧 Excel 记录
                    queries.push({
                      sql: `
                        UPDATE project_excelFile
                        SET is_deleted = 1
                        WHERE project_id = ? AND is_deleted = 0
                      `,
                      values: [key]
                    });

                    // 插入新 Excel 记录
                    queries.push({
                      sql: `
                        INSERT INTO project_excelFile (project_id, uid, name, status, url, is_deleted)
                        VALUES (?, ?, ?, ?, ?, 0)
                      `,
                      values: [
                        key,
                        excelFile.uid,
                        excelFile.name,
                        excelFile.status,
                        excelFile.url
                      ]
                    });
                  }
                  // else: uid 相同 或 未传 excelFile → 无需操作

                  // 执行所有 queries（包括 files 和 excelFile）
                  let completed = 0;
                  const total = queries.length;

                  if (total === 0) {
                    connection.commit((err) => {
                      if (err) return connection.rollback(() => reject(err));
                      resolve(result);
                    });
                    return;
                  }

                  queries.forEach(({ sql, values }) => {
                    connection.query(sql, values, (err) => {
                      if (err) {
                        return connection.rollback(() => reject(err));
                      }
                      completed++;
                      if (completed === total) {
                        connection.commit((err) => {
                          if (err) return connection.rollback(() => reject(err));
                          resolve(result);
                        });
                      }
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

// 新建审批单接口
const createApproval = (params) => {
  const { fileList, excelFile, ...restParams } = params;

  const insertData = {
    ...restParams,
    status: 'pending',
    createTime: new Date(),
    approvalTime: null
  };

  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Transaction start failed:', err.message);
        return reject(err);
      }

      // 1. 插入主表 project
      connection.query('INSERT INTO project SET ?', insertData, (err, result) => {
        if (err) {
          return connection.rollback(() => reject(err));
        }

        const projectId = result.insertId;

        // 2. 批量插入 project_files（原有逻辑）
        let fileInsertPromise;
        if (fileList && fileList.length > 0) {
          const fileValues = fileList.map(file => [
            projectId,
            file.uid,
            file.name,
            file.status,
            file.url,
            new Date()
          ]);

          const sqlFiles = `
            INSERT INTO project_files (project_id, uid, name, status, url, create_time)
            VALUES ?
          `;

          fileInsertPromise = new Promise((resolveFile, rejectFile) => {
            connection.query(sqlFiles, [fileValues], (err) => {
              if (err) return rejectFile(err);
              resolveFile();
            });
          });
        } else {
          // 如果没有 fileList，直接 resolve
          fileInsertPromise = Promise.resolve();
        }

        // 3. 插入 project_excelFile（新增逻辑）
        let excelInsertPromise;
        if (excelFile) {
          const excelSql = `
            INSERT INTO project_excelFile (project_id, uid, name, status, url, create_time)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const excelValues = [
            projectId,
            excelFile.uid,
            excelFile.name,
            excelFile.status,
            excelFile.url,
            new Date()
          ];

          excelInsertPromise = new Promise((resolveExcel, rejectExcel) => {
            connection.query(excelSql, excelValues, (err) => {
              if (err) return rejectExcel(err);
              resolveExcel();
            });
          });
        } else {
          excelInsertPromise = Promise.resolve();
        }

        // 等待两个插入操作完成
        Promise.all([fileInsertPromise, excelInsertPromise])
          .then(() => {
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => reject(err));
              }
              resolve({
                projectId,
                insertedFiles: fileList?.length || 0,
                insertedExcel: excelFile ? 1 : 0
              });
            });
          })
          .catch((err) => {
            connection.rollback(() => reject(err));
          });
      });
    });
  });
};

// 撤回审批单接口
const withdrawApproval = (key) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE project SET status = "withdrawn" WHERE `key` = ?', [key], (err, data) => {
      if (err) {
        console.error('Error executing query:', err.message);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

// 处理审批单接口,根据传递过来的参数设置status的值为已审批或者已拒绝
const handleApproval = (params) => {
  return new Promise((resolve, reject) => {
    const key = params.key;
    const handleData = {
      status: params.status,
      approvalTime: new Date(),
    };
    connection.query('UPDATE project SET ? WHERE `key` = ?', [handleData, key], (err, data) => {
      if (err) {
        console.error('Error executing query:', err.message);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};



module.exports = {
  fetchApprovalList,
  fetchApprovalDetail,
  updateApproval,
  createApproval,
  withdrawApproval,
  handleApproval
};