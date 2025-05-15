document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop(); // Gets 'profile.html', 'search.html', etc.

    navItems.forEach(item => {
        const itemPage = item.getAttribute('href').split('/').pop();
        if (itemPage === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active'); // Ensure only one is active if already set in HTML
        }

        // Fallback for index.html if currentPage is empty (root) or index.html
        if ((currentPage === '' || currentPage === 'index.html') && itemPage === 'index.html') {
             item.classList.add('active');
        }
    });
});