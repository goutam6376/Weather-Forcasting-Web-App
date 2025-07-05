// Weather data for 20 cities with 5 parameters each
const weatherData = {
    "new york": {
        city: "New York",
        country: "USA",
        temperature: 22,
        humidity: 65,
        windSpeed: 12,
        condition: "partly cloudy",
        pressure: 1013,
        icon: "fas fa-cloud-sun"
    },
    "london": {
        city: "London",
        country: "UK",
        temperature: 15,
        humidity: 78,
        windSpeed: 8,
        condition: "cloudy",
        pressure: 1008,
        icon: "fas fa-cloud"
    },
    "paris": {
        city: "Paris",
        country: "France",
        temperature: 18,
        humidity: 72,
        windSpeed: 6,
        condition: "light rain",
        pressure: 1010,
        icon: "fas fa-cloud-rain"
    },
    "tokyo": {
        city: "Tokyo",
        country: "Japan",
        temperature: 25,
        humidity: 68,
        windSpeed: 10,
        condition: "sunny",
        pressure: 1015,
        icon: "fas fa-sun"
    },
    "sydney": {
        city: "Sydney",
        country: "Australia",
        temperature: 28,
        humidity: 55,
        windSpeed: 15,
        condition: "clear",
        pressure: 1018,
        icon: "fas fa-sun"
    },
    "berlin": {
        city: "Berlin",
        country: "Germany",
        temperature: 16,
        humidity: 75,
        windSpeed: 9,
        condition: "overcast",
        pressure: 1006,
        icon: "fas fa-cloud"
    },
    "moscow": {
        city: "Moscow",
        country: "Russia",
        temperature: 8,
        humidity: 82,
        windSpeed: 14,
        condition: "snow",
        pressure: 1002,
        icon: "fas fa-snowflake"
    },
    "dubai": {
        city: "Dubai",
        country: "UAE",
        temperature: 35,
        humidity: 45,
        windSpeed: 7,
        condition: "hot",
        pressure: 1012,
        icon: "fas fa-sun"
    },
    "mumbai": {
        city: "Mumbai",
        country: "India",
        temperature: 32,
        humidity: 85,
        windSpeed: 11,
        condition: "humid",
        pressure: 1009,
        icon: "fas fa-cloud-sun"
    },
    "singapore": {
        city: "Singapore",
        country: "Singapore",
        temperature: 30,
        humidity: 88,
        windSpeed: 5,
        condition: "tropical",
        pressure: 1011,
        icon: "fas fa-cloud-sun"
    },
    "los angeles": {
        city: "Los Angeles",
        country: "USA",
        temperature: 26,
        humidity: 58,
        windSpeed: 8,
        condition: "sunny",
        pressure: 1016,
        icon: "fas fa-sun"
    },
    "toronto": {
        city: "Toronto",
        country: "Canada",
        temperature: 12,
        humidity: 70,
        windSpeed: 13,
        condition: "windy",
        pressure: 1005,
        icon: "fas fa-wind"
    },
    "barcelona": {
        city: "Barcelona",
        country: "Spain",
        temperature: 23,
        humidity: 62,
        windSpeed: 9,
        condition: "pleasant",
        pressure: 1014,
        icon: "fas fa-cloud-sun"
    },
    "rome": {
        city: "Rome",
        country: "Italy",
        temperature: 21,
        humidity: 66,
        windSpeed: 7,
        condition: "mild",
        pressure: 1013,
        icon: "fas fa-cloud-sun"
    },
    "amsterdam": {
        city: "Amsterdam",
        country: "Netherlands",
        temperature: 14,
        humidity: 76,
        windSpeed: 11,
        condition: "breezy",
        pressure: 1007,
        icon: "fas fa-wind"
    },
    "bangkok": {
        city: "Bangkok",
        country: "Thailand",
        temperature: 33,
        humidity: 80,
        windSpeed: 6,
        condition: "hot and humid",
        pressure: 1010,
        icon: "fas fa-thermometer-full"
    },
    "mexico city": {
        city: "Mexico City",
        country: "Mexico",
        temperature: 20,
        humidity: 60,
        windSpeed: 8,
        condition: "moderate",
        pressure: 1012,
        icon: "fas fa-cloud-sun"
    },
    "cairo": {
        city: "Cairo",
        country: "Egypt",
        temperature: 29,
        humidity: 40,
        windSpeed: 12,
        condition: "dry",
        pressure: 1015,
        icon: "fas fa-sun"
    },
    "stockholm": {
        city: "Stockholm",
        country: "Sweden",
        temperature: 10,
        humidity: 73,
        windSpeed: 9,
        condition: "cool",
        pressure: 1004,
        icon: "fas fa-cloud"
    },
    "istanbul": {
        city: "Istanbul",
        country: "Turkey",
        temperature: 19,
        humidity: 68,
        windSpeed: 10,
        condition: "variable",
        pressure: 1011,
        icon: "fas fa-cloud-sun"
    }
};

// DOM elements
const citySearchInput = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const weatherGrid = document.getElementById('weatherGrid');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const noResults = document.getElementById('noResults');

// State management
let isSearching = false;
let displayedCities = [];
let selectedSuggestionIndex = -1;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Start with empty weather grid - don't display all cities
    hideError();
    hideNoResults();
    showWelcomeMessage();
    
    // Add event listeners
    citySearchInput.addEventListener('input', handleSearchInput);
    citySearchInput.addEventListener('keypress', handleKeyPress);
    searchBtn.addEventListener('click', handleSearch);
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-section')) {
            hideSearchResults();
        }
    });
});

/**
 * Display all cities on initial load
 */
function displayAllCities() {
    try {
        const cities = Object.keys(weatherData);
        displayedCities = cities;
        renderWeatherCards(cities);
        hideError();
        hideNoResults();
    } catch (error) {
        showError('Failed to load weather data. Please refresh the page.');
        console.error('Error displaying cities:', error);
    }
}

/**
 * Handle search input changes
 */
function handleSearchInput(event) {
    const query = event.target.value.trim();
    
    if (query.length === 0) {
        hideSearchResults();
        clearWeatherGrid();
        showWelcomeMessage();
        return;
    }
    
    if (query.length >= 1) {
        hideWelcomeMessage();
        showSearchSuggestions(query);
        // Also filter the main weather cards as user types
        searchCities(query);
    }
}

/**
 * Handle key press events
 */
function handleKeyPress(event) {
    const suggestions = searchResults.querySelectorAll('.search-result-item');
    
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
        updateSuggestionSelection(suggestions);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
        updateSuggestionSelection(suggestions);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
            const cityKey = suggestions[selectedSuggestionIndex].dataset.cityKey;
            selectCity(cityKey);
        } else {
            handleSearch();
        }
    } else if (event.key === 'Escape') {
        hideSearchResults();
        selectedSuggestionIndex = -1;
    }
}

/**
 * Handle search button click
 */
function handleSearch() {
    const query = citySearchInput.value.trim();
    
    if (query.length === 0) {
        displayAllCities();
        return;
    }
    
    searchCities(query);
    hideSearchResults();
}

/**
 * Show search suggestions
 */
function showSearchSuggestions(query) {
    const suggestions = findMatchingCities(query);
    
    if (suggestions.length === 0) {
        hideSearchResults();
        return;
    }
    
    // Limit suggestions to 5 for better UX
    const limitedSuggestions = suggestions.slice(0, 5);
    
    const suggestionsHTML = limitedSuggestions.map(city => 
        `<div class="search-result-item" data-city-key="${city}" onclick="selectCity('${city}')">${weatherData[city].city}, ${weatherData[city].country}</div>`
    ).join('');
    
    searchResults.innerHTML = suggestionsHTML;
    searchResults.classList.remove('hidden');
    selectedSuggestionIndex = -1; // Reset selection when showing new suggestions
}

/**
 * Hide search results
 */
function hideSearchResults() {
    searchResults.classList.add('hidden');
    selectedSuggestionIndex = -1;
}

/**
 * Update suggestion selection highlighting
 */
function updateSuggestionSelection(suggestions) {
    suggestions.forEach((suggestion, index) => {
        suggestion.classList.toggle('selected', index === selectedSuggestionIndex);
    });
}

/**
 * Select a city from suggestions
 */
function selectCity(cityKey) {
    const cityData = weatherData[cityKey];
    citySearchInput.value = cityData.city;
    hideSearchResults();
    hideWelcomeMessage();
    displayedCities = [cityKey];
    renderWeatherCards([cityKey]);
    hideError();
    hideNoResults();
}

/**
 * Search for cities
 */
function searchCities(query) {
    try {
        const matchingCities = findMatchingCities(query);
        
        if (matchingCities.length === 0) {
            displayedCities = [];
            weatherGrid.innerHTML = '';
            showNoResults();
            hideError();
            return;
        }
        
        displayedCities = matchingCities;
        renderWeatherCards(matchingCities);
        hideError();
        hideNoResults();
        
    } catch (error) {
        showError('An error occurred while searching. Please try again.');
        console.error('Search error:', error);
    }
}

/**
 * Find cities matching the search query
 */
function findMatchingCities(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    return Object.keys(weatherData).filter(cityKey => {
        const city = weatherData[cityKey];
        return city.city.toLowerCase().includes(normalizedQuery) ||
               city.country.toLowerCase().includes(normalizedQuery) ||
               cityKey.includes(normalizedQuery);
    });
}

/**
 * Render weather cards for given cities
 */
function renderWeatherCards(cityKeys) {
    try {
        const cardsHTML = cityKeys.map(cityKey => {
            const city = weatherData[cityKey];
            return createWeatherCard(city);
        }).join('');
        
        weatherGrid.innerHTML = cardsHTML;
        
        // Add animation to cards
        const cards = weatherGrid.querySelectorAll('.weather-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
    } catch (error) {
        showError('Failed to display weather information. Please try again.');
        console.error('Render error:', error);
    }
}

/**
 * Create HTML for a weather card
 */
function createWeatherCard(city) {
    return `
        <div class="weather-card">
            <h2 class="city-name">${city.city}, ${city.country}</h2>
            
            <div class="weather-main">
                <div class="temperature">${city.temperature}°C</div>
                <div class="weather-icon">
                    <i class="${city.icon}"></i>
                </div>
            </div>
            
            <div class="weather-condition">${city.condition}</div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-tint detail-icon"></i>
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${city.humidity}%</span>
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-wind detail-icon"></i>
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${city.windSpeed} km/h</span>
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-thermometer-half detail-icon"></i>
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value">${city.pressure} hPa</span>
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-eye detail-icon"></i>
                    <span class="detail-label">Condition</span>
                    <span class="detail-value">${getConditionText(city.condition)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get formatted condition text
 */
function getConditionText(condition) {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
}

/**
 * Show error message
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
}

/**
 * Show no results message
 */
function showNoResults() {
    noResults.classList.remove('hidden');
}

/**
 * Hide no results message
 */
function hideNoResults() {
    noResults.classList.add('hidden');
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    weatherGrid.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-content">
                <i class="fas fa-cloud-sun welcome-icon"></i>
                <h2>Welcome to Weather Forecast</h2>
                <p>Search for any city to get current weather information</p>
                <div class="available-cities">
                    <h3>Available Cities:</h3>
                    <div class="city-tags">
                        ${Object.keys(weatherData).map(cityKey => 
                            `<span class="city-tag" onclick="selectCity('${cityKey}')">${weatherData[cityKey].city}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Hide welcome message
 */
function hideWelcomeMessage() {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
}

/**
 * Clear weather grid
 */
function clearWeatherGrid() {
    weatherGrid.innerHTML = '';
}

/**
 * Utility function to debounce search input
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create debounced search function
const debouncedSearch = debounce(handleSearchInput, 300);

// Replace the input event listener with debounced version for better performance
citySearchInput.removeEventListener('input', handleSearchInput);
citySearchInput.addEventListener('input', debouncedSearch);

// Error handling for unexpected errors
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showError('An unexpected error occurred. Please refresh the page.');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showError('A network error occurred. Please check your connection and try again.');
});
