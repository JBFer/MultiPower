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
    const enterprises = [
        { name: "Enterprise A", id: "A" },
        { name: "Enterprise B", id: "B" },
        { name: "Enterprise C", id: "C" },
        { name: "Enterprise D", id: "D" },
        { name: "Enterprise E", id: "E" },
        { name: "Enterprise F", id: "F" },
        { name: "Enterprise G", id: "G" },
        { name: "Enterprise H", id: "H" }
    ];

    function renderEnterprises() {
        enterpriseGrid.innerHTML = ''; // Clear existing
        enterprises.forEach(enterprise => {
            const cardLink = document.createElement('a');
            cardLink.href = `enterpriseProfile.html?name=${encodeURIComponent(enterprise.name)}`;
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