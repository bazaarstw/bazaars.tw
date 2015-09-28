require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				selCity = $.getUrlParam("city");
				selTown = $.getUrlParam("town");
				var keyword = decodeURI(decodeURI($.getUrlParam("keyword")));
				$(".view_foodKey").val(keyword);
				$.setSelCity(selCity);
				$.setSelTown(selTown);
				
				page = 1;
				$.aj_listCity();
				$.aj_listTown();
				getListData();
				$(".pageProcess").on("click", function() {
					pageProcess(this);
				});
				$(".aj_foodSearch").on("click", function() {
					var city = $(".view_citySelectList").val();
					var town = $(".view_townSelectList").val();
					var keyword = $(".view_foodKey").val();
					var url = encodeURI('farmer_search.html?city=' + city + "&town=" + town + "&keyword=" + keyword);		
					location.href = encodeURI(url);
				});
				
				function getListData() {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'farmer_getListData',
							page: page,
							pageNumber: 10,
							keyword: keyword,
							city: selCity,
							town: selTown
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
