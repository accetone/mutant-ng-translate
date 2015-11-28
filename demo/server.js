var http = require('http'),
    fs = require('fs');

var send404 = function(response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end();
};

var sendFile = function(response, file) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(file);
    response.end();
};

var sendFileWithDelay = function(response, file, delay) {
    setTimeout(function() {
        sendFile(response, file);
    }, delay);
};

var transformUrlToPath = function(url) {
    return url.replace(/\//g, '\\').substring(1);
};

var getFile = function(url) {
    var path = transformUrlToPath(url);

    if (path === '') path = 'index.html';

    if (!fs.existsSync(path)) {
        path = '..\\' + path;

        if (!fs.existsSync(path)) {
            return null;
        }
    }

    console.log(path);

    return fs.readFileSync(path);
};

http
    .createServer(function (request, response) {
        var file = getFile(request.url);

        if (file) {
            if (request.url.indexOf('first') !== -1) sendFileWithDelay(response, file, 5000);
            else if (request.url.indexOf('second') !== -1) sendFileWithDelay(response, file, 7000);
            else sendFile(response, file);
        }
        else send404(response);
    })
    .listen(2000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:2000/');