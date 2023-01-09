const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const languageFileExtension = {
    cpp: "cpp",
    python: "py",
    py: "py",
};

const generateFile = async (language, code) => {
    const jobID = uuid();
    const fileName = `${jobID}.${languageFileExtension[language]}`;

    const filePath = path.join(dirCodes, fileName);

    await fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = {
    generateFile,
};
