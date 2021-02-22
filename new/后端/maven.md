# 简介



# 插件

## spring-boot-maven-plugin

当运行 `mvn packages` 进行打包时，会打包成一个可以直接运行的jar文件，使用java -jar就可以直接运行。
由于某些安全考虑，配置文件一般不暴露给开发者，使用该插件，我们可在运行程序的时候，通过参数指定一个外部的配置文件。

```
java -jar my-project-0.0.1.jar --spring.config.location=application.properties
```