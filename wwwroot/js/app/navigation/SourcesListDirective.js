(function() {
	"use strict";

	window.app.directive('sourcesList', sourcesList);    

	function sourcesList() {
		return {
			templateUrl: 'js/app/navigation/templates/sourcesList.html',			         
		}
	}	
})();