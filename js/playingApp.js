$(function() {
  var deck = [];
  var playerHand = [];
  var dealerHand = [];
  var deckID;
  var playerScore = 0;
  var dealerScore = 0;
  $.getJSON("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1", function(d) {
    deckID = d.deck_id;
  }).then(function() {
    $.getJSON("http://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52", function(card) {
      for (i = 0; i < card.cards.length; i++) {
        if (card.cards[i].value == "ACE") {
          card.cards[i].value = 11;
        } else if (card.cards[i].value.length > 2) {
          card.cards[i].value = 10;
        } else {
          card.cards[i].value = +card.cards[i].value;
        }
        deck.push(card.cards[i]);
      }

      function deal() {
        for (var i = 0; i < 2; i++) {
          playerHand.push(deck[0])
          deck.shift();
        }
        dealerHand.push(deck[0])
        deck.shift();
      }

      function pHit() {
        playerHand.push(deck[0])
        deck.shift();
      }

      function dHit() {
        dealerHand.push(deck[0])
        deck.shift();
      }

      function clear() {
        playerHand = [];
        dealerHand = [];
      }

      function dealersTurn() {
        dealerHand.push(deck[0])
        if ()
      }
      function score () {
        playerScore = 0;
        dealerScore = 0;
        for (var i = 0; i < playerHand.length; i++){
          playerScore += playerHand[i].value;
        }
        for (var i = 0; i < dealerHand.length; i++){
          dealerScore += dealerHand[i].value;
        }
      }
      deal()
      dealersTurn()
      score()
      console.log("dealer hand" + dealerHand[0].value + dealerHand[1].value);
      pHit()
      console.log("player score" + playerScore);
      console.log("dealer score" + dealerScore);
      dealersTurn()
    })
  })
})
