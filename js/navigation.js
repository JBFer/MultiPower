document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop(); // Gets 'profile.html', 'search.html', etc.

    // Wallet Balance Management
    const WALLET_BALANCE_KEY = 'walletBalance';
    const DEFAULT_BALANCE = 324.50;

    function getWalletBalance() {
        const balance = sessionStorage.getItem(WALLET_BALANCE_KEY);
        return balance !== null ? parseFloat(balance) : DEFAULT_BALANCE;
    }

    function setWalletBalance(balance) {
        sessionStorage.setItem(WALLET_BALANCE_KEY, balance.toFixed(2));
    }

    function initializeWallet() {
        if (sessionStorage.getItem(WALLET_BALANCE_KEY) === null) {
            setWalletBalance(DEFAULT_BALANCE);
        }
    }

    function updateAllBalanceDisplays() {
        const balance = getWalletBalance();
        document.querySelectorAll('[data-balance-display]').forEach(el => {
            el.textContent = balance.toFixed(2) + '€';
        });
    }

    // Initialize wallet and update displays on page load
    initializeWallet();
    updateAllBalanceDisplays();

    // Expose functions to global scope if needed by other scripts, or pass them around.
    // For simplicity here, other scripts will also implement get/set or rely on this script running first.
    // A more robust solution might use a global object or custom events.
    window.walletManager = {
        getWalletBalance,
        setWalletBalance,
        updateAllBalanceDisplays
    };


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