// Object containing specific texts for different coins
const coinSpecificText = {
    'LUNC': "Remember the good old days in TERRA? That was KUJIRA's first home, and oh boy, what a journey it has been! Sure, we all felt the heartache during TERRA's fall. But don’t you worry, the spirit and community that made TERRA so great didn’t vanish – it just moved house to KUJIRA! Here, we’re not just reminiscing the good times; we’re creating new ones, stronger  than ever. ",
    'INJECTIVE': "INJECTIVE and KUJIRA, both shining stars in the COSMOS ecosystem, but let's be honest, when it comes to being the heart of DeFi, KUJIRA takes the crown. INJECTIVE's doing a great job, no doubt. But KUJIRA it's the grand central station of DeFi within COSMOS ecosystem.",
    'OSMOSIS': "OSMOSIS might have its charm with all that 'expanding universe' vibe, but let's face it, it's a bit too inflationary for our taste. Meanwhile, KUJIRA is over here offering real yield, no inflationary tricks, just real 'hodl' and chill. Why inflate when you can appreciate? With KUJIRA, it's not just growth; it's sustainable, real growth – the kind that doesn't just vanish into thin air!",
    'ATOM': "ATOM, ah, the beloved patriarch of the COSMOS ecosystem, will always hold a special place in our crypto-hearts. But let's face it, too much... drama. Less drama, more development – that's the KUJIRA way. Here, the only drama you'll find is the excitement of innovation."
};

// Object to keep references to the charts
const charts = {};

// Event listener for the DOMContentLoaded event to trigger market cap comparison after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    compareMarketCaps();
});

// Async function to fetch market cap data for a given coin using the CoinGecko API
const fetchMarketCap = async (coinId) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = await response.json();
        return data.market_data.market_cap.usd;
    } catch (error) {
        console.error('Error fetching market cap:', error);
    }
};

// Function to create a horizontal bar chart in a given container
const createHorizontalBarChart = (containerId, otherCoinLabel, otherCoinMarketCap, kujiraMarketCap, specificText) => {
    const canvas = document.getElementById(containerId);
    if (!canvas) {
        console.error(`Canvas element with ID '${containerId}' not found.`);
        return;
    }

    // Destroy existing chart in the container if present
    if (charts[containerId]) {
        charts[containerId].destroy();
    }

    const ctx = canvas.getContext('2d');
    const kujiraPercentage = (kujiraMarketCap / otherCoinMarketCap) * 100;
    const flippeningTitle = `The flippening from Kujira to ${otherCoinLabel} is completed at...`;

    // Creating a new Chart instance for the canvas
    charts[containerId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Market Cap'],
            datasets: [
                {
                    label: 'KUJIRA Market Cap',
                    data: [kujiraPercentage],
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    stack: 'stack1'
                },
                {
                    data: [100 - kujiraPercentage],
                    backgroundColor: 'rgba(100, 100, 100, 0.5)',
                    stack: 'stack1'
                }
            ]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100
                },
                y: {  
                    display: false 
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: flippeningTitle,
                    font: {
                        size: 16
                    },
                    color: 'white'
                },
                annotation: {
                    annotations: {
                        labelAnnotation: {
                            type: 'label',
                            xValue: 50,  
                            yValue: 0,
                            content: `${kujiraPercentage.toFixed(1)}%`,
                            borderRadius: 4,
                            color: 'white',
                            textAlign: 'center',
                            font: {
                                size: 20,
                                weight: 'bold'
                            }
                        }
                    }
            }
        }
        }
    });

    // Updating market cap information and specific text for the chart
    updateMarketCapInfo(containerId, kujiraMarketCap, otherCoinMarketCap, otherCoinLabel);
    const textElement = document.getElementById(`specificText${containerId.charAt(containerId.length - 1)}`);
    if (textElement) {
        textElement.textContent = specificText;
    }
};

// Function to update market cap information displayed on the webpage
const updateMarketCapInfo = (containerId, kujiraMarketCap, otherCoinMarketCap, otherCoinLabel) => {
    const marketCapElementId = `marketCap${containerId.charAt(containerId.length - 1)}`;
    const marketCapElement = document.getElementById(marketCapElementId);
    if (marketCapElement) {
        marketCapElement.innerHTML = 
            `<strong>${otherCoinLabel} Market Cap:</strong> $${otherCoinMarketCap.toLocaleString()}, ` +
            `<strong>KUJIRA Market Cap:</strong> $${kujiraMarketCap.toLocaleString()}`;
    }
};

// Main function to compare market caps of different coins with KUJIRA
const compareMarketCaps = async () => {
    const kujiraMarketCap = await fetchMarketCap('kujira');
    const coins = [
        { id: 'terra-luna', name: 'LUNC' },
        { id: 'injective-protocol', name: 'INJECTIVE' },
        { id: 'osmosis', name: 'OSMOSIS' },
        { id: 'cosmos', name: 'ATOM' }
    ];

    const marketCaps = await Promise.all(coins.map(coin => fetchMarketCap(coin.id)));

    // Processing and sorting the market cap data
        const coinMarketCaps = coins.map((coin, index) => ({
        name: coin.name,
        marketCap: marketCaps[index],
        percentage: (marketCaps[index] / kujiraMarketCap) * 100
    }));
    
    coinMarketCaps.sort((a, b) => a.percentage - b.percentage);

    // Creating charts for each coin
    coinMarketCaps.forEach((coin, index) => {
        const containerId = `chart${index + 1}`;
        const specificText = coinSpecificText[coin.name] || '';
        createHorizontalBarChart(containerId, coin.name, coin.marketCap, kujiraMarketCap, specificText);
    });
};
