var Chat = function() {

    this.socket = new SockJS('http://localhost:5000/chat');
    this.username = false;

    this.login = function(username, callback) {

        if (!this.username && username != '') {

            this.username = username;

            return this.server({"method": "login", "payload": {"username": this.username}});
        }
    };

    this.message = function (message) {

        if (message != '' && message.length > 2) {

            return this.server({"method": "send_message", "payload": message});
        }
    }

    this.server = function(data) {

        this.socket.send(JSON.stringify(data));
    };
};