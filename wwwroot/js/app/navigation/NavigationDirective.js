(function () {
	"use strict";

	window.app.directive('navigation', navigation);

	function navigation() {
		return {
			templateUrl: 'js/app/navigation/templates/navigation.html',
			controller: controller,
			controllerAs: 'navigationController',
		}
	}

	controller.$inject = ['navigationSvc', '$routeParams','$scope','$location','articlesSvc','$route'];
	function controller(navigationSvc, $routeParams, $scope, $location,articlesSvc,$route) {
		var navigationController = this;

		$scope.$on('$routeChangeSuccess', function () {
			navigationController.routes = {
				itemType: $routeParams.type,
				itemFilter: $routeParams.filter,
				selectedItemId: $routeParams.id,
			}
		});

		navigationController.edit = false;

		navigationController.getSources = function () {
			navigationSvc.getSources().then(
				function (response) {
					navigationController.sources = response.data;
				}
			);
		};

		navigationController.getTags = function () {
			navigationSvc.getTags().then(
				function (response) {
					navigationController.tags = response.data;
				}
			);
		};

		navigationController.getSources();
		navigationController.getTags();

		navigationController.showAllSources = false;
		navigationController.showAllTags = false;

		navigationController.deleteItem = function () {
			if (navigationController.routes.itemType == "source") {
				navigationSvc.deleteSource(navigationController.routes.selectedItemId).then(
					function (response) {						
						navigationController.getSources();
						navigationController.getTags();
						$location.path('/all');
						$location.replace();
					});
			};
		};

		navigationController.markAsRead = function(){
			if(navigationController.routes.itemType == 'all' || navigationController.routes.itemType == 'unread' || navigationController.routes.itemType == 'saved'){
				articlesSvc.markAllAsRead().then(
					function(response){
						$route.reload();
						$location.path('/'+navigationController.routes.itemType);
						$location.replace();	
					}
				);
			}
			if(navigationController.routes.itemType == 'source'){
				articlesSvc.markSourceAsRead(navigationController.routes.selectedItemId).then(
					function(response){
						$route.reload();
						$location.path('/'+navigationController.routes.itemType+"/"+navigationController.routes.selectedItemId+"/"+navigationController.routes.itemFilter);
						$location.replace();	
					}
				);	
			}
			if(navigationController.routes.itemType == 'tag'){
				articlesSvc.markTagAsRead(navigationController.routes.selectedItemId).then(
					function(response){
						$route.reload();
						$location.path('/'+navigationController.routes.itemType+"/"+navigationController.routes.selectedItemId+"/"+navigationController.routes.itemFilter);
						$location.replace();	
					}
				);	
			}
		};
	}
})();