require(['../../_js/_require_path'], function() {
	require([
			'domReady',
			'admconn',
			'chosen'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var farmerId = "";
				
				$(".bind_phone_base").hide();
				$(".bind_email_base").hide();
				$(".bind_link_base").hide();
				
				if (getUrlParam("farmerId") != null) farmerId = getUrlParam("farmerId");
				if (farmerId != "") {
					$(".bind_act").attr("value", "farmer_prcUpd");
					initFarmerData();
				} else {
					addPhone("");
					addEmail("");
					addLink("", "");
				}
				initFoodItemChosen(farmerId);
				initStoreItemChosen(farmerId, "");
				initBtn();
				
				function initFarmerData() {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'farmer_getDetail',
							farmerId: farmerId
						},
						dataType : "json", 
						success : function(result) {  
							var info = result.info[0];
							$(".bind_farmerName").attr("value", info["name"]);
							$(".bind_content").attr("value", info["content"]);
							$(".bind_fbRss").attr("value", info["fbRss"]);
							
							var desc = result.desc;
							for (var idx = 0 ; idx < desc.length ; idx++) {
								var descKey = desc[idx]["descKey"];
								if (descKey == "phone") addPhone(desc[idx]["descValue"]);
								if (descKey == "email") addEmail(desc[idx]["descValue"]);
								if (descKey == "link") {
									addLink(desc[idx]["descValue"], desc[idx]["descContent"]);
								}
							}
							
							if ($(".bind_phone").size() == 1) addPhone("");
							if ($(".bind_email").size() == 1) addEmail("");
							if ($(".bind_link").size() == 1) addLink("", "");
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}

				function addPhone(settingVal) {
					var phoneSize = $(".bind_phone").size() - 1;
					var template = $("<span>").append($(".bind_phone_base").html());
					$(template).find(".bind_phone").attr("name", "phone[]");
					$(template).find(".bind_phone").attr("value", settingVal);
					if (phoneSize == 0) $(template).find(".bind_phone_del").remove();
					else $(template).find(".bind_phone_add").remove();
					$(".bind_phoneList").append($(template));
				}

				function addEmail(settingVal) {
					var emailSize = $(".bind_email").size() - 1;
					var template = $("<span>").append($(".bind_email_base").html());
					$(template).find(".bind_email").attr("name", "email[]");
					$(template).find(".bind_email").attr("value", settingVal);
					if (emailSize == 0) $(template).find(".bind_email_del").remove();
					else $(template).find(".bind_email_add").remove();
					$(".bind_emailList").append($(template));
				}

				function addLink(settingVal, settingDesc) {
					var linkSize = $(".bind_link").size() - 1;
					var template = $("<span>").append($(".bind_link_base").html());
					$(template).find(".bind_link").attr("name", "link[]");
					$(template).find(".bind_link").attr("value", settingVal);
					$(template).find(".bind_linkDesc").attr("name", "linkDesc[]");
					$(template).find(".bind_linkDesc").attr("value", settingDesc);
					if (linkSize == 0) $(template).find(".bind_link_del").remove();
					else $(template).find(".bind_link_add").remove();
					$(".bind_linkList").append($(template));
				}

				function initBtn() {
					$(document).on("click", ".aj_saveFarmer", function() {
						$(".bind_foodItem").attr("value", $('.foodItem').val());
						$(".bind_storeItem").attr("value", $('.storeItem').val());
						$(".bind_farmerId").attr("value", farmerId);
						
						var formObj = $(".form_saveFarmer");   
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
									farmerId = result.farmerId;
								}
							},
							error : function(jqXHR, textProject, errorThrown) {
								alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
								alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
							}
						});
					});
					
					$(document).on("click", ".bind_phone_add", function() {
						addPhone("");
					});
					$(document).on("click", ".bind_phone_del", function() {
						$(this).parent().remove();
					});
					
					$(document).on("click", ".bind_email_add", function() {
						addEmail("");
					});
					$(document).on("click", ".bind_email_del", function() {
						$(this).parent().remove();
					});
					
					$(document).on("click", ".bind_link_add", function() {
						addLink("", "");
					});
					$(document).on("click", ".bind_link_del", function() {
						$(this).parent().remove();
					});
				}

				function initStoreItemChosen(keyFarmerId, keyStoreId) {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getItemChosen',
							farmerId: keyFarmerId,
							storeId: keyStoreId
						},
						dataType : "json", 
						success : function(result) {  
							var storeItem = result.storeItem;
							for (var idx = 0 ; idx < storeItem.length ; idx++) {
								var selected = "";
								if (storeItem[idx]["selected"] == "1") selected = "selected";
								var item = "<option " + selected + " value='" + storeItem[idx]["storeId"] + "'>" + storeItem[idx]["storeName"]　+ "</option>"
								$(".storeItem").append(item);
							}
							$(".storeItem").chosen();
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
						}
					});
				}

				function initFoodItemChosen(keyFarmerId) {
					$.ajax({
						async : true,
						url : "../ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'food_getItemChosen',
							farmerId: keyFarmerId
						},
						dataType : "json", 
						success : function(result) {  
							var foodClass = result.foodClass;
							for (var idx = 0 ; idx < foodClass.length ; idx++) {
								var itemGroup = $("<optgroup label='" + foodClass[idx]["classPath"] + "'>");
								var foodItem = foodClass[idx]["item"];
								for (var subIdx = 0 ; subIdx < foodItem.length ; subIdx++) {
									var selected = "";
									if (foodItem[subIdx]["selected"] == "1") selected = "selected";
									$(itemGroup).append("<option " + selected + " value='" + foodItem[subIdx]["foodItemId"] + "'>" + foodItem[subIdx]["itemName"]　+ "</option>")
								}
								$(".foodItem").append($(itemGroup));
							}
							$(".foodItem").chosen();
						},
						error : function(jqXHR, textProject, errorThrown) {
							alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
							alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
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
