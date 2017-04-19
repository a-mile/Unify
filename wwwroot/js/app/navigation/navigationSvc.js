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