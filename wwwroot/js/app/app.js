(function () {
	'use strict';

	window.app = angular.module('Unify', ['ngRoute', 'infinite-scroll']);

	window.app.config(function ($routeProvider,$locationProvider) {
		$routeProvider
			.when('/', {redirectTo : '/all'})
			.when('/:type/:id?/:filter?/:keywords?', {
				templateUrl: "js/app/articles/templates/articlesList.html",
				controller: "articlesController"
			})			
	});

	window.app.controller("articlesController", function (articlesSvc, $scope, $routeParams, $window) {
		$scope.getAllArticles = function () {
			articlesSvc.getAllArticles($scope.page, $routeParams.id).then(
				function (response) {					
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getUnreadArticles = function () {
			articlesSvc.getUnreadArticles($scope.page, $routeParams.id).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getSavedArticles = function () {
			articlesSvc.getSavedArticles($scope.page, $routeParams.id).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getSource = function () {
			articlesSvc.getSource($scope.page, $routeParams.id, $routeParams.filter, $routeParams.keywords).then(
				function (response) {
					$scope.articles = $scope.articles.concat(response.data);
					$scope.load = false;
				}
			);
		};

		$scope.getTag = function () {
			articlesSvc.getTag($scope.page, $routeParams.id, $routeParams.filter, $routeParams.keywords).then(
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

		$scope.saveArticle = function(article){		
			if(!article.saved)
			{
				articlesSvc.saveArticle(article.id).then(
					function(response){	
						article.saved = true;															
					}	
				);
			}
			else{
				articlesSvc.unSaveArticle(article.id).then(
					function(response){
						article.saved = false;						
					}	
				);
			}
		}

		$scope.openArticle = function(article){
			$window.open(article.url);
			articlesSvc.markArticleAsRead(article.id).then(
				function(response){
					article.read = true;
				}
			);
		}

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