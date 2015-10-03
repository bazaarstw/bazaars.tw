require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn',
			'datetimepicker'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var workId = "";
				$('.startDT_Picker').datetimepicker({
					format: 'YYYY-MM-DD HH:mm:ss'
				});
				$('.endDT_Picker').datetimepicker({
					format: 'YYYY-MM-DD HH:mm:ss'
				});
				aj_listCity();
				
				if (getUrlParam("workId") != null) workId = getUrlParam("workId");
				if (workId != "") {
					$(".bind_pageActDesc").text("編輯 Modify");
					$(".bind_act").attr("value", "work_prcUpd");
					initWorkData();
				} else $(".bind_pageActDesc").text("新增 Add");
				initBtn();
				
				function initWorkData() {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'work_getAdmDetail',
							workId: workId
						},
						dataType : "json", 
						success : function(result) {  
							var info = result.info[0];
							$(".bind_title").attr("value", info["title"]);
							$(".bind_city").val(info["city"]);
							aj_listTown(info["town"]);
							$(".bind_address").attr("value", info["address"]);
							$(".bind_salary").attr("value", info["salary"]);
							$(".bind_startDT").attr("value", info["startDT"]);
							$(".bind_endDT").attr("value", info["endDT"]);
							$(".bind_workCnt").attr("value", info["workCnt"]);
							$(".bind_memo").attr("value", info["memo"]);
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				function initBtn() {
					$(document).on("click", ".aj_saveWork", function() {
						$(".bind_workId").attr("value", workId);
						
						var formObj = $(".form_saveWork");   
						//alert($(formObj).serialize());
						$.ajax({
							async : false,
							url : "../ctrl/Controller.php",
							type : "POST",
							dataType : "json", 
							data : $(formObj).serialize(),
							success : function(result) {  
								alert(result.msg);
								if (result.isSuc) {
									workId = result.workId;
								}
								window.location.replace("work.html");
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
							for (idx = 0 ; idx < result.length ; idx++) {
								$(".view_citySelectList").append('<option value="'+result[idx]["cityId"]+'">'+result[idx]["cityName"]+'</option>');
							}
							if (workId == "") aj_listTown('');
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
