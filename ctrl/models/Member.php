<?php

class Member extends Base {
	
	public function register($params){
		$isSuc = false;
        $msg = "註冊成功，請重新登入！";
		
		try {
			$chkValid = "";
			$account = $params["account"];
			$passwd = $params["passwd"];
			if ($account == "") $chkValid .= "\n請輸入帳號！";
			else if (!$this->isEmail($account)) $chkValid .= "\n帳號格式錯誤(需為Email)！";
			if ($passwd == "") $chkValid .= "\n請輸入密碼！";
			if ($chkValid != "") throw new Exception($chkValid);
	
			$sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND registerType = 'Web'");
			$sth->execute(array($params["account"]));
			$rows = $sth->fetchAll();
			if(count($rows) > "0" ){
			    throw new Exception("此帳號已存在！");
			} else {
				$defaultUserName="Member";
				// register
				$sth = $this->dbh->prepare(
				     "insert into member(account, passwd, username, registerType, createDT, updateDT) ".
			     "values(?, ?, '$defaultUserName', 'Web', now(), now())");
		        $this->execSQL($sth, array($params["account"], $params["passwd"]));
				$isSuc = true;
			}
		} catch (Exception $e) {
			$msg = "註冊失敗：". $e->getMessage();
		}
		
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
	}
	
}
?>