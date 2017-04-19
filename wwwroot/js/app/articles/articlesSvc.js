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
			markArticleAsRead: markArticleAsRead,
			markSavedAsRead: markSavedAsRead,
			saveArticle: saveArticle,
			unSaveArticle: unSaveArticle
		};

		return svc;

		function getAllArticles(page, keywords) {
			return $http.get('/Article/GetAll', { params: { page: page, keywords: keywords } });
		}

		function getUnreadArticles(page, keywords) {
			return $http.get('/Article/GetUnread', { params: { page: page, keywords: keywords } });
		}

		function getSavedArticles(page, keywords) {
			return $http.get('/Article/GetSaved', { params: { page: page, keywords: keywords } });
		}

		function getSource(page,id,filter, keywords) {
			return $http.get('/Article/GetSource', { params: { page: page, id:id, filter:filter, keywords: keywords } });
		}

		function getTag(page,id,filter, keywords) {
			return $http.get('/Article/GetTag', { params: { page: page, id:id, filter:filter, keywords: keywords } });
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

		function markSavedAsRead(){
			return $http.post('/Article/MarkSavedAsRead');
		}

		function saveArticle(articeId){
			return $http.post('/Article/SaveArticle',articeId);
		}

		function unSaveArticle(articeId){
			return $http.post('/Article/UnSaveArticle',articeId);
		}
	}
})();