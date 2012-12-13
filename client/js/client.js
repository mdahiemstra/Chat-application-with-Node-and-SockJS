var App = function(Chat) {

    this.initialize = function () {

        $('#userdata').submit(function() {

            Chat.login($('#login').find('[name=username]').val());

            return false;
        });
    }

    this.showChat = function (payload) {

        $('#login').hide();
        $('#chat, #input').show();

        $('#message_form').submit(function() {

            Chat.message($('#message_form').find('[name=message_text]').val());

            $('#message_form').find('[name=message_text]').val('');

            return false;
        });
    }

    this.userJoined = function (payload) {
        $('#users ul').append('<li id="user_'+payload.id+'">'+payload.username+'</li>');
        $('#messages').append('<li>'+payload.username+' joined on '+new Date()+'</li>');
    }

    this.userLeft = function (payload) {
        $('#users ul #user_'+payload.id).remove();
        $('#messages').append('<li>'+payload.username+' left</li>');
    }

    this.chatMessage = function (payload) {
        $('#messages').append('<li><span class="user">'+payload.username+':</span> '+payload.body+'</li>');
    }

    /**
     * Handle callbacks send by the SockJS server
     *
     * @param  object payload
     * @return void
     */
    Chat.socket.onmessage = function(payload) {

        data = JSON.parse(payload.data);

        switch (data.response.method) {
            case "login":
                this.showChat(data.response.payload);
            break;

            case "user_joined":
                this.userJoined(data.response.payload);
            break;

            case "user_left":
                this.userLeft(data.response.payload);
            break;

            case "message_received":
                this.chatMessage(data.response.payload);
            break;
        }
    }.bind(this);
};

/**
 * Start application
 */
$(function() {
    var ChatServer = new Chat();
    var app = new App(ChatServer);

    app.initialize();
});