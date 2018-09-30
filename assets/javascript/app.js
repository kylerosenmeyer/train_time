//Train Time Application

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB-XaSWCg7Zq4xsZGNrTdf1KMYEZKfmycc",
  authDomain: "train-time-39e4e.firebaseapp.com",
  databaseURL: "https://train-time-39e4e.firebaseio.com",
  projectId: "train-time-39e4e",
  storageBucket: "train-time-39e4e.appspot.com",
  messagingSenderId: "934134396298"
};

firebase.initializeApp(config);

//Define initial variables. Set the database variable to more easily call things from/to firebase, define trainCount, and set empty variables for time caclulations. 

var database = firebase.database(),
    trainCount = 1,
    timeNext = "",
    minsAway = "";

// When the page loads, check one time for anything in the database, if nothing is there, put a sample train in.

$(document).ready( function() {

  database.ref().once("value", function(snap) {

    //This is the condition to check if anything exists in the database. the var "newTrain" is a sample train to plug in.

    if ( snap.exists() == false ) {
      var newTrain = {
        trainName: "Florida Express",
        trainDest: "Jacksonville",
        trainFreq: 30,
        trainStart: "07:45",
        trainCount: trainCount
      } 
    
      database.ref().push(newTrain)

    }
  })

  $(".main-container").slideUp(0)
  $(".main-container").delay(4000).slideDown(2000)
})

//When the submit button is clicked, push the new train into firebase

$(".btn-primary").click( function() {

  event.preventDefault()

  if ( ( $("#inputName").val() !== "" ) && ( $("#inputDest").val() !== "" ) && ( $("#inputFreq").val() !== 0 ) && ( $("#inputStart").val() !== "" ) ) {
    trainCount++

    // Here, after the condition is checked that all the form fields have something in them.
    var newTrain = {
        trainName: $("#inputName").val().trim(),
        trainDest: $("#inputDest").val().trim(),
        trainFreq: $("#inputFreq").val().trim(),
        trainStart: $("#inputStart").val().trim(),
        trainCount: trainCount
    } 
    //Put the new train into the database
    database.ref().push(newTrain)
  } else {
    //Display the modal warning the user that the train info is incomplete.
    $("#warningModal").modal("toggle")
  }
  //Reset the form (vanilla javascript)
  document.getElementById("trainForm").reset()

})

//Whenever a child is recognized in firebase, it will display in the train table.
//This applies to new trains added by button click, existing trains in the database, or the sample train being added to the database.

database.ref().on("child_added", function(snap) {

    //This section construct the table row/data entries. trainRow, tName, tDest, tFreq, tScope, tNext, and tMinAway are all entries to the table.
    //This is also recognized by the <tr> or <td> tags in these variables.
    //timeF, time1, tDiff, tLeft, and time2 are all variables related to time calculations.

  let trainRow = $("<tr id=\"trainRow"+trainCount+"\">"),
    tName = $("<td class=\"text\">"+snap.val().trainName+"</td>"),
    tDest = $("<td class=\"text\">"+snap.val().trainDest+"</td>"),
    tFreq = $("<td class=\"text\">"+snap.val().trainFreq+" minutes</td>"),
    tScope = $("<td class=\"text\" scope=\"row\"></td>"),
    //timeF is the time train frequency
    timeF = snap.val().trainFreq,
    //time1 is the time the first train leaves
    time1 = moment(snap.val().trainStart, "HH:mm").subtract(1, "years"),
    //tDiff is the time between now and when the first train left
    tDiff = moment().diff(moment(time1, "minutes")),
    //tLeft is the remainder of the current trip that has not yet passed. 
    tLeft = timeF - tDiff % timeF
    //time2 is the time of the next train
    time2 = moment().add(tLeft, "minutes").format("HH:mm"),
    //After computing the times for the new train, add those values to the table
    tNext = $("<td class=\"text time\">" + time2 + " </td>"),
    tMinAway = $("<td class=\"text time\">" + tLeft + " minutes</td>")
  
  //Build the completed train row.
  trainRow.append(tScope, tName, tDest, tFreq, tNext, tMinAway)
  //Append the new trainRow to the table.
  $("tbody").append(trainRow)
  //Update the value of trainCount
  trainCount = snap.val().trainCount

}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

//This code snippet focuses onto the modal when it displays (taken from bootstrap documentation)
$('#warningModal').on('shown.bs.modal', function () {
  $('#warningModal').trigger('focus')
})

