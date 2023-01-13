const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

const executePython = ([filepath, inputFilePath]) => {
    return new Promise((resolve, reject) => {
        exec(
            `python3 ${filepath} ${inputFilePath}`,
            (error, stdout, stderr) => {
                if (error) reject({ error, stderr });
                if (stderr) reject({ stderr });
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executePython,
};
