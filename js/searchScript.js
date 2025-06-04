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
    let activeFilters = new Set(['nearby']); // Set "nearby" filter as default
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
        
        reserveBtn.disabled = false; // Ensure the button is always enabled when this view is shown

        if (station.available > 0) {
            availabilityDot.style.backgroundColor = '#34c759'; // Green
        } else {
            availabilityDot.style.backgroundColor = '#ff3b30'; // Red (or grey for consistency)
            // Alert removed from here
        }
        // Set default date/time (can be dynamic later)
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        document.getElementById('reservationTime').textContent = formattedTime;

        // Store station ID for reservation button or any other use
        reserveBtn.dataset.stationId = station.id;

        const reservationTagsContainer = document.getElementById('reservationTags');
        reservationTagsContainer.innerHTML = createStationTags(station); // Populate tags
    }

    // --- TIME PICKER LOGIC ---
    function initializeTimePicker() {
        const timePickerInput = document.getElementById('reservationTime');
        timePickerInput.addEventListener('click', () => {
            // Check if a time picker is already open
            if (document.querySelector('.custom-time-picker')) {
                return; // Exit if a time picker already exists
            }
            const timePickerContainer = document.createElement('div');
            timePickerContainer.classList.add('custom-time-picker');
            timePickerContainer.style.position = 'absolute';
            timePickerContainer.style.zIndex = '1000';
            timePickerContainer.style.backgroundColor = '#fff';
            timePickerContainer.style.border = '1px solid #e0e0e0';
            timePickerContainer.style.borderRadius = '8px';
            timePickerContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
            timePickerContainer.style.padding = '10px';
            timePickerContainer.style.display = 'flex';
            timePickerContainer.style.gap = '10px';
            timePickerContainer.style.left = `${timePickerInput.getBoundingClientRect().left}px`;
            timePickerContainer.style.top = `${timePickerInput.getBoundingClientRect().bottom + window.scrollY}px`;

            const hourSelect = document.createElement('select');
            hourSelect.style.padding = '5px';
            hourSelect.style.border = '1px solid #e0e0e0';
            hourSelect.style.borderRadius = '5px';
            hourSelect.style.fontSize = '0.9em';

            const minuteSelect = document.createElement('select');
            minuteSelect.style.padding = '5px';
            minuteSelect.style.border = '1px solid #e0e0e0';
            minuteSelect.style.borderRadius = '5px';
            minuteSelect.style.fontSize = '0.9em';

            const currentTime = new Date();
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();
            const maxTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
            const maxHour = maxTime.getHours();
            const maxMinute = maxTime.getMinutes();

            for (let i = currentHour; i <= maxHour; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i.toString().padStart(2, '0');
                hourSelect.appendChild(option);
            }

            hourSelect.addEventListener('change', () => {
                minuteSelect.innerHTML = ''; // Clear previous options
                const selectedHour = parseInt(hourSelect.value, 10);
                const startMinute = selectedHour === currentHour ? currentMinute : 0;
                const endMinute = selectedHour === maxHour ? maxMinute : 59;

                for (let i = startMinute; i <= endMinute; i += 5) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i.toString().padStart(2, '0');
                    minuteSelect.appendChild(option);
                }
            });

            // Initialize minute options for the current hour
            hourSelect.dispatchEvent(new Event('change'));

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'OK';
            confirmButton.style.padding = '5px 10px';
            confirmButton.style.backgroundColor = '#34c759';
            confirmButton.style.color = '#fff';
            confirmButton.style.border = 'none';
            confirmButton.style.borderRadius = '5px';
            confirmButton.style.cursor = 'pointer';
            confirmButton.style.fontSize = '0.9em';

            confirmButton.addEventListener('click', () => {
                const selectedHour = hourSelect.value;
                const selectedMinute = minuteSelect.value.padStart(2, '0'); // Ensure two-digit format
                timePickerInput.textContent = `${selectedHour}:${selectedMinute}`;
                document.body.removeChild(timePickerContainer);
            });

            timePickerContainer.appendChild(hourSelect);
            timePickerContainer.appendChild(minuteSelect);
            timePickerContainer.appendChild(confirmButton);

            document.body.appendChild(timePickerContainer);

            document.addEventListener('click', (event) => {
                if (!timePickerContainer.contains(event.target) && event.target !== timePickerInput) {
                    document.body.removeChild(timePickerContainer);
                }
            }, { once: true });
        });
    }

    // --- TAGS ---
    function createStationTags(station) {
        const tags = [];

        if (station.isFastCharge) {
            tags.push({ name: 'Fast', color: '#34c759' }); // Green
        }
        if (station.isPopular) {
            tags.push({ name: 'Popular', color: '#ff9500' }); // Orange
        }
        if (station.isNew) {
            tags.push({ name: 'New', color: '#007aff' }); // Blue
        }

        return tags.map(tag => `
            <span class="station-tag" style="border-color: ${tag.color}; color: ${tag.color};">
                <span class="tag-dot" style="background-color: ${tag.color};"></span>
                <span class="tag-name">${tag.name}</span>
            </span>
        `).join('');
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
                    <div class="tags">${createStationTags(station)}</div>
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
                    const listItem = stationListElement.querySelector(`.station-item[data-id="${station.id}"]`);
                    if (listItem) {
                        listItem.click();
                    } else {
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

        if (activeFilters.size > 0) {
            filteredStations = filteredStations.filter(station => {
                let matches = true;
                if (activeFilters.has('available')) {
                    matches = matches && station.available > 0;
                }
                if (activeFilters.has('fast_charge')) {
                    matches = matches && station.isFastCharge && station.prices.fast;
                }
                if (activeFilters.has('popular')) {
                    matches = matches && station.isPopular;
                }
                if (activeFilters.has('new')) {
                    matches = matches && station.isNew;
                }
                return matches;
            });
        }

        filteredStations.sort((a, b) => a.distance - b.distance);
        stationListTitleElement.textContent = activeFilters.size > 0 ? "Filtered Stations" : "Charging Stations";
        renderStationList(filteredStations);
    }

    // --- EVENT LISTENERS ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
                button.classList.remove('active');
            } else {
                activeFilters.add(filter);
                button.classList.add('active');
            }
            applyFilters();
        });
    });

    backToListBtn.addEventListener('click', () => {
        showListView();
        // Optionally, re-apply filters if needed or just show the list as it was
        // applyFilters(); // If you want to refresh the list based on current filter
        if (window.walletManager && typeof window.walletManager.updateAllBalanceDisplays === 'function') {
            window.walletManager.updateAllBalanceDisplays(); // Ensure balance display is current
        }
    });

    reserveBtn.addEventListener('click', () => {
        const stationId = reserveBtn.dataset.stationId;
        const selectedStation = stationData.find(s => s.id === stationId);

        // Check if the station is available before proceeding
        if (selectedStation && selectedStation.available <= 0) {
            alert("No charging docks currently available at this station.");
            return; // Stop reservation process
        }

        const feeText = document.querySelector('.reservation-fee-info span').textContent;
        const fee = parseFloat(feeText.replace('€', ''));
        
        if (window.walletManager) {
            const currentBalance = window.walletManager.getWalletBalance();
            if (currentBalance >= fee) {
                const newBalance = currentBalance - fee;
                window.walletManager.setWalletBalance(newBalance);
                window.walletManager.updateAllBalanceDisplays(); // Update display immediately
            } else {
                alert("Insufficient balance to make the reservation.");
                return; // Stop reservation process
            }
        } else {
            // Fallback or error if walletManager is not available
            console.error("walletManager not found. Cannot process transaction.");
            alert("Error processing payment. Please try again.");
            return;
        }
        
        const dateValue = document.getElementById('reservationDate').value;
        const timeValue = document.getElementById('reservationTime').textContent;
        // Ensure timeValue is formatted as "HH:mm - HH:mm"
        const startTime = timeValue; // Assuming `timeValue` is the start time
        const endTime = new Date(new Date().setHours(...startTime.split(':').map(Number)));
        endTime.setMinutes(endTime.getMinutes());
        const formattedEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
        const reservationTime = `${startTime} - ${formattedEndTime}`;
        // Calculate total fee
        const reservationRatePerMinute = 0.07; // 0.07€/min
        const durationMinutes = 60; // Default duration is 1 hour (60 minutes)
        const totalFee = durationMinutes * reservationRatePerMinute;
        console.log("Reserving station:", stationId, "Date:", dateValue, "Time:", reservationTime, "Total Fee:", totalFee);

        // Store reservation details in localStorage
        if (selectedStation) {
            const reservationDetails = {
                id: Date.now(),
                stationId: selectedStation.id,
                stationName: selectedStation.name,
                stationAddress: selectedStation.address,
                reservationDate: dateValue,
                reservationTimeInterval: reservationTime,
                reservationMadeTimestamp: new Date().toISOString(),
                totalFee: totalFee.toFixed(2),
                reservationRate: reservationRatePerMinute.toFixed(2)
            };

            let history = JSON.parse(localStorage.getItem('reservationHistory')) || [];
            history.unshift(reservationDetails); // Add new reservation to the beginning
            localStorage.setItem('reservationHistory', JSON.stringify(history));
        }


        let reservationUrl = `reservation.html?stationId=${encodeURIComponent(stationId)}`;
        if (selectedStation) {
            reservationUrl += `&stationName=${encodeURIComponent(selectedStation.name)}`;
            reservationUrl += `&stationAddress=${encodeURIComponent(selectedStation.address)}`;
        }
        reservationUrl += `&date=${encodeURIComponent(dateValue)}`;
        reservationUrl += `&time=${encodeURIComponent(reservationTime)}`;
        reservationUrl += `&totalFee=${encodeURIComponent(totalFee.toFixed(2))}`; // Pass total fee
        window.location.href = reservationUrl;
    });

    // Make header icons clickable
    const homeHeaderIcon = document.querySelector('.main-header .fa-home');
    const profileHeaderIcon = document.querySelector('.main-header .fa-user');
    if(homeHeaderIcon) homeHeaderIcon.parentElement.addEventListener('click', () => window.location.href = 'index.html');
    if(profileHeaderIcon) profileHeaderIcon.parentElement.addEventListener('click', () => window.location.href = 'profile.html');

    // --- RESERVATION FEE LOGIC ---
    function updateReservationFee() {
        const timePickerInput = document.getElementById('reservationTime').textContent;
        const userBalanceElement = document.querySelector('.user-balance-info span');
        const reservationFeeElement = document.querySelector('.reservation-fee-info span');

        const currentTime = new Date();
        const [currentHour, currentMinute] = [currentTime.getHours(), currentTime.getMinutes()];
        const [selectedHour, selectedMinute] = timePickerInput.split(':').map(Number);

        // Calculate the total difference in minutes
        const hourDifference = selectedHour - currentHour;
        const minuteDifference = selectedMinute - currentMinute;
        const totalMinutes = hourDifference * 60 + minuteDifference;

        const baseFee = 3; // Base fee of 3€
        let fee = baseFee; // Start with base fee
        if (totalMinutes > 0) {
            fee += totalMinutes * 0.07; // Add time fee
        }

        reservationFeeElement.textContent = `${fee.toFixed(2)}€`; // Update fee display
    }

    // Use MutationObserver to detect changes in the reservationTime element
    const reservationTimeElement = document.getElementById('reservationTime');
    const observer = new MutationObserver(() => {
        updateReservationFee();
        // Ensure balance display is also up-to-date if the reservation panel is visible
        if (reservationView.classList.contains('hidden') === false && window.walletManager && typeof window.walletManager.updateAllBalanceDisplays === 'function') {
            window.walletManager.updateAllBalanceDisplays();
        }
    });

    observer.observe(reservationTimeElement, { childList: true, characterData: true, subtree: true });

    // Call the function initially to set the default fee
    updateReservationFee();

    // --- TAG SHRINKING LOGIC ---
    function adjustTagsForSpace() {
        const stationItems = document.querySelectorAll('.station-item');
        stationItems.forEach(item => {
            const tags = item.querySelectorAll('.station-tag');
            tags.forEach(tag => {
                if (item.offsetWidth < 300) { // Adjust threshold as needed
                    tag.classList.add('shrink');
                } else {
                    tag.classList.remove('shrink');
                }
            });
        });
    }

    window.addEventListener('resize', adjustTagsForSpace);
    document.addEventListener('DOMContentLoaded', adjustTagsForSpace);

    // --- INITIAL RENDER ---
    applyFilters();
    filterButtons.forEach(button => {
        if (button.dataset.filter === 'nearby') {
            button.classList.add('active'); // Highlight the "nearby" filter button
        }
    });
    showListView(); // Ensure list view is the default
    initializeTimePicker();
    // Initial call to update balance display on search page load, handled by navigation.js
    // but if specific updates are needed here for the reservation panel when it's first shown:
    if (window.walletManager && typeof window.walletManager.updateAllBalanceDisplays === 'function') {
        window.walletManager.updateAllBalanceDisplays();
    }
});