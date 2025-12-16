require('dotenv').config();

const express = require('express')

const multer = require('multer');
//创建服务器
const file = express.Router()

// 后端接口 /api/get-cos-credentials
const COS = require('cos-nodejs-sdk-v5');

const upload = multer({
  storage: multer.memoryStorage(), // 文件以 Buffer 形式存在内存中（适合上传到 COS/S3）
  limits: {
    fileSize: 10 * 1024 * 1024, // 限制 10MB
  },
});

const cos = new COS({
  SecretId: process.env.SECRET_ID,
  SecretKey: process.env.SECRET_KEY,
});

file.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const key = `${Date.now()}-${req.file.originalname}`;

  // 封装 putObject 为 Promise
  const putObject = (params) => {
    return new Promise((resolve, reject) => {
      cos.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  try {
    const result = await putObject({
      Bucket: 'approval-image-1376173969',
      Region: 'ap-chongqing',
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    const url = `https://${result.Location}`;
    res.json({ url });
  } catch (err) {
    console.error('COS Upload Error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = file
