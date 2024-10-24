// JavaScript to handle the toggle functionality
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
    console.log("Menu toggled");    
});