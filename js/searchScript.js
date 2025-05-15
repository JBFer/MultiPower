document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const stationData = [
        // Data matching the image's list (lat/lng are illustrative for LA area)
        // mapDisplay: true indicates if it's one of the 5 pins on the map in the image
        { id: 'A', name: 'Station A', lat: 34.0522, lng: -118.2437, mapDisplay: true, mapPinLatOffset: -0.001, mapPinLngOffset: -0.008, distance: 0.5, available: 1, totalSpots: 4, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: true },
        { id: 'B', name: 'Station B', lat: 34.0580, lng: -118.2550, mapDisplay: true, mapPinLatOffset: 0.004, mapPinLngOffset: 0.012, distance: 0.6, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: true, isNew: false },
        { id: 'C', name: 'Station C', lat: 34.0630, lng: -118.2350, mapDisplay: true, mapPinLatOffset: -0.006, mapPinLngOffset: 0.000, distance: 1.2, available: 1, totalSpots: 3, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: false },
        { id: 'D', name: 'Station D', lat: 34.0480, lng: -118.2580, mapDisplay: true, mapPinLatOffset: 0.001, mapPinLngOffset: -0.015, distance: 1.2, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: true, isNew: true },
        { id: 'E', name: 'Station E', lat: 34.0500, lng: -118.2290, mapDisplay: true, mapPinLatOffset: -0.003, mapPinLngOffset: 0.005, distance: 1.2, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: false },
        { id: 'F', name: 'Station F', lat: 34.0450, lng: -118.2400, mapDisplay: false, distance: 1.2, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: false, isNew: true },
        { id: 'G', name: 'Station G', lat: 34.0600, lng: -118.2620, mapDisplay: false, distance: 1.2, available: 1, totalSpots: 2, prices: { slow: 0.41, medium: 0.53, fast: 0.70 }, isFastCharge: true, isPopular: true, isNew: false }
    ];
    const userLocation = { lat: 34.056, lng: -118.245 }; // Center for map view

    // --- MAP INITIALIZATION ---
    const map = L.map('map', {
        zoomControl: false,
        attributionControl: false 
    }).setView([userLocation.lat, userLocation.lng], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        // attribution: '© OpenStreetMap & CARTO' // Add if needed
    }).addTo(map);

    const stationListElement = document.getElementById('station-list');
    const stationListTitleElement = document.getElementById('station-list-title');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'nearby';
    let stationMarkersLayer = L.layerGroup().addTo(map);

    // --- ICONS ---
    function createStationMarkerIcon() {
        return L.divIcon({
            html: `
                <div class="station-marker-icon">
                    <div class="pin-shape"></div>
                    <div class="icon-container">
                        <i class="fas fa-charging-station"></i>
                    </div>
                </div>
            `,
            className: '', // Prevents Leaflet default styling
            iconSize: [30, 42], // Matches .station-marker-icon size
            iconAnchor: [15, 42] // Tip of the pin
        });
    }

    const userMarkerIcon = L.divIcon({
        html: `<div class="user-location-marker-icon"><i class="fas fa-car"></i></div>`,
        className: '',
        iconSize: [36, 20],
        iconAnchor: [18, 10] // Center of the car icon
    });
    L.marker([userLocation.lat, userLocation.lng], { icon: userMarkerIcon }).addTo(map);


    // --- RENDER FUNCTIONS ---
    function renderStationList(stationsToRender) {
        stationListElement.innerHTML = '';
        stationMarkersLayer.clearLayers();

        stationsToRender.forEach(station => {
            // Create List Item
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

                // Optional: Bring corresponding marker to front or pulse animation
                 stationMarkersLayer.eachLayer(marker => {
                    if (marker.options.stationId === station.id) {
                        // marker.setZIndexOffset(1000); // Example: bring to front
                    }
                });
            });
            stationListElement.appendChild(item);

            // Add Marker to Map if applicable
            if (station.mapDisplay) {
                const markerLat = station.lat + (station.mapPinLatOffset || 0);
                const markerLng = station.lng + (station.mapPinLngOffset || 0);
                const marker = L.marker([markerLat, markerLng], { 
                    icon: createStationMarkerIcon(),
                    stationId: station.id 
                }).addTo(stationMarkersLayer);

                marker.on('click', () => {
                    const listItem = stationListElement.querySelector(`.station-item[data-id="${station.id}"]`);
                    if (listItem) {
                        listItem.click();
                        listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });
            }
        });
    }

    // --- FILTER LOGIC ---
    function applyFilters() {
        let filteredStations = [...stationData]; // Copy original data

        // Sort by distance for "Nearby" or as a base
        filteredStations.sort((a, b) => a.distance - b.distance);

        if (currentFilter === 'available') {
            filteredStations = filteredStations.filter(s => s.available > 0);
            stationListTitleElement.textContent = "Available Stations";
        } else if (currentFilter === 'fast_charge') {
            filteredStations = filteredStations.filter(s => s.isFastCharge && s.prices.fast);
            stationListTitleElement.textContent = "Fast Charge Stations";
        } else if (currentFilter === 'popular') {
            filteredStations = filteredStations.filter(s => s.isPopular);
             // Example: sort popular by availability then distance
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

    // --- INITIAL RENDER ---
    applyFilters(); // Render with default "nearby" filter
});