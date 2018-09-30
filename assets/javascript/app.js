//Train Time

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

var database = firebase.database(),
    currentTime = moment(),
    trainCount = 4,
    timeNext = "",
    minsAway = "";

console.log("this is the traincount: " + trainCount)


var trainSetup = {
  
  train1: {
    trainName: "Florida Express",
    trainDest: "Jacksonville",
    trainFreq: 30,
    trainStart: "07:45"
  },

  train2: {
    trainName: "DC to NYC",
    trainDest: "New York City",
    trainFreq: 120,
    trainStart: "05:00"
  },

  train3: {
    trainName: "Georgia Line",
    trainDest: "Atlanta",
    trainFreq: 60,
    trainStart: "09:00"
  },

  train4: {
    trainName: "Walt Disney Monorail",
    trainDest: "Orlando",
    trainFreq: 15,
    trainStart: "04:30"
  }

};

$(document).ready( function() {

  $("#trainName, #trainDest, #trainFreq").empty();

  for ( let i=1; i<5; i++ ) {

        
        //timeF is the time train frequency
    var timeF = trainSetup["train" + i]["trainFreq"],
        //tTime1 is the time the first train leaves
        time1 = moment(trainSetup["train" + i]["trainStart"], "HH:mm").subtract(1, "years"),
        //tDiff is the time between now and when the first train left
        tDiff = moment().diff(moment(time1, "minutes")),
        //tLeft is the remainder of the current trip that has not yet passed. 
        tLeft = timeF - tDiff % timeF
        //tTime2 is the time of the next train
        time2 = moment().add(tLeft, "minutes").format("HH:mm"),
        

        //The following variables represent the new row and data entries to be added to the table.
        trainRow = $("<tr id=\"trainRow" + i + "\">"),
        tScope = $("<td scope=\"row\"></td>"),
        tName = $("<td>"+trainSetup["train" + i]["trainName"]+"</td>"),
        tDest = $("<td>"+trainSetup["train" + i]["trainDest"]+"</td>"),
        tFreq = $("<td>"+trainSetup["train" + i]["trainFreq"]+" minutes</td>"),
        tNext = $("<td>" + time2 + " </td>"),
        tMinAway = $("<td>" + tLeft + " minutes</td>")
  
    // console.log("timeF (" + i + "): " + timeF)
    // console.log("time1 (" + i + "): " + time1)
    // console.log("tDiff (" + i + "): " + tDiff)
    // console.log("tLeft (" + i + "): " + tLeft)
    // console.log("time2 (" + i + "): " + time2)
    
    $(".trainTable").append(trainRow)
    $("#trainRow"+i).append(tScope, tName, tDest, tFreq, tNext, tMinAway)

    database.ref().on("value", function(snap) {
      trainCount = snap.val().trainCount
    })
  }
})

$(".btn-primary").click( function() {

  event.preventDefault()

  trainCount++

  var newTrain = {
      trainName: $("#inputName").val().trim(),
      trainDest: $("#inputDest").val().trim(),
      trainFreq: $("#inputFreq").val().trim(),
      trainFirst: $("#inputStart").val().trim()
  }

  console.log("New Train Created: ")
  console.log(newTrain.trainName)
  console.log(newTrain.trainDest)
  console.log(newTrain.trainFreq)
  console.log(newTrain.trainFirst)

  database.ref().push(newTrain)
  database.ref().push({trainCount: trainCount})
  
  console.log("this is the train count: " + trainCount)

})

database.ref().on("child_added", function(snap) {

  console.log("New Train Added from Firebase: ")
  console.log("this is the new train coming in: ")
  console.log(snap.val().trainName)
  console.log(snap.val().trainDest)
  console.log(snap.val().trainFreq)
  console.log(snap.val().trainFirst)

    //These are the variables used again to build the table entries and do the time calculations.

  var trainRow = $("<tr id=\"trainRow"+trainCount+"\">"),
    tName = $("<td>"+snap.val().trainName+"</td>"),
    tDest = $("<td>"+snap.val().trainDest+"</td>"),
    tFreq = $("<td>"+snap.val().trainFreq+" minutes</td>"),
    tScope = $("<td scope=\"row\"></td>"),
    //timeF is the time train frequency
    timeF = snap.val().trainFreq,
    //tTime1 is the time the first train leaves
    time1 = moment(snap.val().trainFirst, "HH:mm").subtract(1, "years"),
    //tDiff is the time between now and when the first train left
    tDiff = moment().diff(moment(time1, "minutes")),
    //tLeft is the remainder of the current trip that has not yet passed. 
    tLeft = timeF - tDiff % timeF
    //tTime2 is the time of the next train
    time2 = moment().add(tLeft, "minutes").format("HH:mm"),
    //After computing the times for the new train, add those values to the table
    tNext = $("<td>" + time2 + " </td>"),
    tMinAway = $("<td>" + tLeft + " minutes</td>")
      
  $(".trainTable").append(trainRow)
  $("#trainRow"+trainCount).append(tScope, tName, tDest, tFreq, tNext, tMinAway)
  

})



