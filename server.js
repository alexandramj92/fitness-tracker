const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

//global variables
let workoutID = "";

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", { useNewUrlParser: true });

db.Workout.create({ title: "Workout Test" })


app.post("/submitWorkout", ({body}, res) => {
    db.Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);    
})
    .catch(({message}) => {
        console.log(message);
    });
})



app.get("/workouts", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
    res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/submitExercise", ({ body }, res) => {
    db.Exercise.create(body)
    .then(({ _id }) => db.Workout.findOneAndUpdate({"_id" : `${workoutID}`}, { $push: { exercises: _id } }, { new: true }))
    .then(dbWorkout => {
    res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
    
});


app.post("/getWorkoutID", function(req,res) {
    workoutID = req.body.selection;
})


app.get("/populatedworkout", (req, res) => {
  db.Workout.find({})
    .populate("exercises")
    .then(dbWorkout => {
      console.log(res.json(dbWorkout));
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
