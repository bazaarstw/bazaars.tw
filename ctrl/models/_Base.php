<?php

class Base {
	
	public $dbh;
	
	public function __construct()	{		
		$this->dbh = new PDO("mysql:host=localhost;dbname=test","test","test",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));	
	}
	
	public function processPageSQL($params, $searchSQL) {
		$page = $params["page"] - 1;
		$pageNumber = $params["pageNumber"];
		$page = $page * $pageNumber;
		
		$sth = $this->dbh->prepare($searchSQL. " limit $page, $pageNumber");
		$sth->execute();
		$row = $sth->fetchAll();
		
		$sth = $this->dbh->prepare($searchSQL);
		$sth->execute();
		$count = count($sth->fetchAll());
		
		return array("row"=>$row, "count"=>$count);
	}

}
?>