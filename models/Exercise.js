const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  exercise: {type: String, default: "Stretching"},
  workoutType: {type: String, default: "Warm-up"},
  minutes: { type: Number, min: 2, max: 60, default: 5 }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
