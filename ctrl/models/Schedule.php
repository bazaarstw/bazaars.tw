<?php

class Schedule extends Base {
	
	public function getListData($params){
		$searchSql = 
			"(select 'work' as type, workId as id, title, startDT as start, endDT as end, '#494' as color, 1 as allDay from work) ".
			"union ".
			"(select 'news' as type, newsId as id, title, startDT as start, endDT as end, '#F52' as color, 1 as allDay from news) ".
			"order by start";
		$sth = $this->dbh->prepare($searchSql);
		$sth->execute();
		return json_encode($sth->fetchAll());
	}
	
}
?>