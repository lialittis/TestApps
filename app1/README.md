# 前言
本文将从零至一，介绍如何在云服务器上通过 Docker 容器运行一个简单的Node应用。
本文假设读者已经掌握基本的Linux，Docker，Node，Express 知识。

# 基本步骤
1. 本地写好nodejs应用，放到github。
2. 云服务器安装docker，配置国内镜像加速。
3. 拉取一个node镜像。
4. 从github拉取项目代码。
5. 编写Dockerfile文件，构建镜像。
6. 根据镜像运行一个容器。
7. 本地进行访问。

# 具体步骤
1.编写Node应用
新建项目目录hello，进入目录，初始化项目：

```shell
npm  init
```

安装express模块
```shell
npm install express --save
```
项目根目录下新建 app.js ，当访问时返回Hello,Docker!，监听3000端口。
```javascript
// app.js
const express = require('express');  
const app = express();
app.get('/', function (req, res) {
 res.send('Hello,Docker!');
});  
app.listen(3000);
console.log('Server is running on http://localhost:3000');
```
2.安装Docker
远程连接服务器，安装Docker：
```shell
yum install -y docker
```

(Optional)安装成功以后，编辑/etc/docker/daemon.json 文件，配置国内镜像加速。可以选择的有阿里云镜像加速配置和daocloud镜像加速配置，在此不多赘述。
注意，修改完配置文件应该重启服务和Docker。

3.拉取Node镜像
拉取Node镜像
```shell
docker pull node:20
```
等待镜像拉取成功，可以查看下我们已经有的镜像:
```shell
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
node                  20                4c466ea4074f        8 days ago          1.1GB
```
4.部署项目代码
进入云服务某目录，从github上拉取项目代码。

5.编写Dockerfile文件
Dockerfile文件里是一条条能被Linux执行的命令，docker能根据该文件构建镜像。
该文件必须和项目文件放在一起，一般放在项目根目录下。
```
FROM node:20

# 创建容器内的项目存放目录
RUN mkdir -p /home/nodeapp
WORKDIR /home/nodeapp

#  将Dockerfile当前目录下所有文件拷贝至容器内项目目录并安装项目依赖
COPY . .
RUN npm install

# 容器对外暴露的端口号，要和node项目配置的端口号一致
EXPOSE 3000

# 容器启动时执行的命令
CMD [ "node", "app.js" ]
```

6.构建镜像
在项目根目录下执行命令构建对象：
```shell
docker build -t hello .
```
屏幕会按照Dockerfile内的指令一条条执行并显示在屏幕上。
构建完成，查看已有的镜像。
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hello               latest              84a10fa825e3        4 hours ago         1.1 GB
node                  20                4c466ea4074f        8 days ago          1.1GB
```
7.运行容器
通过镜像hello创建一个容器并运行：
```shell
docker run -d --name hellocontainer -p 80:3000 hello
```
-d表示容器会在后台运行；--name 是我们给容器起的名字，这个名字是唯一的；-p表示端口映射，即将容器内的3000端口映射到宿主机器的80端口上，这样外部就可以通过80端口来访问容器内部运行的应用了。

本文的演示没有使用 Nginx 做端口转发，只要服务器开放 80 端口，就能将 80 映射到 node项目容器的3000端口上，对完提供访问服务。

执行命令查看容器的状态：
```shell
docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS          PORTS                                   NAMES
df3a628a7d13        hello          "docker-entrypoint.s…"   9 minutes ago       Up 9 minutes    0.0.0.0:80->3000/tcp, :::80->3000/tcp   hellocontainer
```
此时，node应用已经在容器内跑起来了。我们可以访问了。

8.本地访问
打开本地的浏览器，输入云服务器的公网IP即可访问。

注意，需要对云服务器的访问规则添加对80端口的任意访问，在此不做赘述。
