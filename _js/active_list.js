require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				page = 1;
				$.aj_listCity();
				getListData();
				$(".pageProcess").on("click", function() {
					$.pageProcess(this);
				});
				$(".aj_newsSearch").on("click", function() {
					page = 1;
					getListData();
				});
				
				function getListData() {
					
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'news_getListData',
							page: page,
							pageNumber: 10,
							title: $(".view_newsKey").val(),
							city: $(".view_citySelectList").val(),
							town: $(".view_townSelectList").val()
						},
						dataType : "json", 
						success : function(result) { 
							//viewJSON(result);
							var idx = 0;
							$(".cols-body a").each(function() {
								if (idx > 0) $(this).remove();
								idx++;
							});
							
							$(".view_newsCnt").html(result.listCnt);
							
							if (result.list.length > 0) {
								var news = $(".cols-body").html();
								for (idx = 0 ; idx < result.list.length ; idx++) {
									$(".cols-body").append(news);
									$(".cols-body a").last().attr("href","active_detail.html?newsId="+result.list[idx]["newsId"]);
									$(".cols-body a").last().find(".items").eq(0).text(result.list[idx]["title"]);
									var fullAddr = result.list[idx]["fullAddress"];
									if (fullAddr == null) fullAddr = "";
									$(".cols-body a").last().find(".items").eq(1).text(fullAddr);
									$(".cols-body a").last().find(".items").eq(2).text(result.list[idx]["startDT"].substr(0,10)+" ~ "+result.list[idx]["endDT"].substr(0,10));
									$(".cols-body a").last().find(".items").eq(3).text(result.list[idx]["createDT"].substr(0,10));
									$(".cols-body a").last().show();
								}
								$.showPageer(10, result.listCnt);
								
								//$(".mPage .page-count").show();
								
							}else{
								$(".mPage .page-msg").text("sorry!! no data...").show();
							}
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
