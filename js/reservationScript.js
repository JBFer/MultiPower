document.addEventListener('DOMContentLoaded', function() {
    const continueBtn = document.getElementById('continueBtn');
    const historyBtn = document.getElementById('historyBtn');

    // Elements to populate with data from URL
    const reservationIdValue = document.getElementById('reservationIdValue');
    const reservationDateValue = document.getElementById('reservationDateValue');
    const reservationTimeValue = document.getElementById('reservationTimeValue');
    // const reservationDurationValue = document.getElementById('reservationDurationValue'); // Calculate or pass
    const stationNameValue = document.getElementById('stationNameValue');
    const stationAddressValue = document.getElementById('stationAddressValue');
    // const chargingRateValue = document.getElementById('chargingRateValue');
    // const estTotalValue = document.getElementById('estTotalValue');


    // Get data from URL parameters
    const params = new URLSearchParams(window.location.search);
    const stationName = params.get('stationName') || 'N/A';
    const stationAddress = params.get('stationAddress') || 'N/A';
    const reservationDate = params.get('date') || 'Jan 15, 2025'; // Default placeholder
    const reservationTime = params.get('time') || '2:30 PM - 4:30 PM'; // Default placeholder
    // Example: you might also pass stationId, rate, etc.

    // Populate the page
    // For demo, using some defaults if params not fully set
    reservationIdValue.textContent = `#${Math.floor(10000 + Math.random() * 90000)}`; // Random ID
    reservationDateValue.textContent = decodeURIComponent(reservationDate);
    reservationTimeValue.textContent = decodeURIComponent(reservationTime);
    stationNameValue.textContent = decodeURIComponent(stationName);
    stationAddressValue.textContent = decodeURIComponent(stationAddress);

    // Placeholder for duration, rate, total - these would typically come from backend or calculation
    document.getElementById('reservationDurationValue').textContent = "2 hours";
    document.getElementById('chargingRateValue').textContent = "$0.40/kWh";
    document.getElementById('estTotalValue').textContent = "$12.00";


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