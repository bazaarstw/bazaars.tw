require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				page = 1;
				getListData();
				$(".pageProcess").on("click", function() {
					$.pageProcess(this);
				});
				
				$(document).on("click", ".aj_addFarmer", function() {
					location.href = "admFarmerDetail.html";
				});
				
				function getListData() {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'farmer_getListData',
							page: page,
							pageNumber: 10
						},
						dataType : "json", 
						success : function(result) {  
							//viewJSON(result);
							var idx = 0;
							$(".cols-body a").each(function() {
								if (idx > 0) $(this).remove();
								idx++;
							});

							var farmer = $(".cols-body").html();
							for (idx = 0 ; idx < result.list.length ; idx++) {
								$(".cols-body").append(farmer);
								$(".cols-body a").last().attr("href","admFarmerDetail.html?farmerId="+result.list[idx]["farmerId"]);
								$(".cols-body a").last().find(".items").eq(0).text(result.list[idx]["name"]);
								$(".cols-body a").last().find(".items").eq(1).text(result.list[idx]["content"]);
								$(".cols-body a").last().find(".items").eq(2).text(result.list[idx]["fbRss"]);
								$(".cols-body a").last().show();
							}
							$(".cols-body a").first().hide();
							
							$.showPageer(10, result.listCnt);
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
			});
		});
	});
});
