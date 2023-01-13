const Queue = require("bull");
const Job = require("./models/Job");
const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");

const jobQueue = new Queue("job-queue");

const WORKERS = 5;

jobQueue.process(WORKERS, async ({ data }) => {
    // console.log(data);
    const { id: jobId } = data;
    const job = await Job.findById(jobId);
    if (job === undefined) {
        throw Error("Job not found");
    } else {
        // console.log("Fetched Job: ", job);
        let output;
        try {
            job["startedAt"] = new Date();
            job["status"] = "Running";
            if (job.language === "cpp") {
                output = await executeCpp([job.filepath, job.inputFilePath]);
            } else {
                output = await executePython([job.filepath, job.inputFilePath]);
            }

            job["completedAt"] = new Date();
            job["status"] = "Success";
            job["output"] = output;

            await job.save();
        } catch (err) {
            job["completedAt"] = new Date();
            job["status"] = "Error";
            job["output"] = JSON.stringify(err);

            await job.save();
        }

        return true;
    }
});

jobQueue.on("failed", (error) => {
    console.log(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobId) => {
    await jobQueue.add({ id: jobId });
};

module.exports = {
    addJobToQueue,
};
