<?php

class Base {
	
	public $dbh;
	
	public function __construct()	{		
		$this->dbh = new PDO("mysql:host=localhost;dbname=mymarket","root","123456",array(PDO::ATTR_PERSISTENT => TRUE, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));	
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
	
	public function execSQL($sth, $execParam) {
		$sth->execute($execParam);
		$arr = $sth->errorInfo();
		if ($arr[0] != "0000") throw new Exception($arr[2]);
	}
	
	public function isEmail($str) {
		if(preg_match("/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/", $str)) {
			return true;
		} 
		return false;
	}
	
	public function isPhone($str) {
		// if (preg_match("/09[0-9]{2}-[0-9]{3}-[0-9]{3}/", $str)) {
	        // return true;    // 09xx-xxx-xxx
	    // } else if(preg_match("/09[0-9]{2}-[0-9]{6}/", $str)) {
	        // return true;    // 09xx-xxxxxx
	    // } 
	    if(preg_match("/09[0-9]{8}/", $str)) {
	        return true;    // 09xxxxxxxx
	    }
	    return false;
	}
	
	public function getDefaultImgPath($type) {
		$imgPath = "";
		if ($type == "member") $imgPath = "_files/member/member_default.jpg";
		else if ($type == "farmer") $imgPath = "_files/farmers/farmer_default.jpg";
		else if ($type == "store") $imgPath = "_files/stores/stores_default.jpg";
	    return $imgPath;
	}

}
?>