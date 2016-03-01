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
});
