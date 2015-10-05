require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				$.ajax({
					async : false,
					url : "../ctrl/Controller.php",
					type: 'POST',
					data: {
						act: 'login_getAdmInfo'
					},
					dataType : "json", 
					success : function(result) { 
						if (result.isSuc) {
							$(".bind_farmerCnt").html(result.farmerCnt);
							$(".bind_storeCnt").html(result.storeCnt);
							$(".bind_workCnt").html(result.workCnt);
							$(".bind_newsCnt").html(result.newsCnt);
						} else {
							alert(result.msg);
						}
					},
					error : function(jqXHR, textProject, errorThrown) {
						var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
							errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
					}
				});
			});
		});
	});
});
