require(['_require_path'], function() {
	require([
			'domReady',
			'conn',
			'jquery_warning',
			'jquery_ui',
			'jquery_fullPage'
			
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				
				$("#demosMenu").change(function(){
				  window.location.href = $(this).find("option:selected").attr("id") + '.html';
				});
				
				$('#centerFrame').fullpage({
					anchors: ['firstPage', 'secondPage'],
					scrollBar: true,
					autoScrolling: true,
					fitToSection: false
				});
				
				
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
