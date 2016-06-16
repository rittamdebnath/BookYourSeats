angular.module('appRoot', ['quantityModule'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/quantity', {
            controller: 'quantityModuleController',
            templateUrl: 'templates/quantityTemplate.html'
        })
        .otherwise({
            redirectTo: '/quantity'
        });
}]);
