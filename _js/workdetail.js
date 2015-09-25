require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var workId = $.getUrlParam("workId");
				if (workId != null) {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'work_getDetail',
							workId: workId
						},
						dataType : "json", 
						success : function(result) {  
							//viewJSON(result);
							var data = result[0];
							$(".view_memberPhoto").attr("src", data["photo"]);
							$(".view_memberName").html(data["username"]+"¡@<span>µo§G</span>");
							$(".active-content .Cols .content").eq(0).find("span").html(data["title"]);
							$(".active-content .Cols .content").eq(1).find("span").html(data["startDT"] + " ~ " + data["endDT"]);
							$(".active-content .Cols .content").eq(2).find("span").html(data["workDay"] + " / ¤Ñ");
							$(".active-content .Cols .content").eq(3).find("div").html(data["workCnt"] + "/¤H");
							$(".active-content .Cols .content").eq(4).find("div").html(data["fullAddress"]);
							$(".active-content .Cols .content").eq(5).find("div").html(data["memo"]);
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				$(".aj_workSignUp").on("click", function() {
					var formObj = $(".form_workSign");   
					$(formObj).append("<input type='hidden' name='act' value='work_signUp'/>");
					$(formObj).append("<input type='hidden' name='workId' value='"+workId+"'/>");
					//alert($(formObj).serialize());
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type : "POST",
						dataType : "json", 
						data : $(formObj).serialize(),
						success : function(result) {  
							alert(result.msg);
						},
						error : function(jqXHR, textProject, errorThrown) {
							//??????
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
