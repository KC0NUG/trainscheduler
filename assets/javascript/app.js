// Homework week 7 - Train Scheduler
// by Charles Simpson @KC0NUG

//creates firebase link
var trainData = new Firebase("https://week-7-homework.firebaseio.com/");

//button for adding trains
$('#submitButton').on('click', function(){
	//gets user input
	var trainName = $('#trainNameInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var firstTime = moment($('#timeInput').val().trim(), "HH:mm").format("");
	var frequency = $('#frequencyInput').val().trim();

	//creates local holder for train times
	var newTrains = {
		name: trainName,
		tdestination: destination,
		tFirst: firstTime,
		tfreq: frequency,
	}

	//uploads data to the database
	trainData.push(newTrains);
	alert("Train successfully added!");

	//clears all of the text boxes
	$('#trainNameInput').val("");
	$('#destinationInput').val("");
	$('#timeInput').val("");
	$('#frequencyInput').val("");

	return false;
});

//when a new item is added (child) do this function
trainData.on("child_added", function(childSnapshot, prevChildKey){
	
	//store everything into a variable
	var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().tdestination;
	var firstTime = childSnapshot.val().tFirst;
	var frequency = childSnapshot.val().tfreq;

	//convert first time (push back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
	
	//current time
	var currentTime = moment();
	
	//difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	
	//time apart (remainder)
	var tRemainder = diffTime % frequency;
	
	//minute until train
	var tMinutesTillTrain = frequency - tRemainder;
	
	//next train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	var nextTrainConverted = moment(nextTrain).format("hh:mm a");
	
	//add each trains data into the table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});


