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

    loadReservationHistory();
});

function loadReservationHistory() {
    const historyListElement = document.getElementById('reservationHistoryList');
    if (!historyListElement) return;

    const history = JSON.parse(localStorage.getItem('reservationHistory')) || [];

    if (history.length === 0) {
        historyListElement.innerHTML = '<p class="no-history-message">No reservation history yet.</p>';
        return;
    }

    historyListElement.innerHTML = ''; // Clear current list

    history.forEach(reservation => {
        const item = document.createElement('div');
        item.classList.add('reservation-history-item');

        const reservationMadeDate = new Date(reservation.reservationMadeTimestamp);
        const formattedReservationMadeTime = reservationMadeDate.toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        item.innerHTML = `
            <h4>${reservation.stationName}</h4>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${reservation.stationAddress}</p>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Reserved on:</span>
                    <span class="value">${formattedReservationMadeTime}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Time interval:</span>
                    <span class="value">${reservation.reservationTimeInterval}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Rate:</span>
                    <span class="value">${reservation.reservationRate}€/min</span>
                </div>
                <div class="detail-item">
                    <span class="label">Total Paid:</span>
                    <span class="value">${reservation.totalFee}€</span>
                </div>
            </div>
        `;
        historyListElement.appendChild(item);
    });
}