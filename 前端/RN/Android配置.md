# 更新策略

1. 原始没有集成更新功能，添加入口指导下载
2. 新版本添加自动更新功能，versionCode=3, versionName=1.1.0

办法：

1. 编译master版本，书写版本号，上传到Appcenter
2. 将下载地址放入到1.0版本下面，要求更新
3. 福佑App下载地址，更新为最新app



新的下载地址

https://appcenter-filemanagement-distrib5ede6f06e.azureedge.net/88845073-9e67-4f94-9d9c-7f61abb36459/ForyouToolkit_3.1.1.0-release.apk?sv=2019-02-02&sr=c&sig=c8vuIyN9sdDz2RDRMv%2FJas%2BVs75VwI80DWTfpmUpWEw%3D&se=2020-06-08T01%3A50%3A53Z&sp=r

https://appcenter-filemanagement-distrib5ede6f06e.azureedge.net/88845073-9e67-4f94-9d9c-7f61abb36459/ForyouToolkit_3.1.1.0-release.apk?sv=2019-02-02&sr=c&sig=VHGanUcbWHlpmfRMX9cK60tthKUONhaCYpZFWWEVddg%3D&se=2020-06-08T03%3A43%3A23Z&sp=r&download_origin=appcenter

# Android编译

```
gradlew assembleRelease
```

建议分cpu架构打包，以armeabi-v7a发布即可，目前市面上手机架构基本上都是armeabi-v7a + arm64-v8a，而arm64-v8a兼容armeabi-v7a

```gradle
// 每个架构都生产一个app
def enableSeparateBuildPerCPUArchitecture = true
// 
    splits {
        abi {
            reset()
            enable enableSeparateBuildPerCPUArchitecture
            universalApk true  // If true, also generate a universal APK
            include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
    }
```



# App配置修改

**修改App名称**

android/app/src/main/res/values/strings.xml 
```
<string name="app_name">测试程序</string>
```

**修改应用图标**

 [图标工厂](https://icon.wuruihong.com/) 在线生成，复制到对应文件夹



# KeyStore的生成

```
keytool -genkey -validity 36000 -alias ForyouToolkit -keyalg RSA -keystore D:\\cheng.hu\\ForyouToolkit.jks  
```

 其中：

- genkey表示生成密钥 
- validity指定证书有效期，这里是36000天 
- alias指定别名，这里是ForyouToolkit
- keyalg指定算法，这里是RSA 
- keystore指定存储位置，这里是d:\



# 集成AppCenter

依赖的包

```
npm install appcenter appcenter-analytics appcenter-crashes --save-exact
```



# 集成CodePush

codepush发布更新，**不写-d默认是Staging**

```
appcenter codepush release-react -d Production
appcenter codepush release-react -d Staging
appcenter codepush release-react -a cocogogo/ForyouToolkit -d Production
appcenter codepush release-react -t 1.0
```

  按照官方文档集成，codepush也使用appcenter来执行

**策略：**

1. **公司内部使用Staging版本，永远得到最新的体验**，服务器的Release APK其实是staging版本
2. **外部使用Release版本，待內部测试稳定后发布出去**

```
npm install -g code-push-cli

// 登录
appcenter login
// 查看所有app列表
appcenter apps list


appcenter codepush deployment add -a cocogogo/ForyouToolkit Staging
Deployment Staging has been created for cocogogo/ForyouToolkit with key rCJ2CKJqkLyghZdPp9KccFSkAoHzSAXP-8nyB

appcenter codepush deployment add -a cocogogo/ForyouToolkit Production
Deployment Production has been created for cocogogo/ForyouToolkit with key VfU0vBoxn7JMh-65P0PENSR3CxT-xYSiCEpht

// 设置当前默认应用，否则需要-a指定
appcenter apps set-current cocogogo/ForyouToolkit
appcenter codepush deployment list

// 显示key
appcenter codepush deployment list -k

┌────────────┬───────────────────────────────────────┐
│ Name       │ Key                                   │
├────────────┼───────────────────────────────────────┤
│ Production │ VfU0vBoxn7JMh-65P0PENSR3CxT-xYSiCEpht │
├────────────┼───────────────────────────────────────┤
│ Staging    │ rCJ2CKJqkLyghZdPp9KccFSkAoHzSAXP-8nyB │
└────────────┴───────────────────────────────────────┘
```

局限：

- 只能更新Javascript文件和图片资源

# 集成in-app update

app级build.gradle添加如下

```
dependencies {
   def appCenterSdkVersion = '3.2.1'
   implementation "com.microsoft.appcenter:appcenter-distribute:${appCenterSdkVersion}"
}
```

gradle sync下

按照文档无法启动service，因为AppCenter已经配置，应使用如下的start方法

```
AppCenter.setLogLevel(Log.VERBOSE);
AppCenter.start(Distribute.class);
```

