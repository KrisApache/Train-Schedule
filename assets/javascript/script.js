
$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDcjW3g8QlftX27TjNeieVzcfcyGgJxtLM",
    authDomain: "trainschedule-11124.firebaseapp.com",
    databaseURL: "https://trainschedule-11124.firebaseio.com",
    projectId: "trainschedule-11124",
    storageBucket: "",
    messagingSenderId: "838619567583"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var name = "";
  var destination = "";
  var firstTrainTime = "";
  var freq = "";
  var nextTime = "";


  $(document).on("click", "#submit-data", function () {


    // Don't refresh the page!
    event.preventDefault();


    name = $("#name-input").val();
    destination = $("#dest-input").val();
    firstTrainTime = $("#firstTrain-input").val();
    freq = $("#freq-input").val();


    database.ref().push({
      "name": name,
      "destination": destination,
      "firstTrainTime": firstTrainTime,
      "freq": freq,
      // "nextTime": nextTime,
      // "minAway": minAway
    });

    $("#name-input").val("");
    $("#dest-input").val("");
    $("#firstTrain-input").val("");
    $("#freq-input").val("");

  });


 
  

  database.ref().on('child_added', function (childSnapshot) {


      

      console.log(childSnapshot.val());


      var firstTrainTime = childSnapshot.val().firstTrainTime;
      var freq = childSnapshot.val().freq;
      var nextTime = "";

      var curTime = moment().format('HH:mm');
      var diffMinutes = moment(curTime, "HH:mm").diff(moment(firstTrainTime, "HH:mm")) / 60000;
      var remainder = diffMinutes % freq;
      var minAway = freq - remainder;


      if (diffMinutes < 0) {
        nextTime = firstTrainTime;
        minAway = moment(firstTrainTime, "HH:mm").diff(moment(curTime, "HH:mm")) / 60000;
      }
      else if (minAway == 0) {
        nextTime = curTime;
        minAway = "Right Now";
      }
      else {
        nextTime = moment(firstTrainTime, "hh:mm").add(diffMinutes + minAway, 'minutes').format('LT');
      }

      $("#train-table > tbody").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
        childSnapshot.val().freq + "</td><td>" + nextTime + "</td><td>" +
        minAway + "</td></tr>");

 

  });




  // If any errors are experienced, log them to console.
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});







