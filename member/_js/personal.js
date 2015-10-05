require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn',
			'chosen'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				$.ajax({
					async : false,
					url : "../ctrl/Controller.php",
					type: 'POST',
					data: {
						act: 'login_getUserinfo'
					},
					dataType : "json", 
					success : function(result) { 
						$(".bind_userName").val(result.info.username);
						$(".bind_phone").val(result.info.phone);
						$(".bind_email").val(result.info.email);
					},
					error : function(jqXHR, textProject, errorThrown) {
						var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
							errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
					}
				});
				
				$(document).on("click", ".aj_savePersonal", function() {
					var formObj = $(".form_savePersonal");   
					//alert($(formObj).serialize());
					$.ajax({
						async : false,
						url : "../ctrl/Controller.php",
						type : "POST",
						dataType : "json", 
						data : $(formObj).serialize(),
						success : function(result) {  
							alert(result.msg);
							if (result.isSuc) {
								window.location.replace("index.html");
							}
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
					return false;
				});
				
			});
		});
	});
});
