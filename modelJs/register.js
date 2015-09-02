$(document).ready(function() {
	$(".aj_register").on("click", function() {
		$(".form_login_act").attr("value", "member_register");
		var formObj = $(".form_login");   
		//$(formObj).append("<input type='hidden' name='act' value='member_register'/>");
		//alert($(formObj).serialize());
    	$.ajax({
    		async : false,
    		url : "ctrl/Controller.php",
    		type : "POST",
    		dataType : "json", 
    		data : $(formObj).serialize(),
    		success : function(result) {  
				
				if (result.isSuc) {
					alert(result.msg);
                    location.href="login.html";
    			}else{
					alert("±b¸¹©Î±K½X¿ù»~");
    			}
    		},
    		error : function(jqXHR, textProject, errorThrown) {
    			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
    			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
    		}
    	});
	});
});
