
### 流程图
![git](img/git.jpg)

### 常用命令

```makefile
git branch 		  # 查看所有本地分支
git branch -a  	# 查看所有分支，包含远程分支
git branch -vv	# 查看本地的分支以及追踪的分支
git branch --set-upstream-to=origin/[远程分支] [本地分支] 	# 设置远程追踪

# git fetch 更新远程仓库的代码为最新的，本地仓库的代码还未被更新
# git pull 将本地仓库和远程仓库（本地的）更新到远程的最新版本

git fetch -p # 获取被删减后的远程分支（更新远程分支）
```



### 常见问题

**idea添加忽略文件到.gitignore 不起作用**
原因：idea 对应的目录或者文件已经被 git 跟踪，此时再加入.gitignore后就无效了
执行如下命令：
git rm -r --cached .idea   　　　　--删除文件夹
git rm --cached demo-project.iml  --删除单个文件

