<?php

class News extends Base {
	
	public function getLimitData($params){				
		$sth = $this->dbh->prepare("SELECT * FROM news ORDER BY startDT DESC LIMIT 0,". $params["limitCnt"]);
		$sth->execute();
		return json_encode($sth->fetchAll());
	}
	
	public function getListData($params){
		$searchSql = 
			"select n.*, CONCAT(c.cityName,t.townName,n.address) as fullAddress ".
			"from news n ".
			"left join city c on c.cityId = n.city ".
			"left join town t on t.cityId = n.city and t.townId = n.town ".
			"where n.title like '%". $params["title"]. "%' ".
			"and n.city like '%". $params["city"]. "%' ".
			"and n.town like '%". $params["town"]. "%' ".
			"order by n.startDT desc";
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getDetail($params){
		$newsId = $params["newsId"];
		$searchSql = 
			"select n.*, CONCAT(c.cityName,t.townName,n.address) as fullAddress ".
			"from news n ".
			"left join city c on c.cityId = n.city ".
			"left join town t on t.cityId = n.city and t.townId = n.town ".
			"where newsId = ?";
        $sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($newsId));
		return json_encode($sth->fetchAll());
	}
	
	/********************************************************************************************************************************************
	Admin Function
	*/
	
	public function prcUpd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "活動報報資料編輯成功！";
		
		try {
			$usr = $_SESSION["website_login_session"];
			$newsId = $params["newsId"];

			$sth = $this->dbh->prepare(
			     "update news ".
			     "set title = ?, city = ?, town = ?, address = ?, startDT = ?, endDT = ?, content = ?, updateDT = now() where newsId = ?");
			$this->execSQL($sth, array(
				$params["title"], $params["city"], $params["town"], $params["address"], 
				$params["startDT"], $params["endDT"], $params["content"], $newsId));

			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "活動報報資料編輯失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "newsId"=>$newsId));
	}
	
	public function prcAdd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "活動報報資料新增成功！";
		
		try {
			$newsId = "";
			$usr = $_SESSION["website_login_session"];  
			
			$sth = $this->dbh->prepare(
			     "insert into news(memberId, title, city, town, address, startDT, endDT, content, createDT, updateDT) ".
				 "values(?, ?, ?, ?, ?, ?, ?, ?, now(), now())");
			$this->execSQL($sth, array($usr["memberId"], 
				$params["title"], $params["city"], $params["town"], $params["address"], 
				$params["startDT"], $params["endDT"], nl2br($params["content"])));
			$newsId = $this->dbh->lastInsertId();

			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "活動報報資料新增失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "newsId"=>$newsId));
	}

	public function getAllData($params){
		$usr = $_SESSION["website_login_session"];  

		$searchSql = 
			"select n.*, CONCAT(c.cityName,t.townName,n.address) as fullAddress ".
			"from news n ".
			"left join city c on c.cityId = n.city ".
			"left join town t on t.cityId = n.city and t.townId = n.town ".
			"where memberId = ? ".
			"order by n.updateDT desc";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($usr["memberId"]));
		return json_encode(array("list"=>$sth->fetchAll()));
	}

}
?>
