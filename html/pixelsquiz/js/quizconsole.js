function _send_command(cmd) {
    $.post('/actions/'+ cmd)

}

function send_command(ev) {
    _send_command($(ev.target).attr('id'));
}

$("#commands button").each(function (idx) {
    $(this).click(send_command);
})

$("#buzzed button").each(function (idx) {
    $(this).click(function (e) {
        _send_command($(e.target).attr('id'));
        $("#buzzed .buzzed-text").removeClass("text-highlight");
    });
})

function get_right_wrong(team) {
    /*var r = window.confirm('Team #'+ (team+1) +' got it right?');
    if (r) {
        _send_command('select-right');
    } else {
        _send_command('select-wrong');
    }*/
    $("#buzzed .buzzed-team").text(team + 1);
    $("#buzzed .buzzed-text").addClass("text-highlight");
}

var ws = null;

function start() {
    console.log('starting ws');
    ws = new WebSocket("ws://" + document.location.host +"/displays");
    ws.onopen = function (event) {
        ws.send(JSON.stringify({"kind": "quizmaster-auth"}))
    }
    ws.onmessage = function (event) {
        var msg = JSON.parse(event.data);
        console.log(event.data);
        if(msg.do === 'quizmaster-only') {
            if ('getrightwrong' in msg) {
                get_right_wrong(msg.getrightwrong);
            } else {
                $('#question').html(msg.text);
            }
        } else {
            if (msg.do === 'update-all' || msg.do === 'update-scores' || msg.do === 'update-lights') {
                $('#status').append(JSON.stringify(msg) + '\n');
            }
        }
    }
}

function check() {
    if(!ws || ws.readyState == 3) start();
}

check();

setInterval(check, 3000);
