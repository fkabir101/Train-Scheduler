var config = {
  apiKey: "AIzaSyBv3bP5jX0v9sSdQtPtsvzMJKRLtuILWx8",
  authDomain: "classwork-6401f.firebaseapp.com",
  databaseURL: "https://classwork-6401f.firebaseio.com",
  projectId: "classwork-6401f",
  storageBucket: "classwork-6401f.appspot.com",
  messagingSenderId: "964588687299"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-employee-btn").on("click", function (event) {
  event.preventDefault();

  var tName = $("#name-input").val().trim();
  var tDest = $("#dest-input").val().trim();
  var tFirst = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var tFreq = $("#rate-input").val().trim();

  var newTrain = {
    tName: tName,
    tDest: tDest,
    tFirst: tFirst,
    tFreq: tFreq
  };
  database.ref().push(newTrain);
  $("#name-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  var tFrequency = childSnapshot.val().tFreq;

  var firstTime = childSnapshot.val().tFirst;
  var name = childSnapshot.val().tName;
  var dest = childSnapshot.val().tDest;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(dest),
    $("<td>").text(tFrequency),
    $("<td>").text(firstTimeConverted),
    $("<td>").text(nextTrain),
  );

  // Append the new row to the table
  $("#train-info").append(newRow);
});