(function() {
	"use strict";

	window.app.directive('editSource', editSource);

    editSource.$inject = ['$document'];
	function editSource($document) {
		return {
			templateUrl: 'js/app/navigation/templates/editSource.html',
			controller: controller,
			controllerAs: 'sourceController',
            scope: {source : "="},			
            link: function(scope, element, attr, controller){   
				function outsideClick(event){
					if(controller.routes.selectedItemId == null)
						return;
						
					if(scope.source.id != controller.routes.selectedItemId)
						return;

					if(controller.routes.itemType == "tag")
						return;

					if(scope.$parent.$parent.navigationController.edit == false)
						return;

					var isChild = element[0].contains(event.target);
                    var isSelf = element[0] == event.target;
                    var isInside = isChild || isSelf;
					var editButton = angular.element("#editButton");
					var isEditButton = event.target == editButton[0];
					var isChildEditButton = editButton[0].contains(event.target);
					var isInsideEditButton = isEditButton || isChildEditButton;
                    
                    if (isInside || isInsideEditButton)
                    	return;
					 
					controller.errorMessage = null; 
					scope.$parent.$parent.navigationController.edit = false;
                    scope.$apply();
                }

                $document.bind('click', outsideClick);

				scope.$on('$destroy', function(){
					$document.unbind('click', outsideClick);	 
				});
            }
		}
	}

	controller.$inject = ['$scope','navigationSvc','$location','$routeParams','$route'];
	function controller($scope, navigationSvc,$location,$routeParams,$route) {
		var sourceController = this;		

		sourceController.errorMessage = null;						
        sourceController.form = "editSourceForm";
		sourceController.oldSource = $scope.source;
        sourceController.newSource = angular.copy($scope.source);	

		$scope.$on('$routeChangeSuccess', function () {
			sourceController.routes = {
				itemType: $routeParams.type,
				itemFilter: $routeParams.filter,
				selectedItemId: $routeParams.id,				
			}
		});		
			

		sourceController.editSource = function() {			
			navigationSvc.editSource(sourceController.newSource).then(
				function(response)
				{		
					$scope.$parent.$parent.navigationController.getSources();
					$scope.$parent.$parent.navigationController.getTags();					
					sourceController.errorMessage = null; 
					$scope.$parent.$parent.navigationController.edit = false;	
					sourceController.redirect();
				},
				function(response){
					sourceController.errorMessage = response.data;				
			});													
		}

		sourceController.redirect = function(){
			$route.reload();
			$location.path('/'+sourceController.routes.itemType+"/"+sourceController.routes.selectedItemId+"/all");
			$location.replace();
			
		}
	}
})();