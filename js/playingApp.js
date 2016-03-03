alert('This game is to meant improve your card counting ability.  Rules for counting are cards 2-6 have a value of +1, 10-A have a value of -1.  Cards 7-9 are neutral')
$(function() {
  var tableColor = localStorage.getItem('background');
  $('body').css({
    'background-image': 'url(' + tableColor + ')'
  })
  $('#bet').hide();
  var numDecks = localStorage.getItem('decks');
  var deck = [];
  var playerHand = [];
  var dealerHand = [];
  var deckID;
  var playerScore = 0;
  var dealerScore = 0;
  var count = 0;
  var chips = 500;
  var bet = 10;
  var totalBet = 10;
  $.getJSON("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=" + numDecks, function(d) {
    deckID = d.deck_id;
  }).then(function() {
    $.getJSON("http://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=" + (numDecks * 52), function(card) {
      $('#hit').hide();
      $('#stick').hide();
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
      for (c = 0; c < deck.length; c++) {
        if (deck[c].value >= 10) {
          deck[c].count = -1;
        } else if (deck[c].value < 7) {
          deck[c].count = 1;
        } else {
          deck[c].count = 0;
        }
      }

      function showChips() {
        $('#chipCount').children().remove();
        // chips -= bet;
        $('#chipCount').append('<h4>Chips: $' + chips + '</h4>')
        $('#chipCount').append('<h4>Bet: $' + totalBet + '</h4>')
      }

      function showCards() {
        $("#playerHand").children().remove();
        $("#dealerHand").children().remove();
        playerHand.forEach(function(card) {
          $("#playerHand").append('<img class="cardClass" src="' + card.image + '" />');
        })
        dealerHand.forEach(function(card) {
          $("#dealerHand").append('<img class="cardClass" src="' + card.image + '" />');
        })
      }

      function deal() {
        console.log(totalBet);
        if (totalBet === 10) {
          chips -= bet;
        }
        for (var i = 0; i < 2; i++) {
          playerHand.push(deck[0])
          count += deck[0].count;
          deck.shift();
        }
        dealerHand.push({
          image: "images/red-back.png",
          value: 0
        })
        dealerHand.push(deck[0])
        count += deck[0].count;
        upDateCount();
        deck.shift();
        score();
        showCards();
        if (playerScore === 21) {
          // $('#result').append('<h1>Winner Winner Chicken Dinner!</h1>')
          dealersTurn();
          $('#hit').hide();
          $('#stick').hide();
          $('#deal').show();
        }
        if (playerScore > 21) {
          checkPlayerAces();
        }
      }

      function pHit() {
        playerHand.push(deck[0]);
        count += deck[0].count;
        upDateCount();
        deck.shift();
        showCards();
      }

      function clear() {
        playerHand = [];
        dealerHand = [];
        playerScore = 0;
        dealerScore = 0;
      }

      function checkPlayerAces() {
        for (var a = 0; a < playerHand.length; a++) {
          if (playerHand[a].value == 11) {
            playerHand[a].value = 1;
            return score();
          }
        }
      }

      function checkDealerAces() {
        for (var b = 0; b < dealerHand.length; b++) {
          if (dealerHand[b].value == 11) {
            dealerHand[b].value = 1;
            return score();
          }
        }
      }

      function dealersTurn() {
        dealerHand.shift();
        dealerHand.unshift(deck[0]);
        count += deck[0].count;
        upDateCount();
        deck.shift();
        showCards();
        score();
        while (dealerScore < 17) {
          dealerHand.push(deck[0]);
          count += deck[0].count;
          deck.shift();
          upDateCount();
          showCards();
          dealerScore += dealerHand[dealerHand.length - 1].value;
        }
        score();
        if (dealerScore > 21) {
          checkDealerAces();
          if (dealerScore < 17) {
            while (dealerScore < 17) {
              dealerHand.push(deck[0]);
              count += deck[0].count;
              deck.shift();
              upDateCount();
              showCards();
              dealerScore += dealerHand[dealerHand.length - 1].value;
            }
          }
          score();
          if (dealerScore > playerScore) {
            totalBet = 10;
            showChips()
            return $('#result').append('<h1>You Lose!</h1>')
          } else if (dealerScore === playerScore){
            chips += totalBet
            totalBet = 10;
            showChips();
            return $('#result').append('<h1>Push</h1>')
          } else {
            chips += (totalBet * 2);
            totalBet = 10;
            showChips();
            return $('#result').append('<h1>You Win!</h1>')
          }
        } else if (dealerScore > playerScore) {
          totalBet = 10;
          showChips();
          return $('#result').append('<h1>You Lose!</h1>')
        } else if (dealerScore === playerScore) {
          chips += totalBet
          totalBet = 10;
          showChips();
          return $('#result').append('<h1>Push</h1>')
        } else {
          chips += (totalBet * 2);
          totalBet = 10;
          showChips();
          return $('#result').append('<h1>You Win!</h1>')
        }
      }

      function showPlayerScore() {
        $("#pScore").children().remove();
        $("#pScore").append('<h4> Your Score: ' + playerScore + '</h4>');
      }

      function showDealerScore() {
        $("#dScore").children().remove();
        $("#dScore").append('<h4> Dealer Score: ' + dealerScore + '</h4>');
      }

      function upDateCount() {
        $("#highscore").children().remove();
        $('#highscore').append('<h4> Count: ' + count + '</h4>');
      }

      function score() {
        playerScore = 0;
        dealerScore = 0;
        for (var i = 0; i < playerHand.length; i++) {
          playerScore += playerHand[i].value;
        }
        for (var j = 0; j < dealerHand.length; j++) {
          dealerScore += dealerHand[j].value;
        }
        showPlayerScore();
        showDealerScore();
      }
      $('#hit').on('click', function() {
        pHit()
        score()
        $('#bet').hide();
        if (playerScore > 21) {
          checkPlayerAces();
        }
        if (playerScore > 21) {
          $('#result').append('<h1>BUSTED!</h1>')
          $('#deal').show();
          $('#hit').hide();
          $('#stick').hide();
          // totalBet = 10;
        }
      })
      $('#stick').on('click', function() {
        $('#hit').hide();
        $('#stick').hide();
        $('#bet').show();
        $('#deal').show();
        dealersTurn()
      })
      $('#deal').on('click', function() {
        $('#result').children().remove()
        $('#deal').hide();
        $('#hit').show();
        $('#stick').show();
        $('#bet').show()
        clear()
        deal()
          // totalBet = 10;
        showChips()
      })
      $('#bet').on('click', function() {
        chips -= bet;
        totalBet += bet;
        showChips();
      })
    })
  })
})
