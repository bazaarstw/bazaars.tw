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
			"join city c on c.cityId = n.city ".
			"join town t on t.cityId = n.city and t.townId = n.town ".
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
			"join city c on c.cityId = n.city ".
			"join town t on t.cityId = n.city and t.townId = n.town ".
			"where newsId = ?";
        $sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($newsId));
		return json_encode($sth->fetchAll());
	}

}
?>