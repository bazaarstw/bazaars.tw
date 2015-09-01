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
require.config({
	//enforceDefine: true,
	baseUrl: "",
	paths: {
		'conn': '_js/_conn',
		'domReady': '_library/domready-2.0.1.min',
		'html5': '_library/html5shiv-1.6.2.min',
		'json2': '_library/json2.min',
		'jquery': '_library/jquery-1.9.1.min',
		'jquery_Query': '_library/jquery.query-2.1.8',
		'jquery_fullPage': '_library/jquery.fullPage',
		'jquery_warning': '_library/ie-emulation-modes-warning',
		'jquery_ui': '_library/jquery-ui.min',
		'jquery_slimscroll': '_library/jquery.slimscroll.min',
		'bootstrap': '_library/bootstrap.min',
		'base': 'modelJs/base'
	},
	shim: {
		'jquery': {
			exports: '$'
			},
		'jquery_Query': ['jquery'],
		'jquery_fullPage': ['jquery'],
		'jquery_warning': ['jquery'],
		'jquery_ui': ['jquery'],
		'jquery_slimscroll': ['jquery'],
		'base': ['jquery'],
		'bootstrap': ['jquery','jquery_slimscroll'],
		'conn': ['bootstrap' ,'base']
	},
	waitSeconds: 30
});
