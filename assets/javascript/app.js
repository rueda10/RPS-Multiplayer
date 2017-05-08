const PLAYER_ONE = "one";
const PLAYER_TWO = "two";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDcDOiYlITEcGDYmK0LHIVkKnU00e4QD-0",
  authDomain: "fir-intro-37300.firebaseapp.com",
  databaseURL: "https://fir-intro-37300.firebaseio.com",
  projectId: "fir-intro-37300",
  storageBucket: "fir-intro-37300.appspot.com",
  messagingSenderId: "682482871209"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var currentPlayer;
var turn = 1;
var choiceMade = false;
var playerOneName;
var playerTwoName;

database.ref().on("value", function(snapshot) {
  console.log(snapshot.val());
  if (snapshot.val() === null) {
    // No players
    // Player 1 section: prompt for name
    // Player 2 section: prompt for name
    // message: sign in/sign in
    database.ref().set({
      players: null
    });
  } else if (snapshot.val().players.player1 != undefined &&
             snapshot.val().players.player2 === undefined) {
               // player 1 entered name and signed in, player 2 has not signed in yet
               // Player 1 section: show player's name
               // Player 2 section: prompt for name
               // message: Player 1 ...waiting on player 2
               // message: Player 2 ...please sign in
               if (currentPlayer === PLAYER_ONE) {
                 // PLAYER ONE WINDOW
                 $("#message-bar").html("Waiting on a player to join in...");
                 $("#player-two-form").addClass("hidden");
               } else {
                 // PLAYER TWO WINDOW
                 $("#player-one-label").html(snapshot.val().players.player1.name);
                 $("#player-one-form").addClass("hidden");
                 $("#message-bar").html("Player 1 has signed in. Please sign in as Player 2.");
               }
  } else if (snapshot.val().players.player2 != undefined &&
             snapshot.val().players.player1 === undefined) {
               // player 2 entered name and signed in, player 1 has not signed in yet
               // Player 2 section: show player's name
               // Player 1 section: prompt for name
               // message: Player 2 ...waiting on player 1
               // message: Player 1 ...please sign in
               if (currentPlayer === PLAYER_TWO) {
                 // PLAYER TWO WINDOW
                 $("#message-bar").html("Waiting on a player to join in...");
                 $("#player-one-form").addClass("hidden");
               } else {
                 // PLAYER ONE WINDOW
                 $("#player-two-label").html(snapshot.val().players.player2.name);
                 $("#player-two-form").addClass("hidden");
                 $("#message-bar").html("Player 2 has signed in. Please sign in as Player 1.");
               }
  } else if (snapshot.val().players.player1.choice != undefined &&
             snapshot.val().players.player2.choice === undefined) {
               var playerOneChoice = snapshot.val().players.player1.choice;

               if (currentPlayer === PLAYER_ONE) {
                 $("#message-bar").html("You chose " + playerOneChoice + ". Waiting on Player 2");
               } else {
                 $("#message-bar").html("Player 1 made their choice. You're up " + snapshot.val().players.player2.name);
               }
  } else if (snapshot.val().players.player2.choice != undefined &&
             snapshot.val().players.player1.choice === undefined) {
               var playerOneChoice = snapshot.val().players.player2.choice;

               if (currentPlayer === PLAYER_TWO) {
                 $("#message-bar").html("You chose " + playerTwoChoice + ". Waiting on Player 1");
               } else {
                 $("#message-bar").html("Player 2 made their choice. You're up " + snapshot.val().players.player1.name);
               }
  } else if (snapshot.val().players.player1.choice != undefined &&
             snapshot.val().players.player2.choice != undefined) {
              var playerOneChoice = snapshot.val().players.player1.choice;
              var playerTwoChoice = snapshot.val().players.player2.choice;
              var playerOneWins = snapshot.val().players.player1.wins;
              var playerOneLosses = snapshot.val().players.player1.losses;
              var playerTwoWins = snapshot.val().players.player2.wins;
              var playerTwoLosses = snapshot.val().players.player2.losses;

              database.ref().child("players").child("player1").child("choice").remove();
              database.ref().child("players").child("player2").child("choice").remove();

              if (playerOneChoice === playerTwoChoice) {
                // DRAW
                $("#message-bar").html("DRAW! You both chose " + playerTwoChoice);
              } else if ((playerOneChoice === "rock" && playerTwoChoice === "paper") ||
                         (playerOneChoice === "paper" && playerTwoChoice === "scissors") ||
                         (playerOneChoice === "scissors" && playerTwoChoice === "rock")) {
                           // PLAYER TWO WINS
                           playerTwoWins++;
                           playerOneLosses++;
                           $("#message-bar").html("Player 2 (" + snapshot.val().players.player2.name + ") wins! " + playerTwoChoice + " beats " + playerOneChoice);
                           database.ref().child("players").child("player2").update({
                             wins: playerTwoWins
                           });
                           database.ref().child("players").child("player1").update({
                             losses: playerOneLosses
                           });
              } else {
                // PLAYER ONE WINS
                playerOneWins++;
                playerTwoLosses++;
                $("#message-bar").html("Player 1 (" + snapshot.val().players.player1.name + ") wins! " + playerOneChoice + " beats " + playerTwoChoice);
                database.ref().child("players").child("player1").update({
                  wins: playerOneWins
                });
                database.ref().child("players").child("player2").update({
                  losses: playerTwoLosses
                });
              }

              $("#player-one-wins").html(playerOneWins);
              $("#player-two-wins").html(playerTwoWins);
              $("#player-one-losses").html(playerOneLosses);
              $("#player-two-losses").html(playerTwoLosses);

              if (currentPlayer === PLAYER_ONE) {
                var item = createResultHand(playerTwoChoice);

                $("#player-two-choice").empty();
                $("#player-two-choice").append(item);
                $("#player-two-choice").removeClass("hidden");
              } else if (currentPlayer === PLAYER_TWO) {
                var item = createResultHand(playerOneChoice);

                $("#player-one-choice").empty();
                $("#player-one-choice").append(item);
                $("#player-one-choice").removeClass("hidden");
              }

              turn++;

              setTimeout(function() {
                playerOneName = snapshot.val().players.player1.name;
                playerTwoName = snapshot.val().players.player2.name;
                readyToPlay(playerOneName, playerTwoName);
              }, 5000);
  } else if (snapshot.val().players.player1 != undefined &&
             snapshot.val().players.player2 != undefined) {
               // both players are signed in
               // player 1 section: display RPS
               // player 2 section: display RPS
               // message: just names
               playerOneName = snapshot.val().players.player1.name;
               playerTwoName = snapshot.val().players.player2.name;
               readyToPlay(playerOneName, playerTwoName);
  }

});

database.ref().child("chat").on("child_added", function(snapshot) {
  var player = snapshot.val().player;
  var message = snapshot.val().message;
  var timestamp = snapshot.val().timestamp;

  if (player === PLAYER_ONE) {
    addChatEntry(player, playerOneName, message, timestamp);
  } else if (player === PLAYER_TWO) {
    addChatEntry(player, playerTwoName, message, timestamp);
  }
});

function readyToPlay(playerOneName, playerTwoName) {
  $(".wins-losses").removeClass("hidden");
  $("#chat-box").removeClass("hidden");
  $("#player-one-choice").addClass("hidden");
  $("#player-two-choice").addClass("hidden");
  $("#player-one-label").html(playerOneName);
  $("#player-two-label").html(playerTwoName);
  if (currentPlayer === PLAYER_ONE) {
    $("#player-one-form").addClass("hidden");
    $("#player-one-options").removeClass("hidden");
    $("#message-bar").html("Choose Rock, Paper or Scissors");
  } else if (currentPlayer === PLAYER_TWO) {
    $("#player-two-form").addClass("hidden");
    $("#player-two-options").removeClass("hidden");
    $("#message-bar").html("Choose Rock, Paper or Scissors");
  }
}

/**
 * Player two enters a name and clicks the Start button
 */
$("#player-one-button").on("click", function(event) {
  event.preventDefault();
  var name = $("#player-one-name").val().trim();
  $("#player-one-name").val("");

  if (name != "") {
    currentPlayer = PLAYER_ONE;
    $("#player-one-label").html(name);
    $("#player-one-form").addClass("hidden");

    database.ref().child("players").update({
      player1: {
        name: name,
        wins: 0,
        losses: 0
      }
    });
  }
});

/**
 * Player two enters a name and clicks the Start button
 */
$("#player-two-button").on("click", function(event) {
  event.preventDefault();
  var name = $("#player-two-name").val().trim();
  $("#player-two-name").val("");

  if (name != "") {
    currentPlayer = PLAYER_TWO;
    $("#player-two-label").html(name);
    $("#player-two-form").addClass("hidden");

    database.ref().child("players").update({
        player2: {
          name: name,
          wins: 0,
          losses: 0
        }
    });
  }
});

$(".rps-option").on("click", function() {
  var player = $(":first-child", this).attr("player");
  var hand = $(":first-child", this).attr("hand");

  var item = createResultHand(hand);

  database.ref().child("players").update({
    turn: turn
  });

  if (player === PLAYER_ONE) {
    database.ref().child("players").child("player1").update({
      choice: hand
    });
    $("#player-one-options").addClass("hidden");
    $("#player-one-choice").empty();
    $("#player-one-choice").append(item);
    $("#player-one-choice").removeClass("hidden");
  } else if (player === PLAYER_TWO) {
    database.ref().child("players").child("player2").update({
      choice: hand
    });
    $("#player-two-options").addClass("hidden");
    $("#player-two-choice").empty();
    $("#player-two-choice").append(item);
    $("#player-two-choice").removeClass("hidden");
  }
});

function createResultHand(hand) {
  var item = $('<i class="fa" aria-hidden="true">');

  if (hand === "rock") {
    item.addClass("fa-hand-rock-o");
  } else if (hand === "paper") {
    item.addClass("fa-hand-paper-o");
  } else if (hand === "scissors") {
    item.addClass("fa-hand-scissors-o");
  }

  return item;
}

$("#btn-chat").on("click", function() {
  var message = $("#btn-input").val();
  $("#btn-input").val("");
  var timestamp = moment().format("h:mm:ss");

  database.ref().child("chat").push({
    player: currentPlayer,
    timestamp: timestamp,
    message: message
  });
});

function addChatEntry(player, playerName, message, timestamp) {
  var li = $('<li class="clearfix">');
  var span = $('<span class="chat-img">');
  var img = $('<img class="img-circle" alt="User Avatar">');
  var chatBody = $('<div class="chat-body clearfix">');
  var header = $('<div class="header">');
  var strong = $('<strong class="primary-font">');
  strong.html(playerName);
  var small = $('<small><span class="glyphicon glyphicon-time"> ' + timestamp + '</small>');
  var par = $('<p>');
  par.html(message);

  if (player === PLAYER_ONE) {
    li.addClass("left");
    span.addClass("pull-left");
    img.attr("src", "http://placehold.it/50/55C1E7/fff&text=P1");
    small.addClass("pull-right text-muted");
  } else if (player === PLAYER_TWO) {
    li.addClass("right");
    span.addClass("pull-right");
    img.attr("src", "http://placehold.it/50/FA6F57/fff&text=P2");
    small.addClass("text-muted");
    strong.addClass("pull-right");
  }

  li.append(span);
  span.append(img);
  li.append(chatBody);
  chatBody.append(header);
  if (player === PLAYER_ONE) {
    header.append(strong);
    header.append(small);
  } else if (player === PLAYER_TWO) {
    header.append(small);
    header.append(strong);
  }
  chatBody.append(par);
  $("ul.chat").append(li);
}

/**
 * Remove player when leaving the page or reloading
 */
$(window).on('beforeunload', function() {
  playerLeaving();
});

$(window).on('unload', function() {
  playerLeaving();
});

function playerLeaving() {
  if (currentPlayer === PLAYER_ONE) {
    database.ref().child("players").child("player1").remove();
  } else if (currentPlayer === PLAYER_TWO) {
    database.ref().child("players").child("player2").remove();
  }
  database.ref().child("players").child("turn").remove();
  database.ref().child("chat").remove();
}
