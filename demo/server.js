var http = require('http'),
    fs = require('fs');

http
    .createServer(function(request, response) {
        if (request.url === '/favicon.ico') {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end();
            return;
        }

        var filename = request.url;
        if (filename === '/') filename = 'index.html';

        try {
            var filecontent = fs.readFileSync(filename);

            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(filecontent);
            response.end();
        } catch (e) {}

        try {
            var filecontent = fs.readFileSync('..' + filename);

            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(filecontent);
            response.end();
        } catch (e) {}
    })
    .listen(2000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:2000/');