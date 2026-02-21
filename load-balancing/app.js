/*
 * @Author: lvdengming@foxmail.com
 * @Date: 2026-02-21 09:56:11
 * @LastEditors: lvdengming@foxmail.com
 * @LastEditTime: 2026-02-21 10:34:02
 */
require('dotenv').config();
const express = require('express');
const os = require('os');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require('fs');

const app = express();

// 确保日志目录存在
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 创建按天轮转的日志文件流
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});

// 使用 morgan 记录所有请求到文件（自定义格式：包含时间、方法、URL、状态码、响应时间）
app.use(morgan('combined', { stream: accessLogStream }));

// 可选：同时输出到控制台（开发调试用）
app.use(morgan('dev'));

// 获取本机局域网 IP 或主机名，用于标识服务器
const hostname = os.hostname();
const networkInterfaces = os.networkInterfaces();
let localIp = 'unknown';
outer: for (const name of Object.keys(networkInterfaces)) {
  for (const net of networkInterfaces[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      break outer;
    }
  }
}

app.get('/api/info', (req, res) => {
  res.json({
    message: 'Hello from Node.js',
    server: hostname,
    ip: localIp,
    timestamp: new Date().toISOString(),
  });
});

// 健康检查接口（方便 Nginx 健康检查）
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(process.env.PORT, () => {
  console.log(`Node.js app listening at http://localhost:${process.env.PORT}`);
  console.log(`Server hostname: ${hostname}, IP: ${localIp}`);
  console.log(`Logs are stored in ${logDirectory}`);
});
