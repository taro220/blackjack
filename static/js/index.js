$(document).ready(function(){

  function connect_socket (token) {
    var socket = io.connect('', {
      query: 'token=' + token
    });

    socket.on('connect', function () {
      console.log('authenticated');
      $("#Join").hide();



      $("#joining").html("");
      // socket.emit("msg" : {msg:"hello"})
    }).on('disconnect', function () {
      socket.emit("disconnecting");
      console.log('disconnected');
    });
    socket.on("new_user", function(data){
      console.log(`${data.newPlayer.name} hello`)
      if(data.other_players.length > 0){
        for(var each in data.other_players){
          console.log(data.other_players[each])
          $(".black_jack_table").append(`<div class="row player ${data.other_players[each].id}">` +
            `<div class="row player_name ${data.other_players[each].id}" id='${data.other_players[each].id}'>` +
              `<h4 class="col-sm-2">${data.other_players[each].name}</h4>` +
              `<h4 class="col-sm-3">Money: $<span class="money">${data.other_players[each].money}</span></h4>` +
            `</div>` +
            `<div class="row ${data.other_players[each].id}">` +
            `<ul class="cards ${data.other_players[each].id}">` +
              `<li class="col-sm-3"><img src="cards-png/Clubs2.png">` +
              `<li class="col-sm-3"><img src="cards-png/Diamonds3.png">` +
            `</ul>` +
            `</div>` +
            // `<div class="row ${data.other_players[each].id}">` +
            // `<ul class="buttons ${data.other_players[each].id}">` +
            //   `<li class="col-sm-3"><button class="btn-primary" id="Hit">Hit</button></li>` +
            // `</ul>` +
            // `</div>` +
          `</div>`
          );
        }
      }

      $(".black_jack_table").append(`<div class="row player">` +
        `<div class="row player_name">` +
          `<h4 class="col-sm-2">${data.newPlayer.name}</h4>` +
          `<h4 class="col-sm-3">Money: $${data.newPlayer.money}</h4>` +
        `</div>` +
        `<div class="row">` +
        `<ul class="my-cards cards">` +
          `<li class="col-sm-3"><img src="cards-png/Clubs2.png">` +
          `<li class="col-sm-3"><img src="cards-png/Diamonds3.png">` +
        `</ul>` +
        `</div>` +
        `<div class="row">` +
        `<ul class="my-buttons buttons">` +
          `<li class="col-sm-3"><button class="btn-primary" id="Hit">Hit</button></li>` +
        `</ul>` +
        `</div>` +
      `</div>`
      );

      $(".dealer_table").append(`<div class="row dealer">` +
        `<div class="row dealer">` +
          `<h4 class="col-sm-2">Dealer</h4>` +
        `</div>` +
        `<div class="row">` +
        `<ul class="dealer-cards cards">` +
          `<li class="col-sm-3"><img src="cards-png/Clubs2.png">` +
          `<li class="col-sm-3"><img src="cards-png/b1fv.png">` +
        `</ul>` +
        `</div>` +
        `<div class="row">` +
        `<ul class="dealer-buttons buttons">` +
          `<li class="col-sm-3"><button class="btn-primary" id="start">Start</button></li>` +
        `</ul>` +
        `</div>` +
      `</div>`
      );

      $('#start').click(function(){
        console.log("start pressed");
        socket.emit("start_round");
        });



    })

    socket.on("other_player", function(data){
      console.log(`${data.msg} hello`)
      $(".black_jack_table").append(`<div class="row player ${data.other_players}" id='${data.other_players}'>` +
        `<div class="row player_name ${data.other_players}">` +
          `<h4 class="col-sm-2">${data.msg}</h4>` +
          `<h4 class="col-sm-3">Money: $1000</h4>` +
        `</div>` +
        `<div class="row ${data.other_players}">` +
        `<ul class="cards ${data.other_players}">` +
          `<li class="col-sm-3"><img src="cards-png/Clubs2.png">` +
          `<li class="col-sm-3"><img src="cards-png/Diamonds3.png">` +
        `</ul>` +
        `</div>` +
        // `<div class="row ${data.other_players}">` +
        // `<ul class="buttons ${data.other_players}">` +
        //   `<li class="col-sm-3"><button class="btn-primary" id="Hit">Hit</button></li>` +
        // `</ul>` +
        // `</div>` +
      `</div>`
      );
    })

    socket.on("player_left", function(data){
      $(`.${data.delete_player_id}`).empty()
      $(`.${data.delete_player_id}`).remove()
    })

    socket.on("betting_phase", function(){
      $(".my-buttons").html(`<li><label for="name"><button type="button" class="players_bet">Bet</button></label><input type="number" name="bet-amount" ></li>`);
      $(".dealer-buttons").html("");

      $('.players_bet').click(function(){
        console.log("im placing a bet")
        console.log($(`#bet-amount`).val(), "betamount")
        socket.emit("placing_bet", {bet_amount : $(`#bet-amount`).val()})
      })
    });

    socket.on("someone_placed_a_bet", function(data){
      console.log(`${data.betInfo.id} someone placed a bet`)
      $(`#${data.betInfo.id} .money`).html(`${data.betInfo.other_players_money}`)
    });

  }


  $('#joining').submit(function (e) {
    e.preventDefault();
    console.log("logingPressed")
    $.post('/login', {
      name: $('#name').val()
    }).done(function (result) {
      console.log("calling socket connection")
      connect_socket(result.token);
    });
  });

});
