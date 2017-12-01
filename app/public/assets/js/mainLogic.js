var socket = io();
var activePlayer;
var previousPlayer;
var p1Info;
var p2Info;
var p3Info;
var p4Info;
var currentPosition;
var systemMessage;
var dbl = 0;
var newPosition;
var updateInfo;
var imgPosition;
var x ;
var y ;
var transaction;
/*get request sent to api routes requesting */
//yo yo what up dog?

function playersInfo(){
  $.get("/checkplayers").then(function(response){
    p1Info = response[0];
    p2Info = response[1];
    p3Info = response[2];
    p4Info = response[3];

    socket.emit("players", p1Info, p2Info, p3Info, p4Info);
    //prints information to player panels, should be able to clean this up somehow
    $("#user1Name").text(p1Info.user_name);
    $("#user1Piece").attr("src", p1Info.user_image);
    $("#user1Money").text(p1Info.user_money);

    $("#user2Name").text(p2Info.user_name);
    $("#user2Piece").attr("src", p2Info.user_image);
    $("#user2Money").text(p2Info.user_money);

    $("#user3Name").text(p3Info.user_name);
    $("#user3Piece").attr("src", p3Info.user_image);
    $("#user3Money").text(p3Info.user_money);

    $("#user-4").text(p4Info.user_name);
    $("#user4Piece").attr("src", p4Info.user_image);
    $("#user-4").text(p4Info.user_money);

  });
}
playersInfo();


//This function sets the turn to player one when the laster player logs in if it isn't already someones turn
function setActive(results){
  $.get("/checkactiveplayer").then(function(response){
    activePlayer = response[0];
    if(activePlayer === undefined){
      $.ajax({
        method: "PUT",
        url: "/setplayerone",
        data: {user:1}
      });
    }
});}
setActive();




/*==============================================================================
-------------------------Roll Dice----------------------------------------------
triggers on dice roll,
===============================================================================*/
//these functions trigger on the click of the dice button
$(".dice-btn").click(function(){
  rolldice();

});


function rolldice() {
  $.get("/checkactiveplayer").then(function(response){
    //sets local variable to the active players current position
    activePlayer = response[0];
    socket.emit("newPlayer", activePlayer);

    var currentLocation = response[0].pos_id;
    //removes the icon where the player was


    //determines value of first dice
     x = Math.floor(Math.random() * 6 + 1);

    //determines value of second dice
     y = Math.floor(Math.random() * 6 + 1);

    //combines die values
    var diceTotal = x + y;
    //add dice total to the users position prior to roll
    newPosition = currentLocation + diceTotal;

    //if roll exceeds 40, reduce it by 40
    if(newPosition > 40){
      newPosition -= 40;
      var announceInfo = {player:activePlayer.user_name};
      announceMessage("passingGo", announceInfo);
      var newTotal = activePlayer.user_money +=200;
      freeParking(newTotal);
    }
    //changes players position on database, passing in the users new position
    // updateMove(newPosition);


    //doubles calculation
    if (x == y) { //<----checking if there is a double
        dbl++; //<---increment double count
        if(dbl%3==0){

          dbl = 0;
        }else{

        }
    }
    //emits results to all players on server

    return newPosition;
}
)
.then((newPosition)=>updateMove(newPosition))
.then((newPosition)=>checkPosition(newPosition));
}

function updateMove(newPosition) {

  $.ajax({
      method: "PUT",
      url: "/playermove",
      data: {move:newPosition}
    }).done(function(){
      socket.emit("roll", newPosition, x, y, systemMessage, imgPosition);
    });
    return newPosition;
}

async function checkPosition(newPosition){
  var newData = await $.get("/checkcurrentplace/"+newPosition).then(function (data)
    {
        currentPosition = data[0];


        //player lands on unowned, purchaseable property
        if(currentPosition.c_owner === "bank" && currentPosition.rent != null){
          console.log("would you like to purchase this place?");
          announceMessage("move", data);
          //make the purchase button appear to the active player
        }

        //player lands on another players owned space
        if(currentPosition.c_owner != "bank"){
          //eventually check for active
          if(currentPosition.c_owner!= activePlayer.user_id){
            $.get("/calc/"+currentPosition.id_grp+"/"+currentPosition.c_owner).then(function(response){
              transaction = ((currentPosition.rent*response.length)/2);
              console.log("TRANSACTION");
              console.log(transaction);


              return transaction;})
              .then(function(transaction){
                console.log("TRANSACTION");
                console.log(transaction);
                $.get("/checkplayers")
                .then((response)=>payPlayers(response));
              });




          }else{
            console.log("YOU LANDED ON YOUR OWN PROPERTY");
            announceMessage("move", data);
          }

        }

        //player lands on chance
        if(currentPosition.pos_id ===8||currentPosition.pos_id ===23||currentPosition.pos_id ===37){
          // console.log("YOU HIT THE CHANCE!");
          $.get("/pullchance").then(function(response){
            var randomNumber = Math.floor(Math.random() * (response.length)+1);
            var randomChance = response[randomNumber-1];
            console.log(response);
            console.log(randomChance);
          });
          announceMessage("move", data);
        }

        //player lands on community chest
        if(currentPosition.pos_id ===3||currentPosition.pos_id ===18||currentPosition.pos_id ===34){
          // console.log("YOU HIT THE COMMUNITY!");
          $.get("/pullcommunity").then(function(response){
            var randomNumber = Math.floor(Math.random() * (response.length)+1);
            var randomCommunity = response[randomNumber-1];
            console.log(response);
            // console.log(randomCommunity);
          });
          announceMessage("move", data);
        }

        //playerlands on free parking
        if(currentPosition.pos_id ===21){
          var newTotal = activePlayer.user_money += 500;

          var announceInfo = {player:activePlayer.user_name};
          announceMessage("freeParking", announceInfo);

          updateInfo = {player:activePlayer.user_id, location:currentPosition.pos_id, money:newTotal};
          freeParking(newTotal);
        }
    });
}
function freeParking(newTotal) {
  $.ajax({
    method: "PUT",
    url: "/freeparking/"+activePlayer.user_id,
    data: {money:newTotal}
  })
  .then(function(){
      playersInfo();
  });}

  function payPlayers(response){
    console.log("YOU OWE A PLAYER "+transaction+"!");
    console.log(response);
    var loss = response[activePlayer.user_id -1].user_money -= transaction;
    var loser = response[activePlayer.user_id -1].user_name;
    var gain = response[currentPosition.c_owner -1].user_money += transaction;
    var winner = response[currentPosition.c_owner -1].user_name;
    console.log("=====LOSS/GAIN=====");
    console.log(loss);
    console.log(gain);
    var information ={loser:loser, winner:winner, amount:transaction};
    announceMessage("owePlayer", information);
    $.ajax({
      method: "PUT",
      url: "/playerPaysPlayer/"+activePlayer.user_id+"/"+currentPosition.c_owner,
      data: {gain:gain, loss:loss}
    });
  }
//socket listener logic.
socket.on('newPlayer', function(checkedActive){
  activePlayer = checkedActive;
});
socket.on('roll', function(newPosition, x, y, systemMessage, imgPosition){

  $(".player"+activePlayer.user_id).remove();
  imgPosition = $('<img class="player'+activePlayer.user_id+'"src="'+activePlayer.user_image+'">');
  // console.log(newPosition);
  // console.log(imgPosition);
  $("#p"+newPosition).append(imgPosition);
  if(x == 1){
    $("#dice-1 img").attr('src', "./assets/images/dice-sides/side1.jpg");
  }
  if(x == 2){
    $("#dice-1 img").attr('src', "./assets/images/dice-sides/side2.jpg");
  }
  if(x == 3){
    $("#dice-1 img").attr('src', "./assets/images/dice-sides/side3.jpg");
  }
  if(x == 4){
    $("#dice-1 img").attr('src', "./assets/images/dice-sides/side4.jpg");
  }
  if(x == 5){
    $("#dice-1 img").attr('src', "./assets/images/dice-sides/side5.jpg");
  }
  if(x == 6){
    $("#dice-1 img").attr('src', "./assets/images/dice-sides/side6.jpg");
  }
  if(y == 1){
    $("#dice-2 img").attr('src', "./assets/images/dice-sides/side1.jpg");
  }
  if(y == 2){
    $("#dice-2 img").attr('src', "./assets/images/dice-sides/side2.jpg");
  }
  if(y == 3){
    $("#dice-2 img").attr('src', "./assets/images/dice-sides/side3.jpg");
  }
  if(y == 4){
    $("#dice-2 img").attr('src', "./assets/images/dice-sides/side4.jpg");
  }
  if(y == 5){
    $("#dice-2 img").attr('src', "./assets/images/dice-sides/side5.jpg");
  }
  if(y == 6){
    $("#dice-2 img").attr('src', "./assets/images/dice-sides/side6.jpg");
  }
});

/*==============================================================================
-------------------------Purchase Property--------------------------------------
===============================================================================*/
$("#purchase").click(function(){
    payBank(newPosition);
});

function payBank(player){
  $.get("/checkcurrentplace/"+player).then(function(response){
    var location = response[0];
    var money = activePlayer.user_money -= location.rent;
    updateInfo = {player:activePlayer.user_id, location:location.pos_id, money:money};

    var announceInfo = {activePlayer:activePlayer.user_name, locationName:location.name, cost:location.rent};
        announceMessage("purchase", announceInfo);
        return updateInfo;
  }).then((updateInfo)=>updatePlayerInfo(updateInfo));

}

function updatePlayerInfo(updateInfo) {
  $.ajax({
    method: "PUT",
    url: "/player/"+updateInfo.player+"/"+updateInfo.location,
    data: {money:updateInfo.money,
    player:updateInfo.player}
  })
  .then(function(){
      playersInfo();
  });
}

/*==============================================================================
-------------------------Change the Active Player-------------------------------
===============================================================================*/

$(".end-btn").click(function(){
  endTurn();
});
//Invoke this function when you want the next player to be "active"
function endTurn(){
  // console.log("=====1=====");
  $.get("/checkactiveplayer").then(function(response){
    // activePlayer=response[0];
    // console.log("activeplayer");
    var players = {previous: response[0].user_id, active:response[0].user_id + 1};
    // previousPlayer = response[0].user_id;
    // activePlayer = response[0].user_id + 1;
    if(players.active === 5){
      players.active = 1;
    }
    var active = players.active;
    var previous = players.previous;
    console.log("===============================");
    console.log("===============================");
    console.log(active);
    console.log(previous);
    socket.emit("activeGreen", active, previous);
      return players;
    //this is 80% operational but behind by one player
  })
  .then(function (players){
    return activeOn(players);
  })
  .then(function(players, statusOn){
    return activeOff(players, statusOn);
  })
  // .then(function(statusOff){
  //   setActive(statusOff);
  // })
  .then(function(statusOff){
    announceMessage("turn", statusOff);

  });
}
function activeOn(current, statusCheck) {
  // console.log("=====2=====");
  // console.log(statusCheck);
  // console.log(current);
  $.ajax({
    method: "PUT",
    url: "/activeon",
    data: {current:current.active}
  }).then((status)=>{console.log(status.statuscode);});
  // console.log("current");
  //   console.log(current);
  return current;
}

function activeOff(previous, statusCheck) {
  // console.log("=====3=====");
  // console.log(statusCheck);
  // console.log(previous);
  $.ajax({
    method: "PUT",
    url: "/activeoff",
    data: {previous:previous.previous}
  });
}
socket.on("activeGreen", function(active, previous){
    $(".user-"+active).css("background-color", "#41994e");
<<<<<<< HEAD
    $(".user-"+previous).css("background-color","white");
=======
    $(".user-"+active).css("color", "white");
    $(".user-"+previous).css("background-color","white");
    $(".user-"+active).css("color", "black");
>>>>>>> workingBranch
    $(".user-btn:hover").css("background-color", "#41994e");


});
/*==============================================================================
-------------------------Pull Players Information-------------------------------
===============================================================================*/
//this function sets each variable as an object equal to the players db info


socket.on("players", function(p1Info, p2Info, p3Info, p4Info){

  $("#user1Name").text(p1Info.user_name);
  $("#user1Piece").attr("src", p1Info.user_image);
  $("#user1Money").text(p1Info.user_money);

  $("#user2Name").text(p2Info.user_name);
  $("#user2Piece").attr("src", p2Info.user_image);
  $("#user2Money").text(p2Info.user_money);

  $("#user3Name").text(p3Info.user_name);
  $("#user3Piece").attr("src", p3Info.user_image);
  $("#user3Money").text(p3Info.user_money);

  $("#user4Name").text(p4Info.user_name);
  $("#user4Piece").attr("src", p4Info.user_image);
  $("#user4Money").text(p4Info.user_money);
});

/*==============================================================================
 ---------------------------------Transfer money--------------------------------
 ===============================================================================*/


//transfer money from the active player to a single other player
$("#payPlayers").click(function(){
  if(activePlayer.user_money >= currentPosition.rent){
      payPlayer();
  }else{
      // console.log("you must mortage some of your property!");
  }
});



//makes a put request changing the player table and places table after property purchase


function payPlayer(position,player){}


// DICE BUTTON ON CLICK FUNCTION ============================================
//dice button onclick



// INFO BUTTON ON CLICK FUNCTION ============================================
// display and hide modal content for USER INSTRUCTIONS
$("#info-btn").click(function (){
  $("#info-modal").show(300);
});
// display and hide modal content for GAME RULES
$("#game-rules-btn").click(function (){
  $("#game-rules-modal").show(300);
});
//-------------------The start of the auctionhouse clusterfuck--------------------------
//-------------------------------------------------------------------------------------

// display and hide modal content for PROPERTY AUCTION HOUSE
var auctionGoing = false;
$("#auction-house-btn").click(function (){
  if(!auctionGoing){  //if there's not an ongoing auction
    $("#auction-house-modal").show(300);
    auctionGoing = true;
  }
  else{
    $("#auctionAction").show(300);
  }
});
$('#auction-house-btn').mouseover(function() {
$('.text').css("visibility","visible");
});
$('#auction-house-btn').mouseout(function() {
$('.text').css("visibility","hidden");
});
// Continued auctionhouse code for second auctionhouse screen
$("#post-btn").click(function (){
  $("#auction-house-modal").hide(300);
  $("#auctionAction").show(300);
  //pressing the post button hide the current modal and brings up a new one.
  //start the timer from 30
  var timeLeft = "0:30";
  //This will eventually be replacing every second
  $(".auctionEnd").html(timeLeft);
  //put in logic here to rewrite the modal
});
// This code will run as soon as the page loads
window.onload = function() {
  $(document).on("click","#bid-btn", stopwatch.start);
  $(document).on("click","#bid-btn", stopwatch.reset);
};

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

// Our stopwatch object
var stopwatch = {

  time: 30,

  reset: function() {           //this calls when someone bids
    if(stopwatch.time < 11){
      stopwatch.time = 10;
      // DONE: Change the .auctionEnd" div to "00:00."
      $(".auctionEnd").text("00:10");
    }
  },
  start: function() {

    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
        intervalId = setInterval(stopwatch.count, 1000);
        clockRunning = true;
    }

  },
  stop: function() {

    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  },
  count: function() {

    // DONE: decrement time by 1, remember we cant use "this" here.
    stopwatch.time--;

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.time);
    // console.log(converted);

    // DONE: Use the variable we just created to show the converted time in the .auctionEnd" div.
    $(".auctionEnd").text(converted);

    if(stopwatch.time < 1){
      //******************************This is where the logic gose for price sold! use currentBid
      clearInterval(intervalId);
      clockRunning = false;
      // console.log("The auction needs to stop here.");
      alert("SOLD!");
      auctionGoing = false; //end the auction logic
      currentBid = 0;     //set the bid vack to 0 for the next auction
      $(".inputField").html('<input type="text" id="bidAmount" placeholder=' + currentBid + '><button id="bid-btn">$BID</button>');
      stopwatch.time = 30;      //set the time back to 30 and rewrite the button and input field
      $("#auctionAction").hide(300);
      //change the modal back
    }
  },
  timeConverter: function(t) {

    var seconds = t;

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return "00:" + seconds;
  }
};



//This will eventually be set by the seller in the MIDDLE SCREEN
var currentBid = 0;      //A GLOBAL VARIABLE THAT SHOULD PROBABLY BE AT THE TOP

 $(document).on("click","#bid-btn",function() {     //TODO: This needs to include logic to check if the user has THAT much money to bid
  //define a newBid
  // console.log("bid-btn was pressed");
  var newBid = parseInt($("#bidAmount").val());//take the value from bid amount and save it to currentBid
  if(newBid > currentBid){  //checks if the users bid was more than the current bid
    currentBid = newBid;
    $(".inputField").html('<input type="text" id="bidAmount" placeholder=' + currentBid + '><button id="bid-btn">$BID</button>');
    // console.log("new bid is: " + currentBid);
  }
  else{
    $(".inputField").html('<input type="text" id="bidAmount" placeholder= "Minimum bid: ' + currentBid + '""><button id="bid-btn">$BID</button>');
  }
});
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
/*==============================================================================
 -------------------------------Announcer Messages------------------------------
 ===============================================================================*/
var text='<p>Oops, something went Wrong!</p>';
function announceMessage(type, position){
console.log("=====4=====");
  console.log("activePlayer");
  console.log(activePlayer);
  console.log("position");
  console.log(position);
  console.log("announceMessage");

// var information ={loser:loser, winner:winner, amount:transaction};
// announceMessage("owePlayer", information);

if(type==="purchase"){

  text = '<p>'+position.activePlayer+' has purchased '+position.locationName+' for $'+position.cost+'!</p>';
}
if(type==="move"){
  text = '<p>'+activePlayer.user_name+' landed on '+position[0].name+'!</p>';
}
if(type==="turn"){
  text = '<p>Its Now '+activePlayer+'s turn!</p>';
}
if(type==="freeParking"){
  text = '<p>'+position.player+' earned $500 for landing on Free Parking!</p>';
}
if(type==="passingGo"){
  text = '<p>'+position.player+' earned $200 for Passing Go!</p>';
}
if(type==="owePlayer"){
    text = '<p>'+position.loser+' owes '+position.winner +" $"+ position.amount+' for landing on their property!</p>';
}
 socket.emit("announcement", text);
 // console.log(systemMessage);

}
socket.on("announcement", function(text){
  var $chatHistory = $(".chat-history");
  systemMessage = $(
  '<div class="chat-message clearfix">'+
  '<img src="./assets/images/monopoly-man.jpg" alt="" width="32" height="32">'+
    '<div class="chat-message-content clearfix">'+
      '<span class="chat-time">'+'TIME'+'</span>'+
      '<h5>'+'MONOPOLY'+'</h5>'+
      text+
    '</div>'+
  '</div>'+
  '<br>');
  $chatHistory.animate({ scrollTop: $chatHistory[0].scrollHeight }, 'fast');
$(".chat-history").append(systemMessage);
});
// display and hide modal content for EXIT GAME
$("#end-game-btn").click(function (){
  $("#end-game-modal").show(300);
});
// close my modal (for EXIT GAME ONLY)
$("#no-end-game").click(function (){
  $("#end-game-modal").hide(300);
});
// close my modal (universal)
$(".close").click (function(){
  $(".modal").hide(300);
});

// CHATBOX FUNCTIONALITY ====================================================
(function() {
    $('#live-chat header').on('click', function() {
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');
    });
    $('.chat-close').on('click', function(e) {
        e.preventDefault();
        $('#live-chat').fadeOut(300);
    });
}) ();
// USER BUTTON ON CLICK FUNCTION ============================================
// user info panel drop down
var userInfo = $(".user-btn");
var i;
for (i = 0; i < userInfo.length; i++) {
  userInfo[i].onclick = function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  };
}
