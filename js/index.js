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

(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        return this; // for chaining...
    }
})(jQuery);

function showPopup() {
    swal({
        title: 'Welcome',
        text: 'The Game is simple, just keep pressing the ball',
        confirmButtonText: 'Start Game'
    }).then((result) => {
        if (result.value) {
        $('#start').goTo();
    }
})
}

document.getElementById("start-button").onclick = showPopup;

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
      from: { borderWidth: 0, borderColor: 'rgb(255, 28, 104, 1)' },
      to: { borderWidth: 30, borderColor: 'rgb(255, 28, 104, 0)' }
    }).start(ballBorder);

    ball.innerHTML = 'Tap';
  }
};

var checkWin = function checkWin() {
  if(ballY.get() > 0) {
      height.innerHTML = 0 + " m";
  }else{
      height.innerHTML = Math.ceil(ballY.get()*-1) + " m";
  }

    if(ballY.get() < -3000){
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
    from: { borderWidth: 0, borderColor: 'rgb(20, 215, 144, 1)' },
    to: { borderWidth: 30, borderColor: 'rgb(20, 215, 144, 0)' }
  }).start(ballBorder);
});
