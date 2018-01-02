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
var scoreButton = document.querySelector('.score-button');
var highscore = localStorage['highscore'] || 0;
var won = false;

(function ($) {
    $.fn.goTo = function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        return this; // for chaining...
    }
})(jQuery);


$( document ).ready(function() {
    if(highscore != 0) {
        scoreButton.innerHTML = 'Highscore: ' + highscore + ' m';
    }
})

function showPopup() {
    swal({
        title: 'Welcome',
        text: 'The Game is simple, just keep pressing the ball... But you also need to scroll',
        confirmButtonText: 'Start Game'
    }).then((result) => {
        if (result.value) {
        $('#start').goTo();
    }
})}

function showAboutPopup() {
    swal(
        'About: Tap The Ball',
        'Version 1.1.3<br>by Pascal Andermatt',
        'question'
    )}

function showHighscorePopup() {
    var info = 'You never reached the top :(';
    if(localStorage['highscore-count']){
        info = 'You reached the top with ' + localStorage['highscore-count'] + ' taps';
    }

    swal({
        title: 'Highscore',
        type: 'info',
        html: 'Your Highscore: ' + highscore + ' m <br>' + info,
        confirmButtonText: 'Great!'
    })}

document.getElementById("start-button").onclick = showPopup;
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

    if(highscore < ballHeight){
        highscore = ballHeight;
        localStorage['highscore'] = highscore;
        scoreButton.innerHTML = 'Highscore: ' + ballHeight + ' m';
    }

    if (ballY.get() < -3000 && won == false) {
        won = true;
        bestCount = localStorage['highscore-count'] || 1000;
        if(count < bestCount) {
            localStorage['highscore-count'] = count;
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
});
