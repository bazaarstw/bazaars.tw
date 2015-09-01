<?php

class Area extends Base {
	
	public function getListCity($params){				
		$sth = $this->dbh->prepare("SELECT * FROM city ORDER BY cityId");
		$sth->execute();
		return json_encode($sth->fetchAll());
	}
	
	public function getListTown($params){
		$cityId = $params["cityId"];
		$sth = $this->dbh->prepare("SELECT * FROM town WHERE cityId = '$cityId' ORDER BY townId");
		$sth->execute();
		return json_encode($sth->fetchAll());
	}
	
}
?>