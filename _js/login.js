require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				
				$("#demosMenu").change(function(){
				  window.location.href = $(this).find("option:selected").attr("id") + '.html';
				});
				
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
							alert(result.msg);
							if (result.isSuc) {
								location.href="index.html";
							}
						},
						error : function(jqXHR, textProject, errorThrown) {
							//錯誤回應字串
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$("#footerFrame .system-msg").addClass("error").text(errorString).show();
						}
					});
				});
				
			});
		});
	});
});
