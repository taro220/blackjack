$(document).ready(function(){
'use strict';
class Player{
  constructor(name,pos){
    this.name = name;
    this.position = pos;
    this.hand = [];
    this.splitHand = [];
    this.did_Split = false;
    this.did_Bust = false;
    this.did_Hit = false;
    this.can_doubleDown = false;
    this.did_doubleDown = false;
    this.has_Hit = false;
    this.sideBet = 0;
    this.handValue = 0;
    this.money = 1000;
    this.currBet = 10;

  }
  bet(){
    this.money -= this.currBet;
    var playerHtmlIdx = `#player${this.position}Money`
    $(playerHtmlIdx).html(`${this.name}: $${this.money}`)
    var playerBetHTMLIdx = `#player${this.position}currBet`
    $(playerBetHTMLIdx).html(`Current Bet: ${this.currBet}`)
    return 10;
  }
  take_sideBet(amount){
    this.sideBet = amount;
    this.money -= amount;
    var playerHtmlIdx = `#player${this.position}Money`
    $(playerHtmlIdx).html(`${this.name}: $${this.money}`)
    var playerBetHTMLIdx = `#player${this.position}sideBet`
    $(playerBetHTMLIdx).html(`Side Bet: ${this.sideBet}`)
  }
  printHand(){
    for(let i in this.hand){
      let card = this.hand[i];
      console.log(`${this.name} has ${card.getName()} of ${card.getSuit()}`)
    }
  }
  countHand(){
    var possibleSums = [0];
    var max = possibleSums[0];
    var minOver = 22;
    for(let j in this.hand){
      if(this.hand[j].getName() == "Ace"){
        possibleSums.push.apply(possibleSums,possibleSums);
        for(let i = 0; i < possibleSums.length/2; i++){
          // if(possibleSums[i] <= 21)
            possibleSums[i] += 1;
        }
        for(let i = possibleSums.length/2; i < possibleSums.length; i++){
          // if(possibleSums[i] <= 21)
            possibleSums[i] += 11;
        }
      } else {
        for(let i = 0; i < possibleSums.length; i++){
          // if(possibleSums[i] <= 21)
            possibleSums[i] += this.hand[j].getNumerical_value();
        }
      }
    }
    console.log(possibleSums);
    for (let i in possibleSums){
      if(possibleSums[i]-21 > 0 && possibleSums[i] < minOver){
          minOver = possibleSums[i];
      }
      if(possibleSums[i] <= 21 && possibleSums[i] > max){
          max = possibleSums[i];
      }
    }
    console.log("minOver",minOver,"max",max)
    if (max === 0){
      this.handValue = minOver;
      console.log(this.handValue)
    return minOver;
    } else {
      this.handValue = max;
    return max;
    }
  }
  checkForDoubleDown(){
    var hand = this.handValue;
    if (hand >= 9 && hand <= 11){
      this.can_doubleDown = true;
      return true;
    }
    return false;
  }
  getCard(card){
    this.hand.push(card);
    console.log(`${this.name} got ${card.getName()} of ${card.getSuit()}`)
    var handVal = this.countHand();
    var playerCardHTMLIdx = `#player${this.position}Cards`
    if(!card.faceUp){
      $(playerCardHTMLIdx).append(`<l1><img src="cards-png/b1fv.png"></li>`)
    } else {
    $(playerCardHTMLIdx).append(`<l1><img src="${card.image}"></li>`)
    }
    var playerHandValueHTMLIdx = `#player${this.position}HandValue`
    console.log(`hand val is ${handVal}`)
    $(playerHandValueHTMLIdx).html(`Hand Value: ${handVal}`)
  }

}

class Dealer extends Player{
  constructor(name){
    super(name);
    this.did_Bust = false;
  }

  getCard(card){
    this.hand.push(card);
    console.log(`${this.name} got ${card.getName()} of ${card.getSuit()}`)
    var handVal = this.countHand();
    if(!card.faceUp){
      $(".dealerCards").append(`<l1><img src="cards-png/b1fv.png"></li>`)
    } else {
    $(".dealerCards").append(`<l1><img src="${card.image}"></li>`)
    // console.log(`hand val is ${handVal}`)
    // $("#dealerHandValue").html(`Hand Value: ${handVal}`)
    }
  }

  showDealerHand(){
    console.log("showing Dealers card")
    $(".dealerCards").html(``);
    for(var card in this.hand){
      this.hand[card].faceUp = true;
      $(".dealerCards").append(`<l1><img src="${this.hand[card].image}"></li>`)
    }
  }
}



// Ace, 3, Ace, Ace
//possibleSums = [1,11], [4,14], [5,15,15,25], [6,16,16,26,16,26,26,36]


class Card{
  constructor(name,suit,numerical_value){
    var name = name;
    var suit = suit;
    var numerical_value = numerical_value;
    this.image = `cards-png/${suit}${name}.png`
    this.faceUp = true;
    this.getName = () => {
      return name;
    }
    this.getSuit = () => {
      return suit;
    }
    this.getNumerical_value = () => {
      return numerical_value;
    }
    this.printCard = () => {
      console.log(`${name} of ${suit}`);
    }
  }
}



class Deck{
  constructor(num_of_decks){
    this.deck = [];
    this.num_of_decks = num_of_decks
    this.makeDeck();
  }

  makeDeck(){
    this.deck = []
    var suits = ['Spades','Hearts','Clubs','Diamonds'];
    var names = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
    var numerical_values = [1,2,3,4,5,6,7,8,9,10,10,10,10];
    for (var i = 0; i < 13 * this.num_of_decks; i++){
      for (var j = 0; j < 4; j++){
        const card = new Card(names[i],suits[j],numerical_values[i]);
        this.deck.push(card);
      }
    }
  }

  printDeck(){
    for (var each in this.deck){
      // console.log(`${this.deck[each].getName()} of ${this.deck[each].getSuit()}`);
      this.deck[each].printCard();
    }
  }

  shuffleDeck(){
    var i = 0;
    var j = 0;
    var temp = null;
    for (i = this.deck.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = this.deck[i]
      this.deck[i] = this.deck[j]
      this.deck[j] = temp
      }
  }

  resetDeck(){
    this.deck = [];
    this.makeDeck();
  }

  dealCard(){
    return this.deck.pop();
  }

}

class Round{
  constructor(playersList,dealer,deck){
    this.whosTurn = 0;
    this.deck = deck;
    this.dealer = dealer;
    this.hasWinner = false;
    this.currentPlayers = [];
    this.can_Insure = false;
    this.nextPlayer = () =>{
      this.whosTurn++;
    }
    console.log("round is constructed. dealer name is ", this.dealer.name)
    for (var idx in playersList){
      this.currentPlayers.push(playersList[idx]);
    }
  }

  finishDealersHand(){
    console.log("finish the dealers hand because dealer has", this.dealer.handValue);
    while(this.dealer.handValue < 17){
        this.dealer.getCard(this.deck.dealCard());
    }
    console.log("dealers final hand because dealer is", this.dealer.handValue);
  }

  resetRound(){
    this.whosTurn = 0;
    this.dealer.hand = [];
    this.dealer.handValue = 0;

  for (let player in this.currentPlayers){
    this.currentPlayers[player].bet();
    this.currentPlayers[player].hand = [];
    this.currentPlayers[player].splitHand = [];
    this.currentPlayers[player].did_Split = false;
    this.currentPlayers[player].did_Bust = false;
    this.currentPlayers[player].did_Hit = false;
    this.currentPlayers[player].can_doubleDown = false;
    this.currentPlayers[player].did_doubleDown = false;
    this.currentPlayers[player].has_Hit = false;
    this.currentPlayers[player].sideBet = 0;
    this.currentPlayers[player].handValue = 0;
    console.log(player);
  }
  }

  initialDeal(){
    this.resetRound();
    for(let j = 0; j < this.currentPlayers.length; j++){
      this.currentPlayers[j].getCard(this.deck.dealCard());
    }
    this.dealer.getCard(this.deck.dealCard());
    for(let j = 0; j < this.currentPlayers.length; j++){
      this.currentPlayers[j].getCard(this.deck.dealCard());
    }
    var dealers2ndCard = this.deck.dealCard();
    dealers2ndCard.faceUp = false;
    this.dealer.getCard(dealers2ndCard);
    this.checkForInsurance();
    this.playersTurn();
  }

  checkForInsurance(){
    if (this.dealer.hand[0].getName() === "Ace"){
      this.can_Insure= true;
      return true;
    }
    return false;
  }

  payOut(){
    for(var each in this.currentPlayers){
      if(this.currentPlayers[each].handValue > this.dealer.handValue && this.currentPlayers[each].handValue <= 21){
        this.currentPlayers[each].money += this.currentPlayers[each].currBet + this.currentPlayers[each].sideBet
      }
    }
  }


  playersTurn(callBack){
    if(callBack === undefined){
      var update = this.nextPlayer;
    } else {
      update = callBack;
    }
    var self = this;
    var playersHandValue = this.currentPlayers[this.whosTurn].handValue;
    var activePlayer = `player${this.whosTurn}`;
    console.log(`it is ${this.currentPlayers[this.whosTurn].name}s turn`);
    console.log(self.currentPlayers.length)

    if (playersHandValue == 21){

      $('#'+activePlayer+"stay").show();
    } else {
    if (this.currentPlayers[this.whosTurn].checkForDoubleDown() && this.currentPlayers[this.whosTurn].did_doubleDown == false){
      $('#'+activePlayer+"double").show();
    }
    if (this.can_Insure){
      $('#'+activePlayer+"insure").show();
    }
    if (playersHandValue < 21){
    $('#'+activePlayer+"hit").show();
    }

    $('#'+activePlayer+"stay").show();
    }

    $('#'+activePlayer+"double").click(function(){
      self.currentPlayers[self.whosTurn].take_sideBet(self.currentPlayers[self.whosTurn].currBet*2);
      $('#'+activePlayer+"hit").hide();
      var hiddenCard = self.deck.dealCard();
      hiddenCard.faceUp = false;
      self.currentPlayers[self.whosTurn].getCard(hiddenCard);
      $(this).hide();
    });

    $('#'+activePlayer+"hit").click(function(){
      if (self.currentPlayers[self.whosTurn].handValue < 21){
      $('#'+activePlayer+"insure").hide();
      $('#'+activePlayer+"double").hide();
      console.log("value at hit",self.currentPlayers[self.whosTurn].handValue)
      self.currentPlayers[self.whosTurn].getCard(self.deck.dealCard());
      if (self.currentPlayers[self.whosTurn].handValue > 21){
        $(this).hide();
        $('#'+activePlayer+"stay").hide()
        $('#'+activePlayer+"bust").show()
      } else if (self.currentPlayers[self.whosTurn].handValue == 21){
        $(this).hide();
      }
      }
    });

    $("#"+activePlayer+"stay").click(function(){
      console.log(`it is ${self.currentPlayers[self.whosTurn].name}s stay`);
      $('#'+activePlayer+"insure").hide();
      $('#'+activePlayer+"double").hide();
      $('#'+activePlayer+"hit").hide();
      $(this).hide();

      if(self.whosTurn < self.currentPlayers.length-1){
      update();
      self.playersTurn(update);
      } else {
        self.dealer.showDealerHand();
        self.finishDealersHand();
        self.payOut();
        $("#newRound").show();
      }
    });

    $('#'+activePlayer+"bust").click(function(){
      $('#'+activePlayer+"insure").hide();
      $('#'+activePlayer+"double").hide();
      $('#'+activePlayer+"hit").hide();
      $(this).hide();
      if(self.whosTurn < self.currentPlayers.length-1){
      self.whosTurn++;
      self.playersTurn();
      } else {
        self.dealer.showDealerHand();
        self.finishDealersHand();
        self.payOut();
        $("#newRound").show();
      }
    });


  }


}

/*
    for (let player in this.currentPlayers){
      this.takeBets(player, this.playersList[player].bet());
    }
    for(let i = 0; i < 2; i++){
      for(let j = 0; j < this.playersList.length; j++){
        this.playersList[j].getCard(this.deck.dealCard());
      }
      this.dealer.getCard(this.deck.dealCard());
    }
  }

  takeBets(player,betAmount){
    this.playersList[player].currBet = betAmount;
  }*/


class BlackJack{
  constructor(){
    this.minBet = 10;
    this.dealer = new Dealer("Dealer");
    this.dealerBust = false;
    this.playersList = [];
    this.deck;
    this.num_of_decks = 1;
  }
  startGameWithPlayers(playersList){
    for(let each in playersList){
      this.playersList.push(playersList[each])

      $("#players").append('<div class="playersGUI">'
        +     `<span id="player${each}Money">${playersList[each].name}: $${playersList[each].money}</span>`
        +     '<ul id="testGUI">'
        +       `<div class="playersCards" id="player${each}Cards">`
        +       '</div>'
        +       '<div class="playersButtons">'
        +         '<ul>'
        +           `<li><label for="name">Bet:</label><input type="number" name="bet" id="player${each}bet"></li>`
        +           `<li><button type="button" id="player${each}bet" class="player${each}">Bet</button></li>`
        +           `<li><button type="button" id="player${each}hit" class="player${each}">Hit</button></li>`
        +           `<li><button type="button" id="player${each}stay" class="player${each}">Stay</button></li>`
        +           `<li><button type="button" id="player${each}double" class="player${each}">Double Down</button></li>`
        +           `<li><button type="button" id="player${each}insure" class="player${each}">Insurance</button></li>`
        +           `<li><button type="button" id="player${each}bust" class="player${each}">Bust</button></li>`
        +         '</ul>'
        +           `<span id="player${each}HandValue" class="bet_labels">(Delete this)Hand Value: </span>`
        +           `<span id="player${each}currBet" class="bet_labels">Current Bet: </span>`
        +           `<span id="player${each}sideBet" class="bet_labels">Side Bet: </span>`
        +       '</div>'
        +     '</ul>'
        +   '</div>')

        this.hideButtons()


    }
    this.deck = new Deck(this.num_of_decks);
    this.deck.shuffleDeck();
    // this.deck.printDeck();
  }
  hideButtons(){
    for (var each in this.playersList){
      var playerB = `.player${each}`
      $(playerB).hide();
    }
  }

  clearBoard(){
    for (var each in this.playersList){
      $(`#player${each}Cards`).html("")
    // $("#players").append('<div class="playersGUI">'
    //   +     `<span id="player${each}Money">${this.playersList[each].name}: $${this.playersList[each].money}</span>`
    //   +     '<ul id="testGUI">'
    //   +       `<div class="playersCards" id="player${each}Cards"">`
    //   +       '</div>'
    //   +       '<div class="playersButtons">'
    //   +         '<ul>'
    //   +           `<li><label for="name">Bet:</label><input type="number" name="bet" id="player${each}bet"></li>`
    //   +           `<li><button type="button" id="player${each}bet" class="player${each}">Bet</button></li>`
    //   +           `<li><button type="button" id="player${each}hit" class="player${each}">Hit</button></li>`
    //   +           `<li><button type="button" id="player${each}stay" class="player${each}">Stay</button></li>`
    //   +           `<li><button type="button" id="player${each}double" class="player${each}">Double Down</button></li>`
    //   +           `<li><button type="button" id="player${each}insure" class="player${each}">Insurance</button></li>`
    //   +           `<li><button type="button" id="player${each}bust" class="player${each}">Bust</button></li>`
    //   +         '</ul>'
    //   +           `<span id="player${each}HandValue" class="bet_labels">Hand Value: </span>`
    //   +           `<span id="player${each}currBet" class="bet_labels">Current Bet: </span>`
    //   +           `<span id="player${each}sideBet" class="bet_labels">Side Bet: </span>`
    //   +       '</div>'
    //   +     '</ul>'
    //   +   '</div>')
    }
    // $("#dealer").html('<div class="dealerGUI">' +
    //   '<ul id="testGUI">' +
    //     '<div class="dealerCards">' +
    //     '</div>' +
    //     '<div class="dealerButtons">' +
    //       '<ul>' +
    //         '<li><button type="button" id="newRound" hidden>newRound</button></li>' +
    //         '<li><button type="button" id="initDeal">Deal</button></li>' +
    //         '<li><button type="button" id="idk" hidden>IDK</button></li>' +
    //       '</ul>' +
    //     '</div>' +
    //   '</ul>' +
    // "</div>")
    $("#initDeal").show();
   $("#dealerCards").html("");
       this.hideButtons();

  }
  startRound(){
    var currPlayers = [];
    for(let each in this.playersList){
      if (this.playersList[each].money >= this.minBet){
        currPlayers.push(this.playersList[each]);
      }
    }
    // $("#players").html("");
    this.clearBoard();
    console.log("setting up game")
    $("#initDeal").show();
    console.log("dealers name is ", this.dealer.name)
    return new Round(currPlayers,this.dealer,this.deck);
  }

  checkPlayersHand(){
    for (let player in this.playersList){
      this.playersList[player].printHand()
      console.log(this.playersList[player].handValue)
    }
  }
  checkPlayersMoney(){
    for (let player in this.playersList){
      console.log(this.playersList[player].money)
    }
  }
  checkDealersHand(){
    this.dealer.printHand();
  }
}


var Phill = new Player("Phill",0);
var Jon = new Player("Jon",1);
var Adrian = new Player("Adrian",2);


var newGame = new BlackJack();
newGame.startGameWithPlayers([Phill,Jon,Adrian]);
var currRound = newGame.startRound();
$("#initDeal").click(function(){
  console.log("dealing")
  currRound.initialDeal();
  $(this).hide();
  // $("#newRound").show();
});
// currRound.initialDeal();
// currRound.checkForDoubleDown();
// newGame.checkPlayersMoney();
// newGame.checkPlayersHand();
// newGame.checkDealersHand();
$("#newRound").click(function(){
  console.log("newRound");
  $(this).hide();
  newGame.clearBoard();
});
});






// var newDeck = new Deck(1);
