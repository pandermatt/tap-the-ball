var _window$popmotion = window.popmotion,
    easing = _window$popmotion.easing,
    physics = _window$popmotion.physics,
    spring = _window$popmotion.spring,
    tween = _window$popmotion.tween,
    styler = _window$popmotion.styler,
    listen = _window$popmotion.listen,
    value = _window$popmotion.value,
    transform = _window$popmotion.transform;
var pipe = transform.pipe,
    clampMax = transform.clampMax;


var ball = document.querySelector('.ball');
var score = document.querySelector('.score');
var height = document.querySelector('.height');
var warningTop = document.querySelector('.warning');
var scoreButton = document.querySelector('#score-button');
var modeButton = document.querySelector('#mode-button');
var area = document.querySelector('.area');
var highscore = localStorage['highscore0'] || 0;
var won = false;
var modeText;
var mode = localStorage['mode'] || 0;

var player1 = new Tone.Player({
    "url": "audio/Andreas_Theme.mp3",
    "loop": true
}).toMaster();

var player2 = new Tone.Player({
    "url": "audio/Miami_Nights_-_Extended_Theme.mp3",
    "loop": true
}).toMaster();

var player3 = new Tone.Player({
    "url": "audio/Jet_Fueled_Vixen.mp3",
    "loop": true
}).toMaster();

var players = [player1, player2, player3];

var synth = new Tone.PolySynth(6, Tone.Synth, {
    "oscillator": {
        "partials": [0, 2, 3, 4],
    }
}).toMaster();

(function ($) {
    $.fn.goTo = function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        return this; // for chaining...
    }
})(jQuery);


$(document).ready(function () {
    mode = mode - 1;
    switchMode();
    if (highscore !== 0) {
        scoreButton.innerHTML = 'Highscore: ' + highscore + ' m';
    }
});

function showStartPopup() {
    swal({
        title: 'Welcome',
        text: 'The Game is simple, just keep pressing the ball... But you also need to scroll',
        confirmButtonText: 'Start Game'
    }).then((result) => {
        if (result.value) {
            $('#start').goTo();
        }
    })
}

function switchMode() {
    if (typeof players[mode] !== "undefined") {
        players[mode].stop();
    }

    mode = mode + 1;
    if (mode > 2) {
        mode = 0;
    }
    switch (mode) {
        case 0:
            modeText = 'Easy';
            highscore = localStorage['highscore0'] || 0;
            gravity.setAcceleration(2500);
            area.style.background = 'linear-gradient(179deg, rgba(0, 0, 0, 1) 0%, rgba(2, 30, 70, 1) 15%, rgba(23, 56, 105, 1) 34%, rgba(45, 79, 153, 1) 56%, rgba(91, 148, 229, 1) 79%, rgba(181, 213, 248, 1) 100%)';
            break;
        case 1:
            modeText = 'Hard';
            highscore = localStorage['highscore1'] || 0;
            gravity.setAcceleration(4000);
            area.style.background = 'linear-gradient(200deg, #0f9b0f, #23074d)';
            break;
        case 2:
            modeText = 'Impossible';
            highscore = localStorage['highscore2'] || 0;
            gravity.setAcceleration(6000);
            area.style.background = 'linear-gradient(170deg, #ea384d, #000)';
            break;
    }

    if (highscore > 0) {
        scoreButton.innerHTML = 'Highscore: ' + highscore + ' m';
    } else {
        scoreButton.innerHTML = '';
    }

    players[mode].autostart = true;

    if (players[mode].loaded) {
        players[mode].start();
    }

    localStorage['mode'] = mode;
    modeButton.innerHTML = 'Mode: ' + modeText;
}

function showAboutPopup() {
    swal({
        title: 'About: Tap The Ball',
        html: 'Version 1.2.2<br>by Pascal Andermatt <br><br>' +
        '<style>.bmc-button img{vertical-align: middle !important;}.bmc-button{text-decoration: none; !important;display:inline-block !important;padding:5px 10px !important;color:#FFFFFF !important;background-color:#000000 !important;border-radius: 3px !important;border: 1px solid transparent !important;font-size: 26px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;-webkit-transition: 0.3s all linear !important;transition: 0.3s all linear !important;margin: 0 auto !important;font-family:"Cookie", cursive !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0 4px 16px 0 rgba(190, 190, 190,.45) !important;box-shadow: 0 4px 16px 0 rgba(190, 190, 190,.45) !important;opacity: 0.85 !important;color:#FFFFFF !important;}</style><link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/pandermatt"><img src="BMC-btn-logo.svg" alt="BMC logo"><span style="margin-left:5px">Buy me a coffee</span></a>' +
        '<br><br><b>Music</b><p><i>"Andreas Theme", "Jet Fueled Vixen", "Miami Nights - Extended Theme"</i><br>' +
        'Kevin MacLeod (<a href="http://incompetech.com" target="_blank">incompetech.com</a>)<br>' +
        'Licensed under Creative Commons: By Attribution 3.0<br>' +
        '<a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">http://creativecommons.org/licenses/by/3.0/</a></>',
        type: 'question',
        confirmButtonText: 'Close'
    })
}

function showHighscorePopup() {
    var info = 'You never reached the top :(';
    if (localStorage['highscore-count' + mode]) {
        info = 'You reached the top with ' + localStorage['highscore-count' + mode] + ' taps';
    }

    swal({
        title: 'Highscore',
        type: 'info',
        html: 'Your Highscore: ' + localStorage['highscore' + mode] + ' m <br>' + info,
        confirmButtonText: 'Great!'
    })
}

document.getElementById("start-button").onclick = showStartPopup;
document.getElementById("mode-button").onclick = switchMode;
document.getElementById("score-button").onclick = showHighscorePopup;
document.getElementById("about-button").onclick = showAboutPopup;

var ballStyler = styler(ball);
var ballY = value(0, function (v) {
    return ballStyler.set('y', Math.min(0, v));
});
var ballScale = value(1, function (v) {
    ballStyler.set('scaleX', 1 + (1 - v));
    ballStyler.set('scaleY', v);
});
var count = 0;
var isFalling = false;

var ballBorder = value({
    borderColor: '',
    borderWidth: 0
}, function (_ref) {
    var borderColor = _ref.borderColor,
        borderWidth = _ref.borderWidth;
    return ballStyler.set({
        boxShadow: '0 0 0 ' + borderWidth + 'px ' + borderColor
    });
});

var checkBounce = function checkBounce() {
    if (!isFalling || ballY.get() < 0) return;

    isFalling = false;
    var impactVelocity = ballY.getVelocity();
    var compression = spring({
        to: 1,
        from: 1,
        velocity: -impactVelocity * 0.01,
        stiffness: 800
    }).pipe(function (s) {
        if (s >= 1) {
            s = 1;
            compression.stop();

            if (impactVelocity > 20) {
                isFalling = true;
                gravity.set(0).setVelocity(-impactVelocity * 0.5);
            }
        }
        return s;
    }).start(ballScale);
};

var checkFail = function checkFail() {
    if (ballY.get() >= 0 && ballY.getVelocity() !== 0 && ball.innerHTML !== 'Tap') {
        count = 0;
        tween({
            from: {borderWidth: 0, borderColor: 'rgb(255, 28, 104, 1)'},
            to: {borderWidth: 30, borderColor: 'rgb(255, 28, 104, 0)'}
        }).start(ballBorder);

        won = false;
        ball.innerHTML = 'Tap';
    }
};

var checkWin = function checkWin() {
    var userTop = 3000 - $(window).scrollTop();
    var userBottom = 3000 - $(window).height() - $(window).scrollTop();
    var ballHeight = Math.ceil(ballY.get() * -1);
    if (ballY.get() > 0) {
        ballHeight = 0;
    }

    height.innerHTML = ballHeight + " m";

    if (userTop < 2600) {
        if (ballHeight > userTop) {
            warningTop.innerHTML = "SCROLL UP";
        } else if (ballHeight < (userBottom - 100)) {
            warningTop.innerHTML = "SCROLL DOWN";
        } else {
            warningTop.innerHTML = "";
        }
    } else {
        warningTop.innerHTML = "";
    }

    if (highscore < ballHeight) {
        highscore = ballHeight;
        localStorage['highscore' + mode] = highscore;
        scoreButton.innerHTML = 'Highscore: ' + ballHeight + ' m';
    }

    if (ballY.get() < -3000 && won === false) {
        won = true;
        bestCount = localStorage['highscore-count' + mode] || 1000;
        if (count < bestCount) {
            localStorage['highscore-count' + mode] = count;
        }
        swal(
            'You reached the end',
            'Score: ' + count,
            'success'
        )
    }
};

var gravity = physics({
    acceleration: 2500,
    restSpeed: false
}).start(function (v) {
    ballY.update(v);
    checkBounce(v);
    checkFail(v);
    checkWin(v);
});

listen(ball, 'mousedown touchstart').start(function (e) {
    e.preventDefault();
    var tone = 100 + (count * 5);
    synth.triggerAttack(tone);

    count++;
    ball.innerHTML = count;
    score.innerHTML = "Score: " + count;

    isFalling = true;
    ballScale.stop();
    ballScale.update(1);

    gravity.set(Math.min(0, ballY.get())).setVelocity(-1200);

    tween({
        from: {borderWidth: 0, borderColor: 'rgb(20, 215, 144, 1)'},
        to: {borderWidth: 30, borderColor: 'rgb(20, 215, 144, 0)'}
    }).start(ballBorder);

    setTimeout(function () {
        synth.triggerRelease(tone);
    }, 50);
});
