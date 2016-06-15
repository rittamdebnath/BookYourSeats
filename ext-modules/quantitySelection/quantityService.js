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
                    booked: false
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
        booked: false
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

    var currentSelectionSession = {};

    var DEFAULT_SELECT_SESSION = {
        checkedSeats: {}, // 4 premium seats and 4 standard seats
        count: 0, // e.g. 8 seats checked
        total: 0.0 // e.g. cost for 8 seats
    };

    // reset session
    currentSelectionSession = angular.copy(DEFAULT_SELECT_SESSION);

    
    function createSeats(rows, cols) {
        var arr = [[]];
        var seatIndex = 0;
        for (var row = 0; row < rows; row++) {
            arr[row] = [];
            for(var col=0; col < cols; col++) {
                var seat = angular.extend({}, seatProps, {
                    id: seatIndex,
                    val: seatIndex,
                    booked: seatIndex < 5 // 0 to 5 booked
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
        console.log('checkSelected', newCount);
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
                    if ( !curSeats[row][col].booked ) {
                        // only remove if not booked
                        curSeats[row][col].check = false;
                        removeSeatFromSession(key, curSeats[row], col);
                    }
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
                    if ( !curSeats[row][col].booked ) {
                        curSeats[row][col].check = false;
                        removeSeatFromSession(key, curSeats[row], col);
                    }
                }
            }
        }
    }
    function storeSeatInSession(rang, row, seatIndex) {
        if ( angular.isUndefined(currentSelectionSession
            .checkedSeats[rang]) ) {
            // create if undefined
            currentSelectionSession
            .checkedSeats[rang] = {};
        }
        // we don't need some props in session, so we'll omit it
        // (props not needed because it's obvious that they're 
        //  booked)
        var seat = angular.copy(row[seatIndex]);

        delete seat['$$hashKey'];
        delete seat['check'];
        delete seat['booked'];

        currentSelectionSession
            .checkedSeats[rang][seatIndex] = seat;
    }

    function removeSeatFromSession(rang, row, seatIndex) {
        console.log('remove', currentSelectionSession, rang);
        if ( currentSelectionSession.checkedSeats[rang] ) {
            console.log('remove seat', rang, row, seatIndex, currentSelectionSession.checkedSeats); //[rang][seatIndex]);
            delete currentSelectionSession.checkedSeats[rang][seatIndex];
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

            var borderDistance = row.length - row.indexOf(seat);
            var lastIndex;

            // check if there are booked between click and border
            for(var i=row.indexOf(seat); i < row.length; i++) {
                // e.g. clicked index 2 and 5 is booked
                // --> borderdistance is 5-2 = 3 --> 2 3 4
                if(row[i].booked) {
                    borderDistance = i - row.indexOf(seat); // reduce distance 
                    i = row.length;
                    lastIndex = row.indexOf(seat) + borderDistance;
                }
            }

            var rest = borderDistance > count.val ? 0:  count.val - borderDistance;
            console.log('borderdistance', borderDistance, rest)
                
            if ( factory.availCount.val === count.val) {
                // first click
                if ( !lastIndex ) {
                    // no booked seat hit before normal border
                    lastIndex = rest > 0 ? row.length: row.indexOf(seat) + count.val;
                }
                for ( var seatIndex = row.indexOf(seat); seatIndex < lastIndex; seatIndex++) {
                    row[seatIndex].check = true;

                    console.log('selection test', selection.rang);
                    // add seat to session (total calculated at booking)

                    storeSeatInSession(selection.rang, row, seatIndex);
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

                    storeSeatInSession(selection.rang, row, row.indexOf(seat));

                    if ( factory.availCount.val > 0 ) {
                        factory.availCount.val--;
                    }
                 }
                //}
            }
        }
    }

    function bookCheckedSeats() {
        //@todo add user to the check as reference with an id, 
        //      so we know who booked the seat

        keys = Object.keys(seats);
        var bookedSession;

        for (var rang=0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    if ( curSeats[row][col].check ) {
                        curSeats[row][col].booked = true; // book
                        curSeats[row][col].check = false; // we can remove check
                        currentSelectionSession.count++;
                    }
                }
            }
        }

        bookedSession = angular.copy(currentSelectionSession);

        // reset session
        angular.extend(currentSelectionSession, DEFAULT_SELECT_SESSION);

        return bookedSession; // return statistic of session
    }
    
    var factory = {
        map: seats,
        select: selectSeats,
        availCount: {},
        currentSelectionSession: currentSelectionSession, // just for debugging
        setAvailCount: function(count) {
            checkSelected(count);
        },
        getSeats: function(rang) {
            return seats[rang];
        },
        showQuality: function(rang) {
            // rang means seat quality
            // info if we checked some we can continue checking on other quality
            console.log(rang);
            angular.forEach(Object.keys(seats), function(curRang) {
                seats[rang].visible = (curRang === rang);
            });
        },
        bookCheckedSeats: bookCheckedSeats
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