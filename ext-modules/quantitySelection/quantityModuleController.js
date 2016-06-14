angular.module('quantityModule')
    .controller('quantityModuleController', ['$scope', '$window', 'seatLayoutService', 'seatsManager', function($scope, $window, seatLayoutService, seatsManager) {

        var init = function() {

            // $scope.rows = [];
            //getSeats(startLetter,rows,cols);
            $scope.premiumSeats = seatsManager.getSeats('Premium'); //seatLayoutService.getSeats(65, 5, 10);
            $scope.standardSeats = seatsManager.getSeats('Standard');//seatLayoutService.getSeats(70, 5, 10);
            $scope.seats = seatsManager;
            
            $scope.quantities = [//[0,1,2,3,4],[
                {id: 0, val: 0}, // object for two-way binding
                {id: 1, val: 1},
                {id: 2, val: 2},
                {id: 3, val: 3},
                {id: 4, val: 4},
            ];
            $scope.seatQualities = ['Premium', 'Standard'];

            $scope.states = {
                seatQuality: '', // nesting needed so updating in markup is working
                isDisabled: false
            };

        }

        $scope.resetQuantity = function() {
            $scope.selectedVal = $scope.selectedVal || $scope.storeSelectedVal;
        }


        // $scope.resetQuality = function(quality) {
        //     $scope.resetQuantity();
        //     if (quality == 'premium') {
        //         $scope.rows = $scope.premiumSeats;
        //     } else {
        //         $scope.rows = $scope.standardSeats;
        //     }
        //     $scope.storeSelectedVal = angular.copy($scope.selectedVal);
        //     $scope.rowLetter = seatLayoutService.rowLetter($scope.rows);

        //     angular.forEach($scope.rows, function(v, k) {
        //         for (var i = 0; i < v.length; i++) {
        //             if (v[i].check == true) {
        //                 v[i].check = false;
        //             }
        //         }
        //     });
        //     if ($scope.selectedVal < 1) {
        //         $scope.isDisabled = true;
        //     } else {
        //         $scope.isDisabled = false;
        //     }

        //     console.log($scope.selectedVal + '  isDisabled: ' + $scope.isDisabled);
        // };

        //$scope.assignSeats = function(i, j, itemVal, itemLetter) {

            //seatsManager.select(i, j, itemVal, itemLetter);
            /*angular.forEach($scope.rows, function(v, k) {

                if (v[i].val == itemVal && v[i].letter == itemLetter) {
                    if (v[i].seat == true || ($scope.isDisabled && v[i].check == false)) {
                        return;
                    }

                    v[i].check = !v[i].check;

                    if (v[i].check)
                        $scope.selectedVal -= 1;
                    else
                        $scope.selectedVal += 1;


                    console.log(v[i].val + " " + " " + v[i].letter);


                    if ($scope.selectedVal < 1) {
                        $scope.isDisabled = true;
                    } else {
                        $scope.isDisabled = false;
                    }
                    console.log('isDisabled: ' + $scope.isDisabled);
                }
            });*/

        //};

        $scope.storeSeat = function() {
            var count = 0;
            angular.forEach($scope.rows, function(v, k) {
                for (var i = 0; i < v.length; i++) {
                    if (v[i].check == true) {
                        v[i].seat = true;
                        count++;
                    }
                }
            });

            if ($scope.seats.availCount.val) { //$scope.selectedCount.val < 1) {
                $scope.states.isDisabled = true;
            } else {
                $scope.states.isDisabled = false;
            }
            // $location.path('/thankyou');
            if ($scope.seats.availCount.val != 0) {
                $window.alert("You haven't selected " + $scope.seats.availCount.val + " seats");
                return;
            } else {

                // angular.forEach($scope.rows, function(v, k) {
                //     for (var i = 0; i < v.length; i++) {
                //         if (v[i].seat == true) {
                //             v[i].check = false;
                //         }
                //     }
                // });
                $window.alert('Thank you for Booking ' + $scope.selectedCount.val + ' seats');
                $scope.seatQuality = null;
            }

        };

        init();
    }]);
