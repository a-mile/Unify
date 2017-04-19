(function () {
	'use strict';

	window.app = angular.module('Unify', ['ngRoute', 'infinite-scroll']);

	window.app.config(function ($routeProvider,$locationProvider) {
		$routeProvider
			.when('/', {redirectTo : '/all'})
			.when('/:type/:id?/:filter?', {
				templateUrl: "js/app/articles/templates/articlesList.html",
				controller: "articlesController"
			})			
	});

	window.app.controller("articlesController", function (articlesSvc, $scope, $routeParams) {
		$scope.getAllArticles = function () {
			articlesSvc.getAllArticles($scope.page).then(
				function (response) {					
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getUnreadArticles = function () {
			articlesSvc.getUnreadArticles($scope.page).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getSavedArticles = function () {
			articlesSvc.getSavedArticles($scope.page).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getSource = function () {
			articlesSvc.getSource($scope.page, $routeParams.id, $routeParams.filter).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getTag = function () {
			articlesSvc.getTag($scope.page, $routeParams.id, $routeParams.filter).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.loadArticles = function(){
			$scope.load = true;			
				switch($routeParams.type){
					case "unread":
						$scope.getUnreadArticles();
						break;
					case "saved":
						$scope.getSavedArticles();
						break;
					case "all":
						$scope.getAllArticles();
						break;
					case "source":
						$scope.getSource();
						break;
					case "tag":
						$scope.getTag();
						break;
				}						
		};

		$scope.incrementPageAndLoadArticles = function(){
			$scope.page = $scope.page + 1;
			$scope.loadArticles();
		};

		$scope.$on('$routeChangeSuccess', function () {
			$scope.load = false;
			$scope.articles = [];
			$scope.page = 1;
			$scope.loadArticles();		
		});			
	});
})();
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
(function() {
	window.app.factory('navigationSvc', navigationSvc);
	
	navigationSvc.$inject = ['$http'];

	function navigationSvc($http) {		        
		var svc = {			            														            			
            getTags: getTags,
			getSources: getSources,
			addSource: addSource,
			deleteSource: deleteSource,
			editSource: editSource,
		};

		return svc;

		function getSources() {
			return $http.get('/Source/GetAll');			
		}

		function addSource(source) {
			return $http.post('Source/Create', source);				
		}

        function getTags() {			
            return $http.get('/Tag/GetAll');			
		}

		function deleteSource(id){
			return $http.post('Source/Delete', id);					
		}		

		function editSource(newSource){								
			return $http.post('Source/Edit', newSource);				
		}		
	}
})();
(function() {
	"use strict";

	window.app.directive('sourcesList', sourcesList);    

	function sourcesList() {
		return {
			templateUrl: 'js/app/navigation/templates/sourcesList.html',			         
		}
	}	
})();
(function() {
	"use strict";

	window.app.directive('tagsList', tagsList);    

	function tagsList() {
		return {
			templateUrl: 'js/app/navigation/templates/tagsList.html',			         
		}
	}	
})();
(function () {
	window.app.factory('articlesSvc', articlesSvc);

	articlesSvc.$inject = ['$http'];

	function articlesSvc($http) {
		var svc = {
			getAllArticles: getAllArticles,
			getUnreadArticles: getUnreadArticles,
			getSavedArticles: getSavedArticles,
			getSource: getSource,
			getTag: getTag,
			markAllAsRead: markAllAsRead,
			markSourceAsRead: markSourceAsRead,
			markTagAsRead: markTagAsRead,
			markArticleAsRead: markArticleAsRead
		};

		return svc;

		function getAllArticles(page) {
			return $http.get('/Article/GetAll', { params: { page: page } });
		}

		function getUnreadArticles(page) {
			return $http.get('/Article/GetUnread', { params: { page: page } });
		}

		function getSavedArticles(page) {
			return $http.get('/Article/GetSaved', { params: { page: page } });
		}

		function getSource(page,id,filter) {
			return $http.get('/Article/GetSource', { params: { page: page, id:id, filter:filter } });
		}

		function getTag(page,id,filter) {
			return $http.get('/Article/GetTag', { params: { page: page, id:id, filter:filter } });
		}

		function markAllAsRead(){
			return $http.post('/Article/MarkAllAsRead');
		}

		function markSourceAsRead(sourceId){
			return $http.post('/Article/MarkSourceAsRead', sourceId);
		}

		function markTagAsRead(tagId){
			return $http.post('/Article/MarkTagAsRead', tagId);
		}

		function markArticleAsRead(articleId){
			return $http.post('/Article/MarkArticleAsRead', articleId);
		}
	}
})();