$(function() {
  var tableColor = localStorage.getItem('background');
  $('body').css({
    'background-image': 'url(' + tableColor + ')'
  })
  $('#doubleDown').hide();
  $('#bet').hide();
  $('#all-in').hide();
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
  var totalBet = 0;
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
          $('#bet').show()
          $('#all-in').show();
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

      function endGame() {
        $('#deal').hide();
        $('#hit').hide();
        $('#stick').hide();
        $('#doubleDown').hide();
        $('#all-in').hide();
        $('#result').children().remove();
        $('#result').append('<h1>New Game?</h1>')
        $('#buttons').append('<input class="continue" type="button" onclick="location.href=\'playingPage.html\'" value="YES" /><input class="continue" type="button" onclick="location.href=\'http://www.buzzfeed.com/chelseamarshall/meows#.ucxQA7xv7\'" value="NO" />')
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
        $('#doubleDown').hide();
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
          if (dealerScore > 21) {
            $('#result').append('<h1>You Win $' + (totalBet * 2) + '</h1>')
            chips += totalBet * 2
            showChips()
            if (deck.length === 0) {
              $('#bet').hide();
              $('#deal').hide();
              $('#all-in').hide();
              setTimeout(function(){
                $('#result').children().remove();
                $('#result').append('<h1>Game Over</h1>');
                setTimeout(endGame, 2000)
              }, 2000)
            }
            return totalBet = 0;
          } else if (dealerScore === playerScore) {
            chips += totalBet
            showChips();
            totalBet = 0;
            if (deck.length === 0) {
              $('#bet').hide();
              $('#deal').hide();
              $('#all-in').hide();
              setTimeout(function(){
                $('#result').children().remove();
                $('#result').append('<h1>Game Over</h1>');
                setTimeout(endGame, 2000)
              }, 2000)
            } else {
              return $('#result').append('<h1>Push</h1>')
            }
          } else if (dealerScore > playerScore) {
            $('#result').append('<h1>You Lose $' + totalBet + '</h1>')
            showChips();
            if (chips < 10 || deck.length === 0) {
              $('#deal').hide();
              $('#all-in').hide();
              $('#bet').hide();
              setTimeout(function(){
                $('#result').children().remove();
                $('#result').append('<h1>Game Over</h1>');
                setTimeout(endGame, 2000)
              }, 2000)
            }
            return totalBet = 0;
          } else {
            $('#result').append('<h1>You Win $' + (totalBet * 2) + '</h1>')
            chips += totalBet * 2
            showChips()
            if (deck.length === 0) {
              $('#bet').hide();
              $('#deal').hide();
              $('#all-in').hide();
              setTimeout(function(){
                $('#result').children().remove();
                $('#result').append('<h1>Game Over</h1>');
                setTimeout(endGame, 2000)
              }, 2000)
            }
            return totalBet = 0;
          }
        } else if (dealerScore > playerScore) {
          $('#result').append('<h1>You Lose $' + totalBet + '</h1>')
          showChips();
          if (deck.length === 0 || chips < 10) {
            $('#deal').hide();
            $('#all-in').hide();
            $('#bet').hide();
            setTimeout(function(){
              $('#result').children().remove();
              $('#result').append('<h1>Game Over</h1>');
              setTimeout(endGame, 2000)
            }, 2000)
          }
          return totalBet = 0;

        } else if (dealerScore === playerScore) {
          chips += totalBet
          showChips();
          totalBet = 0;
          if (deck.length === 0) {
            $('#bet').hide();
            $('#deal').hide();
            $('#all-in').hide();
            setTimeout(function(){
              $('#result').children().remove();
              $('#result').append('<h1>Game Over</h1>');
              setTimeout(endGame, 2000)
            }, 2000)
          } else {
            return $('#result').append('<h1>Push</h1>')
          }
        } else {
          $('#result').append('<h1>You Win $' + (totalBet * 2) + '</h1>')
          chips += totalBet * 2
          showChips();
          if (deck.length === 0) {
            $('#bet').hide();
            $('#deal').hide();
            $('#all-in').hide();
            setTimeout(function(){
              $('#result').children().remove();
              $('#result').append('<h1>Game Over</h1>');
              setTimeout(endGame, 2000)
            }, 2000)
          }
          return totalBet = 0;
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
        if (deck.length === 0) {
          $('#bet').hide();
          $('#deal').hide();
          $('#all-in').hide();
          setTimeout(function(){
            $('#result').children().remove();
            $('#result').append('<h1>Game Over</h1>');
            setTimeout(endGame, 2000)
          }, 2000)
        }
        pHit()
        score()
        $('#bet').hide();
        $('#doubleDown').hide();
        if (playerScore > 21) {
          checkPlayerAces();
        }
        if (playerScore > 21) {
          $('#result').append('<h1>BUSTED!</h1>')
          totalBet = 10;
          $('#bet').show()
          $('#deal').show();
          $('#all-in').show();
          $('#hit').hide();
          $('#stick').hide();
          if (chips < 10 || deck.length === 0) {
            $('#deal').hide();
            $('#all-in').hide();
            $('#bet').hide();
            setTimeout(function(){
              $('#result').children().remove();
              $('#result').append('<h1>Game Over</h1>');
              setTimeout(endGame, 2000)
            }, 2000)
          }
        }
      })
      $('#stick').on('click', function() {
        $('#hit').hide();
        $('#stick').hide();
        $('#bet').show();
        $('#deal').show();
        $('#all-in').show();
        $('#doubleDown').hide()
        dealersTurn()
      })
      $('#deal').on('click', function() {
        chips -= bet;
        totalBet += bet;
        showChips()
        $('#result').children().remove()
        $('#deal').hide();
        $('#hit').show();
        $('#stick').show();
        $('#bet').hide();
        $('#all-in').hide();
        $('#doubleDown').show()
        clear()
        deal()
        if (chips <= 10 || deck.length === 0) {
          setTimeout(function(){
            $('#bet').hide();
            $('#deal').hide();
            $('#all-in').hide();
            $('#result').children().remove();
            $('#result').append('<h1>Game Over</h1>');
            setTimeout(endGame, 2000)
          }, 2000)
        }
      })
      $('#bet').on('click', function() {
        if (chips <= 10) {
          $('#bet').hide();
        }
        chips -= bet;
        totalBet += bet;
        showChips();
      })
      $('#doubleDown').on('click', function() {
        $('#doubleDown').hide();
        chips -= totalBet;
        totalBet *= 2;
        showChips();
        playerHand.push(deck[0])
        count += deck[0].count;
        deck.shift();
        showCards();
        score()
        if (playerScore > 21) {
          checkPlayerAces()
        }
        if (playerScore > 21) {
          $('#result').append('<h1>BUSTED!</h1>')
          totalBet = 0;
          $('#bet').show()
          $('#hit').hide();
          $('#stick').hide();
          $('#deal').show();

        } else {
          dealersTurn();
        }
        $('#hit').hide();
        $('#stick').hide();
        $('#deal').show();
        $('#bet').show();
        $('#all-in').show();
        totalBet = 0;
        if (chips <= 10 || deck.length === 0) {
          $('#bet').hide();
          setTimeout(function(){
            $('#result').children().remove();
            $('#result').append('<h1>Game Over</h1>');
            setTimeout(endGame, 2000)
          }, 2000)

        }
      })
      $('#all-in').on('click', function() {
        if (chips <= 10) {
          $('#result').children().remove()
          return endGame();
        } else {
          totalBet =  totalBet + chips;
          chips = 0;
          showChips()
          $('#result').children().remove()
          $('#deal').hide();
          $('#hit').show();
          $('#stick').show();
          $('#bet').hide();
          $('#all-in').hide();
          clear()
          deal()
        }
      })
      $('#rules').on('click', function() {
        alert('Test your counting and Blackjack skills.  Rules for counting are cards 2-6 have a value of +1, 10-A have a value of -1.  Cards 7-9 are neutral. Bet high when the count is high. Bet conservatively when the count is low...don\'t tell Vegas.')
      })
    })
  })
})
