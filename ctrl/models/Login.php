<?php

class Login extends Base {
	
	public function webLogin($params){
		$isLogin = false;
		$sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND passwd = ?");
		$sth->execute(array($params["account"], $this->passMD5($params["passwd"])));
		$rows = $sth->fetchAll();
		if(count($rows) > "0" ){
			$loginData = $rows[0];
			unset($loginData["passwd"]);
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
		// echo "acc => ". $params["account"]. ", rt => ". $params["registerType"];
		if(count($rows) > "0" ){
			$loginData = $rows[0];
			unset($loginData["passwd"]);
			$_SESSION["website_login_session"] = $loginData;   
			$isLogin = true;
		} else {
			// register
			$photo = $this->getDefaultImgPath("member");
			if ($params["photo"] != "") $photo = $params["photo"];
			
			$sth = $this->dbh->prepare(
			     "insert into member(account, username, email, photo, registerType, createDT, updateDT) ".
			     "values(?, ?, ?, ?, ?, now(), now())");
            $sth->execute(array(
                $params["account"], 
                $params["username"], 
                $params["email"], 
                $photo, 
                $params["registerType"]));
                
            $sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND registerType = ?");
            $sth->execute(array($params["account"], $params["registerType"]));
            $rows = $sth->fetchAll();
			
			unset($rows[0]["passwd"]);
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
	
	public function getAdmInfo($params){
		$isSuc = true;
		$msg = "";
		$farmerCnt = 0;
		$storeCnt = 0;
		$workCnt = 0;
		$newsCnt = 0;
		
		try {
			$usr = $_SESSION["website_login_session"];
			$memberId = $usr["memberId"];
			
			$searchSql = 
				"select ".
				" (select count(*) from farmer where memberId = ?) as farmerCnt, ".
				" (select count(*) from store where memberId = ?) as storeCnt, ".
				" (select count(*) from work where memberId = ?) as workCnt, ".
				" (select count(*) from news where memberId = ?) as newsCnt ".
				"from dual";
			$sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array($memberId, $memberId, $memberId, $memberId));
			$data = $sth->fetchAll();
			
			$farmerCnt = $data[0]["farmerCnt"];
			$storeCnt = $data[0]["storeCnt"];
			$workCnt = $data[0]["workCnt"];
			$newsCnt = $data[0]["newsCnt"];
		} catch (Exception $e) {
			$isSuc = false;
			$msg = "查詢失敗：". $e->getMessage();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "farmerCnt"=>$farmerCnt, "storeCnt"=>$storeCnt, "workCnt"=>$workCnt, "newsCnt"=>$newsCnt));
	}

}
?>