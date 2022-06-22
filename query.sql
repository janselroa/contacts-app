create database contacts;
use contacts;
create table users(
  id integer auto_increment primary key,
  name varchar(100) not null,
  email varchar(255) not null,
  password varchar(200) not null,
  profile varchar(100) not null
)

create table contacts(
  id integer auto_increment primary key,
  name varchar(100) not null,
  email varchar(255) not null,
  profile varchar(100) not null,
  userId integer not null
);
