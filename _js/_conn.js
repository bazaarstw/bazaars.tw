$(document).ready(function(){
	$.extend({
		model_link_dept:function (){
			filemanager = [];
			filemanager.push({cid:11});
			
			// RWS的一般寫法
			$.fn.RWS_init({
			
				lang: "zh_tw",
				func: "filemanager",
				method: "SelectLinksMaster",
				data: filemanager,
				success: function(JDATA, JINFO, JOPTS) {
					console.log(JDATA);
					console.log(JINFO);
					console.log(JOPTS);
					mTargetName=$("#dept_link");
					_items=mTargetName.find(".link_img a").clone().removeClass("example");
					mTargetName.find(".example").hide();
					
					if(JINFO[0].result==true){
						//圖片連結
						if(JDATA.masterpic!=null){
							$.each(JDATA.masterpic, function(i,item){
							_items.addClass("data");
							_items.attr({
								"title":item.FM_description.toString(),
								"href":item.FM_Filepath.toString()
							});
							_items.find("img").attr("src","_files/_links/"+item.Files_Name.toString());
							mTargetName.find(".link_img").append(_items.clone());
						});
						}
						
						//文字連結
						if(JDATA.masterurl!=null){
							$.each(JDATA.masterurl, function(i,item){
								_items.addClass("data");
								_items.attr({
									"title":item.FM_description.toString(),
									"href":item.FM_Filepath.toString()
								});
								_items.html(item.FM_description.toString());
								mTargetName.find(".link_word").append(_items.clone());
							});
						}
						
						mTargetName.fadeIn(200);
					}else{
						mTargetName.find(".errorBlock").show();
					}
				},
				error: function(status, results) {
					console.log(results);
				}
			});
		}
	});
});