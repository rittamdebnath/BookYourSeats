angular.module('seatModule')

.controller('seatModuleController', ['$scope', '$location', '$stateParams', '$log', 'seatLayoutService', function($scope, $location, $stateParams, $log, seatLayoutService) {
    $scope.rows = seatLayoutService.getTotalSeat();
    $scope.rowLetter = seatLayoutService.rowLetter();


}])

.service('seatLayoutService', function() {
    var rows = [];
    this.getTotalSeat = function() {
        for (var i = 0; i < 5; i++) {
            var row = [];
            for (var j = 0; j < 10; j++) {
                row.push({
                    val: j
                });
            }
            rows.push(row);
        }
        return rows;
    }

    this.rowLetter = function() {
        var rowLetter = [];
        for (var i = 65, j = 0; j < rows.length, j <= 92; i++, j++) {
            rowLetter.push(String.fromCharCode(i));
        }
        return rowLetter;
    }


});
