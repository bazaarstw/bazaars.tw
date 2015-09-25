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
				$(".aj_workSearch").on("click", function() {
					page = 1;
					getListData();
				});
				function getListData() {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'work_getListData',
							page: page,
							pageNumber: 10,
							title: $(".view_workKey").val(),
							city: $(".view_citySelectList").val(),
							town: $(".view_townSelectList").val()
						},
						dataType : "json", 
						success : function(result) {
							var idx = 0;
								$(".cols-body a").each(function() {
									if (idx > 0) $(this).remove();
									idx++;
								});
							
							//�����ܧP�_
							if (result.list.length > 0) {
								//viewJSON(result);
								$(".mPage .page-msg").text("sorry!! no data...").hide();
								$(".view_workCnt").html(result.listCnt);
								var news = $(".cols-body").html();
								for (idx = 0 ; idx < result.list.length ; idx++) {
									$(".cols-body").append(news);
									$(".cols-body a").last().attr("href","work_detail.html?workId="+result.list[idx]["workId"]);
									$(".cols-body a").last().find(".items").eq(0).text(result.list[idx]["title"]);
									$(".cols-body a").last().find(".items").eq(1).text(result.list[idx]["fullAddress"]);
									$(".cols-body a").last().find(".items").eq(2).text(result.list[idx]["workCnt"]);
									$(".cols-body a").last().find(".items").eq(3).text(result.list[idx]["salary"]);
									$(".cols-body a").last().find(".items").eq(4).text("約"+result.list[idx]["workDay"]+"天");
									$(".cols-body a").last().find(".items").eq(5).text(result.list[idx]["startDT"]+" ~ "+result.list[idx]["endDT"]);
									$(".cols-body a").last().show();
								}
								$.showPageer(10, result.listCnt);
							}else{
								//�L�����ܦ^��
								$(".mPage .page-msg").text("sorry!! no data...").show();
							}
							
						},
						error : function(jqXHR, textProject, errorThrown) {
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$(".mPage .page-msg").addClass("error").text(errorString).show();
						}
					});
				}
				
			});
		});
	});
});
