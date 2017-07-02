//
// User Story: I am presented with a random series of button presses.
//
// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
//
// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
//
// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
//
// User Story: I can see how many steps are in the current series of button presses.
//
// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
//
// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
//
// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
$(document).ready(() => {
  var game = {
    status: false,
    start: false,
    array: [],
    player: [],
    ARRAY: [".green", ".red", ".yellow", ".blue"],
    strict: false,
    i: 0,
    ".green": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    ".red": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    ".yellow": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    ".blue": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    wrong: new Audio("https://www.myinstants.com//media/sounds/wrong-buzzer.mp3"),
    count: 1
  }

  game.ARRAY.forEach((el) => {
    let curEl = el;
    $(curEl).hover(() => {
      $(this).addClass("light");
    }, () => {
      $(this).removeClass("light");
    })
  })

  var start = () => {
    game.status = true;
    game.start = false;
    game.count = 1;
    game.array = [];
    game.player = [];
    game.strict = false;
    game.i = 0;
    clearPlayer();
    $(".count").removeClass("led-off")
  }

  var newGame = () => {

    game.start = true;
    game.count = 1;
    game.array = [];
    game.player = [];
    game.i = 0;
    $(".count").html("--");
    if (game.start === true && game.status === true) {
      generateMove();
    }
  }

  var generateMove = () => {
    game.array.push(game.ARRAY[Math.floor(Math.random() * 4)]);
    displayMove();
  }

  var displayMove = () => {
    $(".count").html(numDisplay(game.count));
    game.i = 0;
    game.ARRAY.forEach((el) => {
      $(el).addClass("unclickable");
    })
    var moves = setInterval(function() {
      if (game.i >= game.array.length) {
        clearInterval(moves);
        setTimeout(() => {
          game.ARRAY.forEach((el) => {
            $(el).removeClass("unclickable").addClass("clickable");
          })
        }, 100)
      } else {
        delay(game.array[game.i]);
        game[game.array[game.i]].play();
        game.i++;
      }
    }, 1000)
    clearPlayer();
  }
  var clearPlayer = () => {
    game.player = [];
  }

  var check = () => {
    var lastEl = game.player.length - 1;
    if (game.player[lastEl] !== game.array[lastEl]) {
      game.wrong.play();
      $(".count").html("!!");
      setTimeout(() => {
        if (game.strict == false) {
          displayMove();
        } else {
          newGame();
        }
      }, 2300)
    } else {
      if (lastEl === game.array.length - 1) {
        setTimeout(() => {
          game.count++;
          generateMove();
        }, 800)
        if (lastEl === 20) {
          $(".count").html("WIN");
          setTimeout(() => {
            start();
          }, 3000)
        }
      }
    }
  }

  var delay = (a) => {
    $(a).addClass("light");
    setTimeout(() => {
      $(a).removeClass("light");
    }, 500);
  };

  var strictMode = () => {
    if (game.strict == false) {
      game.strict = true;
      $("#mode-led").addClass("led-on");
    } else {
      game.strict = false;
      $("#mode-led").removeClass("led-on");
    }
  }

  var turnOff = () => {
    game.status = true;
    game.start = false;
    game.count = 1;
    game.array = [];
    game.player = [];
    game.strict = false;
    game.i = 0;
    clearPlayer();
    game.status = false;
    $(".count").addClass("led-off");
    $(".count").html("--");
  }

  var numDisplay = (a) => {
    if (a < 10) {
      var number = "0" + String(a);
      return number;
    } else {
      return a;
    }
  }
  $(".sw-slot").on("click", () => {
    if (game.status === false) {
      $(".switch").addClass("sw-on");
      start();
    } else {
      $(".switch").removeClass("sw-on");
      turnOff();
    }
  })
  $("#start").on("click", () => {
    newGame();
  })
  $("#mode").on("click", () => {
    strictMode();
  })
  game.ARRAY.forEach((el) => {
    $(el).on("click", () => {
      game.player.push(el);
      game[el].play();
      check();
    })
  })
  game.ARRAY.forEach((el) => {
    $(el).hover(() => {
      $(el).addClass("light")
    }, () => {
      $(el).removeClass("light")
    })
  })
});
