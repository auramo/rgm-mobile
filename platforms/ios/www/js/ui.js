var ui = function() {
    function hide(i, elem) { $(elem).hide(); }
    function show(i, elem) { $(elem).show(); }
    function showView(id) {
	$('.view').each(hide).filter(function() { return $(this).hasClass(id); }).each(show);
    }
    return {
	showAjaxLoader: function() { showView('ajax-loading'); },
	hideAjaxLoader: function() { $('.ajax-loading').hide(); },
	showView: showView
    }
}();
