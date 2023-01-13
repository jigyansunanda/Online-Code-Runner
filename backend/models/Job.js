const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ["cpp", "python"],
    },
    filepath: {
        type: String,
        required: true,
    },
    inputFilePath: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    output: {
        type: String,
    },
    status: {
        type: String,
        default: "Running",
        enum: ["Running", "Success", "Error"],
    },
});

const Job = new mongoose.model("job", JobSchema);

module.exports = Job;
