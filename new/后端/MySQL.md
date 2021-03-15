mysql函数

时间日期相关

CURDATE()

DATE()

DATE_FORMAT() 日期格式化

```mysql
SELECT users.id, DATE_FORMAT(users.signup_date, '%Y-%m-%d') 
FROM users 
WHERE DATE(signup_date) = CURDATE() 
```

如何查询当天数据

```mysql
SELECT FROM_UNIXTIME(create_time,'%Y%u') weeks FROM student GROUP BY weeks;  
SELECT FROM_UNIXTIME(create_time,'%Y%m%d') days FROM student GROUP BY days;   
SELECT FROM_UNIXTIME(create_time,'%Y%m') months FROM student GROUP BY months
```

