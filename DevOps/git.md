# 常用命名

```git
git branch 		# 查看所有本地分支
git branch -a  	# 查看所有分支，包含远程分支
git branch -vv	# 查看本地的分支以及追踪的分支
git branch --set-upstream-to=origin/[远程分支] [本地分支] 	# 设置远程追踪
 

```

问题描述：idea忽略文件.gitignore 忽略的文件不起作用
解决思路：idea 对应的目录或者文件已经被git跟踪，此时再加入.gitignore后就无效了
执行如下命令：
git rm -r --cached .idea   　　　　--删除文件夹
git rm --cached demo-project.iml  --删除单个文件

