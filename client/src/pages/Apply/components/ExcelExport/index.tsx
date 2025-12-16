import * as XLSX from "xlsx";
import { Button } from "antd";

// 定义数据类型
interface ProjectRow {
  项目名称: string;
  项目描述: string;
  项目金额: number;
  项目开始时间: string;
  项目结束时间: string;
}

const TableExcel = () => {
  const exportToExcel = (filename = "export.xlsx") => {
    const data: ProjectRow[] = [
      {
        项目名称: '项目A',
        项目描述: '这是一个非常重要的项目',
        项目金额: 10000,
        项目开始时间: '2023-01-01',
        项目结束时间: '2023-01-31',
      },
    ];

    // 处理空数据情况
    if (data.length === 0) {
      // 创建空表头
      const worksheet = XLSX.utils.aoa_to_sheet([[
        '姓名', '手机号', '城市', '项目名称', '项目描述', '项目金额', '项目开始时间', '项目结束时间'
      ]]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "项目列表");
      XLSX.writeFile(workbook, filename);
      return;
    }

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 获取所有列名（确保顺序一致）
    const headers = Object.keys(data[0]) as (keyof ProjectRow)[];

    // 计算每列宽度
    const colWidths: { wch: number }[] = headers.map((header) => {
      const headerLength = header.length;
      const contentMaxLength = Math.max(
        ...data.map(row => {
          const value = row[header];
          return value != null ? String(value).length : 0;
        })
      );
      const maxLength = Math.max(headerLength, contentMaxLength);
      // 设置最小宽度 8，最大 30，中文友好（+2 padding）
      return { wch: Math.min(30, Math.max(8, maxLength + 2)) };
    });

    // 安全地设置列宽（使用类型断言或扩展接口）
    (worksheet as XLSX.WorkSheet)['!cols'] = colWidths;

    // 创建工作簿并导出
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "项目列表");
    XLSX.writeFile(workbook, filename);
  };

  return (
    <Button
      variant="filled"
      color="cyan"
      onClick={() => exportToExcel("表格模板.xlsx")}
    >
      下载表格模板
    </Button>
  );
};

export default TableExcel;