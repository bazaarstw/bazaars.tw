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
							$(".bind_content").text(info["content"].replace(/&nbsp;/g, ' ').replace(/<br.*?>/g, ''));
							$(".view_citySelectList").val(info["city"]);
							aj_listTown(info["town"]);
							$(".bind_address").attr("value", info["address"]);
							
							var bool_phone = 0;
							var bool_email = 0;
							var bool_link = 0;
							var desc = result.desc;
							for (var idx = 0 ; idx < desc.length ; idx++) {
								var descKey = desc[idx]["descKey"];
								if (descKey == "phone") {
									if ($('.phone-field').size() == 1 && bool_phone == 0) {
										bool_phone = 1;
										$('#phone-field1').attr('value', desc[idx]["descValue"]);
									} else {
										addInputField('phone', '', '', desc[idx]["descValue"]);
									}
								}
								if (descKey == "email") {
									if ($('.email-field').size() == 1 && bool_email == 0) {
										bool_email = 1;
										$('#email-field1').attr('value', desc[idx]["descValue"]);
									} else {
										addInputField('email', '', '', desc[idx]["descValue"]);
									}
								}
								if (descKey == "link") {
									console.log($('.link-field').size());
									if ($('.link-field').size() == 1 && bool_link == 0) {
										bool_link = 1;
										$('#link-field1').attr('value', desc[idx]["descValue"]);
										$('#linkDesc-field1').attr('value', desc[idx]["descContent"]);
									} else {
										var settingVal = [];
										settingVal.push(desc[idx]["descValue"]);
										settingVal.push(desc[idx]["descContent"]);
										addInputField('link', '', '', settingVal);
									}
								}
							}
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}
				
				// Writting By Richard (20150907)
				function addInputField(FieldName, settingPlaceholder, settingTabindex, settingVal) {
					switch (FieldName) {
						case 'phone':
							if (settingPlaceholder == '') settingPlaceholder = '請輸入手機號碼...';
							if (settingTabindex == '') settingTabindex = 2;
							break;
						case 'email':
							if (settingPlaceholder == '') settingPlaceholder = 'email@example.com';
							if (settingTabindex == '') settingTabindex = 3;
							break;
						case 'link':
							if (settingPlaceholder == '') {
								settingPlaceholder = [];
								settingPlaceholder[0] = 'http://www.facebook.com/example';
								settingPlaceholder[1] = '請填寫網頁說明...';
							}
							if (settingTabindex == '') {
								settingTabindex = [];
								settingTabindex[0] = 4;
								settingTabindex[1] = 4;
							}
							if (settingVal == '') {
								settingVal = [];
								settingVal[0] = '';
								settingVal[1] = '';
							}
							break;
					}
					
					next = parseInt($("#" + FieldName + "-field-count").text());
					var addto = "#" + FieldName + "-field" + next;
					var addRemove = "#" + FieldName + "-field" + (next);
					next += 1;
					$("#" + FieldName + "-field-count").text(next);
					var newIn = '';
					newIn = '<div id="field" class="' + FieldName + '-field">';
					if (FieldName == 'link') {
						newIn += '<div class="col-lg-6"><input autocomplete="off" class="form-control input bind_' + FieldName + '" id="' + FieldName + '-field' + next + '" name="' + FieldName + '[]" type="text" placeholder="' + settingPlaceholder[0] + '" tabindex="' + settingTabindex[0] + '"  value="' + settingVal[0] + '" /></div>';
						newIn += '<div class="col-lg-5"><input autocomplete="off" class="form-control input bind_' + FieldName + 'Desc" id="' + FieldName + 'Desc-field' + next + '" name="' + FieldName + 'Desc[]" type="text" placeholder="' + settingPlaceholder[1] + '" tabindex="' + settingTabindex[1] + '"  value="' + settingVal[1] + '" /></div>';
					} else {
						newIn += '<div class="col-lg-11"><input autocomplete="off" class="form-control input bind_' + FieldName + '" id="' + FieldName + '-field' + next + '" name="' + FieldName + '[]" type="text" placeholder="' + settingPlaceholder + '" tabindex="' + settingTabindex + '"  value="' + settingVal + '" /></div>';
					}
					
					newIn += '<div class="col-lg-1"><button id="' + FieldName + '-remove' + (next - 1) + '" class="btn btn-danger ' + FieldName + '-remove-me" >-</button></div>';
					newIn += '</div>';
					
					var newInput = $(newIn);
					$('.' + FieldName + '-field:last').after(newInput);
					$("#" + FieldName + "-field" + next).attr('data-source',$(addto).attr('data-source'));
					$("#count").val(next);
					
						$('.' + FieldName + '-remove-me').click(function(e){
							var fieldNum = this.id.substr(this.id.lastIndexOf("e")+1);
							// var fieldID = "#" + FieldName + "-field" + fieldNum;
							$(this).parent().parent().remove();
							// $(fieldID).parent().remove();
						});
				}
				
				$(".phone-add-more").click(function(e){
					addInputField('phone', '', '', '');
				});
				
				$(".email-add-more").click(function(e){
					addInputField('email', '', '', '');
				});
				
				$(".link-add-more").click(function(e){
					addInputField('link', '', '', '');
				});
				
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
								window.location.replace("store.html");
							}
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