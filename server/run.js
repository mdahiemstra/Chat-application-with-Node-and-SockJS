var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer();

var users = [];

echo.on('connection', function(conn) {

    conn.on('data', function(data) {

        try {
            data = JSON.parse(data);

            switch (data.method) {

                case "login":

                    console.log('DEBUG - USER JOINED: '+data.payload.username);

                    users.push(data.payload.username);

                    conn.write(JSON.stringify({"response": {"method":"login", "code": 1, "success":true}, "payload": {"username":data.payload.username}}));
                break;

                case "userlist":
                    var userlist = users.join(';');
                    conn.write(JSON.stringify({"response": {"method":"userlist", "code": 1, "success":true}, "payload": {"list": userlist}}));
                break;
            }

        } catch (Exception) {

            console.log('Invalid data received');
        }
    });

    conn.on('close', function() {});
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/chat'});
server.listen(5000, 'localhost');