require(['_require_path'], function() {
	require([
			'domReady',
			'conn',
			'jquery_warning',
			'jquery_ui'
			
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				
				$("#demosMenu").change(function(){
				  window.location.href = $(this).find("option:selected").attr("id") + '.html';
				});
			});
		});
	});
});
