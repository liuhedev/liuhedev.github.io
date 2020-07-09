[TOC]

# 介绍

MySQL 是最流行的关系型数据库管理系统，在 WEB 应用方面 MySQL 是最好的 RDBMS(Relational Database Management System：关系数据库管理系统)应用软件之一。

数据库系统解决的问题：持久化存储，优化读写，保证数据的有效性

## E-R模型

> 当前物理的数据库都是按照E-R模型进行设计的,即一个实体与数据库中一个表是对应的

- E表示entity，实体
- R表示relationship，关系

在关系型数据库中一行就是一个对象，描述两个实体之间的对应规则，包括
- 一对一
- 一对多
- 多对多

## 范式
经过研究和对使用中问题的总结，对于设计数据库提出了一些规范，这些规范被称为范式。

（1）一范式（1NF）: **原子性**，即字段/列不可以再分。

地址|
---|
北京北京海淀区 | 
山东省临沂市平邑县 |

省 | 市 | 区
---|---|--
北京 | 北京|海淀区
山东省| 临沂| 平邑

（2）第二范式（2NF）：**唯一性**，不可以把多种数据保存在同一张表中，即一张表只能保存“一种”数据。

不符合第二范式的表：
```
学号, 姓名, 年龄, 课程名称, 成绩, 学分;
```

可能会存在问题：
```
数据冗余，每条记录都含有相同信息，冗余行；
删除异常：删除所有学生成绩，就把课程信息全删除了；
插入异常：学生未选课，无法记录进数据库；
更新异常：调整课程学分，所有行都调整。
```
正确做法:
```
学生：Student(学号, 姓名, 年龄)；
课程：Course(课程名称, 学分)；
选课关系：StudentCourse(学号, 课程名称, 成绩)。
```
（3）第三范式（3NF）：**直接性**，每一列都和主键直接相关，而不能间接相关，即引用主键。(依赖不准传递)。

不符合第三范式的表：
```
学号, 姓名, 年龄, 学院名称, 学院电话
// 因为存在依赖传递: (学号)→(学生)→(所在学院)→(学院电话) 。
```

可能会存在问题：
```
数据冗余：有重复值，冗余列；
更新异常：有重复的冗余信息，修改时需要同时修改多条记录，否则会出现数据不一致的情况
```

正确做法：
```
学生：(学号, 姓名, 年龄, 所在学院)；
学院：(学院, 电话)。
```


说明：后一个范式，都是在前一个范式的基础上建立的。

## 登录 MySQL
当 MySQL 服务已经运行时, 我们可以通过 MySQL 自带的客户端工具登录到 MySQL 数据库中, 首先打开命令提示符, 输入以下格式的命名:


```
mysql -h 主机名 -u 用户名 -p

eg: mysql -u root -p

参数说明：
-h : 指定客户端所要登录的 MySQL 主机名, 登录本机(localhost 或 127.0.0.1)该参数可以省略;
-u : 登录的用户名;
-p : 告诉服务器将会使用一个密码来登录, 如果所要登录的用户名密码为空,可以忽略此选项。
```

在windows上安装，使用net start mysql启动服务时出现异常，可以使用如下解决方案：

使用管理员命令窗口依次执行如下命令
```
//卸载服务
mysqld –remove
//安装服务
mysqld –install
// 初始化
mysqld --initialize-insecure
```

# 基本操作

## 数据完整性

> 一个数据库就是一个完整的业务单元，可以包含多张表，数据被存储在表中。在表中为了更加准确的存储数据，保证数据的正确有效，可以在创建表的时候，为表添加一些强制性的验证，包括数据字段的类型、约束。

### 字段类型

在mysql中包含的数据类型很多，大致分为三类：数值、日期/时间和字符串(字符)类型。

```
数字：int,decimal
字符串：varchar,text
日期：datetime
布尔：bit
```
### 约束

- 主键primary key
- 非空not null
- 唯一unique
- 默认default
- 外键foreign key

## 数据库操作

1. 创建数据库

```
create database 数据库名 charset=utf8;

```

2. 删除数据库

```
drop database 数据库名;
```

3. 切换数据库

```
use 数据库名;
```

4. 查看数据库

查看所有数据库
```
 show databases;
```

5.查看当前选择的数据库

```
select database();
```
6.修改数据库表编码
　　
```
ALTER TABLE tableName CONVERT TO CHARACTER SET character_name [COLLATE ...]
```
eg:

```
alter table t_sales_dealer convert to CHARACTER set utf8
```

7. 反引号的作用
在设计字段时部分MYSQL保留字可能被使用，可能导致sql语句执行错误，所以必须加上反引号来区分。eg：

```
CREATE TABLE `t_demo`(
`select` varchar(20) not null
) CHARSET=utf8 
```

## 表操作

1. 查看当前数据库中所有表

```
show tables;
```

2. 创建表
> auto_increment表示自动增长

```
create table 表名(列及类型);

<!--在创建表时，可以判断是否存在，不存在时就创建-->
CREATE TABLE IF NOT EXISTS [Table Definition];
```

如：
```
create table students(
id int auto_increment primary key,
sname varchar(10) not null
);

CREATE TABLE  IF NOT EXISTS student(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '学号',
  name VARCHAR(200) COMMENT '姓名',
  age    int NOT NULL  DEFAULT 0 COMMENT '年龄'
  KEY idx_stu_id(id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='学生信息'
```
3. 查看表结构

```
desc 表名;
```

4. 查看表的创建语句

```
show create table 表名;
```
5. 修改表

修改字段类型时使用modify,修改字段名称或者类型时可以使用chanage;

```
alter table 表名 add|change|drop 列名 类型;
```
eg:

```
alter table demo add name varchar(20);
alter table demo change good age tinyint;
alter table temp_table drop age;
```
由于MySql中没有boolean类型，所以会用到tinyint[1]类型来表示,在mysql中boolean=tinyint[1]

解决：tinyint类型长度的问题，当我把长度改成4时，查询结果就正常了


6. 更改表名称

```
rename table 原表名 to 新表名;
```

7. 删除表

```
drop table 表名;
```
## 数据操作
1. 查询

```
select * from 表名；
```

2. 增加

> 主键列是自动增长，但是在全列插入时需要占位，通常使用0，插入成功后以实际数据为准

```
插入一条数据：
全列插入：insert into 表名 values(...)
缺省插入：insert into 表名(列1,...) values(值1,...)

同时插入多条数据：
insert into 表名 values (...),(...)...
insert into 表名(列1,...) values(值1,...),(值1,...)...;
```

3. 修改

```
update 表名 set 列1=值1,... where 条件
```

4. 删除

```
delete from 表名 where 条件
```
## 备份与恢复


```
cd /var/lib/mysql
```
备份
```
mysqldump –uroot –p 数据库名 > ~/Desktop/备份文件.sql;
```
恢复
```
mysql -uroot –p 数据库名 < ~/Desktop/备份文件.sql
```
# 数据查询

查询的基本语法

```
select * from 表名;

// 完整的查询顺序
select distinct *
from 表名
where ....
group by ... having ...
order by ...
limit star,count
```
- from关键字后面写表名，表示数据来源于是这张表
- select后面写表中的列名，如果是*表示在结果中显示表中所有列
- 在select后面的列名部分，可以使用as为列起别名，这个别名出现在结果集中
- 如果要查询多个列，之间使用逗号分隔

## 条件
### 比较运算符
- 等于=
- 大于>
- 大于等于>=
- 小于<
- 小于等于<=
- 不等于!=或<>

### 逻辑运算符
- and
- or
- not

eg:
查询编号大于3的女同学

```
select * from students where id>3 and gender=0;
```
### 模糊查询
- like
- %表示任意多个任意字符,类似正则中的 *。
- _表示一个任意字符,类似于正则中的 ?

如果没有使用百分号 %, LIKE 子句与等号 = 的效果是一样的。

eg：
查询姓黄的学生

```
select * from students where sname like '黄%';
```

### 范围查询
- in表示在一个非连续的范围内
- between ... and ...表示在一个连续的范围内

eg：
查询编号是1或3或8的学生
```
select * from students where id in(1,3,8);
```
查询学生是3至8的学生

```
select * from students where id between 3 and 8;
```
### 空判断
- 判空is null
- 判非空is not null

查询没有填写地址的学生
```
select * from students where hometown is null;
```
## 聚合
> 使用聚合，优先考虑是否需要分组。

- count(*)表示计算总行数，括号中写星与列名，结果是相同的
- max(列)表示求此列的最大值
- min(列)表示求此列的最小值
- sum(列)表示求此列的和
- avg(列)表示求此列的平均值

eg:

```
<!--学生总数-->
select count(*) from students;
<!--平均年龄-->
select avg(age) from student;

<!--查询男生的姓名、总分-->
select students.sname,avg(scores.score)
from scores
inner join students on scores.stuid=students.id
where students.gender=1
group by students.sname;
```
## 排序
> order by 列 默认升序
```
select * from 表名
order by 列1 asc|desc,列2 asc|desc,...
```

asc:ascend 升序
desc:descend  降序

## 分组
> 分组的目的是为了更好的完成聚合、统计

按照字段分组，表示此字段相同的数据会被放到一个组中

```
select 列1,列2,聚合... from 表名 group by 列
```
- where是对from后面指定的表进行数据筛选，属于对原始数据的筛选
- having是对group by的结果进行筛选

eg:
```
select address as 地址,count(*) from student group by address;
+--------+----------+
| 地址   | count(*) |
+--------+----------+
| 北京   |        4 |
| 天津   |        3 |
| 山东   |        3 |
| 深圳   |        3 |
+--------+----------+
4 rows in set (0.00 sec)
```


eg: 查询地址为山东的个数

```
mysql> select address as 地址,count(*) from student group by address having address='山东';
+--------+----------+
| 地址   | count(*) |
+--------+----------+
| 山东   |        3 |
+--------+----------+
1 row in set (0.00 sec)
```
## 分页

从start开始，获取count条数据，start索引从0开始
```
select * from 表名 limit start,count
```

当遇到千万级大表时候，mysql会查询前start条数据，然后丢弃前stat行，这个步骤是非常浪费时间的。

优化：可以使用id优化，比如

```
SELECT * FROM t_user WHERE id > 1000000 LIMIT 100;
SELECT * FROM t_user WHERE id > 1000000 AND id <= 5000000+100;
```




# 高级使用


- 实体与实体之间有3种对应关系，这些关系也需要存储下来
- 在开发中需要对存储的数据进行一些处理，用到内置的一些函数
- 视图用于完成查询语句的封装
- 事务可以保证复杂的增删改操作有效


## 关系
关系的存储方案
- 1：1-》存储在任何一个表中
- 1：n-》存储在n的表中，新增一个字段
- m：n-》新建表存储，两个表与其关系1：n,1:m。

### 外键的定义
- 外键是相对于主键说的，是建立表之间的联系的必须的前提
- 在包含父表和子表时候，才能创建外键；
- 外键作用：保证关系字段的数据有效性以及实现一些级联操作；


### 外键的创建
1. 创建表时，增加外键

```
foreign key(外键字段) references 父表（主键）

eg:
create table scores(
    id int primary key auto_increment,
    stuid int,
    foreign key(stuid) references students(id),
);
```
2. 在已创建的表中增加外键
```
alter table 表名 add contraint 外键名 foreign key(外键字段) references 父表(主键)

eg:
alter table scores add constraint f_subid foreign key(subid) REFERENCES t_subject(id)
```

### 级联操作
- 在对存在外键的表进行操作时候，如果相关联父表没有相应的数据，会抛异常，如下：
```
insert into t_score values(0,100,19,1)
> 1452 - Cannot add or update a child row: a foreign key constraint fails (`students`.`t_score`, CONSTRAINT `f_stuid` FOREIGN KEY (`stuid`) REFERENCES `t_student` (`id`))
> 时间: 0.087s
```
- 实际开发中不推荐物理删除，建议**使用逻辑删除**，比如增加一个删除标记字段，即**本质就是修改**。
- 级联操作的类型包括，但是不推荐以下方法
    - restrict（限制）：默认值，抛异常
    - cascade（级联）：如果主表的记录删掉，则从表中相关联的记录都将被删除
    - set null：将外键设置为空
    - no action：什么都不做
    
    语法：
    ```
    alter table scores add constraint stu_sco foreign key(stuid) references students(id) on delete cascade;
    ```

## 连接查询
> 当需要对有关系的多张表进行查询时，需要使用连接join，比如SELECT, UPDATE 和 DELETE语句

根据结果集不同，连接查询分为3类：
- 内连接（表A inner join 表B）：表A与表B匹配的行会出现在结果中
- 左连接（表A left join 表B）：表A与表B匹配的行会出现在结果中，**以左表为准**， 即外加表A中独有的数据为准，未对应的数据使用null填充
- 右连接（表A right join 表B）：表A与表B匹配的行会出现在结果中，**以右表为准**， 即外加表B中独有的数据，未对应的数据使用null填充

eg:

```
<!--内查询-->
mysql> select * from t_student inner join t_score on t_score.stuid=t_student.id;
<!--
或者:
select * from t_student,t_score on t_score.stuid=t_student.id
-->
+----+-------+------+--------+---------+----+-------+-------+-------+
| id | name  | age  | gender | address | id | score | stuid | subid |
+----+-------+------+--------+---------+----+-------+-------+-------+
|  1 | liuhe |   18 |       | ??      |  3 |   100 |     1 |     1 |
| 10 | ??    |   30 |        | ??      |  4 |   100 |    10 |     1 |
+----+-------+------+--------+---------+----+-------+-------+-------+
2 rows in set (0.00 sec)

<!--左查询-->
mysql> select * from t_student left join t_score on t_score.stuid=t_student.id;
+----+--------+------+--------+---------+------+-------+-------+-------+
| id | name   | age  | gender | address | id   | score | stuid | subid |
+----+--------+------+--------+---------+------+-------+-------+-------+
|  1 | liuhe  |   18 |       | ??      |    3 |   100 |     1 |     1 |
| 10 | ??     |   30 |        | ??      |    4 |   100 |    10 |     1 |
|  2 | zdj    |   16 |       | ??      | NULL |  NULL |  NULL |  NULL |
|  3 | guagua |    1 |       | ??      | NULL |  NULL |  NULL |  NULL |
+----+-------+------+--------+---------+----+-------+-------+-------+
4 rows in set (0.00 sec)

<!--右查询-->
mysql> select * from t_student right join t_score on t_score.stuid=t_student.id;
+------+-------+------+--------+---------+----+-------+-------+-------+
| id   | name  | age  | gender | address | id | score | stuid | subid |
+------+-------+------+--------+---------+----+-------+-------+-------+
|    1 | liuhe |   18 |       | ??      |  3 |   100 |     1 |     1 |
|   10 | ??    |   30 |        | ??      |  4 |   100 |    10 |     1 |
+------+-------+------+--------+---------+----+-------+-------+-------+
2 rows in set (0.00 sec)

```

另外：

- 在查询或条件中推荐使用“表名.列名”的语法
- 如果多个表中列名不重复可以省略“表名.”部分
- 如果表的名称太长，可以在表名后面使用' as 简写名'或' 简写名'，为表起个临时的简写名称

## 自关联查询
> 物理上是一个表，但是逻辑上可以分成多个表，比如省市区表。

```
<!--查询所有河南省的市区县-->

select *
	from areas as province 
	INNER JOIN areas as city on city.area_id = province._id 
	LEFT JOIN areas as county on county.area_id=city._id
	WHERE province.area_name="河南省"
```


## 子查询

```
<!--查询所有河北省的市-->
select * from areas where area_id=(select _id from areas where area_name='河北省')
```
ALL、ANY和SOME常和子查询语句结合使用，ALL代表了子查询出来的所有结果，而ANY和SOME代表子查询的任意一个结果。

eg:

```
<!--查询所有GEV1车辆的vin-->
SELECT * FROM `sitech_vehicle`.`t_dms_sales`  
WHERE `production_id`= ANY(SELECT `production_id`  FROM `sitech_vehicle`.`t_vehicle_info` where `serial` ='GEV1');

```

in常用于where表达式中，其作用是查询某个范围内的数据。
```
select * from where field in (value1,value2,value3,…)
```

在做多表查询或者查询的时候产生新的表的时候会出现这个错误：Every derived table must have its own alias（每一个派生出来的表都必须有一个自己的别名）。
eg:

```
select shop_id,shop_name,date1,sum(count) from 
(SELECT t2.`cps_name` shop_name,from_unixtime(date div 1000,'%Y-%m') date1,SUM(count) count FROM `sitech_bigdata_operation`.`t_basic_active_d_box_rank` t1 INNER JOIN `t_cps_info` t2 on t1.`shop` =t2.`cps_id`) 
as t_source 
GROUP BY date1
```


## 视图
> 对复杂查询语句进行封装以便多次复用，这就叫视图，视图是存储到当前库里的。

**优缺点**

优点：
1. 安全：可以为视图分配权限保证数据安全。
2. 简化查询：复杂连接查询通过创建视图来简化操作。

缺点：

1. 视图基于相关联的表创建，若修改表，会相应修改视图，也不好做版本控制。
2. 性能：从数据库视图查询数据可能会很慢，特别是如果视图是基于其他视图创建的。


**创建**

```
create view 视图名称 as sql语句
alter view 视图名称 as sql语句
```

eg：
```
<!--t_student.* 表示students表中的所有字段都展示-->
create view v_score as 
	select t_student.*,t_score.score from t_score 
	INNER JOIN t_subject on t_subject.id=t_score.subid
	INNER JOIN t_student on t_student.id=t_score.stuid;
```

**使用**
```
select * from v_score;
+----+-------+------+--------+---------+-------+
| id | name  | age  | gender | address | score |
+----+-------+------+--------+---------+-------+
|  1 | liuhe |   18 |       | ??      |   100 |
| 10 | ??    |   30 |        | ??      |   100 |
+----+-------+------+--------+---------+-------+
2 rows in set (0.00 sec)
```

## 索引

> 索引在MySQL中也叫是一种“键”，是存储引擎用于快速找到记录的一种数据结构。

- 索引是一张表，该表保存了主键与索引字段，并指向实体表的记录。
- 索引是一系列值，而不是一个范围
- 创建索引时，你需要确保该索引是应用在 SQL 查询语句的条件(一般作为 WHERE 子句的条件)。

### 索引特点
- 索引能提高数据访问性能
- 数据默认会按照某种索引来存，比如主键。
- 索引会降低更新表的速度，比如对表进行insert、update、delete,因为更新表 时，mysql不仅要保存数据，还要保存下索引文件，因此太多的索引会增加物理上的开销(存储、索引计算等)

### 索引的选择
- 越小的数据类型更好，即更小的数据类型在磁盘、内存和cpu缓存中需要更少的空间，处理更快；
- 简单的数据类型更好，比如整型数据会比字符串处理开销更少；
- 尽量避免NULL，在mysql中，含有空值得列很难进行查询优化，因为他们使索引、索引的统计信息以及计算更加复杂。

### 索引的分类
> 单列索引和组合索引
- 单列索引：一个索引只包含一个列，一个表中可以有多个单列索引，但是这不是组合索引。
- 组合索引：一个索引包含多个列。

参考：https://www.runoob.com/w3cnote/mysql-index.html

几个注意点：
1. mysql 组合索引 **"最左前缀"（Leftmost Prefixing)** 的结果。

eg:

```
组合索引(week_item、begin_time、end_time)，它相当于我们创建了
(week_item，begin_time，end_time )、(week_item，begin_time)以及(week_item)
这些列组合上的索引，其他组合会进行全盘扫描。
```
2. 如果联合索引的第一个列不在where条件语句中，索引是不会用到的；where条件要尽量根据联合索引的顺序来，如果不按照顺序来，索引也同样会用到，但是在执行前，SQL优化器也会将条件调整为联合索引的顺序，导致额外的开销。
3. 以通配符%和_**开头**作查询、正则表达式、函数运算等，会导致索引失效，如or运算符会导致索引失效。

eg:

```
SELECT * FROM `houdunwang` WHERE `uname` LIKE'后盾%' -- 走索引 
SELECT * FROM `houdunwang` WHERE `uname` LIKE "%后盾%" -- 不走索引
```
4. 可以使用EXPLAIN查看索引是否生效

eg:

```
<!--可以查看此sql执行情况,比如以下可以通过查看rows执行次数-->
mysql> EXPLAIN SELECT * FROM test_index_sequence WHERE   index_C='c'   and index_A='a';
+----+-------------+---------------------+------+---------------+---------------+---------+-------+------+-----------------------+
| id | select_type | table               | type | possible_keys | key           | key_len | ref   | rows | Extra                 |
+----+-------------+---------------------+------+---------------+---------------+---------+-------+------+-----------------------+
|  1 | SIMPLE      | test_index_sequence | ref  | complex_index | complex_index | 768     | const |    3 | Using index condition |
+----+-------------+---------------------+------+---------------+---------------+---------+-------+------+-----------------------+
1 row in set (0.00 sec)
```

### 索引的操作

- 查看索引
```
show index from table_name;
```
- 创建索引

使用关键字Key或者index定义索引

```
<!--一般只有字符串类型才指定字段长度-->
CREATE INDEX 索引名称 ON table_name(字段1(字段长度)，字段2，...)

eg:
create index index_name on areas(area_id)
```
- 删除索引

```
drop index 索引名称 on 表名

eg:
drop index index_name on areas;
```
eg:

```
<!--开启时间监测-->
set profiling=1;

<!--展示时间监测结果-->
show profiles;

<!--因数据量太小，没有展示索引的优势-->
mysql> show profiles;
+----------+------------+----------------------------------------------+
| Query_ID | Duration   | Query                                        |
+----------+------------+----------------------------------------------+
|        1 | 0.00034400 | show index from areas                        |
|        2 | 0.00028775 | select * from areas where _id="410100"       |
|        3 | 0.02279575 | create index index_area_id on areas(area_id) |
|        4 | 0.00028250 | select * from areas where _id="410100"       |
+----------+------------+----------------------------------------------+
4 rows in set, 1 warning (0.00 sec)

```
## 事务

### 事务的定义
- 某个业务处理的一系列操作称为事务，其目的是保证一个业务逻辑的完整操作；
- 事务用来管理insert、update、delete等设计数据修改的语句。
- 表的类型必须是innodb或bdb类型引擎，才可以对此表使用事务。
- 事务进行过程中，只是在内存中修改，当事务提交时，才会修改底层（磁盘）数据。
- 在MySQL中，默认情况下，事务是自动提交的，也就是说，只要执行一条DML语句就开启了事物，并且提交了事务。

### 事务四大特性(简称ACID)
1. 原子性(Atomicity)：事务中的全部操作在数据库中是不可分割的，要么全部完成，要么均不执行
2. 一致性(Consistency)：几个并行执行的事务，其执行结果必须与按某一顺序串行执行的结果相一致
3. 隔离性(Isolation)：事务的执行不受其他事务的干扰，事务执行的中间结果对其他事务必须是透明的
4. 持久性(Durability)：对于任意已提交事务，系统必须保证该事务对数据库的改变不被丢失，即使数据库出现故障

### 事务语句
```
开启begin;
提交commit;
回滚rollback;
```
eg:

```
<!--终端1-->
select * from students;
mysql> select * from t_student;
+----+--------+------+--------+---------+
| id | name   | age  | gender | address |
+----+--------+------+--------+---------+
|  1 | liuhe  |   18 |       | ??      |
|  2 | zdj    |   16 |       | ??      |
+----+--------+------+--------+---------+
2 rows in set (0.00 sec)

------------------------
<!--终端2-->
begin;
insert into t_student(name) values('tomcat');

<!--终端1-->
select * from students;
mysql> select * from t_student;
+----+--------+------+--------+---------+
| id | name   | age  | gender | address |
+----+--------+------+--------+---------+
|  1 | liuhe  |   18 |       | ??      |
|  2 | zdj    |   16 |       | ??      |
+----+--------+------+--------+---------+
2 rows in set (0.00 sec)

<!--终端2,因为事务是内存级操作，只有commit之后才能实现物理操作-->
commit;
------------------------
<!--终端1-->
select * from students;
mysql> select * from t_student;
+----+--------+------+--------+---------+
| id | name   | age  | gender | address |
+----+--------+------+--------+---------+
|  1 | liuhe  |   18 |       | ??      |
|  2 | zdj    |   16 |       | ??      |
|  3 | tomcat |      |       |         |
+----+--------+------+--------+---------+
3 rows in set (0.00 sec)
```

## 数据清理

### 从右开始截取字符串

```
right（str, length）
```
说明：right（被截取字段，截取长度）
例：

```
select right（content,200） as abstract from my_content_t
```

### 查询重复数据

```
SELECT iccid,count(*) count FROM t_production_tbox  group by iccid having count> 1;
```

# 性能优化
## 慢查询


原因：

```
1、没有索引或者没有用到索引(这是查询慢最常见的问题，是程序设计的缺陷) 
2、I/O吞吐量小，形成了瓶颈效应。 
3、没有创建计算列导致查询不优化。 
4、内存不足 
5、网络速度慢 
6、查询出的数据量过大（可以采用多次查询或其他的方法降低数据量） 
7、锁或者死锁(这也是查询慢最常见的问题，是程序设计的缺陷)sp_lock,sp_who,活动的用户查看,原因是读写竞争资源。 
9、返回了不必要的行和列 
10、查询语句不好，没有优化
```

参考：https://www.cnblogs.com/Eva-J/articles/10126413.html#_label11


# 其他操作
## 日期函数

```
1.日期转时间戳
select UNIX_TIMESTAMP('2018-12-25 12:25:00');
结果：1545711900


2.时间戳转日期：FROM_UNIXTIME(unix_timestamp) --unix_timestamp为时间戳
select FROM_UNIXTIME(1545711900);
结果：2018-12-25 12:25:00

3.时间戳转日期，自定义返回日期格式：FROM_UNIXTIME(unix_timestamp,format) -- format请参考后面的截图
select FROM_UNIXTIME(1545711900,'%Y-%m-%d %T');
-- 结果：2018-12-25 12:25:00

4.时间互转
DATE_FORMAT('2018-12-25 13:20:00','%Y-%m');
结果：2018-12
```

## 正则表达式

```
$	匹配输入字符串的结束位置。
eg:匹配所有以‘ok’结尾的所有数据
mysql> SELECT name FROM person_tbl WHERE name REGEXP 'ok$';

```

# 面试问题
1. 使用一个SQL删除除了自动编号不同, 其他都相同的学生冗余信息

```
自动编号   no   name subject_id 分数
1        2018001 张三      1    69
2        2018002 李四      1    89
3        2018001 张三      1    69
4        2018002 李四      2    79
5        2018001 张三      2    80
6        2018002 李四      2    79
```
sql语句：
```
DELETE 
FROM
	`t_student` 
WHERE
	`id` NOT IN ( SELECT `id` FROM `t_student` GROUP BY `no`, `subject_id`, `score`  )
```
使用以上语句删除，会报错 You can't specify target table 't_student' for update in FROM clause，原因是mysql中不能依据某字段值做判断再来更新某字段的值，需要增加一个过渡层。

```
DELETE 
FROM
	`t_student` 
WHERE
	`id` NOT IN ( SELECT * FROM ( SELECT `id` FROM `t_student` GROUP BY `no`, `subject_id`, `score` ) as t1)
```
注意，在做多表查询时候要给过渡表增加别名，比如t1。