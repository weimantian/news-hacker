# news-hacker

模仿news hacker

## 创建数据库(使用dos进入mysql)：
```sql
CREATE DATABASE hacker_news;
```

## 创建数据表(选择新建的数据库)：
```sql
CREATE TABLE IF NOT EXISTS `userinfo` (
   `id` INT UNSIGNED AUTO_INCREMENT,
   `username` VARCHAR(100) NOT NULL,
   `password` VARCHAR(40) NOT NULL,
   `email` VARCHAR(40),
   `token` VARCHAR(100),
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
## 插入数据
```sql
INSERT INTO userinfo (username, password, email) VALUES ("admin", "admin", "admin@eamil.com");
```
## 删除数据表：
```sql
DROP TABLE table_name;
```
若报 ERROR 1051 (42S02): Unknown table 'xx.xx',请仔细检查数据表的名称有没有写正确。

## 删除数据表中的一条记录：
```sql
DELETE FROM userinfo WHERE  字段1 = "xx" and 字段1 = 2;
如果有主键,则直接利用主键确定某一行。
```
## 查询表

1. 查询表的所有记录：
```sql
select * from userinfo;
```
2. 查询表中满足要求的记录：
```sql
select * from userinfo where username="xx" and password="xx";
```
## 更新数据表：
```sql
update userinfo set token="nksd5mhw" where username="admin";
```
# 备注：

## 启动数据库服务：

net start mysql

## 停止数据库服务：

net stop mysql

## 进入数据库

mysql -u root -p

## 显示数据库：

show databases;

## 选择使用的数据库：

use 数据库名;



