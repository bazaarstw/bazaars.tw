require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn',
			'datetimepicker'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var newsId = "";
				$('.startDT_Picker').datetimepicker({
					format: 'YYYY-MM-DD HH:mm:ss'
				});
				$('.endDT_Picker').datetimepicker({
					format: 'YYYY-MM-DD HH:mm:ss'
				});
				aj_listCity();
				
				if (getUrlParam("newsId") != null) newsId = getUrlParam("newsId");
				if (newsId != "") {
					$(".bind_pageActDesc").text("編輯 Modify");
					$(".bind_act").attr("value", "news_prcUpd");
					initNewsData();
				} else $(".bind_pageActDesc").text("新增 Add");
				initBtn();
				
				function initNewsData() {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'news_getDetail',
							newsId: newsId
						},
						dataType : "json", 
						success : function(result) { 

							var info = result[0];
							$(".bind_title").attr("value", info["title"]);
							$(".bind_city").val(info["city"]);
							aj_listTown(info["town"]);
							$(".bind_address").attr("value", info["address"]);
							$(".bind_startDT").attr("value", info["startDT"]);
							$(".bind_endDT").attr("value", info["endDT"]);
							// $(".bind_content").text(info["content"].replace(/&nbsp;/g, ' ').replace(/<br.*?>/g, ''));
                            CKEDITOR.instances.content.setData(info["content"]);  // set textarea value
							
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				function initBtn() {
					$(document).on("click", ".aj_saveNews", function() {
						$(".bind_newsId").attr("value", newsId);
						
						var formObj = $(".form_saveNews");   
						//alert($(formObj).serialize());

                        // Fix: ckeditor jQuery ajax serialize() issue
                        for ( instance in CKEDITOR.instances ){
                            CKEDITOR.instances[instance].updateElement();
                        }

						$.ajax({
							async : false,
							url : "../ctrl/Controller.php",
							type : "POST",
							dataType : "json", 
							data : $(formObj).serialize(),
							success : function(result) {  
								alert(result.msg);
								if (result.isSuc) {
									newsId = result.newsId;
								}
								window.location.replace("news.html");
							},
							error : function(jqXHR, textProject, errorThrown) {
								alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
								alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
							}
						});
						return false;
					});
				}

				function aj_listCity() {
					$(".view_citySelectList option").remove();
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'area_getListCity'
						},
						dataType : "json", 
						success : function(result) {  
							$(".view_citySelectList").append('<option value="">請選擇</option>');
							for (idx = 0 ; idx < result.length ; idx++) {
								$(".view_citySelectList").append('<option value="'+result[idx]["cityId"]+'">'+result[idx]["cityName"]+'</option>');
							}
							if (newsId == "") aj_listTown('');
						},
						error : function(jqXHR, textProject, errorThrown) {
						}
					});
					
					$(".view_citySelectList").on("change", function() {
						aj_listTown('');
					});
				}
				
				function aj_listTown(townId) {
					$(".view_townSelectList option").remove();
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'area_getListTown',
							cityId: $(".view_citySelectList").val()
						},
						dataType : "json", 
						success : function(result) {  
							$(".view_townSelectList").append('<option value="">請選擇</option>');
							for (idx = 0 ; idx < result.length ; idx++) {
								var selected = '';
								if (townId == result[idx]["townId"]) selected = 'selected';
								$(".view_townSelectList").append('<option value="'+result[idx]["townId"]+'" '+selected+'>'+result[idx]["townName"]+'</option>');
							}
						},
						error : function(jqXHR, textProject, errorThrown) {
						}
					});
				}
				
				function getUrlParam(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
					var r = window.location.search.substr(1).match(reg);  //匹配目标参数
					if (r != null) return unescape(r[2]); return null; //返回参数值
				}
				
			});
		});
	});
});
