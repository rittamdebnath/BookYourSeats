angular.module('quantityModule')
    .controller('quantityModuleController', ['$scope', '$window', 'seatLayoutService', function($scope, $window, seatLayoutService) {

        var init = function() {

            $scope.rows = [];
            //getSeats(startLetter,rows,cols);
            $scope.premiumSeats = seatLayoutService.getSeats(65, 5, 10);
            $scope.standardSeats = seatLayoutService.getSeats(70, 5, 10);

            $scope.quantities = [1, 2, 3, 4, 5];
            $scope.seatQualities = ['premium', 'standard'];
            $scope.seatQuality = null
            $scope.letterList = [];
            $scope.isDisabled = false;

        }


        $scope.resetQuantity = function() {
            $scope.selectedVal = $scope.selectedVal || $scope.storeSelectedVal;
        }


        $scope.resetQuality = function(quality) {
            $scope.resetQuantity();
            if (quality == 'premium') {
                $scope.rows = $scope.premiumSeats;
            } else {
                $scope.rows = $scope.standardSeats;
            }
            $scope.storeSelectedVal = angular.copy($scope.selectedVal);
            $scope.rowLetter = seatLayoutService.rowLetter($scope.rows);

            angular.forEach($scope.rows, function(v, k) {
                for (var i = 0; i < v.length; i++) {
                    if (v[i].check == true) {
                        v[i].check = false;
                    }
                }
            });
            if ($scope.selectedVal < 1) {
                $scope.isDisabled = true;
            } else {
                $scope.isDisabled = false;
            }

            console.log($scope.selectedVal + '  isDisabled: ' + $scope.isDisabled);
        };

        $scope.assignSeats = function(i, j, itemVal, itemLetter) {

            angular.forEach($scope.rows, function(v, k) {

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
            });

        };

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
            if ($scope.selectedVal < 1) {
                $scope.isDisabled = true;
            } else {
                $scope.isDisabled = false;
            }
            // $location.path('/thankyou');
            if ($scope.selectedVal != 0) {
                $window.alert("you didn't select " + $scope.selectedVal + " seats");
                return;
            } else {

                angular.forEach($scope.rows, function(v, k) {
                    for (var i = 0; i < v.length; i++) {
                        if (v[i].seat == true) {
                            v[i].check = false;
                        }
                    }
                });
                $window.alert('Thankyou for Booking ' + count + ' seats');
                $scope.seatQuality = null;
            }

        };

        init();
    }])
    .factory('seatLayoutService', function() {

        getSeats = function(startLetter, rows, cols) {
            var obj = [],
                dummyArray = [];
            for (var i = 0, k = startLetter; i < rows; i++, k++) {
                for (var j = 1; j <= cols; j++) {
                    dummyArray.push({
                        val: j,
                        letter: String.fromCharCode(k),
                        check: false,
                        seat: false
                    });
                }
                obj.push(dummyArray);
                dummyArray = [];
            }
            return obj;
        }

        rowLetter = function(obj) {
            var list = [];
            angular.forEach(obj, function(v, k) {
                for (var i = 0; i < v.length; i++) {
                    if (list.indexOf(v[i].letter) == -1) {
                        list.push(v[i].letter);
                    }
                }
            });
            return list;
        }


        return {
            rowLetter: rowLetter,
            getSeats: getSeats
        }

    });
