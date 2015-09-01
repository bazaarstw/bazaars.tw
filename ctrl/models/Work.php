<?php

class Work extends Base {
	
	public function getListData($params){
		$searchSql = 
			"select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress ".
			"from work w ".
			"join city c on c.cityId = w.city ".
			"join town t on t.cityId = w.city and t.townId = w.town ".
			"where w.title like '%". $params["title"]. "%' ".
			"and w.city like '%". $params["city"]. "%' ".
			"and w.town like '%". $params["town"]. "%' ".
			"order by w.startDT desc";
		$data = $this->processPageSQL($params, $searchSql);
		return json_encode(array("list"=>$data['row'], "listCnt"=>$data['count']));
	}
	
	public function getDetail($params){
		$workId = $params["workId"];
		$searchSql = 
                "select w.*, CONCAT(c.cityName,t.townName,w.address) as fullAddress, m.username, m.email, m.phone, m.photo ".
                "from work w ".
                "join city c on c.cityId = w.city ".
                "join town t on t.cityId = w.city and t.townId = w.town ".
                "join member m on m.memberId = w.memberId ".
                "where workId = ?";
        $sth = $this->dbh->prepare($searchSql);
		$sth->execute(array($workId));
		return json_encode($sth->fetchAll());
	}
	
	public function signUp($params){
	    $isSuc = false;
	    $msg = "";
        if(!isset($_SESSION["website_login_session"])){
            $msg = "如欲報名應援團，請先進行登入！";
        } else {
            $usr = $_SESSION["website_login_session"];
            $workId = $params["workId"];
            $memberId = $usr["memberId"];
            
            $sth = $this->dbh->prepare("select * from worksign where workId = ? and memberId = ?");
            $sth->execute(array($workId, $memberId));
            $data = $sth->fetchAll();
            if (count($data) > 0) {
                $msg = "您已報名過此應援團！";
            } else {
                $name = $params["farmer-name"];
                $phone = $params["farmer-phone"];
                $sth = $this->dbh->prepare("insert into worksign(workId, memberId, name, phone) values(?, ?, ?, ?)");
                $sth->execute(array($workId, $memberId, $name, $phone));
                $isSuc = true;
                $msg = "報名成功！";
            }
        }
        return json_encode(array("isSuc"=>$isSuc, "msg"=>$msg));
    }

}
?>