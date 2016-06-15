// quantityService.js

angular.module('quantityModule')
    .factory('seatLayoutService', SeatsLayoutFactory)
    .factory('seatsManager', SeatsFactory);


function SeatsLayoutFactory() {

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

}

function SeatsFactory($rootScope, $timeout, seatLayoutService) {
    var seatProps = {
        id: 0,
        val: 0,
        check: false,
        blocked: false
    };
    var seats = {
        'Premium': {
            visible: false,
            //           col0 1 2 3 4  5 
            // row 0 seat 0   1 2 3 4  5
            // row 1 seat 6   7 8 9 10 11
            seats: seatLayoutService.getSeats(65, 5, 10) //createSeats(2, 6) // rows, cols
        },
        'Standard': {
            visible: false,
            seats: seatLayoutService.getSeats(70, 5, 10) //createSeats(3, 6)
        }
    };
    
    function createSeats(rows, cols) {
        var arr = [[]];
        var seatIndex = 0;
        for (var row = 0; row < rows; row++) {
            arr[row] = [];
            for(var col=0; col < cols; col++) {
                var seat = angular.extend({}, seatProps, {
                    id: seatIndex,
                    val: seatIndex,
                    blocked: seatIndex < 5 // 0 to 5 booked
                });
                arr[row][col] = seat;
                seatIndex++;
            }
        }
        return arr;
    }
    
    function checkSelected(newCount) {
        // selected fewer or more than persons in select.
        // --> uncheck all
        var checkedCount=0, keys = Object.keys(seats);
        for (var rang=0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    if ( curSeats[row][col].check ) {
                        checkedCount++;
                    }
                }
            }
            //console.log('new count', newCount, checkedCount);
            // we can have more or less selections after selection change
            // --> more inc availCount
            if (checkedCount === 0) {
                // nothing selected
                factory.availCount = angular.copy(newCount);
            }
            else if (newCount.val > checkedCount) {
                //console.log('add delta', newCount, checkedCount)
                factory.availCount.val = (newCount.val - checkedCount);
            } else {
                removeAllCheck();
            }
        }
    }
    
    function removeCheck(rang) {
        // later pass user to this function (for now remove all checked)
        /*var curSeats = seats[rang].seats
        for (var row=0; row < curSeats.length; row++) {
            for (var col=0; col < curSeats[row].length; col++) {
                curSeats[row][col].checked = false;
            }
        }*/
        keys = Object.keys(seats);
        
        for (var rang=0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    curSeats[row][col].check = false;
                }
            }
        }
    }
    
    function removeAllCheck() {
        keys = Object.keys(seats);
        for (var rang=0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    curSeats[row][col].check = false;
                }
            }
        }
    }
    
    function selectSeats(selection, count) {
        // todo:
        // check distance to border, keep the rest as clickable
        // selection = {rang, row, seat}
        console.log(selection);
        var row = selection.row,
            seat = selection.seat;
        
        if ( !seat.booked ) {
            //console.log('availCount', factory.availCount);
            if ( factory.availCount.val == 0 ) {
                //console.log('new selection');
                factory.availCount = angular.copy(count);
                removeCheck(); //selection.rang);
            }

            var borderDistance = row.length - row.indexOf(seat),
                rest = borderDistance > count.val ? 0:  count.val - borderDistance;
                
            if ( factory.availCount.val === count.val) {
                // first click
                var lastIndex = rest > 0 ? row.length: row.indexOf(seat) + count.val;
                for ( var seatIndex = row.indexOf(seat); seatIndex < lastIndex; seatIndex++) {
                    row[seatIndex].check = true;
                }
                factory.availCount.val = rest; // update available seats
            } 
            else {
                // second click dec. availCounter
                // single change of seats
                /*if ( factory.availCount.val < 0 ) {
                    row[row.indexOf(seat)].checked = false; // remove check
                    factory.availCount.val++;
                }
                else {*/
                if ( !row[row.indexOf(seat)].check ) {
                    // only if not already checked
                    row[row.indexOf(seat)].check = true;
                    if ( factory.availCount.val > 0 ) {
                        factory.availCount.val--;
                    }
                 }
                //}
            }
        }
    }
    
    var factory = {
        map: seats,
        select: selectSeats,
        availCount: {},
        setAvailCount: function(count) {
            checkSelected(count);
        },
        getSeats: function(rang) {
            return seats[rang];
        },
        showQuality: function(rang) {
            // rang means seat quality
            console.log(rang);
            angular.forEach(Object.keys(seats), function(curRang) {
                seats[rang].visible = (curRang === rang);
            });
        }
    };
    
    return factory
}

// function MainCtrl(seats) {
//     var vm = this;
//     angular.extend(vm, {
//         seats: seats,
//         selectionCount: [//[0,1,2,3,4],[
//         {id: 0, val: 0}, // object for two-way binding
//         {id: 1, val: 1},
//         {id: 2, val: 2},
//         {id: 3, val: 3},
//         {id: 4, val: 4},
//         ],
//         selectedCount: 0
//     });
    
//     vm.selectedCount = vm.selectionCount[2];
//     seats.setAvailCount(vm.selectedCount);
// }