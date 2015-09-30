<?php

class DBConn {
	
	public $dbh;
	
	public function __construct()	{		
		$this->dbh = new PDO("mysql:host=localhost;dbname=v_bazaars","test","",array(PDO::ATTR_PERSISTENT => TRUE, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));	
	}
	
}
?>