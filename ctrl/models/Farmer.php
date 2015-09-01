<?php

class Farmer extends Base {
	
	public function getDetail($params){
		$farmerId = $params["farmerId"];
		$searchSql = 
			"select fm.* ".
			"from farmer fm ".
			"where fm.farmerId = $farmerId";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$data = $sth->fetchAll();
		
		$searchSql = 
			"select fi.itemName ".
			"from farmeritem fmi ".
			"join fooditem fi on fi.foodItemId = fmi.foodItemId ".
			"where fmi.farmerId = $farmerId";
		//print_r($searchSql);
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$item = $sth->fetchAll();
		
		$searchSql = 
			"select sf.*, s.storeImg, s.storeName ".
			"from storefarmer sf ".
			"join store s on s.storeId = sf.storeId ".
			"where sf.farmerId = $farmerId";
		//print_r($searchSql);
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$store = $sth->fetchAll();
		echo json_encode(array("info"=>$data, "item"=>$item, "store"=>$store));
	}
	
}
?>