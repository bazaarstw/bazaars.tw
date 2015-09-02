<?php

class Config extends Base {
	
	public function getConfig(){				
		$sth = $this->dbh->prepare("SELECT * FROM webconfig");
		$sth->execute();
		
		$config = array();
		$data = $sth->fetchAll();
		for ($i = 0 ; $i < count($data) ; $i++) {
			$config[$data[$i]["config"]] = $data[$i]["setting"];
		}
		return $config;
	}
	
}
?>