# news-hacker

## 一、模块划分

### 1.1 模块 1（服务模块）：负责启动服务 - index.js


### 1.2 模块2（扩展模块）：负责扩展 req 和 res 对象，为 req 和 res 提供更方便的API - context.js


### 1.3 模块3（路由模块）：负责路由判断 - router.js


### 1.4 模块4（业务模块）：负责处理具体路由的业务处理 - handler.js


### 1.5 模块5（数据操作模块）：负责进行数据库操作模块


### 1.6 模块6（配置信息模块）：负责保存项目的配置信息 - config.js



## 二、数据库

### 2.1 创建数据库(使用dos进入mysql)：
```sql
CREATE DATABASE hacker_news;
```

### 2.2 创建数据表(选择新建的数据库)：
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
### 2.3 插入数据
```sql
INSERT INTO userinfo (username, password, email) VALUES ("admin", "admin", "admin@eamil.com");
```
### 2.4 删除数据表：
```sql
DROP TABLE table_name;
```
若报 ERROR 1051 (42S02): Unknown table 'xx.xx',请仔细检查数据表的名称有没有写正确。

### 2.5 删除数据表中的一条记录：
```sql
DELETE FROM userinfo WHERE  字段1 = "xx" and 字段1 = 2;
如果有主键,则直接利用主键确定某一行。
```
### 2.6 查询表

1. 查询表的所有记录：
```sql
select * from userinfo;
```
2. 查询表中满足要求的记录：
```sql
select * from userinfo where username="xx" and password="xx";
```
### 更新数据表：

```sql
update userinfo set token="nksd5mhw" where username="admin";
```
## 备注：

### 1. 启动数据库服务：

net start mysql

### 2. 停止数据库服务：

net stop mysql

### 3. 进入数据库

mysql -u root -p

### 4. 显示数据库：

show databases;

### 5. 选择使用的数据库：

use 数据库名;



