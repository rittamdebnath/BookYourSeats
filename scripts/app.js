angular.module('appRoot', ['quantityModule'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/quantity', {
            controller: 'quantityModuleController',
            controllerAs: 'vm',
            templateUrl: 'templates/quantityTemplate.html'
        })
        .otherwise({
            redirectTo: '/quantity'
        });
}]);
