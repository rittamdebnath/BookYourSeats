angular.module('appRoot', ['quantityModule','thankyouModule'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/quantity', {
            controller: 'quantityModuleController',
            templateUrl: 'ext-modules/quantitySelection/quantityTemplate.html'
        })
        .when('/thankyou',{
          controller: 'thankyouController',
          templateUrl: 'ext-modules/quantitySelection/thankyouTemplate.html'
        })
        .otherwise({
            redirectTo: '/quantity'
        });
}]);
