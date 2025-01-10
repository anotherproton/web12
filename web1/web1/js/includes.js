document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('/includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize navigation toggle after header is loaded
            const navToggle = document.getElementById('navToggle');
            const navLinks = document.querySelector('.nav-links');
            if (navToggle) {
                navToggle.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                });
            }
        });

    // Load footer
    fetch('/includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}); 