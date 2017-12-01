console.log("connected to lobby.js");
$(document).ready(function(){

  $.get("/api/user_data").then(function(data) {
    console.log("get request 1");
  var user = data.username;
      $(".member-email").text(data.email);
      $(".member-username").text(data.username);
      return user;
    }).then((user)=>addPlayer(user))
      .then(()=>changeAvailablePlayer());



});

function addPlayer(user){
  console.log("ajax put request 2");
$.ajax({
  method: "PUT",
  url: "/addplayer",
  data: {user:user}
});
}

function changeAvailablePlayer(){
  $.get("/checkactiveplayer").then(function(response){
    console.log("================================");
    console.log(response);
    console.log("================================");
    // console.log(response[0]);

     var on = response[0].user_id + 1;
    // if(on === 5){
    //   on = 1;
    // }
    return on;
  }).then(function (on){
    activeOn(on);
    var off = on-=1;
    return off;
  }).then(function(off){
    activeOff(off);
  });}

    //this is 80% operational but behind by one player

//
  function activeOn(current) {
    console.log(current);
    $.ajax({
      method: "PUT",
      url: "/activeon",
      data: {current:current}
    });
  }
  function activeOff(previous) {
    console.log(previous);
    $.ajax({
      method: "PUT",
      url: "/activeoff",
      data: {previous:previous}
    });
  }
