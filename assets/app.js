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
    //Global variables
    var name ;
    var stop ;
    var lastTime ;
    var stopInterval;
    //Add new train
    $("#submit").on("click", function () {
        var nameInput = $("#name-input");
        var stopInput = $("#stop-input");
        var timeInput = $("#time-input");
        var intInput = $("#train-interval");
        //Get Data from form
        name = nameInput.val();
        stop = stopInput.val();
        lastTime = timeInput.val();
        stopInterval = intInput.val();
        //verify that all fields filled out
        if (name && stop && lastTime && stopInterval) {
            //push to db
            database.ref('/Train-Timer').push({
                name: name,
                stop: stop,
                lastTime: lastTime,
                stopInterval: stopInterval,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
            //clear form
            $(".form-input").val("");
            $(".form-input").removeClass("invalid");
            $(".input-label").removeClass('invalid-input');
            updateTable();
        }
        //determine what field is empty and mark
        else {
            checkInput(name, nameInput);
            checkInput(stop, stopInput);
            checkInput(lastTime, timeInput);
            checkInput(stopInterval, intInput);
        }

    });
    //calculate next stop time
    function nextStopCalc(time, interval) {

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
    //function to update table
    function updateTable() {
        $("#train-data").empty();
        //Load data
        database.ref('/Train-Timer').orderByChild("dateAdded").on("child_added", function (snapshot) {
            //retrieve data
            var key = snapshot.key;
            var snapshot = snapshot.val();
            //run time calculations
            var prevTime = moment(snapshot.lastTime, 'hhmm');
            var currentTime = moment().add(24, "hours");
            var timeDiff = currentTime.diff(prevTime, 'minutes');
            var timeTill = snapshot.stopInterval - (timeDiff % snapshot.stopInterval);
            var nextStop = moment().add(timeTill, "minutes").format('hh:mm');

            //Create row
            var row = $("<tr>");
            row.attr("data-key", key);
            $("#train-data").append(row);
            //name
            var data = $("<td>");
            data.attr("data-type", "name");
            data.text(snapshot.name);
            row.append(data);
            //stop
            data = $("<td>");
            data.attr("data-type", "stop");
            data.text(snapshot.stop);
            row.append(data);
            //frequency
            data = $("<td>");
            data.attr("data-type", "interval");
            data.text(`${snapshot.stopInterval} minutes`);
            row.append(data);
            //next arrival
            data = $("<td>");
            data.attr("data-type", "next-stop");
            data.text(nextStop);
            row.append(data);
            // minutes away
            data = $("<td>");
            data.attr("data-type", "interval-time");
            data.text(timeTill);
            row.append(data);
            //edit button (wip)
            /*data = $("<td>");
            $("#train-data").append(row);
            var button = $("<button>");
            button.addClass("btn btn-sm btn-primary edit-button");
            button.text("Edit");
            data.append(button);
            row.append(data);*/
            //delete button
            data = $("<td>");
            button = $("<button>");
            button.addClass("btn btn-sm btn-primary delete-button");
            button.text("Delete");
            data.append(button);
            row.append(data);
        });
    };
    //delete button functionality
    $(document).click(".delete-button", function () {
        var clicked = event.target;
        //find row
        var clickedRow = $(clicked).closest('tr');
        //retrieve db key
        var clickedKey = $(clickedRow).attr("data-key");
        //remove row
        clickedRow.remove();
        //remove from db
        database.ref('/Train-Timer').child(clickedKey).remove();

    });
        //initial write
        updateTable();
        //update every minute
        var timedUpdate = setInterval(updateTable, 60 * 1000)

})
;