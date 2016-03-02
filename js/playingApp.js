$(function() {
      var tableColor = localStorage.getItem('background');
      $('body').css({
        'background-image': 'url(' + tableColor + ')'
      })
      var numDecks = localStorage.getItem('decks');
      var deck = [];
      var playerHand = [];
      var dealerHand = [];
      var deckID;
      var playerScore = 0;
      var dealerScore = 0;
      var count = 0;
      $.getJSON("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=" + numDecks, function(d) {
        deckID = d.deck_id;
      }).then(function() {
          $.getJSON("http://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=" + (numDecks * 52), function(card) {
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
                // console.log(deck[c].count)
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
                // if(playerScore === 21) {
                //   $('').append('<h1>Winner Winner<br>Chicken Dinner!</h1>')
                // }
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
                for ( var a = 0; a < playerHand.length; a++) {
                  if (playerHand[a].value == 11) {
                    playerHand[a].value = 1;
                    console.log('wtf mate? ' + playerHand[a].value);
                    return score();
                  }
                }
              }
              function checkDealerAces() {
                for ( var b = 0; b < dealerHand.length; b++) {
                  if (dealerHand[b].value == 11) {
                    dealerHand[b].value = 1;
                    console.log('wtf mate? ' + dealerHand[b].value);
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
                  score()
                  // return
                  console.log("You win");
                  console.log('player score 1', playerScore, 'dealerScore', dealerScore);
                } else if (dealerScore > playerScore) {
                  // return
                  console.log("You lose");
                  console.log('player score 2', playerScore, 'dealerScore', dealerScore);
                } else if (dealerScore === playerScore) {
                  // return
                  console.log("Push");
                  console.log('player score 3', playerScore, 'dealerScore', dealerScore);
                } else {
                  // return
                  console.log("You win");
                  console.log('player score 4', playerScore, 'dealerScore', dealerScore);
                }
                console.log("dealer Score " + dealerScore, 'playerScr', playerScore);
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
                  // console.log('in score for player', playerHand[i].value);
                  playerScore += playerHand[i].value;
                }
                for (var j = 0; j < dealerHand.length; j++) {
                  // console.log('in score for dealer', dealerHand[j].value);
                  dealerScore += dealerHand[j].value;
                }
                showPlayerScore();
                showDealerScore();
              }
              $('#hit').on('click', function() {
                  pHit()
                  score()
                  console.log(count);
                  if (playerScore > 21) {
                    checkPlayerAces();
                    } else {

                    }
              })
                $('#stick').on('click', function() {
                  $('#hit').hide();
                  $('#stick').hide();
                  dealersTurn()
                })
                $('#deal').on('click', function() {
                  $('#hit').show();
                  $('#stick').show();
                  clear()
                  deal()
                })
              })
          })
      })
