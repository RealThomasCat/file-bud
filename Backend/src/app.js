import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/*
    -> Configure application to use CORS middleware.

    -> Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism
    that allows a server to indicate any origins(domain, scheme, or port)
    other than its own from which a browser should permit loading resources.

    -> credentials: true -> Configures the Access-Control-Allow-Credentials CORS header.
    This header tells browsers whether the server allows cross-origin HTTP requests to include credentials.
    Credentials are cookies, TLS client certificates, or authentication headers containing a username and password.
*/
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

/*
    -> Configure the Express application to parse incoming JSON request bodies,
    but only if they are 16 KB or smaller. This helps prevent denial-of-service (DoS)
    attacks by limiting the size of the request body that the server will accept.
*/
app.use(express.json({ limit: "16kb" }));

// Configure the Express application to parse requests with URL-encoded payloads
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// Configure Express.js application to serve static files from the "public" directory.
// Any files placed in this directory will be accessible via HTTP requests.
app.use(express.static("public"));

// Configure application to use the cookie-parser middleware.
// Used to set and access cookies in the client's browser.
app.use(cookieParser());

// ROUTES IMPORT

import userRouter from "./routes/user.routes.js";
import fileRouter from "./routes/file.routes.js";
import folderRouter from "./routes/folder.routes.js";

// ROUTES DECLARATION

app.use("/api/v1/users", userRouter); // Give control to userRouter for any routes starting with /users
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/folders", folderRouter);

export { app };
