require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var parentId = 0;
				
				page = 1;
				parentId = $.getUrlParam("parentId");
				getListData();
				$(".pageProcess").on("click", function() {
					$.pageProcess(this);
				});
				
				function getListData() {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'food_getClassList',
							page: page,
							pageNumber: 10,
							parentId: parentId
						},
						dataType : "json",
						success : function(result) { 
							//viewJSON(result);
							$(".view_parentFoodClassName").html("location: " + result.info[0]["classPath"]);
							$(".mPage .page-msg").text("sorry!! no data...").hide();
							var idx = 0;
							$("#foods-subtype-list li").each(function() {
								if (idx > 0) $(this).remove();
								idx++;
							});
								
							//資料顯示判斷
							if (result.list.length > 0) {
								var food = $("#foods-subtype-list").html();
								for (idx = 0 ; idx < result.list.length ; idx++) {
									$("#foods-subtype-list").append(food);
									if (result.list[idx]["subClassCnt"] > 0)
										$("#foods-subtype-list li").last().find("a").attr("href","food_class.html?parentId="+result.list[idx]["foodClassId"]);
									else 
										$("#foods-subtype-list li").last().find("a").attr("href","food_class_farmers.html?classId="+result.list[idx]["foodClassId"]);
									$("#foods-subtype-list li").last().find(".cover img").attr("src", result.list[idx]["classImg"]);
									$("#foods-subtype-list li").last().find(".title").html(result.list[idx]["className"]);
									$("#foods-subtype-list li").last().fadeIn(300);
								}
								$.showPageer(10, result.listCnt);
								
							} else {
								//無資料顯示回應
								$(".mPage .page-msg").text("sorry!! no data...").show();
							}
							
						},
						error : function(jqXHR, textProject, errorThrown) {
							//錯誤回應字串
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$("#footerFrame .system-msg").addClass("error").text(errorString).show();
						},
						complete: function(){
							//$(".mPage .page-msg").text("Complete!");
						}
						
					});
				}
				
			});
		});
	});
});
