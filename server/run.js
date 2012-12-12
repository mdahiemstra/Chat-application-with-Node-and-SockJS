var http = require('http'),
    sockjs = require('sockjs'),
    echo = sockjs.createServer(),
    clients = {},
    users = {};

function broadcast (message, exclude) {
    for ( var i in clients ) {
        if ( i != exclude ) clients[i].write( JSON.stringify(message) );
    }
}

echo.on('connection', function(conn) {

    clients[conn.id] = conn;

    conn.on('data', function(data) {

        try {
            data = JSON.parse(data);

            switch (data.method) {

                case "login":

                    console.log('DEBUG - USER JOINED: '+data.payload.username);

                    users[conn.id] = data.payload.username;

                    conn.write(JSON.stringify({"response": {"method":"login", "code": 1, "success":true, "payload": {"username":data.payload.username}}}));

                    broadcast({"response": {
                        "method": "user_joined",
                        "payload": {
                            "id": conn.id,
                            "username": data.payload.username
                        }
                    }});
                break;

                case "send_message":
                    broadcast({"response": {
                        "method": "message_received",
                        "payload": {
                            "username": users[conn.id],
                            "body": data.payload
                        }
                    }});
                break;
            }

        } catch (Exception) {

            console.log('Invalid data received', data);
        }
    });

    conn.on('close', function() {
        delete clients[conn.id];
        delete users[conn.id];

        broadcast({"response": {
            "method": "user_left",
            "payload": {
                "id": conn.id
            }
        }});
    });
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/chat'});
server.listen(5000, 'localhost');