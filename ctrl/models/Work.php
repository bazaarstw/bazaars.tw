<?php

class Work extends Base {
	
	public function getListData($params){
		$searchSql = 
			"select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress ".
			"from work w ".
			"join city c on c.cityId = w.city ".
			"join town t on t.cityId = w.city and t.townId = w.town ".
			"where w.title like '%". $params["title"]. "%' ".
			"and w.city like '%". $params["city"]. "%' ".
			"and w.town like '%". $params["town"]. "%' ".
			"order by w.startDT desc";
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getDetail($params){
		$workId = $params["workId"];
		$searchSql = 
                "select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress, m.username, m.email, m.phone, m.photo ".
                "from work w ".
                "join city c on c.cityId = w.city ".
                "join town t on t.cityId = w.city and t.townId = w.town ".
                "join member m on m.memberId = w.memberId ".
                "where workId = ?";
        $sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($workId));
		return json_encode($sth->fetchAll());
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
                $sth = $this->dbh->prepare("insert into worksign(workId, memberId, name, phone) values(?, ?, ?, ?)");
                $sth->execute(array($workId, $memberId, $name, $phone));
                $isSuc = true;
                $msg = "報名成功！";
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
			"select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress ".
			"from work w ".
			"join city c on c.cityId = w.city ".
			"join town t on t.cityId = w.city and t.townId = w.town ".
			"where memberId = ? ".
			"order by w.startDT desc";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($usr["memberId"]));
		return json_encode(array("list"=>$sth->fetchAll()));
	}

}
?>