document.addEventListener('DOMContentLoaded', () => {
    const chooseVehiclePage = document.getElementById('chooseVehiclePage');
    const vehicleFormPage = document.getElementById('vehicleFormPage');
    const vehicleListDiv = document.getElementById('vehicleList');
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const vehicleForm = document.getElementById('vehicleForm');
    const headerTitle = document.getElementById('headerTitle');
    const backButton = document.getElementById('backButton');
    const saveVehicleButton = document.getElementById('saveVehicleButton');
    const formVehicleImage = document.getElementById('formVehicleImage'); // For future image changes

    let vehicles = [];
    let currentEditVehicleId = null;
    let selectedVehicleId = null;

    const defaultCarImageUrl = 'https://www.polestar.com/dato-assets/11286/1684239003-240516-polestar-2-bsc-position-06-front-3-4-winter-tyres.png?auto=format&dpr=1&w=200'; // Default/Placeholder


    // --- DATA MANAGEMENT ---
    function loadVehicles() {
        const storedVehicles = localStorage.getItem('vehicles');
        if (storedVehicles) {
            vehicles = JSON.parse(storedVehicles);
        } else {
            // Default vehicles if none stored
            vehicles = [
                { id: 'v1', name: 'My Polestar', brand: 'Polestar', model: '2', licensePlate: 'AB-123-CD', releaseDate: '2023-05', imageUrl: defaultCarImageUrl, stats: { distanceMade: 50, reservations: 12, charges: 3, moneySaved: 82 } },
                { id: 'v2', name: 'Family SUV', brand: 'Volvo', model: 'XC60', licensePlate: 'EF-456-GH', releaseDate: '2022-01', imageUrl: defaultCarImageUrl, stats: { distanceMade: 150, reservations: 5, charges: 10, moneySaved: 120 } }
            ];
            saveVehicles();
        }
        const storedSelectedId = localStorage.getItem('selectedVehicleId');
        if(storedSelectedId) {
            selectedVehicleId = storedSelectedId;
        }
    }

    function saveVehicles() {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }

    function saveSelectedVehicleId() {
        if(selectedVehicleId) {
            localStorage.setItem('selectedVehicleId', selectedVehicleId);
        } else {
            localStorage.removeItem('selectedVehicleId');
        }
    }

    // --- RENDERING ---
    function renderVehicleList() {
        vehicleListDiv.innerHTML = '';
        if (vehicles.length === 0) {
            vehicleListDiv.innerHTML = '<p style="text-align:center; color:#777;">No vehicles added yet. Click the + button to add one.</p>';
        }
        vehicles.forEach((vehicle, index) => {
            const card = document.createElement('div');
            card.classList.add('vehicle-card');
            card.dataset.id = vehicle.id;
            if (vehicle.id === selectedVehicleId) {
                card.classList.add('selected');
            }

            // Use a more generic car image for list items for simplicity or vehicle.imageUrl
            const displayImageUrl = vehicle.imageUrl || defaultCarImageUrl;

            card.innerHTML = `
                <div class="vehicle-card-image-container">
                    <img src="${displayImageUrl}" alt="${vehicle.name}">
                    <span class="image-overlay-number-small">${index + 1}</span>
                </div>
                <div class="vehicle-card-info">
                    <h3>${vehicle.name}</h3>
                    <div class="vehicle-stats">
                        <div class="stat-item"><i class="fas fa-charging-station"></i> ${vehicle.stats.distanceMade} km</div>
                        <div class="stat-item"><i class="fas fa-route"></i> ${vehicle.stats.reservations}</div>
                        <div class="stat-item"><i class="fas fa-plug"></i> ${vehicle.stats.charges}</div>
                        <div class="stat-item"><i class="fas fa-piggy-bank"></i> ~${vehicle.stats.moneySaved}€</div>
                    </div>
                </div>
                <button class="edit-vehicle-icon" data-id="${vehicle.id}"><i class="fas fa-pencil-alt"></i></button>
            `;
            card.addEventListener('click', () => handleSelectVehicle(vehicle.id));
            card.querySelector('.edit-vehicle-icon').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                handleEditVehicle(vehicle.id);
            });
            vehicleListDiv.appendChild(card);
        });
    }

    // --- NAVIGATION & PAGE HANDLING ---
    function showPage(pageId, title) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        headerTitle.textContent = title;
    }

    // --- EVENT HANDLERS ---
    function handleSelectVehicle(vehicleId) {
        selectedVehicleId = vehicleId;
        saveSelectedVehicleId();
        renderVehicleList(); // Re-render to show selection
        // Could also navigate or perform another action here
        console.log("Selected vehicle:", vehicleId);
    }

    function handleAddVehicle() {
        currentEditVehicleId = null;
        vehicleForm.reset();
        formVehicleImage.src = defaultCarImageUrl; // Reset image to default for new car
        // document.querySelector('.image-overlay-number').textContent = ''; // Clear overlay number for new
        saveVehicleButton.textContent = "Save Vehicle";
        showPage('vehicleFormPage', 'Add your vehicle');
    }

    function handleEditVehicle(vehicleId) {
        currentEditVehicleId = vehicleId;
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            document.getElementById('vehicleName').value = vehicle.name;
            document.getElementById('vehicleLicensePlate').value = vehicle.licensePlate;
            document.getElementById('vehicleModel').value = vehicle.model;
            document.getElementById('vehicleBrand').value = vehicle.brand;
            document.getElementById('vehicleReleaseDate').value = vehicle.releaseDate;
            formVehicleImage.src = vehicle.imageUrl || defaultCarImageUrl;
            // const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
            // document.querySelector('.image-overlay-number').textContent = vehicleIndex + 1;
            saveVehicleButton.textContent = "Save Changes";
            showPage('vehicleFormPage', 'Edit your vehicle');
        }
    }

    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(vehicleForm);
        const vehicleData = {
            name: formData.get('vehicleName'),
            licensePlate: formData.get('vehicleLicensePlate'),
            model: formData.get('vehicleModel'),
            brand: formData.get('vehicleBrand'),
            releaseDate: formData.get('vehicleReleaseDate'),
            imageUrl: formVehicleImage.src, // Could allow changing this
            // Stats would typically be updated by other app logic, not directly in this form
            // For simplicity, we'll keep existing stats or initialize new ones.
            stats: currentEditVehicleId ? vehicles.find(v => v.id === currentEditVehicleId).stats : { distanceMade: 0, reservations: 0, charges: 0, moneySaved: 0 }
        };

        if (currentEditVehicleId) {
            const index = vehicles.findIndex(v => v.id === currentEditVehicleId);
            vehicles[index] = { ...vehicles[index], ...vehicleData };
        } else {
            vehicleData.id = 'v' + (Date.now().toString()); // Simple unique ID
            vehicles.push(vehicleData);
        }
        saveVehicles();
        renderVehicleList();
        showPage('chooseVehiclePage', 'Choose your vehicle');
    });

    addVehicleBtn.addEventListener('click', handleAddVehicle);
    
    backButton.addEventListener('click', () => {
        if (vehicleFormPage.classList.contains('active')) {
            showPage('chooseVehiclePage', 'Choose your vehicle');
        } else if (chooseVehiclePage.classList.contains('active')) {
            window.history.back();
        }
    });

    // Clear input button functionality
    document.querySelectorAll('.clear-input-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.previousElementSibling.value = '';
            this.previousElementSibling.focus();
        });
    });


    // --- INITIALIZATION ---
    loadVehicles();
    renderVehicleList();
    backButton.classList.remove('hidden'); // Ensure this line is present to make the button visible
    showPage('chooseVehiclePage', 'Choose your vehicle');
});