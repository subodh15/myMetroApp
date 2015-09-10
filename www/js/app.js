// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers'])

app.service('StationNameService', function($http) {
	var stationdata = {};

	var config = {
				method: 'GET',
				data: "{body}",
				cache: true,
				url: 'https://api.wmata.com/Rail.svc/json/jStations',
				headers: {
					'api_key':'8c8a7586480d4837887731037d91fc92'
				}
	};

	$http(config).then(
		function(response){
			//$scope.Trains = response.data;
			console.log( response ) ;
			for ( var i=0; i < response.data.Stations.length ; i++ ) {
				stationdata[response.data.Stations[i].Code] = response.data.Stations[i].Name;
			}
			console.log( 'Got sll station codes');
			console.log(stationdata);
			return;
		}, 
		function(response){
			console.log( 'FAIL');
		}
	);
	//https://api.wmata.com/Rail.svc/json/jStations
	this.getStationName = function (key) {
		return stationdata[key];
	}
	
	this.addStation = function(code, stationname) {
		//console.log( "Adding " + stationname  + " to code " + code);	
		stationdata[code] = stationname;
	}
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

  .state('app.stationsList', {
      url: '/stationsList',
      views: {
        'menuContent': {
          templateUrl: 'templates/metrolines.html',
          controller: 'MetroLinesCtrl'
        }
      }
    })
  .state('app.incidentsList', {
      url: '/incidentsList',
      views: {
        'menuContent': {
          templateUrl: 'templates/incidentsList.html',
          controller: 'IncidentsListCtrl'
        }
      }
    })
  .state('app.stationPrediction', {
      url: '/stationPrediction/?stationcode&stationName&metroLine',
      views: {
        'menuContent': {
          templateUrl: 'templates/stationprediction.html',
          controller: 'StationPredictionCtrl'
        }
      }
    })	
  .state('app.stationDetail', {
      url: '/stationInfo/?stationcode&stationName&metroLine',
      views: {
        'menuContent': {
          templateUrl: 'templates/stationdetail.html',
          controller: 'StationDetailCtrl'
        }
      }
    })
  .state('app.single', {
    url: '/metroStations/?lineID&lineName',
    views: {
      'menuContent': {
        templateUrl: 'templates/metrostations.html',
        controller: 'StationsListCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/stationsList');
});
