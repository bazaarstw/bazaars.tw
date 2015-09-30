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
				$.ajax({
					async : true,
					url: 'ctrl/Controller.php',
					type: 'POST',
					data: {
						act: 'login_Logout'
					},
					dataType : "json", 
					success : function(result) {
						if (result.isLogout) {
							$(".view_loging").hide();
							$(".view_notLogin").show();
						}else{
						}
						
					},
					error : function(jqXHR, textProject, errorThrown) {
						// alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
						// alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
					}
				});
				
			});
		});
	});
});
