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
			"and s.town like '%". $params["town"]. "%' ".
			"order by s.createDT desc";
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
		
		if ($farmerId != "") {
			$searchSql = 
				"select s.*, ".
				"  case when (select count(sf.storeFarmerId) from storefarmer sf where sf.farmerId = '$farmerId' and sf.storeId = s.storeId) > 0 then '1' else '0' end as selected ".
				"from store s";
			$sth = $this->dbh->prepare($searchSql);
			$sth->execute();
			$storeItem = $sth->fetchAll();
		} else if ($storeId != "") {
			$searchSql = 
				"select s.*, ".
				"  case when (select count(sf.storeFarmerId) from storefarmer sf where sf.storeId = '$storeId' and sf.storeId = s.storeId) > 0 then '1' else '0' end as selected ".
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
		
		echo json_encode(array("storeItem"=>$storeItem));
	}

}
?>