require(['_require_path'], function() {
	require([
			'domReady',
			'conn'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				var storeId = $.getUrlParam("storeId");
				if (storeId != null) {
					$.ajax({
						async : false,
						url : "ctrl/Controller.php",
						type: 'POST',
						data: {
							act: 'store_getDetail',
							storeId: storeId
						},
						dataType : "json", 
						success : function(result) {  
							
							//viewJSON(result);
							//���a���
							var info = result.info[0];
							$("#store-personal .cover img").attr("src", info["storeImg"]);
							$("#store-personal .name").html(info["storeName"]);
							$("#store-personal .atricle").html(info["contact"]);
							$("#store-personal .addrs").html(info["fullAddress"]);
							
							$.each(result['desc'], function( index, value ) {
                                switch(value[2]) {
                                    case 'phone':
                                        $(".phone ul").append("<li>" + value[3] + "</li>");
                                        break;
                                    case 'email':
                                        $(".email ul").append("<li>" + value[3] + "</li>");
                                        break;
                                }
                                console.log( index + ": " + value[2] );
                            });
                            
							//�X�@�A��
							var farmer = result.farmer;
							console.log(result.farmer);
							var farmerHtml = $(".link-farmers").html();
							for (var idx = 0 ; idx < farmer.length ; idx++) {
								$(".link-farmers").append(farmerHtml);
								
								$(".link-farmers li").last().find("a").attr("href", "farmer.html?farmerId="+farmer[idx].farmerId);
								$(".link-farmers li").last().find(".farmer-name").html(farmer[idx].name);
								$(".link-farmers li").last().find("img").attr({
									"title" : farmer[idx].name,
									"src" : farmer[idx].farmerImg
								});
							}
							$(".link-farmers li").first().hide();
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
