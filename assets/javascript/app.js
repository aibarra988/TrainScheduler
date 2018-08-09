var config = {
    apiKey: "AIzaSyDdPHh0LYfbB5Dmf8fK3LoLP8xSA3clqkM",
    authDomain: "trainscheduler-35b0e.firebaseapp.com",
    databaseURL: "https://trainscheduler-35b0e.firebaseio.com",
    projectId: "trainscheduler-35b0e",
    storageBucket: "trainscheduler-35b0e.appspot.com",
    messagingSenderId: "855211399640"
};
firebase.initializeApp(config);

var database = firebase.database();

var dbRef = database.ref();

dbRef.on("child_added", function(snap) {
    var sv = snap.val();

    var firstTrainTime = moment(sv.firstTrainTime, "hh:mm");
    var timeDifference = moment().diff(moment(firstTrainTime), "minutes");
    var remainder = timeDifference % sv.frequency;
    var minutesAway;
    var nextArrival;
    var nextArrivalFormatted;

    if (remainder < 0) {
        minutesAway = Math.abs(timeDifference);
        nextArrival = firstTrainTime;
        nextArrivalFormatted = moment(nextArrival).format("h:mm a");
    } else {
        minutesAway = sv.frequency - remainder;
        nextArrival = moment().add(minutesAway, "minutes");
        nextArrivalFormatted = moment(nextArrival).format("h:mm a");
    }
    
    
    console.log("child added", minutesAway);    
    
    var trEl = $("<tr>");

    var trainNameEl = $("<td>").text(sv.trainName);
    var destinationEl = $("<td>").text(sv.destination);
    var frequencyEl = $("<td>").text(sv.frequency);
    var nextArrivalEl = $("<td>").text(nextArrivalFormatted);
    var minutesAwayEl = $("<td>").text(minutesAway);

    // Add table entries here
    trEl
        .append(trainNameEl)
        .append(destinationEl)
        .append(frequencyEl)
        .append(nextArrivalEl)
        .append(minutesAwayEl);

    $("#table-body").append(trEl);
});

$("#submit").click(function() {
    var formTrainName = $("#form-train-name").val().trim();
    var formDestination = $("#form-destination").val().trim();
    var formFirstTrainTime = $("#form-first-train-time").val().trim();
    var formFrequency = $("#form-frequency").val().trim();

    console.log(formTrainName, formDestination, formFirstTrainTime, formFrequency);

    database.ref().push({
        trainName: formTrainName,
        destination: formDestination,
        firstTrainTime: formFirstTrainTime,
        frequency: formFrequency
    });

    $("#form-train-name").val("");
    $("#form-destination").val("");
    $("#form-first-train-time").val("");
    $("#form-frequency").val("");
});