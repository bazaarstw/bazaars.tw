require(['jqPaginator'], function() {
	$(document).ready(function(){
		var page = 1;
		var hostLocation = getRootPath();
		var pageLocation = window.location.toString();
		var hasAuth = false;
		
		$.extend({
			initCheckAuth:function (){
				$.ajax({
					async : false,
					url : "../ctrl/Controller.php",
					type: 'POST',
					data: {
						act: 'login_getUserinfo'
					},
					dataType : "json", 
					success : function(result) {  
						//viewJSON(result);
						if (!result.isLogin) {
							alert("請先登入！");
							location.href="../login.html";
						} else {
							hasAuth = true;
						}
					},
					error : function(jqXHR, textProject, errorThrown) {
						// alert('HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown);
						// alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
					}
				});
			},
			getUrlParam:function (name){
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
				var r = window.location.search.substr(1).match(reg);  //匹配目标参数
				if (r != null) return unescape(r[2]); return null; //返回参数值
			},
			pageProcess:function (obj){
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
			},
			showPageer:function (pageNumber, dataCnt){
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
		});
		
		$.initCheckAuth();
		
		/*
		if (hasAuth) {
			includeRequireJS(["_library/jqPaginator.js"]);
			
			if (pageLocation.indexOf("admFarmer.html") > -1) {
				includeRequireJS(["admModelJs/admFarmer.js"]);
			}
			if (pageLocation.indexOf("admFarmerDetail.html") > -1) {
				includeRequireJS(["admModelJs/admFarmerDetail.js"]);
			}
		}
		
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
		*/
		
	});
});