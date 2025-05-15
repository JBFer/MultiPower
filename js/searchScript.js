document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const stationData = [
        // Added 'address' field and sample data
        { id: 'A', name: 'Pingo Doce Aveiro - Ria', address: 'Rua Doutor Francisco Ferreira Neves, Urbanização Das Barrocas 15, 3800-056 Aveiro', lat: 34.0522, lng: -118.2437, mapDisplay: true, mapPinLatOffset: -0.001, mapPinLngOffset: -0.008, distance: 0.5, available: 2, totalSpots: 5, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: true },
        { id: 'B', name: 'Station B Downtown', address: '123 Main St, Los Angeles, CA', lat: 34.0580, lng: -118.2550, mapDisplay: true, mapPinLatOffset: 0.004, mapPinLngOffset: 0.012, distance: 0.6, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: true, isNew: false },
        { id: 'C', name: 'City Center Charging', address: '456 Central Ave, Los Angeles, CA', lat: 34.0630, lng: -118.2350, mapDisplay: true, mapPinLatOffset: -0.006, mapPinLngOffset: 0.000, distance: 1.2, available: 3, totalSpots: 3, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: false },
        { id: 'D', name: 'Westside Quick Charge', address: '789 West Blvd, Los Angeles, CA', lat: 34.0480, lng: -118.2580, mapDisplay: true, mapPinLatOffset: 0.001, mapPinLngOffset: -0.015, distance: 1.2, available: 0, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: true, isNew: true },
        { id: 'E', name: 'East LA Chargers', address: '101 East Ave, Los Angeles, CA', lat: 34.0500, lng: -118.2290, mapDisplay: true, mapPinLatOffset: -0.003, mapPinLngOffset: 0.005, distance: 1.2, available: 2, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: false },
        { id: 'F', name: 'Southside Power Hub', address: '222 South St, Los Angeles, CA', lat: 34.0450, lng: -118.2400, mapDisplay: false, distance: 1.2, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: true },
        { id: 'G', name: 'North End Energy', address: '333 North Rd, Los Angeles, CA', lat: 34.0600, lng: -118.2620, mapDisplay: false, distance: 1.2, available: 2, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: true, isNew: false }
    ];
    const userLocation = { lat: 34.056, lng: -118.245 }; // Center for map view

    // --- MAP INITIALIZATION ---
    const map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([userLocation.lat, userLocation.lng], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        // attribution: '© OpenStreetMap & CARTO'
    }).addTo(map);

    const stationListElement = document.getElementById('station-list');
    const stationListTitleElement = document.getElementById('station-list-title');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'nearby';
    let stationMarkersLayer = L.layerGroup().addTo(map);

    // --- DOM Elements for Views ---
    const stationListView = document.getElementById('stationListView');
    const reservationView = document.getElementById('reservationView');
    const backToListBtn = document.getElementById('backToListBtn');
    const reserveBtn = document.getElementById('reserveBtn');

    // Reservation panel elements
    const reservationStationName = document.getElementById('reservationStationName');
    const reservationStationAddress = document.getElementById('reservationStationAddress');
    const spotsAvailableElement = document.getElementById('spotsAvailable');
    const availabilityDot = reservationView.querySelector('.availability-dot');
    // const reservationDateInput = document.getElementById('reservationDate'); // Already defined in HTML
    // const reservationTimeDisplay = document.getElementById('reservationTime'); // Already defined in HTML


    // --- ICONS ---
    function createStationMarkerIcon(isAvailable) { // Pass availability
        const iconColor = isAvailable ? '#34c759' : '#888'; // Green if available, grey otherwise
        return L.divIcon({
            html: `
                <div class="station-marker-icon">
                    <div class="pin-shape" style="border-color: ${isAvailable ? '#A8D8A8' : '#aaa'}; background-color: ${isAvailable ? 'white' : '#f0f0f0'};"></div>
                    <div class="icon-container">
                        <i class="fas fa-charging-station" style="color: ${iconColor};"></i>
                    </div>
                </div>
            `,
            className: '',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
    }

    const userMarkerIcon = L.divIcon({
        html: `<div class="user-location-marker-icon"><i class="fas fa-car"></i></div>`,
        className: '',
        iconSize: [36, 20],
        iconAnchor: [18, 10]
    });
    L.marker([userLocation.lat, userLocation.lng], { icon: userMarkerIcon }).addTo(map);


    // --- VIEW MANAGEMENT ---
    function showListView() {
        stationListView.classList.remove('hidden');
        reservationView.classList.add('hidden');
        document.querySelector('.pull-handle-bar').style.display = 'block'; // Show pull handle
    }

    function showReservationView(station) {
        stationListView.classList.add('hidden');
        reservationView.classList.remove('hidden');
        document.querySelector('.pull-handle-bar').style.display = 'none'; // Hide pull handle for reservation view

        // Populate reservation panel
        reservationStationName.textContent = station.name;
        reservationStationAddress.textContent = station.address;
        spotsAvailableElement.textContent = `${station.available}/${station.totalSpots}`;
        if (station.available > 0) {
            availabilityDot.style.backgroundColor = '#34c759'; // Green
        } else {
            availabilityDot.style.backgroundColor = '#ff3b30'; // Red (or grey)
        }
        // Set default date/time (can be dynamic later)
        // document.getElementById('reservationDate').value = "April 15, 2024";
        // document.getElementById('reservationTime').textContent = "9:40 AM";

        // Store station ID for reservation button or any other use
        reserveBtn.dataset.stationId = station.id;
    }

    // --- RENDER FUNCTIONS ---
    function renderStationList(stationsToRender) {
        stationListElement.innerHTML = '';
        stationMarkersLayer.clearLayers();

        stationsToRender.forEach(station => {
            const item = document.createElement('div');
            item.classList.add('station-item');
            item.dataset.id = station.id;
            item.innerHTML = `
                <div class="station-info">
                    <h3>${station.name}</h3>
                    <div class="details">${station.distance.toFixed(1)} km away • ${station.available}/${station.totalSpots} Available</div>
                    <div class="prices">
                        ${station.prices.slow ? `<span>${station.prices.slow.toFixed(2)}€ Slow</span>` : ''}
                        ${station.prices.medium ? `<span>${station.prices.medium.toFixed(2)}€ Medium</span>` : ''}
                        ${station.prices.fast ? `<span>${station.prices.fast.toFixed(2)}€ Fast</span>` : ''}
                    </div>
                </div>
                <i class="fas fa-chevron-right arrow-icon"></i>
            `;

            item.addEventListener('click', () => {
                const targetLat = station.lat + (station.mapPinLatOffset || 0);
                const targetLng = station.lng + (station.mapPinLngOffset || 0);
                map.setView([targetLat, targetLng], 16);

                document.querySelectorAll('.station-item').forEach(el => el.classList.remove('highlighted'));
                item.classList.add('highlighted');
                
                showReservationView(station); // Show reservation panel for this station
            });
            stationListElement.appendChild(item);

            if (station.mapDisplay) {
                const markerLat = station.lat + (station.mapPinLatOffset || 0);
                const markerLng = station.lng + (station.mapPinLngOffset || 0);
                const marker = L.marker([markerLat, markerLng], {
                    icon: createStationMarkerIcon(station.available > 0),
                    stationId: station.id
                }).addTo(stationMarkersLayer);

                marker.on('click', () => {
                    // Find the corresponding list item and trigger its click to show reservation panel
                    const listItem = stationListElement.querySelector(`.station-item[data-id="${station.id}"]`);
                    if (listItem) {
                        listItem.click(); // This will handle map zoom and showing reservation view
                        // listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Already scrolled if list is visible
                    } else { // If list item not found (e.g. due to filtering), directly show reservation view
                        showReservationView(station);
                         map.setView([markerLat, markerLng], 16);
                    }
                });
            }
        });
    }

    // --- FILTER LOGIC ---
    function applyFilters() {
        showListView(); // Ensure list view is shown when applying filters
        let filteredStations = [...stationData];

        filteredStations.sort((a, b) => a.distance - b.distance);

        if (currentFilter === 'available') {
            filteredStations = filteredStations.filter(s => s.available > 0);
            stationListTitleElement.textContent = "Available Stations";
        } else if (currentFilter === 'fast_charge') {
            filteredStations = filteredStations.filter(s => s.isFastCharge && s.prices.fast);
            stationListTitleElement.textContent = "Fast Charge Stations";
        } else if (currentFilter === 'popular') {
            filteredStations = filteredStations.filter(s => s.isPopular);
            filteredStations.sort((a, b) => b.available - a.available || a.distance - b.distance);
            stationListTitleElement.textContent = "Popular Stations";
        } else if (currentFilter === 'new') {
            filteredStations = filteredStations.filter(s => s.isNew);
            stationListTitleElement.textContent = "New Stations";
        } else { // 'nearby'
            stationListTitleElement.textContent = "Nearby Charging Stations";
        }
        renderStationList(filteredStations);
    }

    // --- EVENT LISTENERS ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            applyFilters();
        });
    });

    backToListBtn.addEventListener('click', () => {
        showListView();
        // Optionally, re-apply filters if needed or just show the list as it was
        // applyFilters(); // If you want to refresh the list based on current filter
    });

    reserveBtn.addEventListener('click', () => {
        const stationId = reserveBtn.dataset.stationId;
        console.log("Reserving station:", stationId);
        // Redirect to reservation confirmation page
        window.location.href = 'reservation.html'; // Add ?stationId=${stationId} if needed
    });
    
    // Make header icons clickable
    const homeHeaderIcon = document.querySelector('.main-header .fa-home');
    const profileHeaderIcon = document.querySelector('.main-header .fa-user');

    if(homeHeaderIcon) homeHeaderIcon.parentElement.addEventListener('click', () => window.location.href = 'index.html');
    if(profileHeaderIcon) profileHeaderIcon.parentElement.addEventListener('click', () => window.location.href = 'profile.html');


    // --- INITIAL RENDER ---
    applyFilters();
    showListView(); // Ensure list view is the default
});