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

    var seats = {
            'Premium': {
                visible: false,
                //           col0 1 2 3 4  5
                // row 0 seat 0   1 2 3 4  5
                // row 1 seat 6   7 8 9 10 11
                seats: seatLayoutService.getSeats(65, 5, 10)
                    //createSeats(2, 6) // rows, cols
            },
            'Standard': {
                visible: false,
                seats: seatLayoutService.getSeats(70, 5, 10) //createSeats(3, 6)
            }
        },
        checkedSeatCount = 0, // keep track of currently selected seats
        currentSelectionSession = {},
        DEFAULT_SELECT_SESSION = {
            checkedSeats: {}, // 4 premium seats and 4 standard seats
            count: 0, // e.g. 8 seats checked
            total: 0.0 // e.g. cost for 8 seats
        };

    init();

    function init() {
        // reset session
        currentSelectionSession = angular.copy(DEFAULT_SELECT_SESSION);
    }

    //@todo old function, not used anymore --> can be removed
    function createSeats(rows, cols) {
        var seatProps = {
            id: 0,
            val: 0,
            check: false,
            booked: false
        };
        var arr = [
            []
        ];
        var seatIndex = 0;
        for (var row = 0; row < rows; row++) {
            arr[row] = [];
            for (var col = 0; col < cols; col++) {
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

        // checkedSeatCount not re-created inc. / dec. as needed
        if (checkedSeatCount === 0) {
            // nothing selected
            factory.availCount = angular.copy(newCount);
        } else if (newCount.val > checkedSeatCount) {
            //console.log('add delta', newCount, checkedCount)
            factory.availCount.val = (newCount.val - checkedSeatCount);
        } else {
            removeAllCheck();
            checkedSeatCount = 0;
        }
    }

    function removeAllCheck() {
        keys = Object.keys(seats);
        for (var rang = 0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row = 0; row < curSeats.length; row++) {
                for (var col = 0; col < curSeats[row].length; col++) {
                    if (!curSeats[row][col].booked) {
                        curSeats[row][col].check = false;
                        removeSeatFromSession(key, curSeats[row], col);
                    }
                }
            }
        }
        checkedSeatCount = 0; // reset counter
    }

    function storeSeatInSession(rang, row, seatIndex) {
        if (angular.isUndefined(currentSelectionSession
                .checkedSeats[rang])) {
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
        if (currentSelectionSession.checkedSeats[rang]) {
            delete currentSelectionSession.checkedSeats[rang][seatIndex];
        }
    }

    function selectSeats(selection, count) {
        // check distance to border, keep the rest as clickable
        // selection = {rang, row, seat}
        var row = selection.row,
            seat = selection.seat,
            borderDistance,
            rest, // rest after border hit
            lastIndex,
            lastIndexBookedCheck;

        if (!seat.booked) {
            // clicked seat not already booked
            if (factory.availCount.val == 0) {
                // reset availCounter --> new selection
                factory.availCount = angular.copy(count);
                removeAllCheck();
            }

            lastIndexBookedCheck = row.indexOf(seat) + count.val;
            // check if there are booked seats between click, border and we're
            // hitting it (check count.val)

            if (lastIndexBookedCheck > row.length)
                lastIndexBookedCheck = row.length; // limit to row.length

            borderDistance = row.length - row.indexOf(seat);

            for (var i = row.indexOf(seat); i < lastIndexBookedCheck; i++) {
                // e.g. clicked index 2 and 5 is booked
                // --> borderdistance is 5-2 = 3 --> 2 3 4
                if (row[i].booked) {
                    // we would hit a booked seat
                    borderDistance = i - row.indexOf(seat); // reduce distance
                    i = row.length;
                    lastIndex = row.indexOf(seat) + borderDistance;
                }
            }


            rest = borderDistance > count.val ? 0 :
                count.val - borderDistance;

            if (factory.availCount.val === count.val) {
                // first click
                if (!lastIndex) {
                    // no booked seat hit before normal border
                    lastIndex = rest > 0 ? row.length :
                        row.indexOf(seat) + count.val;
                }

                for (var seatIndex = row.indexOf(seat); seatIndex < lastIndex; seatIndex++) {
                    // if ( !row[seatIndex].check ) {
                    row[seatIndex].check = true;

                    // add seat to session
                    storeSeatInSession(selection.rang, row, seatIndex);

                    checkedSeatCount++;
                    // }
                }

                factory.availCount.val = rest; // update available seats
            } else {
                // second click dec. availCounter
                // single change of seats
                if (!row[row.indexOf(seat)].check) {
                    // only if not already checked
                    // @info would be good to remove this if, but counting
                    //       will break
                    row[row.indexOf(seat)].check = true;

                    storeSeatInSession(selection.rang, row, row.indexOf(seat));

                    checkedSeatCount++;

                    if (factory.availCount.val > 0) {
                        factory.availCount.val--;
                    }
                }
            }
        }
    }

    function bookCheckedSeats() {
        //@todo add user to the check as reference with an id,
        //      so we know who booked the seat

        var keys = Object.keys(seats),
            bookedSession;

        // change check to booked
        for (var rang = 0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row = 0; row < curSeats.length; row++) {
                for (var col = 0; col < curSeats[row].length; col++) {
                    if (curSeats[row][col].check) {
                        curSeats[row][col].booked = true; // book
                        curSeats[row][col].check = false; // we can remove check
                    }
                }
            }
        }

        currentSelectionSession.count = checkedSeatCount;
        checkedSeatCount = 0;
        bookedSession = angular.copy(currentSelectionSession);

        // reset session
        currentSelectionSession = angular.copy(DEFAULT_SELECT_SESSION);

        return bookedSession; // return statistic of session
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
            // info if we checked some seats,
            // we can continue checking on other quality
            angular.forEach(Object.keys(seats), function(curRang) {
                seats[rang].visible = (curRang === rang);
            });
        },
        bookCheckedSeats: bookCheckedSeats
    };

    return factory
}
