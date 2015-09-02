<?php
if(!isset($_SESSION)) 
{
	session_start(); 
} 

function __autoload($className){
	include_once("models/$className.php");	
}

if(!isset($_POST['act'])) {
	print json_encode(0);
	return;
}

$act = $_POST['act'];
$act = preg_split("/[\_,]+/", $act);
$func = $act[1];

switch($act[0]) {
    case 'member':
        $member = new Member();
        print $member->$act[1]($_POST);
    break;
    
	case 'login':
		$login = new Login();
		print $login->$act[1]($_POST);
	break;
	
	case 'news':
		$news = new News();
		print $news->$act[1]($_POST);
	break;
	
	case 'work':
		$work = new Work();
		print $work->$act[1]($_POST);
	break;
	
	case 'schedule':
		$schedule = new Schedule();
		print $schedule->$act[1]($_POST);
	break;
	
	case 'food':
		$food = new Food();
		print $food->$act[1]($_POST);
	break;
	
	case 'farmer':
		$farmer = new Farmer();
		print $farmer->$act[1]($_POST);
	break;
	
	case 'store':
		$store = new Store();
		print $store->$act[1]($_POST);
	break;
	
	case 'area':
		$area = new Area();
		print $area->$act[1]($_POST);
	break;
	
	/*
	case 'add_user':
		$user = new stdClass;
		$user = json_decode($_POST['user']);
		print $users->add($user);		
	break;
	
	case 'delete_user':
		$user = new stdClass;
		$user = json_decode($_POST['user']);
		print $users->delete($user);		
	break;
	
	case 'update_field_data':
		$user = new stdClass;
		$user = json_decode($_POST['user']);
		print $users->updateValue($user);				
	break;
	*/
}

exit();