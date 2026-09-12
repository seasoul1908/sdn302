import http from 'http';
import fs from 'fs';
import path from 'path';
import { readFile } from './file.js';
const hostname = "localhost";
const port = 8082;

http.createServer(function (request, response) {
    console.log(request.headers);
    if (request.method == 'GET') {
        var fileUrl;
        if (request.url == '/') fileUrl = '/index.html';
        else fileUrl = request.url;
        var filename = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filename);
        if (fileExt == '.html') {
            readFile(filename).then((data) => {
                response.setHeader('Content-Type', 'text/html');
                response.statusCode = 200;
                fs.createReadStream(filename).pipe(response);
            })
                .catch((err) => {
                    console.error('Error reading file:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                });
        }
    } else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        response.end('<html><body><h1>Error 404: ' + request.method + ' not supported.</h1></body></html>');
    }
}).listen(port);

console.log(`Server running at http://${hostname}:${port}/`);