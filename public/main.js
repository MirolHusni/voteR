
// Active anchor tag.
$(document).ready(function () {
    if (window.location.pathname === localStorage.lastClicked) {
        $('.main-nav a[href="' + localStorage.lastClicked + '"]').addClass('active-class');
        $('.register a[href="' + localStorage.lastClicked + '"]').addClass('active-class');
    }
    $('a').click(function () {
        localStorage.lastClicked = $(this).attr('href');
    });

    $('#bar').click(function(){
        $('.mobile-nav').slideToggle(300);
    });
});