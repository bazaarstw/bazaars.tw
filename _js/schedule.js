require(['_require_path'], function() {
	require([
			'domReady',
			'conn',
			'fullcalendar'
			], function(domReady) {
		domReady(function () {
			$(document).ready(function(){
				$('<link rel="stylesheet" href="plugin/Calendar/fullcalendar.min.css" />').appendTo('head');
				$('<link rel="stylesheet" href="plugin/Calendar/fullcalendar.print.css" media="print" />').appendTo('head');
				
				$('.aj_workCalendar').fullCalendar({
					header: {
						left: '',
						center: 'title',
						right: 'prev,next today'
					},
					firstDay: 1,
					editable: false,
					eventLimit: true, // allow "more" link when too many events
					events: {
						url: 'ctrl/Controller.php',
						type: 'POST',
						data: {
							act: 'schedule_getListData'
						},
						error: function(jqXHR, textProject, errorThrown) {
							//¿ù»~¦^À³¦r¦ê
							var errorString= 'HTTP project code: ' + jqXHR.project + '\n' + 'textProject: ' + textProject + '\n' + 'errorThrown: ' + errorThrown;
								errorString += 'HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText;
								
							$("#footerFrame .system-msg").addClass("error").text(errorString).show();
						},
						textColor: 'white'
					},
					eventClick: function(calEvent, jsEvent, view) {
						if (calEvent.type == 'news') {
							location.href = "active_detail.html?newsId=" + calEvent.id;
						} else {
							location.href = "work_detail.html?workId=" + calEvent.id;
						}
					},
					eventMouseover: function(calEvent, jsEvent) {
						var tooltip = '<div class="tooltipevent" style="width:100px;height:100px;background:#ccc;position:absolute;z-index:10001;">' + calEvent.title + '</div>';
						$("body").append(tooltip);
						$(this).mouseover(function(e) {
							$(this).css('z-index', 10000);
							$('.tooltipevent').fadeIn('500');
							$('.tooltipevent').fadeTo('10', 1.9);
						}).mousemove(function(e) {
							$('.tooltipevent').css('top', e.pageY + 10);
							$('.tooltipevent').css('left', e.pageX + 20);
						});
					},
					eventMouseout: function(calEvent, jsEvent) {
						$(this).css('z-index', 8);
						$('.tooltipevent').remove();
					}
				});
				
			});
		});
	});
});
