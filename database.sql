CREATE DATABASE IF NOT EXISTS superchat;
USE superchat;
CREATE TABLE users ( 
	id int AUTO_INCREMENT,
	username varchar(20),
	messages  text,
	PRIMARY KEY (id)
);
