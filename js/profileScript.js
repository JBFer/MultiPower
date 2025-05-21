document.addEventListener('DOMContentLoaded', function() {
    const manageCarsButton = document.getElementById('manageCarsButton');
    if (manageCarsButton) {
        manageCarsButton.addEventListener('click', function() {
            window.location.href = 'chooseCar.html'; // Navigate to chooseCar.html
        });
    }

    const carStatsButton = document.getElementById('carStatsButton');
    if (carStatsButton) {
        carStatsButton.addEventListener('click', function() {
            // Placeholder for car statistics action
            alert('Car Statistics button clicked! Implement navigation or modal here.');
            // Example: window.location.href = 'car_specific_stats.html';
        });
    }

    // You can add more JS functionality for the profile page here
    // For example, handling the "Add Funds" button click
    const addFundsBtn = document.querySelector('.add-funds-button');
    if(addFundsBtn) {
        addFundsBtn.addEventListener('click', () => {
            const amountToAdd = prompt("Enter amount to add:", "10.00");
            if (amountToAdd !== null && !isNaN(parseFloat(amountToAdd)) && parseFloat(amountToAdd) > 0) {
                const currentBalance = window.walletManager.getWalletBalance();
                const newBalance = currentBalance + parseFloat(amountToAdd);
                window.walletManager.setWalletBalance(newBalance);
                window.walletManager.updateAllBalanceDisplays();
                alert('Funds added successfully!');
            } else if (amountToAdd !== null) {
                alert('Invalid amount entered.');
            }
        });
    }
});