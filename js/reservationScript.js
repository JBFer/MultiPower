document.addEventListener('DOMContentLoaded', function() {
    const continueBtn = document.getElementById('continueBtn');
    const historyBtn = document.getElementById('historyBtn');

    // Elements to populate with data from URL
    const reservationIdValue = document.getElementById('reservationIdValue');
    const reservationDateValue = document.getElementById('reservationDateValue');
    const reservationTimeValue = document.getElementById('reservationTimeValue');
    const stationNameValue = document.getElementById('stationNameValue');
    const stationAddressValue = document.getElementById('stationAddressValue');
    const reservationRateValue = document.getElementById('reservationRateValue');
    const estTotalValue = document.getElementById('estTotalValue');
    const reservationDurationValue = document.getElementById('reservationDurationValue');

    // Get data from URL parameters
    const params = new URLSearchParams(window.location.search);
    const stationName = params.get('stationName') || 'N/A';
    const stationAddress = params.get('stationAddress') || 'N/A';
    const reservationDate = params.get('date') || 'Jan 15, 2025'; // Default placeholder
    const reservationTime = params.get('time') || ''; // Default to an empty string if not provided

    // Populate the page
    reservationIdValue.textContent = `#${Math.floor(10000 + Math.random() * 90000)}`; // Random ID
    reservationDateValue.textContent = decodeURIComponent(reservationDate);
    reservationTimeValue.textContent = decodeURIComponent(reservationTime);
    stationNameValue.textContent = decodeURIComponent(stationName);
    stationAddressValue.textContent = decodeURIComponent(stationAddress);

    // Define the reservation rate per minute and base fee
    const reservationRatePerMinute = 0.07; // 0.07€/min
    const baseFee = 3; // Base fee of 3€

    // Calculate the total reservation fee
    function calculateReservationFee() {
        if (!reservationTime || !reservationTime.includes(' - ')) {
            console.error('Invalid reservation time:', reservationTime);
            reservationRateValue.textContent = `${reservationRatePerMinute.toFixed(2)}€/min`;
            estTotalValue.textContent = `${baseFee.toFixed(2)}€`; // Show only base fee
            return;
        }

        const [, endTime] = reservationTime.split(' - '); // Treat the provided time as the end time

        const parseTime = (time) => {
            const [hour, minute] = time.split(':').map(Number);
            return hour * 60 + minute; // Convert time to total minutes
        };

        const currentTime = new Date();
        const currentTotalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes(); // Current time as initial time
        const endTotalMinutes = parseTime(endTime);

        const durationMinutes = endTotalMinutes - currentTotalMinutes;

        if (durationMinutes <= 0) {
            console.error('Invalid duration:', durationMinutes);
            reservationRateValue.textContent = `${reservationRatePerMinute.toFixed(2)}€/min`;
            estTotalValue.textContent = `${baseFee.toFixed(2)}€`; // Show only base fee
            return;
        }

        const totalFee = baseFee + durationMinutes * reservationRatePerMinute; // Add base fee to time fee

        reservationRateValue.textContent = `${reservationRatePerMinute.toFixed(2)}€/min`;
        estTotalValue.textContent = `${totalFee.toFixed(2)}€`;

        // Update the duration value on the page
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        reservationDurationValue.textContent = durationText;

        // Update the reservation time to reflect the current time as the start time
        const formattedCurrentTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        reservationTimeValue.textContent = `${formattedCurrentTime} - ${endTime}`; // Correctly display the end time
    }

    calculateReservationFee();

    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.location.href = 'search.html';
        });
    }

    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            window.location.href = 'profile.html'; // Or a specific history section: 'profile.html#history'
        });
    }
});