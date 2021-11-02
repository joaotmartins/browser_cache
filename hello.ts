import { RequestListener, createServer } from 'http';
const fs = require('fs').promises;

const host : string = "localhost";
const port : number = 8080;

const requestListener: RequestListener = function (req, res) {

    switch(req.url) {
        case "/regular":
            if (req.headers["if-none-match"] === "1234") {
                console.log("Got cache query, answering 304");
                res.setHeader("ETag", "1234");
                res.writeHead(304);
                res.end();
            } else {
                console.log("Got regular query");
                res.setHeader("ETag", "1234");
                res.setHeader("Cache-Control", "public");
                res.writeHead(200);
                res.end('{ "obj": "value" }')
            }
            break;
        case "/":
            res.writeHead(200);
            res.end("First server!\n");
            break;
        case "/client":
            fs.readFile(__dirname + "/client.html")
            .then((contents: any) => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(contents);
            })
            .catch((err: any) => {
                res.writeHead(500);
                res.end(err);
                return;
            });
            break;
        default:
            res.writeHead(200);
            res.end("Default reply");
    }
}

const server = createServer(requestListener);

server.listen(port, host);
