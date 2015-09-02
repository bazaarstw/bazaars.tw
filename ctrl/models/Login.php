<?php

class Login extends Base {
	
	public function webLogin($params){
		$isLogin = false;
		$sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND passwd = ?");
		$sth->execute(array($params["account"], $params["passwd"]));
		$rows = $sth->fetchAll();
		if(count($rows) > "0" ){
			$loginData = $rows[0];
			$_SESSION["website_login_session"] = $loginData;   
			$isLogin = true;
		} 
		return json_encode(array("isLogin"=>$isLogin));
	}
	
	public function otherLogin($params){
		$isLogin = false;
		$sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND registerType = ?");
		$sth->execute(array($params["account"], $params["registerType"]));
		$rows = $sth->fetchAll();
		if(count($rows) > "0" ){
			$loginData = $rows[0];
			$_SESSION["website_login_session"] = $loginData;   
			$isLogin = true;
		} else {
			// register
			$sth = $this->dbh->prepare(
			     "insert into member(account, username, email, photo, registerType, createDT, updateDT) ".
			     "values(?, ?, ?, ?, ?, now(), now())");
            $sth->execute(array(
                $params["account"], 
                $params["username"], 
                $params["email"], 
                $params["photo"], 
                $params["registerType"]));
                
            $sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND registerType = ?");
            $sth->execute(array($params["account"], $params["registerType"]));
            $rows = $sth->fetchAll();
            $_SESSION["website_login_session"] = $rows[0];
			$isLogin = true;
		}
		return json_encode(array("isLogin"=>$isLogin));
	}
	
	public function getUserinfo($params){	
		$isLogin = false;
		$usr = array();
		if(isset($_SESSION["website_login_session"])){
			$isLogin = true;
			$usr = $_SESSION["website_login_session"];     
		}
		return json_encode(array("isLogin"=>$isLogin, "info"=>$usr));
	}
	
	public function Logout($params){
		$_SESSION["website_login_session"] = null;
		return json_encode(array("isLogout"=>true));
	}

}
?>