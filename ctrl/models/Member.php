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
			else if (!$this->isEmail($account) && !$this->isPhone($account)) $chkValid .= "\n帳號格式錯誤(需為Email或手機格式)！";
			if ($passwd == "") $chkValid .= "\n請輸入密碼！";
			if ($chkValid != "") throw new Exception($chkValid);
	
			$sth = $this->dbh->prepare("SELECT * FROM member WHERE account = ? AND registerType = 'Web'");
			$sth->execute(array($params["account"]));
			$rows = $sth->fetchAll();
			if(count($rows) > "0" ){
			    throw new Exception("此帳號已存在！");
			} else {
				$defaultUserName="Member";
				$photo = $this->getDefaultImgPath("member");
				// register
				$sth = $this->dbh->prepare(
				     "insert into member(account, passwd, username, photo, registerType, createDT, updateDT) ".
			     "values(?, ?, '$defaultUserName', ?, 'Web', now(), now())");
		        $this->execSQL($sth, array($params["account"], $this->passMD5($params["passwd"]), $photo));
				$isSuc = true;
			}
		} catch (Exception $e) {
			$msg = "註冊失敗：". $e->getMessage();
		}
		
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
	}
	
	public function prcUpd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "個人資料編輯成功！";
		
		try {
			$usr = $_SESSION["website_login_session"];

			$sth = $this->dbh->prepare(
			     "update member ".
			     "set username = ?, phone = ?, email = ?, updateDT = now() where memberId = ?");
			$this->execSQL($sth, array(
				$params["userName"], $params["phone"], $params["email"], $usr["memberId"]));

			$this->dbh->commit();
			
			$_SESSION["website_login_session"]["username"] = $params["userName"];
			$_SESSION["website_login_session"]["phone"] = $params["phone"];
			$_SESSION["website_login_session"]["email"] = $params["email"];
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "個人資料編輯失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
	}
	
}
?>