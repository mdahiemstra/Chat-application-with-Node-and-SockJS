/**
 * APPLICATION
 */
var App = function() {

    this.userJoin = function (username) {

        $('#login').hide();
        $('#chat, #input').show();
    }
};

$(function() {

    var app = new App();
    var chat = new Chat(app);

    $('#userdata').submit(function() {

        var login = chat.login($('#login').find('[name=username]').val(), false);

        return false;
    });
});