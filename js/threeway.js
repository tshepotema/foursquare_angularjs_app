(function(){
		var appCricketStore = angular.module('threeWayApp', ['ngRoute', 'ui.bootstrap']);

		appCricketStore.config(['$routeProvider',
			function ($routeProvider) {
			$routeProvider
			.when('/', 
			{
				controller: 'featuredController',
				templateUrl: 'views/featured.html'
			})
			.when('/photos/:venue/:venueID', 
			{
				controller: 'photosController',
				templateUrl: 'views/photos.html'
			})
			.when('/photo/:photoOwner/:photoDescription/:photoURL1/:photoURL2/:photoURL3/:photoURL4/:photoURL5', 
			{
				controller: 'photoController',
				templateUrl: 'views/photo.html'
			})
			.when('/about', 
			{
				controller: 'contentController',
				templateUrl: 'views/about.html'
			})
			.when('/services', 
			{
				controller: 'contentController',
				templateUrl: 'views/services.html'
			})
			.when('/contact', 
			{
				controller: 'contentController',
				templateUrl: 'views/contact.html'
			})
			.otherwise(
				{
					redirectTo: '/'
				}
			);
		}]);		

		appCricketStore.controller('contentController', ['$scope', contentController]);	
		appCricketStore.controller('globalController', ['$scope', globalController]);	
		appCricketStore.controller('featuredController', ['$scope', '$routeParams', '$http', featuredController]);	
		appCricketStore.controller('photosController', ['$scope', '$routeParams', '$http', '$log', photosController]);	
		appCricketStore.controller('photoController', ['$scope', '$routeParams', '$http', photoController]);	

		function contentController($scope) {

			var content = "This is just a simple test app using foursquare API, so select a category on the left and then you click on the name of a venue in the next screen and then it displays all the photos taken at that venue.. tada :) (c) Tshepo Tema 27 May 2015";

			$scope.about_content = "" + content;
			$scope.services_content = "" + content;
			$scope.contact_content = "" + content;
		}

		function globalController($scope) {            
            
            $scope.company_name = "ThreeWay Test App";
            
			$scope.navbar = [{name: 'About', link: '/about'}, {name: 'Services', link: '/services'}, {name: 'Contact', link: '/contact'}];
			$scope.categories = ['Featured', 'Resturant', 'Bar', 'Sport', 'Nature', 'Instagram', 'Mall', 'Shopping', 'Fun'];	

			$scope.active_nav = $scope.categories[0];		

			$scope.selectCategory = function(selectedCategory){
				if (selectedCategory.length < 1) {
					selectedCategory == $scope.categories[0];
				}
				$scope.active_nav = selectedCategory;
			};
		}

		function featuredController($scope, $routeParams, $http) {
			// Simple GET request to get "featured" data
			$http.get('https://api.foursquare.com/v2/venues/search?client_id=5STQTYIEY43XBTSOKKOAVCOPM13KYA2J4S21XM3AIMGMDH5N&client_secret=LMCUDUNHR0X3H2IQOYJPYCTY032T0ONEW5NT1DSJYNAW24TL&v=20150527&ll=-26.109228,28.053365&radius=100000&query=&limit=18').
			  success(function(data, status, headers, config) {
				    if (data.meta.code == "200") {				    	
				    	$scope.venues = data.response.venues;
				    } else {
				    	alert('Error retrieving data from foursquare!!!');
				    }
				})
				.error(function(data, status, headers, config) {
				    alert('error getting json from = https://api.foursquare.com/v2/venues/search?client_id=5STQTYIEY43XBTSOKKOAVCOPM13KYA2J4S21XM3AIMGMDH5N&client_secret=LMCUDUNHR0X3H2IQOYJPYCTY032T0ONEW5NT1DSJYNAW24TL&v=20130815&ll=-26.109228,28.053365&radius=100000&query=bar&limit=10 :: status = ' + status + ' :: headers = ' + headers + ' :: data = ' + data);
				});			

		}

		function photosController($scope, $routeParams, $http, $log) {
			//filtering defaults
			$scope.reverseValue = true;
			$scope.orderField = '';

			$scope.changeOrdering = function() {
				switch ($scope.selectedFilter.value) {
					case 0: 
						$scope.reverseValue = true;
						$scope.orderField = '';
						break;
					case 1: 
						$scope.reverseValue = false;
						$scope.orderField = 'user.firstName';
						break;
					case 2: 
						$scope.reverseValue = true;
						$scope.orderField = 'user.firstName';
						break;
				};
			}

			$scope.changePageLimit = function() {
				$scope.itemsPerPage = $scope.selectedPPage.value;
			}

			$scope.venueID = $routeParams.venueID;
			$scope.venueName = $routeParams.venue;
			$scope.categoryName = $routeParams.venue;

			if (typeof $scope.categoryName === 'undefined') {
				$scope.categoryName = "Featured";
			}

			// Simple GET request to get photos in a venue
			$http.get('https://api.foursquare.com/v2/venues/' + $scope.venueID + '/photos?client_id=5STQTYIEY43XBTSOKKOAVCOPM13KYA2J4S21XM3AIMGMDH5N&client_secret=LMCUDUNHR0X3H2IQOYJPYCTY032T0ONEW5NT1DSJYNAW24TL&v=20150527').
			  success(function(data, status, headers, config) {
				    if (data.meta.code == "200") {				    	
						if (data.response.photos.count == "0") {
							$scope.totalItems = 0;
							alert('No photos taken at this venue.');
						} else {
							$scope.totalItems = parseInt(data.response.photos.count);
				    		$scope.photos = data.response.photos.items;
						}				    					    	
				    } else {
				    	$scope.totalItems = 0;
				    	alert('Error retrieving data from foursquare!!!');
				    }
				})
				.error(function(data, status, headers, config) {
				    alert('Error retrieving = https://api.foursquare.com/v2/venues/' + $scope.venueID + '/photos?client_id=5STQTYIEY43XBTSOKKOAVCOPM13KYA2J4S21XM3AIMGMDH5N&client_secret=LMCUDUNHR0X3H2IQOYJPYCTY032T0ONEW5NT1DSJYNAW24TL&v=20150527 :: status = ' + status + ' :: headers = ' + headers + ' :: data = ' + data);
				});			

			var listCategories = ['Featured', 'Resturant', 'Bar', 'Sport', 'Nature', 'Instagram', 'Mall', 'Shopping', 'Fun'];

			$scope.categoryIndex = listCategories.indexOf($routeParams.categoryName);

			$scope.selectedManufacture = "all";

			$scope.priceFilters = [{label: 'Default', value: 0}, {label: 'Name: a-z', value: 1}, {label: 'Name: z-a', value: 2}];
			$scope.selectedPriceFilter = $scope.priceFilters[0];

			$scope.pageLimitOptions = [{label: '9', value: 9}, {label: '12', value: 12}, {label: '15', value: 15}, {label: '30', value: 30}, {label: 'All', value: 300}];
			$scope.selectedPPage = $scope.pageLimitOptions[0];			//set the Drop Down default
			$scope.itemsPerPage = $scope.pageLimitOptions[0]['value'];	//set the filter default

			//pagination
			//$scope.totalItems = 30;
			$scope.maxSize = 5;
		  	$scope.currentPage = 1;
		  	$scope.pagerStartDisplay = 0;

			$scope.setPage = function (pageNo) {
				$scope.currentPage = pageNo;
			};

			$scope.pageChanged = function() {
				$log.log('Page changed to: ' + $scope.currentPage);
				
				$scope.pagerStartDisplay = (($scope.currentPage - 1) * $scope.itemsPerPage);

			};

		}


		function photoController($scope, $routeParams, $http) {

			$scope.photoOwner = $routeParams.photoOwner;
			$scope.photoDescription = $routeParams.photoDescription;

			$scope.photoURL1 = $routeParams.photoURL1;
			$scope.photoURL2 = $routeParams.photoURL2;
			$scope.photoURL3 = $routeParams.photoURL3;
			$scope.photoURL4 = $routeParams.photoURL4;			
			$scope.photoURL5 = $routeParams.photoURL5;

			$scope.photoURL1 = $scope.photoURL1.replace("~~", "//");

			//$scope.photoDate = $routeParams.photoDate;
		}


})(); 
