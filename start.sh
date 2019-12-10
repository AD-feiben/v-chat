#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

rm -rf server/public
cp -r dist/. server/public
# 启动 node fuwu
npm run server
