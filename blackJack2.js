class Player{
  constructor(name, id){
    this.name = name;
    this.id = id
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

  betting(amount){
    console.log(amount)
    console.log(this.name, "is betting")
    console.log(this.money, "money")
    this.money -= parseInt(amount);
    console.log(this.money, "money")
    this.currBet = parseInt(amount);
    console.log(this.currbet, "currBet")
  }
}

class Dealer extends Player{
  constructor(name){
    super(name);
    this.did_Bust = false;
  }

}

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
    this.minBet = 10;
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
}

class BlackJack{
  constructor(){
    this.minBet = 10;
    this.dealer = new Dealer("Dealer");
    this.playersList = [];
    this.num_of_decks = 1;
    this.deck = new Deck(this.num_of_decks);
    console.log("new game made")
  }

  addPlayer(person){
    this.playersList.push(person);
    console.log(`${person.name} has been added`)
  }
}

module.exports = {
  BlackJack: BlackJack,
  Deck: Deck,
  Round: Round,
  Player: Player
  }
