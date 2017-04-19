(function() {
	"use strict";

	window.app.directive('tagsList', tagsList);    

	function tagsList() {
		return {
			templateUrl: 'js/app/navigation/templates/tagsList.html',			         
		}
	}	
})();