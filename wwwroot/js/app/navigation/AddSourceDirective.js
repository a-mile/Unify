(function() {
	"use strict";

	window.app.directive('addSource', addSource);

    addSource.$inject = ['$document'];

	function addSource($document) {
		return {
			templateUrl: 'js/app/navigation/templates/addSource.html',
			controller: controller,
			controllerAs: 'sourceController',
            link: function(scope, element, attr, controller){                                              
                $document.bind('click', function(event){
					var isChild = element
            		.find(event.target)
           			.length > 0;
                    var isSelf = element[0] == event.target;
                    var isInside = isChild || isSelf;
                    
                    if (isInside)
                    	return;
                    
					controller.hide();					 

                    scope.$apply();
                });
            }
		}
	}

	controller.$inject = ['navigationSvc','$scope'];
	function controller(navigationSvc, $scope) {
		var sourceController = this;		
				
		sourceController.form = "addSourceForm";
		sourceController.source = {Name : null, Url : null, TagId : null};
		sourceController.errorMessage = null;        
        sourceController.visible = false;

		sourceController.hide = function(){
			sourceController.visible = false;
			sourceController.source = {Name : null, Url : null, TagId : null};   
			sourceController.form.$setPristine();              
			sourceController.form.$setUntouched();  
			sourceController.errorMessage = null;  
		};

        sourceController.toggleVisibility = function(){
        	sourceController.visible = !sourceController.visible; 
			sourceController.source = {Name : null, Url : null, TagId : null};   
			sourceController.form.$setPristine();              
			sourceController.form.$setUntouched();
			sourceController.errorMessage = null;                
        };

		sourceController.addSource = function() {			
			navigationSvc.addSource(sourceController.source).then(
				function(response){
				$scope.navigationController.getSources();
				$scope.navigationController.getTags();
				sourceController.hide();
			},
				function(response){
				sourceController.errorMessage = response.data;				
			});	
		}
	}
})();