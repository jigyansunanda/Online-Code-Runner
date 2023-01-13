const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/Job");

mongoose.connect(
    "mongodb://0.0.0.0/compiler",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("Successfully connected to mongodb database");
    }
);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/status", async (req, res) => {
    const jobId = req.query.id;
    if (jobId === undefined) {
        return res
            .status(400)
            .json({ success: false, error: "missing id query param" });
    }
    try {
        const job = await Job.findById(jobId);
        if (job === undefined) {
            return res
                .status(404)
                .json({ success: false, error: "invalid job id" });
        }
        return res.status(200).json({ success: true, job });
    } catch (err) {
        return res
            .status(400)
            .json({ success: false, error: JSON.stringify(err) });
    }
});

app.post("/run", async (req, res) => {
    const { language = "python", code, input = "" } = req.body;
    if (code === undefined) {
        return res
            .status(400)
            .json({ success: false, error: "Empty code body" });
    }

    let job;

    try {
        // generate c++ file with content from request
        const files = await generateFile(language, code, input);

        const [filepath, inputFilePath] = files;

        job = await new Job({ language, filepath, inputFilePath }).save();
        // console.log(job);

        const jobId = job["_id"];
        addJobToQueue(jobId);

        res.status(201).json({ success: true, jobId });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, err: JSON.stringify(err) });
    }
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});

// http://localhost:5000/run
