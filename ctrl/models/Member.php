<?php

class Member extends Base {
	
	public function register($params){
		$isSuc = false;
        $msg = "";
        
		$sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND registerType = 'Web'");
		$sth->execute(array($params["account"]));
		$rows = $sth->fetchAll();
		if(count($rows) > "0" ){
		    $msg = "此帳號已存在！";
		} else {
			$defaultUserName="Member";
			// register
			$sth = $this->dbh->prepare(
			     "insert into member(account, passwd, username, registerType, createDT, updateDT) ".
			     "values(?, ?, '$defaultUserName', 'Web', now(), now())");
            $sth->execute(array(
                $params["account"], 
                $params["passwd"]));
            $isSuc = true;
            $msg = "註冊成功，請重新登入！";
		}
		return json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
	}
	
}
?>