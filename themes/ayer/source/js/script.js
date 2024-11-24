$(function(){
    "use strict"
  
  new WOW().init();
 // menu fix start

//  var mapping = $('.main_menu').offset().top;

//  $(window).scroll(function () {
//    var scrolling = $(this).scrollTop();

//    if (scrolling > mapping) {
//      $('.main_menu').addClass('menu_fix');
//    } else {
//      $('.main_menu').removeClass('menu_fix');
//    }

//  });

 // menu fix end



 // top-bottom-btn fix start

 $('.btn_top_bottom').click(function () {
   $('html').animate({
     scrollTop: 0,
   }, 2000);
 });

 $(window).scroll(function () {
   var scrolling = $(this).scrollTop();

   if (scrolling > 200) {
     $('.btn_top_bottom').fadeIn();
   } else {
     $('.btn_top_bottom').fadeOut();
   }
 });

 // top-bottom-btn fix end

  // counter up

  $('.counterr').counterUp({
    delay: 10,
    time: 1000,
  });
  
  // counter up

// Testimonial slider
const slides = document.querySelector(".slider").children;
const indicatorImages = document.querySelector(".slider-indicator").children;
let currentIndex = 0;
let intervalTime = 3000; // Time in milliseconds for autoplay (3 seconds)

// Function to change slides
function changeSlide(index) {
  // Remove 'active' class from all indicators and slides
  for (let i = 0; i < indicatorImages.length; i++) {
    indicatorImages[i].classList.remove("active");
    slides[i].classList.remove("active");
  }
  
  // Add 'active' class to the current slide and indicator
  indicatorImages[index].classList.add("active");
  slides[index].classList.add("active");
}

// Event listeners for manual slide navigation
for (let i = 0; i < indicatorImages.length; i++) {
  indicatorImages[i].addEventListener("click", function () {
    currentIndex = i; // Update current index
    changeSlide(currentIndex);
    resetAutoplay(); // Reset autoplay when manually changed
  });
}

// Autoplay function
function autoPlay() {
  currentIndex = (currentIndex + 1) % slides.length; // Move to next slide or loop back
  changeSlide(currentIndex);
}

// Start autoplay with setInterval
let autoplayInterval = setInterval(autoPlay, intervalTime);

// Function to reset autoplay (when manually navigating)
function resetAutoplay() {
  clearInterval(autoplayInterval); // Clear the interval
  autoplayInterval = setInterval(autoPlay, intervalTime); // Restart the interval
}



});