# 常用命令

## docker build

`docker build`命令用于从Dockerfile构建镜像。

**典型用法**

```shell
docker build  -t ImageName:TagName dir
```

**选项**

- `-t` − 给镜像加一个Tag
- `ImageName` − 给镜像起的名称
- `TagName` − 给镜像的Tag名
- `Dir` − Dockerfile所在目录