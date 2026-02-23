<!--
 * @Author: lvdengming@foxmail.com
 * @Date: 2026-02-23 10:14:36
 * @LastEditors: lvdengming@foxmail.com
 * @LastEditTime: 2026-02-23 10:30:20
-->

# load-balancing

负载均衡测试

服务器A 80端口作为服务入口

通过nginx转发到服务器A 3000端口和服务器B 3000端口

通过`morgan`+`rotating-file-stream`，将接口请求日志按天存储、压缩

通过 `gunzip -c logs/access.log.20250220.gz` 解压日志文件

通过 `wc -l access.log` 命令查看接口请求数量
