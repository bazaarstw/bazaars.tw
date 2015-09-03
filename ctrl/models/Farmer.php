<?php

class Farmer extends Base {
	
	public function getListData($params){
		$isSuc = true;
		$msg = "農友資料查詢成功！";
		
		try {
			$usr = $_SESSION["website_login_session"];
			$memberId = $usr["memberId"];
			$searchSql = 
				"select fm.* ".
				"from farmer fm ".
				"where fm.memberId = $memberId";
			$data = $this->processPageSQL($params, $searchSql);
		} catch (Exception $e) {
			$isSuc = false;
			$msg = "農友資料查詢失敗：". $e->getMessage();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getDetail($params){
		$isSuc = true;
		$msg = "農友資料查詢成功！";
		
		try {
			$farmerId = $params["farmerId"];
			$searchSql = 
				"select fm.* ".
				"from farmer fm ".
				"where fm.farmerId = $farmerId";
			$sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array());
			$data = $sth->fetchAll();
			
			$searchSql = 
				"select fd.* ".
				"from farmerdesc fd ".
				"where fd.farmerId = $farmerId";
			$sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array());
			$desc = $sth->fetchAll();
			
			$searchSql = 
				"select fi.itemName ".
				"from farmeritem fmi ".
				"join fooditem fi on fi.foodItemId = fmi.foodItemId ".
				"where fmi.farmerId = $farmerId";
			//print_r($searchSql);
			$sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array());
			$item = $sth->fetchAll();
			
			$searchSql = 
				"select sf.*, s.storeImg, s.storeName ".
				"from storefarmer sf ".
				"join store s on s.storeId = sf.storeId ".
				"where sf.farmerId = $farmerId";
			//print_r($searchSql);
			$sth = $this->dbh->prepare($searchSql);
			$this->execSQL($sth, array());
			$store = $sth->fetchAll();
		} catch (Exception $e) {
			$isSuc = false;
			$msg = "農友資料查詢失敗：". $e->getMessage();
		}
		
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "info"=>$data, "desc"=>$desc, "item"=>$item, "store"=>$store));
	}

	public function prcUpd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "農友資料編輯成功！";
		
		try {
			$usr = $_SESSION["website_login_session"];
			$farmerId = $params["farmerId"];

			$sth = $this->dbh->prepare(
			     "update farmer set name = ?, content = ?, fbRss = ?, updateDT = now() where farmerId = ?");
			$this->execSQL($sth, array($params["farmerName"], $params["content"], $params["fbRss"], $farmerId));

			$this->processPhoneData($farmerId, $params["phone"]);
			$this->processEmailData($farmerId, $params["email"]);
			$this->processLinkData($farmerId, $params["link"], $params["linkDesc"]);
			
			$foodItems = preg_split("/[\,,]+/", $params["foodItem"]);
			$this->processFoodItemData($farmerId, $foodItems);
			
			$storeItems = preg_split("/[\,,]+/", $params["storeItem"]);
			$this->processStoreItemData($farmerId, $storeItems);

			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "農友資料編輯失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "farmerId"=>$farmerId));
	}
	
	public function prcAdd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "農友資料新增成功！";
		
		try {
			$farmerId = "";
			$usr = $_SESSION["website_login_session"];  
		
			$sth = $this->dbh->prepare(
			     "insert into farmer(memberId, name, content, fbRss, createDT, updateDT) ".
			     "values(?, ?, ?, ?, now(), now())");
			$this->execSQL($sth, array($usr["memberId"], $params["farmerName"], $params["content"], $params["fbRss"]));
	        // $sth->execute(array($usr["memberId"], $params["farmerName"], $params["content"], $params["fbRss"]));
			$farmerId = $this->dbh->lastInsertId();
			
			$this->processPhoneData($farmerId, $params["phone"]);
			$this->processEmailData($farmerId, $params["email"]);
			$this->processLinkData($farmerId, $params["link"], $params["linkDesc"]);
			
			$foodItems = preg_split("/[\,,]+/", $params["foodItem"]);
			$this->processFoodItemData($farmerId, $foodItems);
			
			$storeItems = preg_split("/[\,,]+/", $params["storeItem"]);
			$this->processStoreItemData($farmerId, $storeItems);
			
			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "農友資料新增失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "farmerId"=>$farmerId));
	}

	public function processFoodItemData($farmerId, $foodItems) {
		$curFoodItem = array();
		$existFoodItem = array();

		$searchSql = 
			"select fi.* ".
			"from farmeritem fi ".
			"where fi.farmerId = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($farmerId));
		$curFoodItem = $sth->fetchAll();

		//刪除
		for ($i = 0 ; $i < count($curFoodItem) ; $i++) {
			if (!in_array($curFoodItem[$i]["foodItemId"], $foodItems)) {
				$sth = $this->dbh->prepare(
				     "delete from farmeritem ".
				     "where farmerItemId = ?");
		        $this->execSQL($sth, array($curFoodItem[$i]["farmerItemId"]));
			}
			array_push($existFoodItem, $curFoodItem[$i]["foodItemId"]);
		}
		//新增
		for ($i = 0 ; $i < count($foodItems) ; $i++) {
			if (!in_array($foodItems[$i], $existFoodItem)) {
				$sth = $this->dbh->prepare(
				     "insert into farmeritem(farmerId, foodItemId) ".
				     "values(?, ?)");
				$this->execSQL($sth, array($farmerId, $foodItems[$i]));
			}
		}
	}

	public function processStoreItemData($farmerId, $storeItems) {
		$curStoreItem = array();
		$existStoreItem = array();

		$searchSql = 
			"select sf.* ".
			"from storefarmer sf ".
			"where sf.farmerId = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($farmerId));
		$curStoreItem = $sth->fetchAll();
		
		//刪除
		for ($i = 0 ; $i < count($curStoreItem) ; $i++) {
			if (!in_array($curStoreItem[$i]["storeId"], $storeItems)) {
				$sth = $this->dbh->prepare(
				     "delete from storefarmer ".
				     "where storeFarmerId = ?");
		        $this->execSQL($sth, array($curStoreItem[$i]["storeFarmerId"]));
			}
			array_push($existStoreItem, $curStoreItem[$i]["storeId"]);
		}
		//新增
		for ($i = 0 ; $i < count($storeItems) ; $i++) {
			if (!in_array($storeItems[$i], $existStoreItem)) {
				$sth = $this->dbh->prepare(
				     "insert into storefarmer(farmerId, storeId) ".
				     "values(?, ?)");
				$this->execSQL($sth, array($farmerId, $storeItems[$i]));
			}
		}
	}

	public function processPhoneData($farmerId, $phone) {
		$curPhone = array();
		$existPhone = array();
		
		$searchSql = 
			"select fd.* ".
			"from farmerdesc fd ".
			"where fd.farmerId = ? ".
			"and fd.descKey = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($farmerId, "phone"));
		$curPhone = $sth->fetchAll();
		
		//刪除
		for ($i = 0 ; $i < count($curPhone) ; $i++) {
			if (!in_array($curPhone[$i]["descValue"], $phone)) {
				$sth = $this->dbh->prepare(
				     "delete from farmerdesc ".
				     "where farmerDescId = ?");
		        $this->execSQL($sth, array($curPhone[$i]["farmerDescId"]));
			}
			array_push($existPhone, $curPhone[$i]["descValue"]);
		}
		//新增
		for ($i = 0 ; $i < count($phone) ; $i++) {
			if (!in_array($phone[$i], $existPhone)) {
				$sth = $this->dbh->prepare(
				     "insert into farmerdesc(farmerId, descKey, descValue, descContent, createDT, updateDT) ".
				     "values(?, ?, ?, ?, now(), now())");
		        $this->execSQL($sth, array($farmerId, "phone", $phone[$i], ""));
			}
		}
	}

	public function processEmailData($farmerId, $email) {
		$curEmail = array();
		$existEmail = array();
		
		$searchSql = 
			"select fd.* ".
			"from farmerdesc fd ".
			"where fd.farmerId = ? ".
			"and fd.descKey = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($farmerId, "email"));
		$curEmail = $sth->fetchAll();
		
		//刪除
		for ($i = 0 ; $i < count($curEmail) ; $i++) {
			if (!in_array($curEmail[$i]["descValue"], $email)) {
				$sth = $this->dbh->prepare(
				     "delete from farmerdesc ".
				     "where farmerDescId = ?");
		        $this->execSQL($sth, array($curEmail[$i]["farmerDescId"]));
			}
			array_push($existEmail, $curEmail[$i]["descValue"]);
		}
		//新增
		for ($i = 0 ; $i < count($email) ; $i++) {
			if (!in_array($email[$i], $existEmail)) {
				$sth = $this->dbh->prepare(
				     "insert into farmerdesc(farmerId, descKey, descValue, descContent, createDT, updateDT) ".
				     "values(?, ?, ?, ?, now(), now())");
		        $this->execSQL($sth, array($farmerId, "email", $email[$i], ""));
			}
		}
	}

	public function processLinkData($farmerId, $link, $linkDesc) {
		$curLink = array();
		$existLink = array();
		
		$searchSql = 
			"select fd.* ".
			"from farmerdesc fd ".
			"where fd.farmerId = ? ".
			"and fd.descKey = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($farmerId, "link"));
		$curLink = $sth->fetchAll();
		
		//刪除
		for ($i = 0 ; $i < count($curLink) ; $i++) {
			if (!in_array($curLink[$i]["descValue"], $link)) {
				$sth = $this->dbh->prepare(
				     "delete from farmerdesc ".
				     "where farmerDescId = ?");
		        $this->execSQL($sth, array($curLink[$i]["farmerDescId"]));
			}
			array_push($existLink, $curLink[$i]["descValue"]);
		}
		//新增
		for ($i = 0 ; $i < count($link) ; $i++) {
			if (!in_array($link[$i], $existLink)) {
				$sth = $this->dbh->prepare(
				     "insert into farmerdesc(farmerId, descKey, descValue, descContent, createDT, updateDT) ".
				     "values(?, ?, ?, ?, now(), now())");
		        $this->execSQL($sth, array($farmerId, "link", $link[$i], $linkDesc[$i]));
			}
		}
	}
	
}
?>