document.addEventListener('DOMContentLoaded', function() {
    generateAveragePricesChart();

    // Navigation (optional, as hrefs are set directly in HTML)
    // Example:
    // document.getElementById('userProfileLink').addEventListener('click', () => window.location.href = 'profile.html');
    // document.getElementById('chooseCarLink').addEventListener('click', () => window.location.href = 'chooseCar.html');
    // document.getElementById('mapLink').addEventListener('click', () => window.location.href = 'search.html');
    // document.getElementById('pricesChartLink').addEventListener('click', () => window.location.href = 'prices.html');
});

function generateAveragePricesChart() {
    const suppliers = ["Supplier 1", "Supplier 2", "Supplier 3", "Supplier 4", "Supplier 5"];
    const yAxisLabelsContainer = document.getElementById('yAxisLabels');
    const barsContainer = document.getElementById('chartBars');
    const gridLinesContainer = document.getElementById('chartGridLines');
    const xAxisTicksContainer = document.getElementById('xAxisTicks');

    // Clear previous elements
    yAxisLabelsContainer.innerHTML = '';
    barsContainer.innerHTML = '';
    gridLinesContainer.innerHTML = '';
    xAxisTicksContainer.innerHTML = '';

    const tickValues = [0.40, 0.45, 0.50, 0.55];
    const minTick = Math.min(...tickValues);
    const maxTick = Math.max(...tickValues);
    const tickRange = maxTick - minTick;

    // Fixed height for chart elements for alignment
    const barHeight = 20; // px
    const barMarginBottom = 5; // px

    suppliers.forEach((supplierName, index) => {
        // Create Y-axis label
        const labelDiv = document.createElement('div');
        labelDiv.textContent = supplierName;
        yAxisLabelsContainer.appendChild(labelDiv);

        // Generate random price for the bar
        let price = (Math.random() * (maxTick - minTick) + minTick);
        // Ensure price is within the visual range of ticks or slightly beyond for variety if desired
        // For this example, let's constrain it to be at least minTick
        price = Math.max(minTick, price); 
        // And not significantly beyond maxTick, or cap at maxTick for strictness
        price = Math.min(price, maxTick + (tickValues[1]-tickValues[0])*0.5); // Allow a little over last tick for visual
        
        const constrainedPriceForWidth = Math.max(minTick, Math.min(price, maxTick));


        // Create bar item container
        const barItemDiv = document.createElement('div');
        barItemDiv.classList.add('chart-bar-item');
        barItemDiv.style.height = `${barHeight}px`;
        if (index < suppliers.length - 1) {
            barItemDiv.style.marginBottom = `${barMarginBottom}px`;
        }
        
        const bar = document.createElement('div');
        bar.classList.add('bar');
        
        // Calculate width: percentage relative to the displayed tick range
        const barWidthPercent = tickRange > 0 ? ((constrainedPriceForWidth - minTick) / tickRange) * 100 : 0;
        bar.style.width = `${Math.max(0, Math.min(barWidthPercent, 100))}%`; // Ensure width is between 0 and 100

        barItemDiv.appendChild(bar);
        barsContainer.appendChild(barItemDiv);
    });
    
    // Set height of grid lines container to match bars container
    const totalChartHeight = suppliers.length * barHeight + (suppliers.length - 1) * barMarginBottom;
    gridLinesContainer.style.height = `${totalChartHeight}px`;


    // Create X-axis ticks and grid lines
    tickValues.forEach(tick => {
        const positionPercent = tickRange > 0 ? ((tick - minTick) / tickRange) * 100 : 0;

        // Add tick label
        const tickLabel = document.createElement('span');
        tickLabel.classList.add('x-axis-tick-label');
        tickLabel.textContent = tick.toFixed(2);
        tickLabel.style.left = `${positionPercent}%`;
        xAxisTicksContainer.appendChild(tickLabel);

        // Add grid line (dashed line)
        if (positionPercent >= 0 && positionPercent <= 100) { // Only draw lines within the chart bounds
            const gridLine = document.createElement('div');
            gridLine.classList.add('grid-line');
            gridLine.style.left = `${positionPercent}%`;
            gridLinesContainer.appendChild(gridLine);
        }
    });
}