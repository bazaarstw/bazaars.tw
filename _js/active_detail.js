require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var newsId = $.getUrlParam("newsId");
				if (newsId != null) {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'news_getDetail',
							newsId: newsId
						},
						dataType : "json", 
						success : function(result) {  
							var data = result[0];
							$("#active-content h1").text(data["title"]);
							$("#active-content .cols-body li.content").eq(0).find("p").html(data["startDT"] + " ~ " + data["endDT"]);
							$("#active-content .cols-body li.content").eq(1).find("p").html(data["fullAddress"]);
							$("#active-content .cols-body li.content").eq(2).find("p").html(data["content"]);
						},
						error : function(jqXHR, textProject, errorThrown) {
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$("#footerFrame .system-msg").addClass("error").text(errorString).show();
						}
					});
				}
				
			});
		});
	});
});
