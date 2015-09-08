require(['_require_path'], function() {
	require([
			'domReady',
			'conn',
			'jquery_fullPage'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				
				$.ajax({
					async : true,
					url : "ctrl/Controller.php",
					type: 'POST',
					data: {
						act: 'news_getLimitData',
						limitCnt: 5
					},
					dataType : "json", 
					success : function(result) {  
						var newsMarquess = $(".view_limitNews marquee").html();
						for (var idx = 0 ; idx < result.length ; idx++) {
							$(".view_limitNews marquee").append(newsMarquess);
							$(".view_limitNews marquee a").last().attr("href","active-detail.html?newsId="+result[idx]["newsId"]);
							$(".view_limitNews marquee a").last().find("span").eq(0).text(result[idx]["title"]);
							$(".view_limitNews marquee a").last().find("span").eq(1).text(result[idx]["createDT"].substr(0, 10));
						}
						$(".view_limitNews marquee a").first().hide();
					},
					error : function(jqXHR, textProject, errorThrown) {
						var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
							errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
							
						$("#footerFrame .system-msg").addClass("error").text(errorString).show();
					}
				});
				
				$("#demosMenu").change(function(){
				  window.location.href = $(this).find("option:selected").attr("id") + '.html';
				});
				
				$('#centerFrame').fullpage({
					anchors: ['firstPage', 'secondPage'],
					scrollBar: true,
					autoScrolling: true,
					fitToSection: false
				});
				
				$('#mainFrame').fadeIn(300);
				
				/**首頁按鈕動畫**/
				$('#link-1').animate({
					opacity: 1,
					top: "-=30",
					height: "show"
				}, 500, function() {
					// Animation complete.
				});
				
				$('#link-2').animate({
					opacity: 1,
					top: "+=30",
					height: "show"
				}, 500, function() {
					// Animation complete.
				});
				
				$('#link-3').animate({
					opacity: 1,
					top: "-=30",
					height: "show"
				}, 500, function() {
					$('#link-4').animate({
						opacity: 1,
						bottom: "-=30",
						height: "show"
					}, 500, function() {
						// Animation complete.
					});
				});

				$('#link-4').on('mouseover',function(){
					$(this).animate({
						opacity: 0.8,
						bottom: "-=20",
						height: "show"
					}, 500, function() {
						// Animation complete.
					});
				});
				
				$('#link-4').on('mouseout',function(){
					$(this).animate({
						opacity: 1,
						bottom: "+=20",
						height: "show"
					}, 500, function() {
						// Animation complete.
					});
				});
				/**首頁按鈕動畫**/
			});
		});
	});
});
