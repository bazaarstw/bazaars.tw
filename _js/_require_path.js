/**
* RWS Systems
* Modules: Simple
* Creation time: 2013/03/20
* Modification time: 2013/03/20
*
* @author Richard WU.
* @copyright 2013 Richard WU. taipeiwu@yahoo.com.tw
*
*/

function getRootPath(){
	var strFullPath = window.document.location.href;
	var strPath = window.document.location.pathname;
	var pos = strFullPath.indexOf(strPath);
	var prePath = strFullPath.substring(0, pos);
	var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
	if (postPath == '/member') postPath = '';
	var returnPath = prePath + postPath + '/'
	return(returnPath);
}

require.config({
	//enforceDefine: true,
	paths: {
		'conn': getRootPath() + '_js/_conn',
		'admconn': getRootPath() + 'member/_js/_conn',
		// domready 2.0.1 (2015/09/03)
		'domReady': getRootPath() + '_library/domready.min',
		// html5 shiv 3.7.3 (2015/09/03)
		'html5': getRootPath() + '_library/html5shiv.min',
		// json2 2015-05-03 (2015/09/03)
		'json2': getRootPath() + '_library/json2',
		// JQuery 1.11.3 (2015/09/03)
		'jquery': getRootPath() + '_library/jquery.min',
		// fullPage 2.6.9 (2015/09/03)
		'jquery_fullPage': getRootPath() + '_library/jquery.fullPage.min',
		// Warning (2015/09/03)
		'jquery_warning': getRootPath() + '_library/ie-emulation-modes-warning',
		// JQuery UI 1.11.4 (2015/09/03)
		'jquery_ui': getRootPath() + '_library/jquery-ui.min',
		// Slimscroll 1.3.6 (2015/09/03)
		'jquery_slimscroll': getRootPath() + '_library/jquery.slimscroll.min',
		// Bootstrap 3.3.5 (2015/09/03)
		'bootstrap': getRootPath() + '_library/bootstrap.min',
		// jqPaginator (2015/09/03)
		'jqPaginator': getRootPath() + '_library/jqPaginator',
		// fullcalendar (2015/09/03)
		'fullcalendar_moment': getRootPath() + 'plugin/Calendar/lib/moment.min',
		'fullcalendar': getRootPath() + 'plugin/Calendar/fullcalendar.min',
		// Chosen 1.4.2 (2015/09/03)
		'chosen': getRootPath() + '_library/chosen'
	},
	shim: {
		'jquery': {
			exports: '$'
			},
		'jquery_fullPage': ['jquery'],
		'jquery_warning': ['jquery'],
		'jquery_ui': ['jquery'],
		'jquery_slimscroll': ['jquery'],
		'bootstrap': ['jquery_slimscroll'],
		'jqPaginator': ['jquery'],
		'fullcalendar': ['fullcalendar_moment', 'jquery'],
		'chosen': ['jquery'],
		'conn': ['bootstrap', 'html5', 'json2', 'jquery_ui', 'jquery_warning', 'jqPaginator'],
		'admconn': ['bootstrap', 'html5', 'json2']
	},
	waitSeconds: 30
});
