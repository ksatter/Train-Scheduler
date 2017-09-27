$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB34HKhFQpY5nuXrTP_3iTM6_RcZ_CF7zg",
        authDomain: "gtcbc-6bc73.firebaseapp.com",
        databaseURL: "https://gtcbc-6bc73.firebaseio.com",
        projectId: "gtcbc-6bc73",
        storageBucket: "gtcbc-6bc73.appspot.com",
        messagingSenderId: "364563583460"
    };
    firebase.initializeApp(config);


    var database = firebase.database();

    var name ;
    var stop ;
    var lastTime ;
    var stopInterval;
    //
    $("#submit").on("click", function () {
        nameInput = $("#name-input");
        stopInput = $("#stop-input");
        timeInput = $("#time-input");
        intInput = $("#train-interval");


        // Grab data input
        name = nameInput.val();
        stop = stopInput.val();
        lastTime = timeInput.val();
        stopInterval = intInput.val();

        // Check that data was grabbed correctly
        console.log(name);
        console.log(stop);
        console.log(lastTime);
        console.log(stopInterval);

        if (name && stop && lastTime && stopInterval) {
            database.ref('/Train-Timer').push({
                name: name,
                stop: stop,
                lastTime: lastTime,
                stopInterval: stopInterval,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

          $(".form-input").val("");
          $(".form-input").removeClass("invalid");
          $(".input-label").removeClass('invalid-input');
        }
        else {
            checkInput(name, nameInput);
            checkInput(stop, stopInput);
            checkInput(lastTime, timeInput);
            checkInput(stopInterval, intInput);
        }

    });


    //calculate next stop time
    function nextStopCalc(time, interval) {
        var prevTime = moment(time, 'hhmm').subtract(1, "year");
        var timeDiff = moment().diff(prevTime, 'minutes');

        return timeDiff % interval

    }

    function checkInput(type, div) {
        if (!type) {

            div.addClass("invalid");
            div.prev().addClass("invalid-input");
        }
        else{
            div.removeClass("invalid");
            div.prev().removeClass("invalid-input");
        }
    }
    //Load data from firtebase add data to employee table
    database.ref('/Train-Timer').orderByChild("dateAdded").on("child_added", function (snapshot) {
        // Store data in variable sv
        var snapshot = snapshot.val();
        var timeInt = nextStopCalc(snapshot.lastTime, snapshot.stopInterval);
        var nextStop = moment().add(timeInt, "minutes").format('hh:mm');

        //Create table
        var row = $("<tr>");
        var data = $("<td>");

        data.text(snapshot.name);
        row.append(data);

        data = $("<td>");
        data.text(snapshot.stop);
        row.append(data);

        data = $("<td>");
        data.text(snapshot.stopInterval);
        row.append(data);

        data = $("<td>");
        data.text(nextStop);
        row.append(data);

        data = $("<td>");
        data.text(timeInt);
        row.append(data);
        //Append New rows to employee tables body
        $("#train-data").append(row);
    })
})
;