import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import stubs from "./defaultStubs";
import "./App.css";

const editorOptions = {
    scrollBeyondLastLine: false,
    fontSize: "14px",
    folding: false,
    // lineDecorationsWidth: 15,
};

const inputOptions = {
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: "14px",
    lineDecorationsWidth: 5,
};
const outputOptions = {
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: "14px",
    lineDecorationsWidth: 5,
};

function App() {
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");
    const [input, setInput] = useState("// enter input here");
    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("");
    const [jobId, setJobId] = useState("");
    const [jobDetails, setJobDetails] = useState(null);
    const [editorMode, setEditorMode] = useState("vs-dark");
    const [languageIcon, setLanguageIcon] = useState("./resources/python.png");

    useEffect(() => {
        setCode(stubs[language]);
        setOutput("// output");
        setLanguageIcon(`./resources/${language}.png`);
    }, [language]);

    const toggleTheme = (idName) => {
        let currentClassName = document.getElementById(idName).className;
        let newClassName = currentClassName;
        if (currentClassName === idName + "-dark")
            newClassName = idName + "-light";
        else newClassName = idName + "-dark";
        document.getElementById(idName).className = newClassName;
    };

    const handleThemeChange = () => {
        if (editorMode === "vs-light") setEditorMode("vs-dark");
        else setEditorMode("vs-light");
        toggleTheme("App");
        toggleTheme("header");
        toggleTheme("app-name");
        toggleTheme("language-button");
        const themeToggler = document.getElementById("theme-icon");
        let classNames = themeToggler.classList;
        if (classNames.contains("theme-icon-light")) {
            classNames.replace("theme-icon-light", "theme-icon-dark");
            classNames.replace("fa-sun", "fa-moon");
        } else {
            classNames.replace("theme-icon-dark", "theme-icon-light");
            classNames.replace("fa-moon", "fa-sun");
        }
    };

    const handleSubmit = async () => {
        const payload = {
            language: language,
            code: code,
            input: input,
        };
        try {
            setJobId("");
            setStatus("Running");
            setJobDetails(null);
            setOutput(`Code Execution Status: Running`);
            const { data } = await axios.post(
                "http://localhost:5000/run",
                payload
            );
            // console.log(data);
            setJobId(data.jobId);

            let intervalId;

            intervalId = setInterval(async () => {
                setStatus("Running");
                setOutput(`Code Execution Status: Running`);
                const { data: dataRes } = await axios.get(
                    "http://localhost:5000/status",
                    { params: { id: data.jobId } }
                );
                const { success, job, error } = dataRes;
                if (success) {
                    // console.log(dataRes);
                    setJobDetails(job);
                    // console.log(jobDetails);
                    const { status: jobStatus, output: jobOutput } = job;
                    setStatus(jobStatus);
                    if (jobStatus === "Running") {
                        setOutput(`Code Execution Status: Running`);
                        return;
                    } else if (jobStatus === "Success") {
                        setOutput(
                            `Code Execution Status: ${jobStatus}\n\n${jobOutput}`
                        );
                    } else {
                        const errorObject = JSON.parse(jobOutput);
                        // console.log(errorObject);
                        setOutput(
                            `Code Execution Status: ${jobStatus}\n\n${errorObject.stderr}`
                        );
                    }
                    clearInterval(intervalId);
                } else {
                    console.log(dataRes);
                    setStatus("Error !!! ");
                    console.error(error);
                    setOutput(error);
                    clearInterval(intervalId);
                }
            }, 1000);
        } catch ({ response }) {
            if (response) {
                const errorMessage = response.data.err.stderr;
                setOutput(errorMessage);
            } else {
                setOutput("Error connecting to server!");
            }
        }
    };

    return (
        <div id="App" className="App-dark">
            <div id="header" className="header-dark">
                <h3 id="app-name" className="app-name-dark">
                    <i className="fas fa-solid fa-cube" aria-hidden="true"></i>
                    &nbsp; Online Code Runner
                </h3>

                <div className="nav-right-options">
                    <i
                        id="theme-icon"
                        className="fas fa-solid fa-sun fa-2x nav-icons theme-icon-light"
                        aria-hidden="true"
                        onClick={handleThemeChange}
                    ></i>

                    <i
                        className="fas fa-solid fa-swatchbook tutorial-icon nav-icons fa-2x"
                        aria-hidden="true"
                    ></i>
                </div>
            </div>

            <div className="secondary-nav-items">
                <button className="btn logo-btn" disabled={true}>
                    <img
                        src={require(`${languageIcon}`)}
                        className="image"
                        alt={`${language} icon`}
                    />
                </button>
                <button id="language-button" className="language-button-dark">
                    <select
                        value={language}
                        onChange={(e) => {
                            setStatus("");
                            setJobDetails(null);
                            setLanguage(e.target.value);
                            setCode(stubs[e.target.value]);
                            setLanguageIcon(`./resources/${language}.png`);
                        }}
                    >
                        <option value={"python"}>Python</option>
                        <option value={"cpp"}>C++</option>
                    </select>
                </button>
                {/* run button */}
                <button className="btn run-btn" onClick={handleSubmit}>
                    <i
                        className="fas fa-play fa-fade run-icon"
                        aria-hidden="true"
                    ></i>
                    &nbsp; Run
                </button>
            </div>

            <div className="editor">
                <Editor
                    height="100%"
                    width="100%"
                    theme={editorMode}
                    defaultLanguage={language}
                    defaultValue={code}
                    value={code}
                    onChange={(e) => setCode(e)}
                    options={editorOptions}
                    language={language}
                />
            </div>
            <div className="std-input-output">
                <div className="std-input">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// enter input here"}
                        value={input}
                        options={inputOptions}
                        onChange={(e) => setInput(e)}
                    />
                </div>
                <div className="std-output">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// output"}
                        value={output}
                        options={outputOptions}
                    />
                </div>
            </div>
            <br />
        </div>
    );
}

export default App;
