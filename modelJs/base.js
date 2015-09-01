var page = 1;
var hostLocation = window.location.host +　"/";
var pageLocation = window.location.toString();

$(document).ready(function() {
	includeRequireJS(["_library/jqPaginator.js"]);
	
	if (pageLocation.indexOf("index.html") > -1) {
		includeRequireJS(["modelJs/index.js"]);
	}
	if (pageLocation.indexOf("login.html") > -1) {
		includeRequireJS(["modelJs/register.js"]);
	}
	if (pageLocation.indexOf("schedule.html") > -1) {
    	$('<link rel="stylesheet" href="plugin/Calendar/fullcalendar.css" />').appendTo('head');
    	$('<link rel="stylesheet" href="plugin/Calendar/fullcalendar.print.css" media="print" />').appendTo('head');
    	includeRequireJS([
    		"plugin/Calendar/lib/moment.min.js",
    		"plugin/Calendar/fullcalendar.min.js",
    		"modelJs/schedule.js"
    	]);
	}
	if (pageLocation.indexOf("active-list.html") > -1) {
    	includeRequireJS(["modelJs/news.js"]);
	}
	if (pageLocation.indexOf("active-detail.html") > -1) {
    	includeRequireJS(["modelJs/newsDetail.js"]);
	}
	if (pageLocation.indexOf("work-search.html") > -1) {
    	includeRequireJS(["modelJs/work.js"]);
	}
	if (pageLocation.indexOf("work-detail.html") > -1) {
    	includeRequireJS(["modelJs/workDetail.js"]);
	}
	if (pageLocation.indexOf("food.html") > -1) {
    	includeRequireJS(["modelJs/food.js"]);
	}
	if (pageLocation.indexOf("food-class.html") > -1) {
    	includeRequireJS(["modelJs/subFood.js"]);
	}
	if (pageLocation.indexOf("food-class-farmers.html") > -1) {
    	includeRequireJS(["modelJs/foodFarmers.js"]);
	}
	if (pageLocation.indexOf("farmer.html") > -1) {
    	includeRequireJS(["modelJs/farmer.js"]);
	}
	if (pageLocation.indexOf("store-search.html") > -1) {
    	includeRequireJS(["modelJs/store.js"]);
	}
	if (pageLocation.indexOf("store.html") > -1) {
    	includeRequireJS(["modelJs/storeDetail.js"]);
	}
	
	getLoginInfo();
	execLoging();
	execLogout();
	googleLogin();
	fbLogin();
});

function includeRequireJS(jsFileArray) {
	includeJS(jsFileArray, 0);
}

function includeJS(jsFileArray, jsFileIdx) {
	$.getScript(jsFileArray[jsFileIdx])
	  .done(function( script, textStatus ) {
	    if ((jsFileArray.length - 1) > jsFileIdx) includeJS(jsFileArray, jsFileIdx + 1);
	  })
	  .fail(function( jqxhr, settings, exception ) {
	    //alert(jsFileArray[jsFileIdx] + 'Failed to load script');
	});
}

function getLoginInfo() {
	
	$.ajax({
		async : false,
		url : "ctrl/Controller.php",
		type: 'POST',
        data: {
            act: 'login_getUserinfo'
        },
		dataType : "json", 
		success : function(result) {  
			if (result.isLogin) {
				$(".view_loging").show();
				$(".view_notLogin").hide();
				var username = result.info.username;
				if (username == '') username = "無名氏";
				$(".view_loginInfo").text(username + " 您好，歡迎來到「我的菜市埸」！");
				
				
				/**首頁專用**/
				$("#link-0").attr("href","logout.html").find("span").text("登出");
				
				
			} else {
				$(".view_loging").hide();
				$(".view_notLogin").show();
			}
		},
		error : function(jqXHR, textProject, errorThrown) {
			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
		}
	});
}

function execLoging() {
	$(".aj_login").on("click", function() {
		$(".form_login_act").attr("value", "login_webLogin");
		var formObj = $(".form_login");   
		//$(formObj).append("<input type='hidden' name='act' value='login_webLogin'/>");
		//alert($(formObj).serialize());
    	$.ajax({
    		async : false,
    		url : "ctrl/Controller.php",
    		type : "POST",
    		dataType : "json", 
    		data : $(formObj).serialize(),
    		success : function(result) {  
    			if (result.isLogin) {
                    alert("登入成功");
					location.href="food.html";
    			}else{
					alert("帳號或密碼錯誤");
    			}
    		},
    		error : function(jqXHR, textProject, errorThrown) {
    			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
    			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
    		}
    	});
	});
}

function execLogout() {
	$(".aj_logout").on("click", function() {
    	$.ajax({
    		async : false,
    		url: 'ctrl/Controller.php',
			type: 'POST',
	        data: {
	            act: 'login_Logout'
	        },
    		dataType : "json", 
    		success : function(result) {
				if (result.isLogout) {
                    $(".view_loging").hide();
					$(".view_notLogin").show();
    			}else{
    			}
    		},
    		error : function(jqXHR, textProject, errorThrown) {
    			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
    			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
    		}
    	});
	});
}

function googleLogin() {
	$(".aj_googleLogin").on("click", function() {
		$.ajax({
			async : false,
			url : "plugin/Google/util.php?act=getLoginUrl",
			dataType : "json", 
			success : function(result) {  
				location.href = result.url;
			},
			error : function(jqXHR, textProject, errorThrown) {
				alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
				alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
			}
		});
	});
}

function fbLogin() {
	$(".aj_fbLogin").on("click", function() {
		$.ajax({
			async : false,
			url : "plugin/Facebook/util.php?act=getLoginUrl",
			dataType : "json", 
			success : function(result) {  
				location.href = result.url;
			},
			error : function(jqXHR, textProject, errorThrown) {
				alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
				alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
			}
		});
	});
}



function add(formObj, fileName) {  
	var formObj = formObj;
	$(formObj).append("<input type='hidden' name='act' value='add'/>");
	//alert($(formObj).serialize());
	$.ajax({
		async : false,
		url : "adm/ctrl/" + fileName + ".php",
		type : "POST",
		dataType : "json",
		data : $(formObj).serialize(),
		success : function(result) { 
			var code = result.system.code; 
			var msg = result.system.msg; 
			if(code == "0"){  
				var msgs = "";
				for(var data in msg){ 
					var rdata = msg[data]; 
					var msgStr = "";
					if(Array.isArray(rdata)){
						for(var datas in rdata){
							msgStr += rdata[datas] + ",";
						}
						msgStr = msgStr.substring(0, msgStr.length-1);
					}else{
						msgStr += rdata;
					}  
					
					if($("#" + data).length>0){  
						msgs += $("#" + data).attr("alt") + msgStr + "\n"; 
					}else{  
						msgs += msgStr + "\n"; 
					}
				}
				alert(msgs);
			}else{
				alert(msg);
			}
		},
		error : function(jqXHR, textProject, errorThrown) {
			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
		}
	});  
} 

function aj_listCity() {
	$(".view_citySelectList option").remove();
	$(".view_citySelectList").append('<option value="">全部</option>');
	$.ajax({
		async : false,
		url : "ctrl/Controller.php",
		type: 'POST',
        data: {
            act: 'area_getListCity'
        },
		dataType : "json", 
		success : function(result) {  
			for (idx = 0 ; idx < result.length ; idx++) {
				$(".view_citySelectList").append('<option value="'+result[idx]["cityId"]+'">'+result[idx]["cityName"]+'</option>');
			}
		},
		error : function(jqXHR, textProject, errorThrown) {
			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
		}
	});
	
	$(".view_citySelectList").on("change", function() {
		aj_listTown();
		page = 1;
		getListData();
	});
	$(".view_townSelectList").on("change", function() {
		page = 1;
		getListData();
	});
}

function aj_listTown() {
	$(".view_townSelectList option").remove();
	$(".view_townSelectList").append('<option value="">全部</option>');
	$.ajax({
		async : false,
		url : "ctrl/Controller.php",
		type: 'POST',
        data: {
            act: 'area_getListTown',
            cityId: $(".view_citySelectList").val()
        },
		dataType : "json", 
		success : function(result) {  
			for (idx = 0 ; idx < result.length ; idx++) {
				$(".view_townSelectList").append('<option value="'+result[idx]["townId"]+'">'+result[idx]["townName"]+'</option>');
			}
		},
		error : function(jqXHR, textProject, errorThrown) {
			alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
			alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
		}
	});
}

function viewJSON(data) {
	alert(JSON.stringify(data));
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function getMapLocation() {
	// 瀏覽器支援 HTML5 定位方法
	if (navigator.geolocation) {
	    // HTML5 定位抓取
	    navigator.geolocation.getCurrentPosition(function(position) {
	        mapServiceProvider(position.coords.latitude, position.coords.longitude);
	    },
	    function(error) {
	        switch (error.code) {
	            case error.TIMEOUT:
	                alert('連線逾時');
	                break;
	 
	            case error.POSITION_UNAVAILABLE:
	                alert('無法取得定位');
	                break;
	 
	            case error.PERMISSION_DENIED://拒絕
	                alert('定位失敗，\n使用此功能前請記得允許手機的GPS定位功能喔!');
	                break;
	 
	            case error.UNKNOWN_ERROR:
	                alert('不明的錯誤，請稍候再試');
	                break;
	        }
	    });
	 
	} else { // 不支援 HTML5 定位
	    // 若支援 Google Gears
	    if (window.google && google.gears) {
	        try {
	              // 嘗試以 Gears 取得定位
	              var geo = google.gears.factory.create('beta.geolocation');
	              geo.getCurrentPosition(successCallback, errorCallback, {enableHighAccuracy: true, gearsRequestAddress: true});
	        } catch(e){
	              alert("定位失敗請稍候再試");
	        }
	    }else{
	        alert("定位失敗，\n使用此功能前請記得允許手機的GPS定位功能喔!");
	    }
	}
}
 
 
// 取得 Gears 定位發生錯誤
function errorCallback(err) {
    var msg = 'Error retrieving your location: ' + err.message;
    alert(msg);
}
 
// 成功取得 Gears 定位
function successCallback(p) {
      mapServiceProvider(p.latitude, p.longitude);
}

function pageProcess(obj) {
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
	getListData();
}

function showPageer(pageNumber, dataCnt) {
	var idx = 0;
	$(".pagelist.pageProcess").each(function() {
		if (idx > 0) $(this).remove();
		idx++;
	});
	
	var pagelen = pageNumber;
	var pageCount = dataCnt / pageNumber;
	if (dataCnt % pageNumber > 0) pageCount++;
	
	var startPage = page - 4;
	if(startPage < 0) startPage = 0;
	var endpage = pagelen + startPage;
	if(endpage > pageCount) endpage = pageCount;
	
	startPage = endpage - pagelen;
	if(startPage < 0) startPage = 0;
		
	for (var i = startPage ; i < endpage ; i++){
		if(i == page) {
			$(".pagelist.pageProcess").last().after('<span class="pagelist pageProcess">'+parseInt(i)+'</span>').show();
		} else if (i > 0){
			$(".pagelist.pageProcess").last().after('<span class="pagelist pageProcess">'+parseInt(i)+'</span>').show();
		}
	}
	$(".pagelist.pageProcess").eq(0).hide();
	$(".nowpage.pageProcess").text(parseInt(page));
	$(".totalpage.pageProcess").text(parseInt(pageCount));
}