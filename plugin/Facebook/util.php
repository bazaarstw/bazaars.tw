<?php
    header("Content-Type:text/html; charset=utf-8");
    if(!isset($_SESSION)) session_start(); 
	
	require dirname(dirname(dirname(__FILE__))).'/ctrl/models/Base.php';
	require dirname(dirname(dirname(__FILE__))).'/ctrl/models/Config.php';
	$config = new Config();
	$conf = $config->getConfig();
	
	$fullUrl = $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
	$endUrlIdx = stripos($fullUrl, '/'.$conf["webName"].'/');
	$endUrlIdx = $endUrlIdx + strlen($conf["webName"]) + 1;
	$baseUrl = 'http://'. substr($fullUrl, 0, $endUrlIdx);
    $utilUrl = $baseUrl.'plugin/Facebook/util.php';
	
    define('FACEBOOK_SDK_V4_SRC_DIR', 'src/');
    require dirname(dirname(dirname(__FILE__))).'/plugin/Facebook/autoload.php';

    use Facebook\FacebookSession;
    use Facebook\FacebookRedirectLoginHelper;
    use Facebook\FacebookRequest;
    
    $act = $_GET['act'];
    FacebookSession::setDefaultApplication($conf["fbAppId"], $conf["fbAppSecret"]);
    
    if ($act == 'getLoginUrl') {
        $helper = new FacebookRedirectLoginHelper($utilUrl.'?act=getUserData');
		$permissions = array('scope'=>'email');
        $loginUrl = $helper->getLoginUrl($permissions);
        echo json_encode(array("url"=>$loginUrl));
    }

    
    $fbId = '';
    $fbName = '';
    $fbEmail = '';
    $fbPhoto = '';
    if ($act == 'getUserData') {
        $helper = new FacebookRedirectLoginHelper($utilUrl.'?act=getUserData');
        try {
            $session = $helper -> getSessionFromRedirect();
        } catch(FacebookRequestException $ex) {
            // When Facebook returns an error
            print_r('<br/>zzz ');
        } catch(\Exception $ex) {
            // When validation fails or other local issues
            print_r('<br/>yyy '.$ex);
        }
        if ($session) {
            // Logged in
            $request = new FacebookRequest($session, 'GET', '/me?fields=id,name,email');
            $response = $request -> execute();
            $arrayResult = $response->getGraphObject()->asArray();
            
            $fbId = $arrayResult['id'];
            $fbName = $arrayResult['name'];
            $fbEmail = $arrayResult['email'];
            $fbPhoto = 'https://graph.facebook.com/'.$arrayResult['id'].'/picture?type=large';
        }
    }
?>

<?php 
    if ($act == 'getUserData') {
?>
        <form class="form_login">
            <input name="act" type="hidden" value="login_otherLogin" />
            <input name="account" type="hidden" value="<?php echo $fbId;?>" />
            <input name="username" type="hidden" value="<?php echo $fbName;?>" />
            <input name="email" type="hidden" value="<?php echo $fbEmail;?>" />
            <input name="photo" type="hidden" value="<?php echo $fbPhoto;?>" />
            <input name="registerType" type="hidden" value="Facebook" />
        </form>
        <script src="../../_library/jquery.min.js"></script>
        
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

