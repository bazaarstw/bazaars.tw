<?php
    header("Content-Type:text/html; charset=utf-8");
    if(!isset($_SESSION)) session_start(); 

    require dirname(dirname(dirname(__FILE__))).'/ctrl/models/Base.php';
	require dirname(dirname(dirname(__FILE__))).'/ctrl/models/Config.php';
	$config = new Config();
	$conf = $config->getConfig();
	
	$fullUrl = $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
	$endUrlIdx = stripos($fullUrl, '/'.$conf["webName"].'/');
	$endUrlIdx = $endUrlIdx + strlen($conf["webName"]) + 2;
	$baseUrl = 'http://'. substr($fullUrl, 0, $endUrlIdx);
    $utilUrl = $baseUrl.'plugin/Google/util.php';
    
    require_once 'src/Google_Client.php';
    require_once 'src/contrib/Google_Oauth2Service.php';

    $act = $_GET['act'];
    
    if ($act == 'getLoginUrl') {
        $loginUrl = 'https://accounts.google.com/o/oauth2/auth?'.http_build_query(array(
            'scope' => 'email profile', 
            'response_type' => 'code', 
            'redirect_uri' => $utilUrl.'?act=getUserData', 
            'access_type' => 'offline', 
            'approval_prompt' => 'force', 
            'client_id' => $conf["googleClientId"], ));
        echo json_encode(array("url"=>$loginUrl));
    }

    $gId = '';
    $gName = '';
    $gEmail = '';
    $gPhoto = '';
    if ($act == 'getUserData') {
        $client = new Google_Client();
        $client -> setApplicationName("Google UserInfo PHP Starter Application");
        $oauth2 = new Google_Oauth2Service($client);
        if (isset($_GET['code'])) {
            $client -> authenticate($_GET['code']);
            $_SESSION['token'] = $client -> getAccessToken();
            $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
            header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL).'?act=getUserData');
            return;
        }
        
        if (isset($_SESSION['token'])) {
            $client -> setAccessToken($_SESSION['token']);
        }
    
        if (isset($_REQUEST['logout'])) {
            unset($_SESSION['token']);
            $client -> revokeToken();
        }
    
        if ($client -> getAccessToken()) {
            $user = $oauth2 -> userinfo -> get();
            // These fields are currently filtered through the PHP sanitize filters.
            // See http://www.php.net/manual/en/filter.filters.sanitize.php

            $gId = filter_var($user['id'], FILTER_SANITIZE_STRING);
            $gName = filter_var($user['name'], FILTER_SANITIZE_STRING);
            $gEmail = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
            $gPhoto = filter_var($user['picture'], FILTER_VALIDATE_URL);
    
            // The access token may have been updated lazily.
            $_SESSION['token'] = $client -> getAccessToken();
        } else {
            $authUrl = $client -> createAuthUrl();
        }
    }
?>

<?php 
    if ($act == 'getUserData') {
?>
        <form class="form_login">
            <input name="act" type="hidden" value="login_otherLogin" />
            <input name="account" type="hidden" value="<?php echo $gId;?>" />
            <input name="username" type="hidden" value="<?php echo $gName;?>" />
            <input name="email" type="hidden" value="<?php echo $gEmail;?>" />
            <input name="photo" type="hidden" value="<?php echo $gPhoto;?>" />
            <input name="registerType" type="hidden" value="Google" />
        </form>
        <script src="../../_library/jquery-1.9.1.min.js"></script>
        
        <script>
            var formObj = $(".form_login");
            $.ajax({
                async : false,
                url : "<?php echo $baseUrl;?>ctrl/Controller.php",
                type : "POST",
                dataType : "json", 
                data : $(formObj).serialize(),
                success : function(result) {  
                    if(result.isLogin){       
						location.href="<?php echo $baseUrl;?>index.html";
                    }else{
                        location.href="<?php echo $baseUrl;?>login.html";
                        jQuery('.login-alert').fadeIn();
                    }
                },
                error : function(jqXHR, textProject, errorThrown) {
                    alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
                    alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
                }
            });
        </script>
<?php 
    }
?>



