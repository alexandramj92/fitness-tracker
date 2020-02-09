$( document ).ready(function() {

let selection;

function init() {
    getWorkouts();
    getSpecWork();
}

function getWorkouts(err) {
    $.ajax("/workouts", {
        type: "GET",
        dataType: 'json',
        success: function(response) {
            console.log(response[0]._id);
            allWorkoutsDropdown(response); 
            // setTimeout(refresh,2000);
        }
    })
    if (err) console.log(err);
}

function getSpecWork(err) {
    $.ajax("/populatedWorkout", {
        type: "GET",
        dataType: 'json',
        success: function(response) {
            // console.log("yay worked", response[0]._id.toString());
            for (let i = 0; i<response.length; i++){
                if(response[i]._id.toString() == selection) {
                    console.log("matching", response[i]);
                    let specWork = response[i];
                    displaySpecWork(specWork);
                    // return response[i];
                }

            }
        }
    })
    if (err) console.log(err);

}

function displaySpecWork (specWork) {
    $( "#specific-workout" ).empty();

    const workoutTitle = document.createTextNode(specWork.title);
    const hTwo = document.createElement("h2");
    hTwo.append(workoutTitle);
    const specWorkDiv = document.getElementById('specific-workout');
    specWorkDiv.appendChild(hTwo);
    selection = specWork._id.toString();

    for (let i = 0; i<specWork.exercises.length; i++){
        let exercise = document.createTextNode(specWork.exercises[i].exercise);
        let pOne = document.createElement("p");
        pOne.setAttribute("class", "exercise");
        pOne.append(exercise);

        let minutes = document.createTextNode(specWork.exercises[i].minutes + " min");
        let pTwo = document.createElement("p");
        pTwo.setAttribute("class", "minutes");
        pTwo.append(minutes);

        pOne.appendChild(pTwo);

        specWorkDiv.appendChild(pOne);


    } 

}


function allWorkoutsDropdown(allWorkouts) {
    const dropdownField = document.getElementById('workout-dropdown');
    for (let i = 0; i<allWorkouts.length; i++){
        const workoutTitle = document.createTextNode(allWorkouts[i].title);
        const option = document.createElement("option");
        option.append(workoutTitle);
        option.setAttribute("value", `${allWorkouts[i]._id}` );
        dropdownField.appendChild(option);
    } 

}


const getWorkoutId = document.getElementById('workout-dropdown');
getWorkoutId.onchange = function() {
    selection = document.getElementById('workout-dropdown').value;
    console.log("selection", selection);
    $.ajax("/getWorkoutID", {
        type: "POST",
        dataType: 'json',
        data: {selection}
    })

    getSpecWork();

}

$("#newExerForm").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    console.log("submit exer fom clicked");

    var form = $(this);
    var url = form.attr('action');

    $.ajax("/submitExercise", {
           type: "POST",
           url: url,
           data: form.serialize(), // serializes the form's elements.
           success: function(data)
           {
               console.log(data); 
           },
           complete: function(data) {
               getSpecWork();
           }
         });


});

$("#newWorkForm").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    console.log("work form clicked");

    var form = $(this);
    var url = form.attr('action');

    $.ajax("/submitWorkout", {
           type: "POST",
           url: url,
           data: form.serialize(), // serializes the form's elements.
           success: function(data)
           {
               console.log(data); 
           },
           complete: function(data) {
               getWorkouts();
               reloadPage();
           }
         });


});

function reloadPage() {
    location.reload();
    

}




init();

});