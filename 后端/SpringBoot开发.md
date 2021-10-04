# 架构

架构演变之路：https://segmentfault.com/a/1190000018626163



# Maven

## 插件

### spring-boot-maven-plugin

当运行 `mvn packages` 进行打包时，会打包成一个可以直接运行的jar文件，使用java -jar就可以直接运行。
由于某些安全考虑，配置文件一般不暴露给开发者，使用该插件，我们可在运行程序的时候，通过参数指定一个外部的配置文件。

```
java -jar my-project-0.0.1.jar --spring.config.location=application.properties
```



## Shiro提供的功能

-  **Authentication**：身份认证

-  **Authorization** : 授权，权限验证

-  **SessionManager**：会话管理，用户所有信息保存在会话

-  **Cryptography** ：加密



## shiro原理

```mermaid
graph TD
A[ApplicationCode]
A --> B[Subject]
B --> C[SecurityManager] 
C --> D[Realm]
```

-  **Subject **: 主体，可以看作用户
-  **SecurityManager** :  Shiro的心脏，所有的交互都通过此进行控制，如管理所有Subject、认证、授权、会话和缓存的管理
-  **Authenticator**：认证器，可以自定义认证策略，AuthenticationStrategy
-  **Authrizer** : 授权器，决定是否有权限进行相应操作
-  **Realm**：安全实体数据源，可以是JDBC，LDAP或内存，需要自己指定
-  **SessionManager** ：Session管理器，这里是Session是Shiro自己抽象的会话
-  **SessionDAO** ：Session的CURD
-  **CacheManager** ：缓存控制器， 来管理如用户、角色、权限缓存
-  **Cryptography** : 密码模块，Shiro 提高了一些常见的加密组件用于如密码加密 

![shiro原理图](img/shiro原理图.png)



## SpringBoot集成shiro