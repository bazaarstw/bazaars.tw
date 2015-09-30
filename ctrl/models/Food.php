<?php

class Food extends Base {
	
	public function getClassList($params){
		$searchSql = 
			"select fc.* ".
			"from foodclass fc ".
			"where fc.foodClassId = ". $params["parentId"];
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$clsRows = $sth->fetchAll();
		
		$searchSql = 
			"select fc.*, pfc.classPath as parentClassPath, ".
			"(select count(foodClassId) from foodclass where classParentId = fc.foodClassId) as subClassCnt ".
			"from foodclass fc ".
			"left join foodclass pfc on pfc.foodClassId = fc.classParentId ".
			"where fc.classParentId = ". $params["parentId"];
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("info"=>$clsRows, "list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getListItem($params){
		$classId = $params["classId"];
		$sth = $this->dbh->prepare("select * from fooditem where active = 1 AND foodClassId = ?");
		$sth->execute(array($classId));
		return json_encode($sth->fetchAll());
	}
	
	public function getFarmerList($params){
		$classId = $params["classId"];
		$itemId = $params["itemId"];
		// $keyword = '%'.$params["keyword"].'%';
		
		$searchSql = 
			"select fc.* ".
			"from foodclass fc ".
			"where fc.foodClassId = ". $classId;
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$clsRows = $sth->fetchAll();
		
		$searchSql = "";
		if ($itemId == "") {
			$searchSql = 
			"select distinct fm.*, ".
			"(select classPath from foodclass where foodClassId = $classId) as parentClassPath ".
			"from farmer fm ".
			"join farmeritem fi on fi.farmerId = fm.farmerId ".
			"where fi.foodItemId in (select foodItemId from fooditem where foodClassId = $classId) ".
			"and fm.city like '%". $params["city"]. "%' ".
			"and fm.town like '%". $params["town"]. "%'";
			// "where fi.foodItemId in (select foodItemId from fooditem where foodClassId = $classId and itemName like '$keyword')";
		} else {
			$searchSql = 
			"select distinct fm.*, ".
			"(select classPath from foodclass where foodClassId = $classId) as parentClassPath ".
			"from farmer fm ".
			"join farmeritem fi on fi.farmerId = fm.farmerId ".
			"where fi.foodItemId = $itemId ".
			"and fi.foodItemId in (select foodItemId from fooditem where foodClassId = $classId) ".
			"and fm.city like '%". $params["city"]. "%' ".
			"and fm.town like '%". $params["town"]. "%'";
			// "and fi.foodItemId in (select foodItemId from fooditem where foodClassId = $classId and itemName like '$keyword')";
		}
		// echo $searchSql;
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("info"=>$clsRows, "list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getItemChosen($params){
		$farmerId = $params["farmerId"];
		
		$searchSql = 
			"select fc.* ".
			"from foodclass fc ".
			"where (select count(fcp.foodClassId) from foodclass fcp where fcp.classParentId = fc.foodClassId) = 0";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		$foodClass = $sth->fetchAll();
		
		for ($i = 0 ; $i < count($foodClass) ; $i++) {
			$row = $foodClass[$i];
			
			if ($farmerId == "") {
				$searchSql = 
					"select fi.*, '0' as selected ".
					"from fooditem fi ".
					"where fi.foodClassId = ". $row["foodClassId"];
			} else {
				$searchSql = 
					"select fi.*, ".
					"  case when (select count(fmi.farmerItemId) from farmeritem fmi where fmi.farmerId = '$farmerId' and fmi.foodItemId = fi.foodItemId) > 0 then '1' else '0' end as selected ".
					"from fooditem fi ".
					"where fi.foodClassId = ". $row["foodClassId"];
			}
			$sth = $this->dbh->prepare($searchSql);
			$sth->execute();
			$foodClass[$i]["item"] = $sth->fetchAll();
		}
		
		echo json_encode(array("foodClass"=>$foodClass));
	}
	
}
?>