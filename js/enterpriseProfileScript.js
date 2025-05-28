document.addEventListener('DOMContentLoaded', function() {
    const enterpriseNameHeader = document.getElementById('enterpriseNameHeader');
    const seeMoreNewsLink = document.getElementById('seeMoreNewsLink');
    const newsTitleEl = document.getElementById('newsTitle');
    const newsSnippetEl = document.getElementById('newsSnippet');
    const newsAuthorEl = document.getElementById('newsAuthor');
    const timeFilterButtons = document.querySelectorAll('.time-filter-buttons-prices .time-filter-btn');

    const params = new URLSearchParams(window.location.search);
    const enterpriseName = params.get('name') || 'Selected Enterprise'; // From prices.html link
    const enterpriseId = params.get('id') || 'default_id'; // Assuming an ID is passed

    // Set enterprise name in header
    if (enterpriseNameHeader) {
        enterpriseNameHeader.textContent = decodeURIComponent(enterpriseName);
    }

    // Set "See more" news link
    if (seeMoreNewsLink) {
        seeMoreNewsLink.href = `news.html?enterprise_id=${encodeURIComponent(enterpriseId)}`;
    }

    // --- Time Filter Button Logic for Prices ---
    timeFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            console.log("Selected price time filter:", filter, "for enterprise:", enterpriseId);
            // In a real app, call a function to reload price chart data
            // loadPriceChartData(enterpriseId, filter);
        });
    });


    // --- Mock Data Loading (Replace with actual API calls) ---
    function loadEnterpriseData(id) {
        console.log(`Loading data for enterprise ID: ${id}`);
        // Mock specific news for this enterprise
        // In a real app, you'd fetch this.
        if (id === "A" || enterpriseName.includes("Enterprise A")) { // Example based on how you get the ID/name
            newsTitleEl.textContent = "Enterprise A's New Charging Tech";
            newsSnippetEl.textContent = "Enterprise A unveils groundbreaking fast-charging technology, reducing wait times significantly.";
            newsAuthorEl.textContent = "Tech Reporter";
        } else if (id === "B" || enterpriseName.includes("Enterprise B")) {
            newsTitleEl.textContent = "Enterprise B Expands Network";
            newsSnippetEl.textContent = "Discover new locations as Enterprise B rapidly expands its charging network across the region.";
            newsAuthorEl.textContent = "Business Insider";
        } else {
            // Default news
            newsTitleEl.textContent = "General Enterprise Update";
            newsSnippetEl.textContent = "Stay tuned for exciting developments from this leading charging provider.";
            newsAuthorEl.textContent = "App Team";
        }

        // Mock load price chart data (e.g., change image src or re-render canvas chart)
        // For now, the image is static.
    }

    loadEnterpriseData(enterpriseId);

});