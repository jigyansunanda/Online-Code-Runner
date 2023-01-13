<h1 align="center">Online Code Runner</h1>

<p align="center">Welcome. This is an online text editor, that runs code in <code>C++</code> and <code>Python</code>.</p>
<img src="https://github.com/jigyansunanda/Online-Code-Runner/blob/master/media/app-screengrab.png" height="70%" width="100%" >

<h3 align="center">How to use</h4>

-   To try the code runner locally, download the codebase.
-   Make sure you have following installed in your system: `react`, `NodeJS`, `Mongodb`, `Redis` and `Bull`. I have also used `nodemon` for help in development while working in `NodeJS`.
-   To run the client-written code in their corresponding languages, you need to have `GCC` compiler and `python` installed in your machine.

Then follow the below guide to start (client) frontend and server (backend) part of the application.

<h3 align="center">Activate Client side</h4>

-   Open Terminal
-   Go to `client` directory inside the project codespace
-   Write `npm start`. This will open the client side build with react on `port:3000` on your local machine

<h3 align="center">Activate Server side</h4>

-   Open Terminal
-   Go to `backend` directory inside the project codespace
-   Write `npm run`. If you have the above mentioned entities installed on your machine, you should be able to see a log of `Listening on port 5000` and `Successfully connected to Mongodb database` on terminal window.
-   Optional: If you have `nodemon` installed on your machine, then you can use `npm run dev` instead of `npm run`. This will keep the backend in check on any changes made by you, and refresh the server accordingly.

<h3 align="center">Change programming language</h3>
<p align="center">
<img src="https://github.com/jigyansunanda/Online-Code-Runner/blob/master/media/language-selection.gif" height="30%" width="60%">
</p>

<h3 align="center">Code exceution status</h3>
<p align="center">
<img src="https://github.com/jigyansunanda/Online-Code-Runner/blob/master/media/execution-status.gif" height="30%" width="60%">
</p>

<h3 align="center">Switch theme</h3>
<p align="center">
<img src="https://github.com/jigyansunanda/Online-Code-Runner/blob/master/media/theme-switch.gif" height="70%" width="100%">
</p>
