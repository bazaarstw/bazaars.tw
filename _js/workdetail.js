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
							var data = result.info[0];
							$(".view_memberPhoto").attr("src", data["photo"]);
							$(".view_memberName").html(data["username"]);
							$(".work-content .content").eq(0).find("span").html(data["title"]);
							$(".work-content .content").eq(1).find("span").html(data["startDT"] + " ~ " + data["endDT"]);
							$(".work-content .content").eq(2).find("span").html("約 " + data["workDay"] + " 天");
							$(".work-content .content").eq(3).find("div").html(data["workCnt"] + "/人");
							$(".work-content .content").eq(4).find("div").html(data["fullAddress"]);
							$(".work-content .content").eq(5).find("div").html(data["memo"]);
							
							if (result.isWorkAuth) {
								var signList = result.signList;
								if (signList.length > 0) {
									var signInfo = "";
									for (var i = 0 ; i < signList.length ; i++) {
										if (signInfo != "") signInfo += "-----------------------------<br>";
										signInfo += "姓名： " + signList[i]["name"] + "<br/>";
										signInfo += "電話： " + signList[i]["phone"] + "<br/>";
									}
									$(".form_workSign").html(signInfo);
								} else {
									$(".form_workSign").html("<span>尚無報名資料</span>");
								}
							} else {
								if (result.isSign) {
									$(".form_workSign").html(
										'<div class="action"><input type="button" text="取消報名"  value="取消報名" class="aj_workSignCancel" /></div>');
								} else {
									if (result.signInfo != null) {
										$("input[name='farmer-name']").val(result.signInfo["name"]);
										$("input[name='farmer-phone']").val(result.signInfo["phone"]);
									}
								}
							}
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				$(".aj_workSignCancel").on("click", function() {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type : "POST",
						dataType : "json", 
						data: {
							act: 'work_signCancel',
							workId: workId
						},
						success : function(result) {  
							alert(result.msg);
							if (result.isSuc) location.reload();
						},
						error : function(jqXHR, textProject, errorThrown) {
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$("#footerFrame .system-msg").addClass("error").text(errorString).show();
						}
					});
				});
				
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
							if (result.isSuc) location.reload();
						},
						error : function(jqXHR, textProject, errorThrown) {
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
