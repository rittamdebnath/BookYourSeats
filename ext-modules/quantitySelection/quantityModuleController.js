angular.module('quantityModule')
    .controller('quantityModuleController', ['$scope', '$window', 'seatLayoutService', 'seatsManager', function($scope, $window, seatLayoutService, seatsManager) {

        var init = function() {

            //getSeats(startLetter,rows,cols);
            $scope.premiumSeats = seatsManager.getSeats('Premium'); //seatLayoutService.getSeats(65, 5, 10);
            $scope.standardSeats = seatsManager.getSeats('Standard'); //seatLayoutService.getSeats(70, 5, 10);
            $scope.seats = seatsManager;

            $scope.quantities = [ //[0,1,2,3,4],[
                {
                    id: 0,
                    val: 0
                }, // object for two-way binding
                {
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
                },
            ];
            $scope.seatQualities = ['Premium', 'Standard'];

            // set default start values for select boxes
            $scope.seatQuality = 'Standard'; //undefined;
            $scope.selectedCount = $scope.quantities[1];

            // manually trigger setAvailCount
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

                // console.log(JSON.stringify(sessionInfo.checkedSeats));
                $scope.seatsJSON = [];
                var checkedJSON = sessionInfo.checkedSeats;

                angular.forEach(checkedJSON, function(v, k) {
                    angular.forEach(v, function(v, k) {
                        angular.forEach(v, function(v, k) {
                            $scope.seatsJSON.push(v);
                        });
                    });
                });

                 $scope.seatsJSON = $scope.seatsJSON.join('').match(/[\s\S]{1,2}/g) || [];

                $window.alert('Thank you for Booking ' + sessionInfo.count + ' seats. ' +
                    'Your seats are: '+ $scope.seatsJSON.join(', '));
        };

        init();
    }]);
