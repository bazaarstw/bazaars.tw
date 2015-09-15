require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn',
			'chosen'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var storeId = "";
				aj_listCity();
				
				if (getUrlParam("storeId") != null) storeId = getUrlParam("storeId");
				if (storeId != "") {
					$(".bind_pageActDesc").text("編輯 Modify");
					$(".bind_act").attr("value", "store_prcUpd");
					initStoreData();
				} else $(".bind_pageActDesc").text("新增 Add");
				initFarmerItemChosen("", storeId);
				initStoreTypeItemChosen(storeId);
				initBtn();
				
				function initStoreData() {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getDetail',
							storeId: storeId
						},
						dataType : "json", 
						success : function(result) {  
							var info = result.info[0];
							$(".bind_storeName").attr("value", info["storeName"]);
							$(".bind_contact").attr("value", info["contact"]);
							$(".view_citySelectList").val(info["city"]);
							aj_listTown(info["town"]);
							$(".bind_address").attr("value", info["address"]);
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				function initBtn() {
					$(document).on("click", ".aj_saveStore", function() {
						$(".bind_farmerItem").attr("value", $('.farmerItem').val());
						$(".bind_storeTypeItem").attr("value", $('.storeTypeItem').val());
						$(".bind_storeId").attr("value", storeId);
						var addr = 
							$(".bind_city :selected").text() + 
							$(".bind_town :selected").text() + 
							$(".bind_address").val();
						codeAddress(addr);
					});
				}
				
				function processForm() {
					var formObj = $(".form_saveStore");   
					// alert($(formObj).serialize());
					$.ajax({
						async : false,
						url : "../ctrl/Controller.php",
						type : "POST",
						dataType : "json", 
						data : $(formObj).serialize(),
						success : function(result) {  
							alert(result.msg);
							if (result.isSuc) {
								storeId = result.storeId;
							}
							window.location.replace("store.html");
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
					return false;
				}

				function initFarmerItemChosen(keyFarmerId, keyStoreId) {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getItemChosen',
							farmerId: keyFarmerId,
							storeId: keyStoreId,
							chosenPage: 'store'
						},
						dataType : "json", 
						success : function(result) {  
							var storeItem = result.storeItem;
							for (var idx = 0 ; idx < storeItem.length ; idx++) {
								var selected = "";
								if (storeItem[idx]["selected"] == "1") selected = "selected";
								var item = "<option " + selected + " value='" + storeItem[idx]["farmerId"] + "'>" + storeItem[idx]["name"]　+ "</option>"
								$(".farmerItem").append(item);
							}
							$(".farmerItem").chosen();
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				function initStoreTypeItemChosen(keyStoreId) {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getStoreTypeItemChosen',
							storeId: keyStoreId
						},
						dataType : "json", 
						success : function(result) {
							var storeTypeItem = result.storeTypeItem;
							for (var idx = 0 ; idx < storeTypeItem.length ; idx++) {
								var selected = "";
								if (storeTypeItem[idx]["selected"] == "1") selected = "selected";
								var item = "<option " + selected + " value='" + storeTypeItem[idx]["typeId"] + "'>" + storeTypeItem[idx]["typeName"]　+ "</option>"
								$(".storeTypeItem").append(item);
							}
							$(".storeTypeItem").chosen();
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}

				function getUrlParam(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
					var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
					if (r != null) return unescape(r[2]); return null; // 返回参数值
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
							if (storeId == "") aj_listTown('');
						},
						error : function(jqXHR, textProject, errorThrown) {
							// alert('HTTP project code: ' + jqXHR.project +
							// '\n' + 'textProject: ' + textProject + '\n' +
							// 'errorThrown: ' + errorThrown);
							// alert('HTTP message body (jqXHR.responseText): '
							// + '\n' + jqXHR.responseText);
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
							// alert('HTTP project code: ' + jqXHR.project +
							// '\n' + 'textProject: ' + textProject + '\n' +
							// 'errorThrown: ' + errorThrown);
							// alert('HTTP message body (jqXHR.responseText): '
							// + '\n' + jqXHR.responseText);
						}
					});
				}
				
				function codeAddress(addr) {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode( { 'address': addr}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							$(".bind_lat").val(results[0].geometry.location.lat());
							$(".bind_lon").val(results[0].geometry.location.lng());
							processForm();
						} else {
							alert("輸入地址格式錯誤: " + status);
						}
					});
				}

			});
		});
	});
});