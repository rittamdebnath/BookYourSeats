angular.module('thankyouModule', [])

.controller('thankyouController', ['$scope', '$log', function($scope, $log) {
    $scope.val = false;
    $scope.myclass = "available";
    $scope.toggleclass = function() {
        $log.log('fired function');
        $scope.val = !$scope.val;
        $log.log($scope.val);

        if ($scope.val) {
            $scope.myclass = "selected";
        } else {
            $scope.myclass = "blocked";
        }
        $log.log($scope.myclass);
    };

    $scope.isDisabled = false;
    $scope.disableClick = function() {
        $scope.isDisabled = !$scope.isDisabled;
        return false;
    }

    $scope.linkEnabled = true;
    $scope.toggleLink = function() {
        $scope.linkEnabled = !$scope.linkEnabled;   
    };

}]);
