/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : localhost:3306
 Source Schema         : approval_project

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 09/12/2025 22:27:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `key` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '审批状态：pending（待审批）/approved（已审批）/rejected（已拒绝）/withdrawn（已撤回）',
  `createTime` datetime NOT NULL COMMENT '创建时间',
  `approvalTime` datetime NULL DEFAULT NULL COMMENT '审批完成时间',
  `approvalItem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '审批事项名称',
  `approvalDepartment` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '申请部门',
  `approvalContent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '审批内容详情',
  `executionTime` date NOT NULL COMMENT '计划执行日期',
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '项目审批表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES (1, 'pending', '2025-12-06 15:58:39', NULL, '新项目立项申请', '产品部/技术部/AI创新团队', '关于AI助手产品的初步规划', '2024-06-15');
INSERT INTO `project` VALUES (2, 'approved', '2024-04-02 10:30:00', '2024-04-03 14:20:00', '培训预算审批', '人才发展部/学习中心/HRBP团队', '2024年Q2员工培训经费申请', '2024-07-20');
INSERT INTO `project` VALUES (3, 'rejected', '2024-04-03 11:15:00', '2024-04-04 15:45:00', '采购设备申请', '运营部/采购部/后勤团队', '采购笔记本电脑50台', '2024-05-10');
INSERT INTO `project` VALUES (4, 'withdrawn', '2024-04-04 13:00:00', NULL, '外包服务合同', '产品部/技术部/AI创新团队', '外包AI模型训练服务', '2024-08-01');
INSERT INTO `project` VALUES (5, 'withdrawn', '2024-04-05 08:45:00', NULL, '系统升级计划', '运营部/采购部/后勤团队', '服务器集群扩容方案', '2024-06-05');
INSERT INTO `project` VALUES (6, 'approved', '2024-04-06 14:20:00', '2024-04-07 10:10:00', '招聘需求审批', '人才发展部/学习中心/HRBP团队', '招聘数据分析师2名', '2024-05-30');
INSERT INTO `project` VALUES (7, 'pending', '2025-12-05 19:26:27', NULL, '海外推广预算132', '产品部/技术部/AI创新团队', '东南亚市场推广费用申请', '2024-09-15');
INSERT INTO `project` VALUES (8, 'withdrawn', '2024-04-08 17:30:00', NULL, '内部系统迁移', '运营部/采购部/后勤团队', 'ERP系统迁移至云平台', '2024-10-01');
INSERT INTO `project` VALUES (9, 'pending', '2025-12-05 19:01:22', NULL, 'AI算法优化123', '产品部/技术部/AI创新团队', '提升图像识别准确率', '2024-07-10');
INSERT INTO `project` VALUES (10, 'approved', '2024-04-10 12:00:00', '2024-04-11 16:00:00', '办公用品采购', '人才发展部/学习中心/HRBP团队', '文具及打印机耗材采购', '2024-05-01');
INSERT INTO `project` VALUES (11, 'approved', '2025-12-05 16:57:10', '2025-12-05 19:29:36', '123', '运营部/采购部/后勤团队', '123', '2025-12-05');
INSERT INTO `project` VALUES (12, 'withdrawn', '2025-12-05 19:26:55', NULL, '1111', '运营部/采购部/后勤团队', '你在', '2025-12-04');
INSERT INTO `project` VALUES (13, 'withdrawn', '2025-12-06 11:14:06', NULL, '1234', '运营部/采购部/后勤团队', '1', '2025-12-06');
INSERT INTO `project` VALUES (14, 'rejected', '2025-12-06 15:54:33', '2025-12-06 16:04:04', '2', '人才发展部/学习中心/HRBP团队', '2', '2025-12-06');
INSERT INTO `project` VALUES (15, 'withdrawn', '2025-12-06 16:28:45', NULL, '4', '运营部/采购部/后勤团队', '4', '2025-12-05');
INSERT INTO `project` VALUES (16, 'approved', '2025-12-06 16:29:12', '2025-12-07 19:47:12', '5', '运营部/采购部/后勤团队', '5', '2025-12-05');
INSERT INTO `project` VALUES (17, 'rejected', '2025-12-06 19:51:36', '2025-12-07 19:46:07', '6', '运营部/采购部/后勤团队', '6', '2025-12-06');
INSERT INTO `project` VALUES (18, 'approved', '2025-12-07 16:02:50', '2025-12-07 19:41:49', '8', '品牌部/数字营销部/增长黑客团队', '8', '2025-12-08');
INSERT INTO `project` VALUES (19, 'approved', '2025-12-07 16:14:05', '2025-12-07 19:40:05', '9', '运营部/采购部/后勤团队', '9', '2025-12-07');
INSERT INTO `project` VALUES (20, 'approved', '2025-12-07 19:36:59', '2025-12-07 19:38:25', '10', '运营部/采购部/后勤团队', '10', '2025-12-07');
INSERT INTO `project` VALUES (21, 'withdrawn', '2025-12-07 19:49:28', NULL, '11', '运营部/采购部/后勤团队', '11', '2025-12-07');
INSERT INTO `project` VALUES (22, 'withdrawn', '2025-12-07 19:56:27', NULL, '12', '运营部/采购部/后勤团队', '12', '2025-12-07');
INSERT INTO `project` VALUES (23, 'withdrawn', '2025-12-07 20:05:47', NULL, '13', '运营部/采购部/后勤团队', '13', '2025-12-08');
INSERT INTO `project` VALUES (24, 'withdrawn', '2025-12-07 20:06:52', NULL, '14', '运营部/采购部/后勤团队', '14', '2025-12-07');
INSERT INTO `project` VALUES (25, 'withdrawn', '2025-12-07 20:10:05', NULL, '15', '产品部/技术部/AI创新团队', '15', '2025-12-07');
INSERT INTO `project` VALUES (26, 'withdrawn', '2025-12-07 20:16:15', NULL, '16', '运营部/采购部/后勤团队', '16', '2025-12-07');
INSERT INTO `project` VALUES (27, 'pending', '2025-12-07 21:25:41', NULL, '17', '运营部/采购部/后勤团队', '17', '2025-12-07');
INSERT INTO `project` VALUES (28, 'approved', '2025-12-07 21:43:27', '2025-12-08 09:36:18', '18', '运营部/采购部/后勤团队', '18', '2025-12-07');
INSERT INTO `project` VALUES (29, 'approved', '2025-12-07 21:48:29', '2025-12-07 21:56:27', '19', '运营部/采购部/后勤团队', '19', '2025-12-10');
INSERT INTO `project` VALUES (30, 'withdrawn', '2025-12-07 21:57:31', NULL, '2011', '运营部/采购部/后勤团队', '20', '2025-12-08');
INSERT INTO `project` VALUES (31, 'approved', '2025-12-08 09:56:51', '2025-12-08 16:13:38', '211', '品牌部/数字营销部/增长黑客团队', '121', '2025-12-08');
INSERT INTO `project` VALUES (32, 'approved', '2025-12-08 15:54:03', '2025-12-08 15:54:31', '25', '运营部/采购部/后勤团队', '25', '2025-12-08');
INSERT INTO `project` VALUES (33, 'pending', '2025-12-08 16:11:25', NULL, '267', '运营部/采购部/后勤团队', '26', '2025-12-08');
INSERT INTO `project` VALUES (34, 'approved', '2025-12-08 16:13:26', '2025-12-08 16:13:34', '27', '品牌部/数字营销部/增长黑客团队', '27', '2025-12-08');
INSERT INTO `project` VALUES (35, 'pending', '2025-12-08 19:58:51', NULL, '26', '运营部/采购部/后勤团队', '26', '2025-12-08');
INSERT INTO `project` VALUES (36, 'rejected', '2025-12-09 19:57:47', '2025-12-09 19:58:17', '27', '人才发展部/学习中心/HRBP团队', '27', '2025-12-08');

-- ----------------------------
-- Table structure for project_excelfile
-- ----------------------------
DROP TABLE IF EXISTS `project_excelfile`;
CREATE TABLE `project_excelfile`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `create_time` datetime NULL DEFAULT NULL,
  `is_deleted` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  CONSTRAINT `project_excelfile_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`key`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_excelfile
-- ----------------------------
INSERT INTO `project_excelfile` VALUES (1, 19, '1765095230720', '表格模板 (2).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%282%29.xlsx', '2025-12-07 16:14:05', '1');
INSERT INTO `project_excelfile` VALUES (2, 19, '1765104385411', '表格模板 (1).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%281%29.xlsx', NULL, '1');
INSERT INTO `project_excelfile` VALUES (3, 19, '1765104429378', '表格模板 (3).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%283%29.xlsx', NULL, '0');
INSERT INTO `project_excelfile` VALUES (4, 20, '1765107409931', '当前页数据.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E5%BD%93%E5%89%8D%E9%A1%B5%E6%95%B0%E6%8D%AE.xlsx', '2025-12-07 19:36:59', '0');
INSERT INTO `project_excelfile` VALUES (5, 21, '1765108162727', '表格模板 (1).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%281%29.xlsx', '2025-12-07 19:49:28', '0');
INSERT INTO `project_excelfile` VALUES (6, 22, '1765108585933', '表格模板 (2).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%282%29.xlsx', '2025-12-07 19:56:27', '0');
INSERT INTO `project_excelfile` VALUES (7, 23, '1765109139876', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF.xlsx', '2025-12-07 20:05:47', '0');
INSERT INTO `project_excelfile` VALUES (8, 24, '1765109209197', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF.xlsx', '2025-12-07 20:06:52', '0');
INSERT INTO `project_excelfile` VALUES (9, 25, '1765109396878', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF.xlsx', '2025-12-07 20:10:05', '0');
INSERT INTO `project_excelfile` VALUES (10, 26, '1765109773391', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF.xlsx', '2025-12-07 20:16:15', '0');
INSERT INTO `project_excelfile` VALUES (11, 27, '1765113937941', '表格模板 (1).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%281%29.xlsx', '2025-12-07 21:25:41', '0');
INSERT INTO `project_excelfile` VALUES (12, 28, '1765115005299', '表格模板 (2).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%282%29.xlsx', '2025-12-07 21:43:27', '0');
INSERT INTO `project_excelfile` VALUES (13, 29, '1765115306989', '表格模板 (1).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%281%29.xlsx', '2025-12-07 21:48:29', '0');
INSERT INTO `project_excelfile` VALUES (14, 30, '1765115849230', '表格模板 (2).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%282%29.xlsx', '2025-12-07 21:57:31', '0');
INSERT INTO `project_excelfile` VALUES (15, 31, '1765159006499', '表格模板 (2).xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF%20%282%29.xlsx', '2025-12-08 09:56:51', '0');
INSERT INTO `project_excelfile` VALUES (16, 32, '1765180437655', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF.xlsx', '2025-12-08 15:54:03', '0');
INSERT INTO `project_excelfile` VALUES (17, 33, '1765181483694', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF.xlsx', '2025-12-08 16:11:25', '0');
INSERT INTO `project_excelfile` VALUES (18, 34, '1765181604725', '当前页数据.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/%E5%BD%93%E5%89%8D%E9%A1%B5%E6%95%B0%E6%8D%AE.xlsx', '2025-12-08 16:13:26', '0');
INSERT INTO `project_excelfile` VALUES (19, 35, '1765195130180', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/1765195129603-%C3%A8%C2%A1%C2%A8%C3%A6%C2%A0%C2%BC%C3%A6%C2%A8%C2%A1%C3%A6%C2%9D%C2%BF.xlsx', '2025-12-08 19:58:51', '0');
INSERT INTO `project_excelfile` VALUES (20, 36, '1765281465806', '表格模板.xlsx', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/1765281464982-%C3%A8%C2%A1%C2%A8%C3%A6%C2%A0%C2%BC%C3%A6%C2%A8%C2%A1%C3%A6%C2%9D%C2%BF.xlsx', '2025-12-09 19:57:47', '0');

-- ----------------------------
-- Table structure for project_files
-- ----------------------------
DROP TABLE IF EXISTS `project_files`;
CREATE TABLE `project_files`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `uid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  CONSTRAINT `project_files_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`key`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_files
-- ----------------------------
INSERT INTO `project_files` VALUES (1, 13, '1764990776537', 'bg3.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg3.jpg', '2025-12-06 11:14:06', '0');
INSERT INTO `project_files` VALUES (2, 14, '1764991044560', 'bg2.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg2.jpg', '2025-12-06 11:17:40', '1');
INSERT INTO `project_files` VALUES (3, 14, '1764991056678', 'bg4.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg4.jpg', '2025-12-06 11:17:40', '0');
INSERT INTO `project_files` VALUES (4, 14, '1765007479121', 'poster.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/poster.jpg', '2025-12-06 15:54:33', '0');
INSERT INTO `project_files` VALUES (5, 1, '1765007872966', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-06 15:57:58', '1');
INSERT INTO `project_files` VALUES (6, 1, '1765007915483', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-06 15:58:39', '0');
INSERT INTO `project_files` VALUES (7, 15, '1765009723103', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-06 16:28:45', '0');
INSERT INTO `project_files` VALUES (8, 16, '1765009748387', 'bg2.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg2.jpg', '2025-12-06 16:29:12', '0');
INSERT INTO `project_files` VALUES (9, 17, '1765021892415', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-06 19:51:37', '0');
INSERT INTO `project_files` VALUES (10, 18, '1765094531755', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-07 16:02:50', '0');
INSERT INTO `project_files` VALUES (11, 19, '1765095218972', 'bg2.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg2.jpg', '2025-12-07 16:14:05', '0');
INSERT INTO `project_files` VALUES (12, 20, '1765107401323', 'img.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/img.jpg', '2025-12-07 19:36:59', '0');
INSERT INTO `project_files` VALUES (13, 21, '1765108153938', 'mi.webp', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/mi.webp', '2025-12-07 19:49:28', '0');
INSERT INTO `project_files` VALUES (14, 22, '1765108577701', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 19:56:27', '0');
INSERT INTO `project_files` VALUES (15, 23, '1765109128082', 'img.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/img.jpg', '2025-12-07 20:05:47', '0');
INSERT INTO `project_files` VALUES (16, 24, '1765109200157', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 20:06:52', '0');
INSERT INTO `project_files` VALUES (17, 25, '1765109384450', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 20:10:05', '0');
INSERT INTO `project_files` VALUES (18, 26, '1765109765850', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 20:16:15', '0');
INSERT INTO `project_files` VALUES (19, 27, '1765113928318', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 21:25:41', '0');
INSERT INTO `project_files` VALUES (20, 28, '1765114998206', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 21:43:27', '0');
INSERT INTO `project_files` VALUES (21, 29, '1765115300459', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-07 21:48:29', '0');
INSERT INTO `project_files` VALUES (22, 30, '1765115842064', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-07 21:57:31', '0');
INSERT INTO `project_files` VALUES (23, 31, '1765158998499', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/bg1.jpg', '2025-12-08 09:56:51', '0');
INSERT INTO `project_files` VALUES (24, 32, '1765180430468', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-08 15:54:03', '0');
INSERT INTO `project_files` VALUES (25, 33, '1765181475581', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-08 16:11:25', '0');
INSERT INTO `project_files` VALUES (26, 34, '1765181596263', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/ldh.png', '2025-12-08 16:13:26', '0');
INSERT INTO `project_files` VALUES (27, 33, '1765181661631', 'img.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/img.jpg', '2025-12-08 16:14:25', '0');
INSERT INTO `project_files` VALUES (28, 35, '1765195093708', 'bg1.jpg', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/1765195088490-bg1.jpg', '2025-12-08 19:58:51', '0');
INSERT INTO `project_files` VALUES (29, 36, '1765281453008', 'ldh.png', 'done', 'https://approval-image-1376173969.cos.ap-chongqing.myqcloud.com/1765281453021-ldh.png', '2025-12-09 19:57:47', '0');

SET FOREIGN_KEY_CHECKS = 1;
