require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var classId = 0;
				
				page = 1;
				classId = $.getUrlParam("classId");
				$.aj_listCity();
				aj_listItem();
				getListData();
				$(".pageProcess").on("click", function() {
					pageProcess(this);
				});
				$(".aj_itemSearch").on("click", function() {
					page = 1;
					getListData();
				});
				
				function aj_listItem() {
					$(".view_itemSelectList option").remove();
					$(".view_itemSelectList").append('<option value="">全部</option>');
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'food_getListItem',
							classId: classId
						},
						dataType : "json", 
						success : function(result) {  
							for (idx = 0 ; idx < result.length ; idx++) {
								$(".view_itemSelectList").append('<option value="'+result[idx]["foodItemId"]+'">'+result[idx]["itemName"]+'</option>');
							}
						},
						error : function(jqXHR, textProject, errorThrown) {
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$("#footerFrame .system-msg").addClass("error").text(errorString).show();
						}
					});
					
					$(".view_itemSelectList").on("change", function() {
						//getListData(1);
					});
				}
				
				function getListData() {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'food_getFarmerList',
							page: page,
							pageNumber: 10,
							classId: classId,
							itemId: $(".view_itemSelectList").val(),
							city: $(".view_citySelectList").val(),
							town: $(".view_townSelectList").val()
							// keyword: $(".view_itemKey").val()
						},
						dataType : "json", 
						success : function(result) {  
							//清除前次搜尋資料
							$(".mPage .page-msg").text("sorry!! no data...").hide();
							var idx = 0;
							$("#farmers-list li").each(function() {
								if (idx > 0) $(this).remove();
								idx++;
							});
							
							//資料顯示判斷
							if (result.list.length > 0) {
								if (result.list.length > 0) {
									$(".view_parentFoodClassName").html("location: " + result.list[0]["parentClassPath"]);
								} else {
									$(".view_parentFoodClassName").html("");
								}
								
								var farmer = $("#farmers-list").html();
								for (idx = 0 ; idx < result.list.length ; idx++) {
									$("#farmers-list").append(farmer);
									$("#farmers-list li").last().find("a").attr("href","farmer.html?farmerId="+result.list[idx]["farmerId"]);
									$("#farmers-list li").last().find(".name").html(result.list[idx]["name"]);
									$("#farmers-list li").last().find(".article").html(result.list[idx]["content"]);
									$("#farmers-list li").last().fadeIn(300);
								}
								$.showPageer(10, result.listCnt);
								
								
							}else{
								//無資料顯示回應
								$(".mPage .page-msg").text("sorry!! no data...").show();
							}
							
							
						},
						error : function(jqXHR, textProject, errorThrown) {
							//錯誤回應字串
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
