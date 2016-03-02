$(function() {
  var currdeg = 0;
  $("#next").on("click", function() {
    currdeg += 72;
    $("#carousel").css({
      "transform": "rotateY("+currdeg+"deg)"
    });
  });
  $("#prev").on("click", function() {
    currdeg -= 72;
    $("#carousel").css({
      "transform": "rotateY("+currdeg+"deg)"
    })
  })
  $('img').on('click', function(){
    var bgColor = $(this).attr('src')
    var TheImage = localStorage.setItem('background', bgColor);
  })
  $('input[type="submit"]').on('click', function(e) {
    e.preventDefault();
    var numDecks = $('input[type="radio"]:checked').attr('value');
    var setDecks = localStorage.setItem('decks', numDecks);
  })
});
