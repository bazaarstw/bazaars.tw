<?php

class Store extends Base {
	
	public function getDistanceList($params){
		$page = $params["page"] - 1;
		$pageNumber = $params["pageNumber"];
		$page = $page * $pageNumber;
		
		$searchSql = 
			"select s.*, CONCAT(c.cityName,t.townName,s.address) as fullAddress, ".
			"(select count(storeFarmerId) from storefarmer where storeId = s.storeId) as farmerCnt ".
			"from store s ".
			"join city c on c.cityId = s.city ".
			"join town t on t.cityId = s.city and t.townId = s.town";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$rows = $sth->fetchAll();
		
		$data = array();
		for ($i = 0 ; $i < count($rows) ; $i++) {
			$row = $rows[$i];
			$distInfo = $this->distance($params["lat"], $params["lon"], $row["latitude"], $row["longitude"], "K");
			$row['dist'] = $distInfo["dist"];
			$row['distDesc'] = $distInfo["distDesc"];
			array_push($data, $row);
		}
		usort($data, array("Store", "sort_by_dist"));
		return json_encode(array("list"=>array_slice($data, $page, $pageNumber), "listCnt"=>count($data)));
	}
	
	function sort_by_dist($a, $b)
	{
		if($a['dist'] == $b['dist']) return 0;
		return ($a['dist'] > $b['dist']) ? 1 : -1;
	}
	
	#lat1,lon1是第一個點的經緯度
	#lat2,lon2是第二個點的經緯度
	#unit的話就用"K" (這樣的話傳回值就會是公尺)
	private function distance($lat1, $lon1, $lat2, $lon2, $unit) {
	  global $source;
	  $theta = $lon1 - $lon2;
	  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
	  $dist = acos($dist);
	  $dist = rad2deg($dist);
	  $miles = $dist * 60 * 1.1515;
	  $unit = strtoupper($unit);
	  $distDesc = "";
	 
	  if ($unit == "K") {
		$meters = intval($miles * 1.609344 * 1000);
		if($meters > 1000){
		  $distDesc1 = intval($meters/1000). '公里';
		  $distDesc2 = intval($meters%1000). '公尺';
		  $distDesc = $distDesc1. $distDesc2;
		}else{
		  $distDesc = $meters. '公尺';
		}
	  } else if ($unit == "N") {
		$distDesc =($miles * 0.8684) + '';
	  } else {
		$distDesc = $miles + '';
	  }
	  
	  return array("dist"=>$meters, "distDesc"=>$distDesc);
	}
	
	public function getListData($params){
		$searchSql = 
			"select s.*, CONCAT(c.cityName,t.townName,s.address) as fullAddress, ".
			"(select count(storeFarmerId) from storefarmer where storeId = s.storeId) as farmerCnt ".
			"from store s ".
			"join city c on c.cityId = s.city ".
			"join town t on t.cityId = s.city and t.townId = s.town ".
			"where s.storeName like '%". $params["keyword"]. "%' ".
			"and s.city like '%". $params["city"]. "%' ".
			"and s.town like '%". $params["town"]. "%' ";
			
		$storeTypeSearchSQL = "";
		$storeType = $params["storeType"];
		if ($storeType != "") {
			$types = preg_split("/[\_,]+/", $storeType);
			for ($i = 0 ; $i < count($types) ; $i++) {
				if ($storeTypeSearchSQL != "") $storeTypeSearchSQL .= " or ";
				$storeTypeSearchSQL .= "storeTypeId = '". $types[$i] ."' ";
			}
			if ($storeTypeSearchSQL != "") {
				$searchSql .= "and (select count(sat.authId) from storeauthtype sat where sat.storeId = s.storeId and (". $storeTypeSearchSQL .")) > 0 ";
			}
		}

		$searchSql .= "order by s.createDT desc";
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}

	public function getDetail($params){
		$storeId = $params["storeId"];
		$searchSql = 
			"select s.* ".
			"from store s ".
			"where s.storeId = $storeId";
		//print_r($searchSql);
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$data = $sth->fetchAll();
		
		$searchSql = 
			"select f.* ".
			"from storefarmer sf ".
			"join farmer f on f.farmerId = sf.farmerId ".
			"where sf.storeId = $storeId";
		//print_r($searchSql);
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$farmer = $sth->fetchAll();
		return json_encode(array("info"=>$data, "farmer"=>$farmer));
	}
	
	public function getItemChosen($params){
		$farmerId = $params["farmerId"];
		$storeId = $params["storeId"];
		$chosenPage = $params["chosenPage"];
		
		if ($chosenPage == "farmer") {
			if ($farmerId != "") {
				$searchSql = 
					"select s.*, ".
					"  case when (select count(sf.storeFarmerId) from storefarmer sf where sf.farmerId = '$farmerId' and sf.storeId = s.storeId) > 0 then '1' else '0' end as selected ".
					"from store s";
				$sth = $this->dbh->prepare($searchSql);
				$sth->execute();
				$storeItem = $sth->fetchAll();
			} else {
				$searchSql = 
					"select s.*, '0' as selected ".
					"from store s";
				$sth = $this->dbh->prepare($searchSql);
				$sth->execute();
				$storeItem = $sth->fetchAll();
			}
		} else {
			if ($storeId != "") {
				$searchSql = 
					"select f.*, ".
					"  case when (select count(sf.storeFarmerId) from storefarmer sf where sf.storeId = '$storeId' and sf.farmerId = f.farmerId) > 0 then '1' else '0' end as selected ".
					"from Farmer f";
				$sth = $this->dbh->prepare($searchSql);
				$sth->execute();
				$storeItem = $sth->fetchAll();
			} else {
				$searchSql = 
					"select f.*, '0' as selected ".
					"from Farmer f";
				$sth = $this->dbh->prepare($searchSql);
				$sth->execute();
				$storeItem = $sth->fetchAll();
			}
		}
		echo json_encode(array("storeItem"=>$storeItem));
	}
	
	public function getStoreTypeItemChosen($params){
		$storeId = $params["storeId"];
		
		if ($storeId != "") {
			$searchSql = 
				"select st.*, case when sat.authId is not null then '1' else '0' end as selected ".
				"from storetype st ".
				"left join storeauthtype sat on sat.storeTypeId = st.typeId and sat.storeId = ?";
			$sth = $this->dbh->prepare($searchSql);
			$sth->execute(array($storeId));
			$storeTypeItem = $sth->fetchAll();
		} else {
			$searchSql = 
				"select st.*, '0' as selected ".
				"from storetype st";
			$sth = $this->dbh->prepare($searchSql);
			$sth->execute();
			$storeTypeItem = $sth->fetchAll();
		}
		echo json_encode(array("storeTypeItem"=>$storeTypeItem));
	}

	/********************************************************************************************************************************************
	Admin Function
	*/
	
	public function prcUpd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "店家資料編輯成功！";
		
		try {
			$usr = $_SESSION["website_login_session"];
			$storeId = $params["storeId"];

			$sth = $this->dbh->prepare(
			     "update store set storeName = ?, contact = ?, city = ?, town = ?, address = ?, latitude = ?, longitude = ?, updateDT = now() where storeId = ?");
			$this->execSQL($sth, array(
				$params["storeName"], $params["contact"], 
				$params["city"], $params["town"], $params["address"], 
				$params["latitude"], $params["longitude"], $storeId));

			$farmerItems = preg_split("/[\,,]+/", $params["farmerItem"]);
			$this->processFarmerItemData($storeId, $farmerItems);
			
			$storeTypeItems = preg_split("/[\,,]+/", $params["storeTypeItem"]);
			$this->processStoreTypeItemData($storeId, $storeTypeItems);

			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "店家資料編輯失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "storeId"=>$storeId));
	}
	
	public function prcAdd($params){
		$this->dbh->beginTransaction();
		$isSuc = true;
		$msg = "店家資料新增成功！";
		
		try {
			$storeId = "";
			$usr = $_SESSION["website_login_session"];  
			
			$sth = $this->dbh->prepare(
			     "insert into store(memberId, storeName, contact, city, town, address, latitude, longitude, createDT, updateDT) ".
				 "values(?, ?, ?, ?, ?, ?, ?, ?, now(), now())");
			$this->execSQL($sth, array($usr["memberId"], 
				$params["storeName"], $params["contact"], 
				$params["city"], $params["town"], $params["address"], 
				$params["latitude"], $params["longitude"]));
			$storeId = $this->dbh->lastInsertId();
			
			$farmerItems = preg_split("/[\,,]+/", $params["farmerItem"]);
			$this->processFarmerItemData($storeId, $farmerItems);
			
			$storeTypeItems = preg_split("/[\,,]+/", $params["storeTypeItem"]);
			$this->processStoreTypeItemData($storeId, $storeTypeItems);
		
			$this->dbh->commit();
		} catch (Exception $e) {
			//print_r($e);
			$isSuc = false;
			$msg = "店家資料新增失敗：". $e->getMessage();
			$this->dbh->rollBack();
		}
		echo json_encode(array("isSuc"=>$isSuc, "msg"=>$msg, "storeId"=>$storeId));
	}
	
	public function processFarmerItemData($storeId, $farmerItems) {
		$curFarmerItem = array();
		$existFarmerItem = array();

		$searchSql = 
			"select sf.* ".
			"from storefarmer sf ".
			"where sf.storeId = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($storeId));
		$curFarmerItem = $sth->fetchAll();
		
		//刪除
		for ($i = 0 ; $i < count($curFarmerItem) ; $i++) {
			if (!in_array($curFarmerItem[$i]["farmerId"], $farmerItems)) {
				$sth = $this->dbh->prepare(
				     "delete from storefarmer ".
				     "where storeFarmerId = ?");
		        $this->execSQL($sth, array($curFarmerItem[$i]["storeFarmerId"]));
			}
			array_push($existFarmerItem, $curFarmerItem[$i]["farmerId"]);
		}
		//新增
		for ($i = 0 ; $i < count($farmerItems) ; $i++) {
			if (!in_array($farmerItems[$i], $existFarmerItem)) {
				$sth = $this->dbh->prepare(
				     "insert into storefarmer(storeId, farmerId) ".
				     "values(?, ?)");
				$this->execSQL($sth, array($storeId, $farmerItems[$i]));
			}
		}
	}
	
	public function processStoreTypeItemData($storeId, $storeTypeItems) {
		$curStoreTypeItem = array();
		$existStoreTypeItem = array();

		$searchSql = 
			"select sat.* ".
			"from storeauthtype sat ".
			"where sat.storeId = ?";
		$sth = $this->dbh->prepare($searchSql);
		$this->execSQL($sth, array($storeId));
		$curStoreTypeItem = $sth->fetchAll();
		
		//刪除
		for ($i = 0 ; $i < count($curStoreTypeItem) ; $i++) {
			if (!in_array($curStoreTypeItem[$i]["storeTypeId"], $storeTypeItems)) {
				$sth = $this->dbh->prepare(
				     "delete from storeauthtype ".
				     "where authId = ?");
		        $this->execSQL($sth, array($curStoreTypeItem[$i]["authId"]));
			}
			array_push($existStoreTypeItem, $curStoreTypeItem[$i]["storeTypeId"]);
		}
		//新增
		for ($i = 0 ; $i < count($storeTypeItems) ; $i++) {
			if (!in_array($storeTypeItems[$i], $existStoreTypeItem)) {
				$sth = $this->dbh->prepare(
				     "insert into storeauthtype(storeId, storeTypeId) ".
				     "values(?, ?)");
				$this->execSQL($sth, array($storeId, $storeTypeItems[$i]));
			}
		}
	}
	
	public function getAllData($params){
		$searchSql = 
			"select s.*, CONCAT(c.cityName,t.townName,s.address) as fullAddress, ".
			"(select count(storeFarmerId) from storefarmer where storeId = s.storeId) as farmerCnt ".
			"from store s ".
			"join city c on c.cityId = s.city ".
			"join town t on t.cityId = s.city and t.townId = s.town ".
			"where 1 = 1 ".
			"order by s.createDT desc";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		return json_encode(array("list"=>$sth->fetchAll()));
	}
}
?>