$(document).ready(function() {
    //Get all elements that have an attribute of rating-stars
    var starsElementArray = document.querySelectorAll('[rating-stars]');

    for (var i = 0; i < starsElementArray.length; i++) {
      //Set it to right align
    starsElementArray[i].style.textAlign = 'right';
    //Get the attribute value
        var starValue = starsElementArray[i].getAttribute('rating-stars');
        switch(starValue){
          case '0':
          starsElementArray[i].innerHTML = '<i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
          break;
          case '1':
          starsElementArray[i].innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
          break;
          case '2':
          starsElementArray[i].innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
          break;
          case '3':
          starsElementArray[i].innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
          break;
          case '4':
          starsElementArray[i].innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i>';
          break;
          default:
          starsElementArray[i].innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
          break;
        }
    }
});
