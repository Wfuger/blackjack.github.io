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
    $('img').removeClass('bgChoice');
    $(this).addClass('bgChoice');
    var bgColor = $(this).attr('src')
    var TheImage = localStorage.setItem('background', bgColor);
  })
  $('#play').on('click', function(e) {
    e.preventDefault();

    var pName = $('#playername').val();
    var setPName = localStorage.setItem('PlayerName', pName)
    if (pName.length === 0) {
      window.location.href = "index.html";
      alert('Player Name is required')
    }
  })
});
