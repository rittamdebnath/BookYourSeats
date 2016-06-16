# BookYourSeats

It is a angularJs app that is used to book seats for a show or a movie.

## Branch ver1.1

**Installation**
```
Download the Repository

npm install
gulp

Open Browser and put this URL: localhost:8080
```
What the User Can Do (User Cases)?

1. Select and Deselect the Seats with respect to the selectedVal, i.e if the selectedVal = 4 then the user can select only 4 seats in total.

2. if the SelectedVal is less than 1 then the user should not be able to select the seat anymore unless the user deselect any of the previously selected seats and select again.

3. Booked Seats Case: If the check value of a seat is true, then the user should not be able to select or deselect that seat(a.blocked CSS rule is Added for that purpose) since it is already selected by another user(Lets assume).

4. User can select the seats from anyone of the seat Quality i.e. either standard or premium but not both.


#### Automatic Seat Selection Cases

1. If the user selects 3 seats and click on the first seat in the first row it should automatically select 2 and 3 on the same row.
2. If the user Selects 3 seats and clicks on the second last seat in the row then last two seats should be filled and the remaining seat should be filled where ever the user clicks.
3. If the user selects 3 seats and click on only last then, only that seat should be filled.

StackOverflow: http://stackoverflow.com/questions/37796699/bookyourseat-automatic-seat-selection-on-click-using-angularjs-gif
