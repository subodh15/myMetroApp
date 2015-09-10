var apiKey="XXXXXXXXXXXXXXXXXXXXX";

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
//RD, BL, YL, OR, GR, or SV

.controller('MetroLinesCtrl', function($scope) {
  $scope.metroLines = [
    { title: 'Red', id: 'RD' },
    { title: 'Yellow', id: 'YL' },
    { title: 'Green', id: 'GR' },
    { title: 'Blue', id: 'BL' },
    { title: 'Orange', id: 'OR' },
    { title: 'Silver', id: 'SV' }
  ];
})
.controller('StationsListCtrl', function($scope, $http, $location, StationNameService, $stateParams) {
	$scope.metroLine = $stateParams.lineName;
	$scope.goNext = function ( hash ) {
			$location.path( hash );
	};
	var config = {
				method: 'GET',
				data: "{body}",
				cache: false,
				params : { 
							'LineCode':$stateParams.lineID
						},
				url: 'https://api.wmata.com/Rail.svc/json/jStations',
				headers: {
					'api_key':apiKey
				}
			}

	$http(config).then(
		function(response){
			$scope.stations = response.data.Stations;
			console.log( response ) ;			
			console.log( 'Got Station List');
			return;
		}, 
		function(response){
			console.log( 'FAIL');
		}
	);
			
})
.controller('StationPredictionCtrl', function($scope, $http, $location, $stateParams) {
	$scope.stationName = $stateParams.stationName;
	$scope.isTime = function (value) {
		if ( value === "ARR" || value === "BRD" || value === "---") 
			return false;
		else
			return true;
	};
	var config = {
				method: 'GET',
				data: "{body}",
				cache: false,
				url: 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + $stateParams.stationcode,
				headers: {
					'api_key': apiKey
				}
			}

	$http(config).then(
		function(response){
			$scope.Trains = response.data.Trains;
			console.log( response ) ;
			console.log( 'Got Station Predictions');
			return;
		}, 
		function(response){
			console.log( 'FAIL');
		}
	);
			
})
.controller('IncidentsListCtrl', function($scope, $http, $stateParams) {
	var config = {
				method: 'GET',
				data: "{body}",
				cache: false,
				url: 'https://api.wmata.com/Incidents.svc/json/Incidents',
				headers: {
					'api_key':apiKey
				}
			}
	$http(config).then(
		function(response){
			$scope.incidents = response.data.Incidents;
			console.log( response ) ;
			console.log( 'Got Incidents');
			return;
		}, 
		function(response){
			console.log( 'FAIL');
		}
	);
			
})
.controller('StationDetailCtrl', function($scope, $http, $location, StationNameService, $stateParams) {
	$scope.stationcode = $stateParams.stationName;
	$scope.stationName = $stateParams.stationName;
	var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

	console.log( StationNameService.getStationName('E05'));
	
	$scope.isDayDetails = function ( dataValue ) {
		return ( days.indexOf ( dataValue) >= 0 );
	};
	
	$scope.getStationName = function ( stationCode ) {
		var sname = StationNameService.getStationName(stationCode);
		//console.log( 'Looking  for ' + stationCode  + ":" + sname);
		return sname;
	};
	
	
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

	$scope.metroLineName = $stateParams.metroLine;

	
	var config = {
				method: 'GET',
				data: "{body}",
				cache: false,
				params : { 
							'StationCode':$stateParams.stationcode
						},
				url: 'https://api.wmata.com/Rail.svc/json/jStationInfo' ,
				headers: {
					'api_key':apiKey
				}
			};

	$http(config).then(
		function(response){
			//ARR or BRD or minutes.
			$scope.stationdata = response.data;
			
			console.log( response ) ;
			console.log( 'Got Station Detail Info');
			return;
		}, 
		function(response){
			console.log( 'FAIL');
		}
	);
	
	
	var timingsRequest = {
				method: 'GET',
				data: "{body}",
				cache: false,
				params : { 
							'StationCode':$stateParams.stationcode
						},
				url: 'https://api.wmata.com/Rail.svc/json/jStationTimes' ,
				headers: {
					'api_key':apiKey
				}
			};

	$http(timingsRequest).then(
		function(response){
			$scope.StationTimes = response.data.StationTimes[0];		
			console.log( response ) ;
			console.log( 'Got Station Timings Info');
			return;
		}, 
		function(response){
			console.log( 'FAIL');
		}
	);

});


