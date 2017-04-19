(function() {
	"use strict";

	window.app.directive('search', search);

	function search() {
		return {
			templateUrl: 'js/app/search/templates/search.html',
			controller: controller,
			controllerAs: 'searchController'            
		}
	}

	controller.$inject = ['$routeParams','$location','$scope'];
	function controller($routeParams,$location,$scope) {
		var searchController = this;		

        $scope.$on('$routeChangeSuccess', function () {
			searchController.routes = {
			itemType: $routeParams.type,
			itemFilter: $routeParams.filter,
			selectedItemId: $routeParams.id,            
		    }
		});		

        searchController.keyWords = "";

        searchController.search = function(){
            if(searchController.routes.itemType == "source" || searchController.routes.itemType == "tag"){
                $location.path('/'+searchController.routes.itemType+'/'+searchController.routes.selectedItemId+'/'+searchController.routes.itemFilter+'/'+searchController.keyWords);
			    $location.replace();
            }
            if(searchController.routes.itemType == "all" || searchController.routes.itemType == "unread" || searchController.routes.itemType == "saved"){
                $location.path('/'+searchController.routes.itemType + '/'+searchController.keyWords);
			    $location.replace();
            }
            
        }	
		
	}
})();