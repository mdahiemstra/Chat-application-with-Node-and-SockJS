var Chat = function(Client) {

    this.socket = new SockJS('http://localhost:5000/chat');
    this.username = false;

    this.login = function(username, callback) {

        if (!this.username && username != '') {

            this.sock({"method": "login", "payload": {"username": username}}, this.login);
        }

        if (callback) {

            if (callback.response.success == true) {

                this.username = callback.payload.username;

                $('#login').hide();
                $('#chat, #input').show();

                //Client.userJoin(this.username);
            }
        }
    };

    this.sock = function(data, callback) {

        var response = false;

        this.socket.send(JSON.stringify(data));

        this.socket.onmessage = function(payload) {

            response = JSON.parse(payload.data);

            if (callback)
                callback(false, response);
        }

        return data;
    }
};