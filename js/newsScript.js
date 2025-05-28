document.addEventListener('DOMContentLoaded', function() {
    const newsSearchInput = document.getElementById('newsSearchInput');
    const topicFilterButtons = document.querySelectorAll('.topic-filter-btn');
    const newsArticlesList = document.getElementById('news-articles-list');

    const dummyNewsData = [
        {
            id: 1,
            title: "Revolutionizing Urban Charging: New Downtown Hubs",
            author: "Alex Green",
            date: "Oct 26, 2023",
            topic: "topic1",
            imageText: "80x80",
            summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque consectetur diam eleifend commodo aliquam. Proin erat libero, tempus eget aliquet eu, suscipit quis metus. Sed sodales arcu malesuada, tincidunt sem ut, pretium felis.",
            isNew: true,
            enterpriseId: "enterprise_a_001" // Example
        },
        {
            id: 2,
            title: "The Future of EV Battery Technology Explored",
            author: "Maria Chen",
            date: "Oct 25, 2023",
            topic: "topic2",
            imageText: "80x80",
            summary: "Maecenas tincidunt, nisi at pulvinar finibus, nisl arcu malesuada tortor, ut faucibus ex augue sed risus. Proin commodo rutrum sapien vitae lobortis. Praesent vel eros vulputate, pretium nunc vel, egestas orci.",
            isNew: false,
            enterpriseId: "enterprise_b_002" // Example
        },
        {
            id: 3,
            title: "Government Incentives for EV Adoption Announced",
            author: "John Doe",
            date: "Oct 24, 2023",
            topic: "topic3",
            imageText: "80x80",
            summary: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus vitae gravida arcu. Integer nec ante ac sapien facilisis.",
            isNew: false
        },
        {
            id: 4,
            title: "Enterprise X Launches Solar-Powered Charging Stations",
            author: "Jane Smith",
            date: "Oct 23, 2023",
            topic: "topic1",
            imageText: "80x80",
            summary: "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.",
            isNew: true,
            enterpriseId: "enterprise_x_003" // Example
        },
        {
            id: 5,
            title: "Navigating Long-Distance EV Travel: Tips and Tricks",
            author: "Sam Wilson",
            date: "Oct 22, 2023",
            topic: "topic4",
            imageText: "80x80",
            summary: "Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.",
            isNew: false
        },
        {
            id: 6,
            title: "Smart Grids and EV Charging: A Synergistic Future",
            author: "Dr. Eva Rostova",
            date: "Oct 21, 2023",
            topic: "topic5",
            imageText: "80x80",
            summary: "Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.",
            isNew: false
        }
    ];

    let currentTopicFilter = "all";
    let currentSearchTerm = "";
    let currentEnterpriseFilter = null;

    function renderNewsArticles() {
        newsArticlesList.innerHTML = ''; // Clear existing articles

        let filteredNews = dummyNewsData;

        // 1. Filter by enterprise_id (from URL)
        if (currentEnterpriseFilter) {
            filteredNews = filteredNews.filter(article => article.enterpriseId === currentEnterpriseFilter);
        }

        // 2. Filter by topic button
        if (currentTopicFilter !== "all") {
            filteredNews = filteredNews.filter(article => article.topic === currentTopicFilter);
        }

        // 3. Filter by search term (title or summary)
        if (currentSearchTerm) {
            const searchTermLower = currentSearchTerm.toLowerCase();
            filteredNews = filteredNews.filter(article =>
                article.title.toLowerCase().includes(searchTermLower) ||
                article.summary.toLowerCase().includes(searchTermLower)
            );
        }

        if (filteredNews.length === 0) {
            newsArticlesList.innerHTML = '<p class="no-results">No news articles found matching your criteria.</p>';
            return;
        }

        filteredNews.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.classList.add('news-article-card');
            if (article.isNew) {
                articleCard.classList.add('is-new');
            }

            // Updated HTML structure: summary is now outside article-text-content
            // and after article-main-content
            articleCard.innerHTML = `
                <div class="article-main-content">
                    <div class="article-image-placeholder">${article.imageText}</div>
                    <div class="article-text-content">
                        <h3>${article.title}</h3>
                        <div class="article-meta">
                            <span>${article.author}, ${article.date}</span>
                        </div>
                        <span class="article-topic-tag">${article.topic.charAt(0).toUpperCase() + article.topic.slice(1)}</span>
                        
                    </div>
                </div>
                <p class="article-summary">${article.summary}</p> 
                <div class="see-more-bar">
                    <button class="see-more-button" data-article-id="${article.id}">
                        See more <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            newsArticlesList.appendChild(articleCard);
        });

        // Add event listeners to "See more" buttons
        document.querySelectorAll('.see-more-button').forEach(button => {
            button.addEventListener('click', function() {
                const articleId = this.dataset.articleId;
                alert(`"See more" clicked for article ID: ${articleId}. Full article view to be implemented.`);
                // In a real app, you might navigate to a detailed article page:
                // window.location.href = `article_detail.html?id=${articleId}`;
            });
        });
    }

    // --- Event Listeners for Filters ---
    topicFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            topicFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTopicFilter = this.dataset.topic;
            renderNewsArticles();
        });
    });

    newsSearchInput.addEventListener('input', function() {
        currentSearchTerm = this.value;
        renderNewsArticles();
    });

    // --- Handle Enterprise Filter from URL ---
    function initializeFilters() {
        const params = new URLSearchParams(window.location.search);
        const enterpriseIdFromUrl = params.get('enterprise_id');
        const newsPageTitle = document.querySelector('.main-header-news h1');

        if (enterpriseIdFromUrl) {
            currentEnterpriseFilter = enterpriseIdFromUrl;
            if (newsPageTitle) {
                 // Find enterprise name (mockup)
                const enterpriseName = enterpriseIdFromUrl.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()); // Simple name format
                newsPageTitle.textContent = `News for ${enterpriseName}`;
            }
            // Optionally, disable or hide topic filters if showing enterprise-specific news
            // document.querySelector('.topic-filter-buttons-news').style.display = 'none';
        } else if (newsPageTitle) {
            newsPageTitle.textContent = "News Feed";
        }

        renderNewsArticles(); // Initial render
    }

    initializeFilters();
});