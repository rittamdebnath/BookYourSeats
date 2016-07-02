angular.module('quantityModule')
    .controller('quantityModuleController', ['$scope', '$window','seatsManager', function($scope, $window, seatsManager) {
            var init = function() {
                $scope.premiumSeats = seatsManager.getSeats('Premium');
                $scope.standardSeats = seatsManager.getSeats('Standard');
                $scope.seats = seatsManager;
                $scope.quantities = [{
                    id: 0,
                    val: 0
                }, {
                    id: 1,
                    val: 1
                }, {
                    id: 2,
                    val: 2
                }, {
                    id: 3,
                    val: 3
                }, {
                    id: 4,
                    val: 4
                }, ];
                $scope.seatQualities = ['Premium', 'Standard'];
                $scope.seatQuality = 'Standard';
                $scope.selectedCount = $scope.quantities[1];
                seatsManager.setAvailCount($scope.selectedCount);
            }

            $scope.storeSeat = function() {
                if ($scope.seats.availCount.val != 0) {
                    $window.alert("You haven't selected " +
                        $scope.seats.availCount.val + " seats");
                    return;
                }
                var sessionInfo = seatsManager.bookCheckedSeats();
                seatsManager.setAvailCount($scope.selectedCount);

                // console.log(sessionInfo.checkedSeats);

                $scope.alertMsg = [];
                angular.forEach(sessionInfo.checkedSeats, function(v, k) {
                    for (var i = 0; i < v.length; i++) {
                        $scope.alertMsg.push(v[i].val + v[i].letter);
                    }
                });
                
                $window.alert('Thank you for Booking ' + sessionInfo.count + ' seats. ' + 
                        'Your seats are: ' + $scope.alertMsg.join(', '));
            };

        init();
    }]);
