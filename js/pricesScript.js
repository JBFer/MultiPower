document.addEventListener('DOMContentLoaded', function() {
    const timeFilterButtons = document.querySelectorAll('.time-filter-btn');
    const enterpriseGrid = document.querySelector('.enterprise-grid');

    // --- Time Filter Button Logic ---
    timeFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            timeFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            this.classList.add('active');

            const filter = this.dataset.filter;
            console.log("Selected time filter:", filter);
            // In a real app, you would call a function here to reload/filter data
            // loadPriceData(filter);
            updateEnterpriseSectionBasedOnFilter(filter); // Example
        });
    });

    // --- Populate Enterprise Grid ---
    const enterprises = [ // Ensure IDs are unique and meaningful if possible
        { name: "Enterprise A", id: "enterprise_a_001" },
        { name: "Enterprise B", id: "enterprise_b_002" },
        { name: "Enterprise C", id: "enterprise_c_003" },
        { name: "Enterprise D", id: "enterprise_d_004" },
        { name: "Enterprise E", id: "enterprise_e_005" },
        { name: "Enterprise F", id: "enterprise_f_006" },
        { name: "Enterprise G", id: "enterprise_g_007" },
        { name: "Enterprise H", id: "enterprise_h_008" }
    ];

    function renderEnterprises() {
        enterpriseGrid.innerHTML = ''; // Clear existing
        enterprises.forEach(enterprise => {
            const cardLink = document.createElement('a');
            // Pass both name and id
            cardLink.href = `enterpriseProfile.html?name=${encodeURIComponent(enterprise.name)}&id=${encodeURIComponent(enterprise.id)}`;
            cardLink.classList.add('enterprise-card');

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('enterprise-name');
            nameSpan.textContent = enterprise.name;

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-bolt', 'enterprise-icon');

            cardLink.appendChild(nameSpan);
            cardLink.appendChild(icon);
            enterpriseGrid.appendChild(cardLink);
        });
    }

    renderEnterprises(); // Initial render

    // --- Placeholder for updating content based on filter ---
    function updateEnterpriseSectionBasedOnFilter(filter) {
        // This is where you might change which enterprises are shown,
        // or update the "Trending Stats" and "User Area Prices" based on the selected time.
        // For this prototype, it's mostly a visual change of the active button.
        console.log(`Updating content for filter: ${filter}`);

        // Example: Maybe "Live" filter shows fewer enterprises or different stats
        const trendingStatsSection = document.querySelector('.trending-stats-section h2');
        const userAreaPricesSection = document.querySelector('.user-area-prices-section h2');

        if (filter === 'live') {
            trendingStatsSection.textContent = "Live Enterprise Activity";
            userAreaPricesSection.textContent = "Current Price Snapshot";
        } else {
            trendingStatsSection.textContent = "Trending Enterprise Stats";
            userAreaPricesSection.textContent = "Price Trends in Your Area";
        }
    }
});