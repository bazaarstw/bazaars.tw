<?php

class Food extends Base {
	
	public function getClassList($params){
		$searchSql = 
			"select fc.*, pfc.classPath as parentClassPath, ".
			"(select count(foodClassId) from foodclass where classParentId = fc.foodClassId) as subClassCnt ".
			"from foodclass fc ".
			"left join foodclass pfc on pfc.foodClassId = fc.classParentId ".
			"where fc.classParentId = ". $params["parentId"];
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getListItem($params){
		$classId = $params["classId"];
		$sth = $this->dbh->prepare("select * from fooditem where foodClassId = ?");
		$sth->execute(array($classId));
		return json_encode($sth->fetchAll());
	}
	
	public function getFarmerList($params){
		$classId = $params["classId"];
		$itemId = $params["itemId"];
		$keyword = '%'.$params["keyword"].'%';
		$searchSql = "";
		if ($itemId == "") {
			$searchSql = 
			"select distinct fm.*, ".
			"(select classPath from foodclass where foodClassId = $classId) as parentClassPath ".
			"from farmer fm ".
			"join farmeritem fi on fi.farmerId = fm.farmerId ".
			"where fi.foodItemId in (select foodItemId from fooditem where foodClassId = $classId and itemName like '$keyword')";
		} else {
			$searchSql = 
			"select distinct fm.*, ".
			"(select classPath from foodclass where foodClassId = $classId) as parentClassPath ".
			"from farmer fm ".
			"join farmeritem fi on fi.farmerId = fm.farmerId ".
			"where fi.foodItemId = $itemId ".
			"and itemName like '$keyword'";
		}
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
}
?>