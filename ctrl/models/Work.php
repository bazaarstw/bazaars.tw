<?php

class Work extends Base {
	
	public function getListData($params){
		$searchSql = 
			"select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress ".
			"from work w ".
			"left join city c on c.cityId = w.city ".
			"left join town t on t.cityId = w.city and t.townId = w.town ".
			"where w.title like '%". $params["title"]. "%' ".
			"and ifnull(w.city,'') like '%". $params["city"]. "%' ".
			"and ifnull(w.town,'') like '%". $params["town"]. "%' ".
			"order by w.startDT desc";
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getDetail($params){
		$isSuc = true;
		$msg = "";
		
		$isWorkAuth = false;
		$signList = array();
		$isSign = false;
		$signInfo = array();
		
		try {
			$workId = $params["workId"];
			$searchSql = 
                "select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress, m.username, m.email, m.phone, m.photo ".
                "from work w ".
                "left join city c on c.cityId = w.city ".
                "left join town t on t.cityId = w.city and t.townId = w.town ".
                "join member m on m.memberId = w.memberId ".
                "where workId = ?";
            $sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array($workId));
			$data = $sth->fetchAll();
			
			if(isset($_SESSION["website_login_session"])){
				$usr = $_SESSION["website_login_session"];
				$memberId = $data[0]["memberId"];
				if ($usr["memberId"] == $memberId) {
					//小農應援團擁有者，查詢報名清單
					$isWorkAuth = true;
					$signList = $this->getSignList($params);
				} else {
					$searchSql = 
			            "select ws.* ".
			            "from worksign ws ".
			            "where ws.memberId = ?";
			        $sth = $this->dbh->prepare($searchSql);
					$this->execSQL($sth, array($usr["memberId"]));
					$signList = $sth->fetchAll();
					if (count($signList) > 0) {
						$isSign = true;
						$signInfo = array("name"=>$signList[0]["name"], "phone"=>$signList[0]["phone"]);
					} else {
						// echo $usr["username"];
						$signInfo = array("name"=>$usr["username"], "phone"=>$usr["phone"]);
					}
				}
			} else {
				$signInfo = null;
			}
		} catch (Exception $e) {
			$isSuc = false;
			$msg = "查詢失敗：". $e->getMessage();
		}
		return json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "info"=>$data, 
			"isWorkAuth"=>$isWorkAuth, "signList"=>$signList, 
			"isSign"=>$isSign, "signInfo"=>$signInfo));
	}
	
	public function getAdmDetail($params){
		$isSuc = true;
		$msg = "";
		$signList = array();
		
		try {
			$workId = $params["workId"];
			$searchSql = 
                "select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress, m.username, m.email, m.phone, m.photo ".
                "from work w ".
                "left join city c on c.cityId = w.city ".
                "left join town t on t.cityId = w.city and t.townId = w.town ".
                "join member m on m.memberId = w.memberId ".
                "where workId = ?";
            $sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array($workId));
			$data = $sth->fetchAll();
		} catch (Exception $e) {
			$isSuc = false;
			$msg = "查詢失敗：". $e->getMessage();
		}
		return json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "info"=>$data));
	}

	public function getSignList($params) {
		$workId = $params["workId"];
		
		$searchSql = 
            "select ws.* ".
            "from worksign ws ".
            "where ws.workId = ?";
        $sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($workId));
		$data = $sth->fetchAll();
		return $data;
	}
	
	public function signCancel($params){
	    $isSuc = true;
	    $msg = "";
        
		$usr = $_SESSION["website_login_session"];
        $workId = $params["workId"];
        $memberId = $usr["memberId"];
        
        $sth = $this->dbh->prepare("delete from worksign where workId = ? and memberId = ?");
        $sth->execute(array($workId, $memberId));
        $msg = "已取消報名！";

        return json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
    }
	
	public function signUp($params){
	    $isSuc = false;
	    $msg = "";
        if(!isset($_SESSION["website_login_session"])){
            $msg = "如欲報名應援團，請先進行登入！";
        } else {
            $usr = $_SESSION["website_login_session"];
            $workId = $params["workId"];
            $memberId = $usr["memberId"];
            
            $sth = $this->dbh->prepare("select * from worksign where workId = ? and memberId = ?");
            $sth->execute(array($workId, $memberId));
            $data = $sth->fetchAll();
            if (count($data) > 0) {
                $msg = "您已報名過此應援團！";
            } else {
                $name = $params["farmer-name"];
                $phone = $params["farmer-phone"];
				if ($name == "") $msg = "請輸入姓名！";
				else if ($phone == "") $msg = "請輸入聯絡電話！";
				
				if ($msg == "") {
					$sth = $this->dbh->prepare("insert into worksign(workId, memberId, name, phone) values(?, ?, ?, ?)");
		            $sth->execute(array($workId, $memberId, $name, $phone));
		            $isSuc = true;
		            $msg = "報名成功！";
				}
            }
        }
        return json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
    }

	/********************************************************************************************************************************************
	Admin Function
	*/
	
	public function prcUpd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "小農應援團資料編輯成功！";
		
		try {
			$usr = $_SESSION["website_login_session"];
			$workId = $params["workId"];
			$workDay = $this->getWorkDay($params["startDT"], $params["endDT"]);

			$sth = $this->dbh->prepare(
			     "update work ".
			     "set title = ?, city = ?, town = ?, address = ?, salary = ?, startDT = ?, endDT = ?, memo = ?, ".
			     "workCnt = ?, workDay = ?, updateDT = now() where workId = ?");
			$this->execSQL($sth, array(
				$params["title"], $params["city"], $params["town"], $params["address"], 
				$params["salary"], $params["startDT"], $params["endDT"], $params["memo"],
				$params["workCnt"], $workDay, $workId));

			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "小農應援團資料編輯失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "workId"=>$workId));
	}
	
	public function prcAdd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "小農應援團資料新增成功！";
		
		try {
			$workId = "";
			$workDay = $this->getWorkDay($params["startDT"], $params["endDT"]);
			$usr = $_SESSION["website_login_session"];  
			
			$sth = $this->dbh->prepare(
			     "insert into work(memberId, title, city, town, address, salary, startDT, endDT, memo, workCnt, workDay, createDT, updateDT) ".
				 "values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())");
			$this->execSQL($sth, array($usr["memberId"], 
				$params["title"], $params["city"], $params["town"], $params["address"], 
				$params["salary"], $params["startDT"], $params["endDT"], $params["memo"],
				$params["workCnt"], $workDay));
			$workId = $this->dbh->lastInsertId();

			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "小農應援團資料新增失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "workId"=>$workId));
	}
	
	public function getWorkDay($startDT, $endDT) {
		$startDT = strtotime($startDT);
		$endDT = strtotime($endDT);
		$days = round(($endDT-$startDT)/3600/24);
		$overDays = round(($endDT-$startDT)/3600%24);
		if ($overDays != 0) $days++;
		return $days;
	}
	
	public function getAllData($params){
		$usr = $_SESSION["website_login_session"];  

		$searchSql = 
			"select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress, ".
			"(select count(ws.workSignId) from worksign ws where ws.workId = w.workId) as signCnt ".
			"from work w ".
			"left join city c on c.cityId = w.city ".
			"left join town t on t.cityId = w.city and t.townId = w.town ".
			"where memberId = ? ".
			"order by w.startDT desc";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($usr["memberId"]));
		return json_encode(array("list"=>$sth->fetchAll()));
	}
	
	public function getAdmSignList($params) {
		$workId = $params["workId"];
		
		$searchSql = 
            "select ws.* ".
            "from worksign ws ".
            "where ws.workId = ?";
        $sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($workId));
		return json_encode(array("list"=>$sth->fetchAll()));
	}

}
?>