(function() {
  "use strict";

  var module = angular.module('umbrellr', ['geolocation']);
  module.controller('IndexCtrl', [
    '$scope', '$http', 'geolocation', 
    function($scope,$http,geolocation) {
      $scope.reset = function() {
        $scope.coords = {};
        $scope.days = [{is_raining: null}, {is_raining: null}];
      };
      $scope.refresh = function() {
        $scope.reset();
        geolocation.getLocation().then(function(data) {
          $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
          var config = {
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily',
            params: { cnt: 2, lat: $scope.coords.lat, lon: $scope.coords.lon, 'callback': 'JSON_CALLBACK'},
          };
          var http_promise = $http.jsonp(config.url, config);
          http_promise.success(function(results) {
            angular.forEach(results.list, function(val,idx) {
              var weather = val.weather[0];
              // http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes
              if (weather.id >= 200 && weather.id <= 299)  {
                // thunderstorms
                $scope.days[idx].is_raining = true;
              } else if (weather.id >= 300 && weather.id <= 399) {
                // Drizzle
                $scope.days[idx].is_raining = true;
              } else if (weather.id >= 500 && weather.id <= 599) {
                // Rain
                $scope.days[idx].is_raining = true;
              } else {
                // something other than rain, so either nice, or umbrellas don't matter
                $scope.days[idx].is_raining = false;
              }
            });
          });
        });
      };
      $scope.reset();
      $scope.refresh();
    }
  ]);
})();
