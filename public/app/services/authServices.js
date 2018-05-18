angular.module('authServices', [])

.factory('Auth', function($http){
    authFactory = {};
    authFactory.login = function(logData){
        return $http.post('/api/authenticate', logData);
    }
    return authFactory;
});