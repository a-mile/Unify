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