require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				
				var workSearchType = "default";
				var workLat = 0;
				var workLon = 0;
				
				page = 1;
				$.aj_listCity();
				getStoreTypeList();
				getListData();
				$(".pageProcess").on("click", function() {
					if (workSearchType == "default") pageProcess(this);
					else workPageProcess(this);
				});
				$(".aj_storeSearch").on("click", function() {
					page = 1;
					getListData();
				});
				
				$(".aj_nowLocationSearchStore").on("click", function() {
					$.getMapLocation();
				});
				
				function workPageProcess(obj) {
					var pageCount = parseInt($(".totalpage.pageProcess").text());
					var pageClass = $(obj).attr("class");
					if (pageClass.indexOf("top") > -1) page = 1;
					if (pageClass.indexOf("last") > -1) page = pageCount;
					if (pageClass.indexOf("prev") > -1) {
						page = page - 1;
						if (page < 1) page = 1;
					}
					if (pageClass.indexOf("next") > -1) {
						page = page + 1;
						if (page > pageCount) page = pageCount;
					}
					if (pageClass.indexOf("pagelist") > -1) {
						page = parseInt($(obj).text());
					}
					mapServiceProvider(workLat, workLon);
				}

				// 取得經緯度
				function mapServiceProvider(latitude, longitude) {
					//alert("經緯度：" + latitude + ", " + longitude);
					workLat = latitude;
					workLon = longitude;
					workSearchType = "distance";
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getDistanceList',
							page: page,
							pageNumber: 10,
							lat: latitude,
							lon: longitude
						},
						dataType : "json", 
						success : function(result) { 
							if (result.list.length > 0) {
								//viewJSON(result);
								var idx = 0;
								$(".cols-body a").each(function() {
									if (idx > 0) $(this).remove();
									idx++;
								});
								
								$(".view_storeCnt").html(result.listCnt);
								var news = $(".cols-body").html();
								for (idx = 0 ; idx < result.list.length ; idx++) {
									$(".cols-body").append(news);
									$(".cols-body a").last().attr("href","store_detail.html?storeId="+result.list[idx]["storeId"]);
									$(".cols-body a").last().find(".items").eq(0).text(result.list[idx]["storeName"]);
									$(".cols-body a").last().find(".items").eq(1).text(result.list[idx]["fullAddress"]);
									$(".cols-body a").last().find(".items").eq(2).text(result.list[idx]["farmerCnt"]);
									$(".cols-body a").last().find(".items").eq(3).text(result.list[idx]["distDesc"]);
									$(".cols-body a").last().show();
								}
								
								$.showPageer(10, result.listCnt);
							}else{
								//無資料顯示回應
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

				function getListData() {
					workSearchType = "default";
					
					var storeType = "";
					$(".bind_keyStoreType:checked").each(function() {
						if (storeType != "") storeType += ",";
						storeType += $(this).val();
					});
					
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getListData',
							page: page,
							pageNumber: 10,
							keyword: $(".view_storeKey").val(),
							city: $(".view_citySelectList").val(),
							town: $(".view_townSelectList").val(),
							storeType: storeType
						},
						dataType : "json", 
						success : function(result) {  
							//資料顯示判斷
							if (result.list.length > 0) {
								//viewJSON(result);
								var idx = 0;
								$(".cols-body a").each(function() {
									if (idx > 0) $(this).remove();
									idx++;
								});
								
								$(".view_storeCnt").html(result.listCnt);
								var news = $(".cols-body").html();
								
								for (idx = 0 ; idx < result.list.length ; idx++) {
									
									$(".cols-body").append(news);
									$(".cols-body a").last().attr("href","store_detail.html?storeId="+result.list[idx]["storeId"]);
									$(".cols-body a").last().find(".items").eq(0).text(result.list[idx]["storeName"]);
									$(".cols-body a").last().find(".items").eq(1).text(result.list[idx]["fullAddress"]);
									$(".cols-body a").last().find(".items").eq(2).text(result.list[idx]["farmerCnt"]);
									$(".cols-body a").last().find(".items").eq(3).text("---");
									$(".cols-body a").last().show();
								}
								
								$.showPageer(10, result.listCnt);
							}else{
								//無資料顯示回應
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
				
				function getStoreTypeList() {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getStoreTypeItemChosen',
							storeId : ''
						},
						dataType : "json", 
						success : function(result) {  
							var items = result.storeTypeItem;
							for (var i = 0 ; i < items.length ; i++) {
								$(".bind_storeTypeChkDiv").append("<input " +
									"class='bind_keyStoreType' " +
									"type='checkbox' " +
									"value='" + items[i]["typeId"] + "'>" + items[i]["typeName"] + "</input>");
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
