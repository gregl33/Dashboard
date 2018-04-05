create database if not exists calendar;
use calendar;
create table if not exists calendar.events (
  id varchar(25),
  day varchar(4),
  month varchar(4),
  year varchar(5),
  timeFrom varchar(10),
  timeTo varchar(10),
  eventName varchar(30),
  profileName varchar(30)

) charset 'utf8mb4';

create table if not exists calendar.profile (
  id int primary key auto_increment,
  profileName varchar(20),
  colour varchar(10)
) charset 'utf8mb4';

  insert into profile values (0,'Guest',"#ffbdbd");
  insert into profile values (0,'Child',"#bfe476");
  insert into profile values (0,'User',"#6fb7d6");
