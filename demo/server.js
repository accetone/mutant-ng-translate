var http = require('http'),
    fs = require('fs');

http
    .createServer(function (request, response) {
        response.writeHead(200, { 'Content-Type': 'text/html' });

        var filename = request.url;

        if (filename === '/favicon.ico') {
            response.end();
            return;
        }
        if (filename === '/') filename = 'index.html';
        else filename = '..' + filename;

        fs.readFile(filename, function (error, filecontent) {
                if (error) throw error;

                response.write(filecontent);
                response.end();
            }
        );
    })
    .listen(2000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:2000/');