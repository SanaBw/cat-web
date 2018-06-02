angular.module('favServices', [])

    .factory('Fav', function ($http) {
        var favFactory = {};

        favFactory.create = function (favData) {
            return $http.post('/api/favorites', favData);
        };

        favFactory.remove = function (fav) {
            return $http.delete('/api/favorites/' + fav._id);
        };

        return favFactory;
    });