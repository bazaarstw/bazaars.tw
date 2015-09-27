require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			page = 1;
			$.aj_listCity;
			getListData();
			$(".pageProcess").on("click", function() {
				pageProcess(this);
			});
			$(".aj_foodSearch").on("click", function() {
				page = 1;
				getListData();
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
						parentId: 0,
						title: $(".view_foodKey").val(),
						city: $(".view_citySelectList").val(),
						town: $(".view_townSelectList").val()
					},
					dataType : "json", 
					success : function(result) {  
						var idx = 0;
						$("#foods-type-list li").each(function() {
							if (idx > 0) $(this).remove();
							idx++;
						});
						
						//資料顯示判斷
						if (result.list.length > 0) {
							//viewJSON(result);
							var idx = 0;
							$("#foods-type-list li").each(function() {
								if (idx > 0) $(this).remove();
								idx++;
							});
							
							var food = $("#foods-type-list").html();
							for (idx = 0 ; idx < result.list.length ; idx++) {
								$("#foods-type-list").append(food);
								$("#foods-type-list li").last().find("a").attr("href","food_class.html?parentId="+result.list[idx]["foodClassId"]);
								$("#foods-type-list li").last().find(".cover img").attr("src", result.list[idx]["classImg"]);
								$("#foods-type-list li").last().find(".title").html(result.list[idx]["className"]);
								$("#foods-type-list li").last().fadeIn(300);
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