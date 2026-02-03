/**
 * Gem Dashboard - Application Logic
 * Handles filtering, searching, and clipboard functionality
 */

// Application State
const state = {
    gems: [],
    currentFilter: 'all',
    searchQuery: '',
    workModeActive: false
};

// DOM Elements
const elements = {
    heroGems: document.getElementById('essentials-gems'),
    processorGems: document.getElementById('toolkit-gems'),
    archiveGems: document.getElementById('miscellaneous-gems'),
    tierHero: document.getElementById('tier-essentials'),
    tierProcessor: document.getElementById('tier-toolkit'),
    tierArchive: document.getElementById('tier-miscellaneous'),
    searchInput: document.getElementById('search-input'),
    filterPills: document.querySelectorAll('.filter-pill'),
    workModeToggle: document.getElementById('work-mode-toggle'),
    toast: document.getElementById('toast')
};

/**
 * Initialize the application
 */
async function init() {
    try {
        await loadGems();
        renderGems();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showError('Failed to load gems. Please refresh the page.');
    }
}

/**
 * Load gems data from JSON file
 */
async function loadGems() {
    const response = await fetch('gems.json');
    if (!response.ok) {
        throw new Error('Failed to fetch gems.json');
    }
    const data = await response.json();
    state.gems = data.gems;
}

/**
 * Render gems into their respective tier containers
 */
function renderGems() {
    const filteredGems = getFilteredGems();

    // Group by tier
    const heroGems = filteredGems.filter(gem => gem.tier === 'essentials');
    const processorGems = filteredGems.filter(gem => gem.tier === 'toolkit');
    const archiveGems = filteredGems.filter(gem => gem.tier === 'miscellaneous');

    // Render each tier
    elements.heroGems.innerHTML = renderGemCards(heroGems);
    elements.processorGems.innerHTML = renderGemCards(processorGems);
    elements.archiveGems.innerHTML = renderGemCards(archiveGems);

    // Toggle tier visibility based on content
    toggleTierVisibility(elements.tierHero, heroGems.length);
    toggleTierVisibility(elements.tierProcessor, processorGems.length);
    toggleTierVisibility(elements.tierArchive, archiveGems.length);

    // Add click listeners to new cards
    setupCardListeners();
}

/**
 * Get filtered gems based on current filter, search query, and work mode
 */
function getFilteredGems() {
    return state.gems.filter(gem => {
        const workType = gem.work; // "work", "work-only", "false"

        // Work Mode Active: Show "work" and "work-only", Hide "false"
        if (state.workModeActive) {
            if (workType === "false") return false;
        }
        // Work Mode Inactive: Show "work" and "false", Hide "work-only"
        else {
            if (workType === "work-only") return false;
        }

        // Category filter
        const categoryMatch = state.currentFilter === 'all' ||
            gem.category.toLowerCase() === state.currentFilter.toLowerCase();

        // Search filter
        const searchMatch = state.searchQuery === '' ||
            gem.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            gem.description.toLowerCase().includes(state.searchQuery.toLowerCase());

        return categoryMatch && searchMatch;
    });
}

/**
 * Render gem cards HTML
 */
function renderGemCards(gems) {
    if (gems.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p>No gems found</p>
            </div>
        `;
    }

    return gems.map(gem => `
        <article class="gem-card${gem.is_private ? ' private' : ''}" data-file="${gem.file}" data-id="${gem.id}" data-url="${gem.url || ''}">
            <div class="gem-header">
                <div class="gem-icon">${gem.icon}</div>
                <h3 class="gem-name">${gem.name}</h3>
            </div>
            <p class="gem-description">${gem.description}</p>
            <div class="gem-footer">
                <span class="gem-category">${gem.category}</span>
                ${gem.file ? `<button class="gem-copy-btn" data-file="${gem.file}" title="Copy prompt to clipboard">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Copy</span>
                </button>` : ''}
            </div>
        </article>
    `).join('');
}

/**
 * Toggle tier section visibility
 */
function toggleTierVisibility(tierElement, gemCount) {
    if (gemCount === 0) {
        tierElement.classList.add('hidden');
    } else {
        tierElement.classList.remove('hidden');
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Filter pills
    elements.filterPills.forEach(pill => {
        pill.addEventListener('click', handleFilterClick);
    });

    // Search input
    elements.searchInput.addEventListener('input', handleSearchInput);

    // Clear search on Escape
    elements.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.searchInput.value = '';
            state.searchQuery = '';
            renderGems();
        }
    });

    // Work mode toggle
    elements.workModeToggle.addEventListener('change', handleWorkModeToggle);
}

/**
 * Handle work mode toggle
 */
function handleWorkModeToggle(e) {
    state.workModeActive = e.target.checked;
    renderGems();
}

/**
 * Setup click listeners for gem cards
 */
function setupCardListeners() {
    // Copy button clicks
    document.querySelectorAll('.gem-copy-btn').forEach(btn => {
        btn.addEventListener('click', handleCopyClick);
    });

    // Card clicks (but not on button)
    document.querySelectorAll('.gem-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If clicking on the copy button, don't trigger card click
            if (e.target.closest('.gem-copy-btn')) return;

            const file = card.dataset.file;
            const url = card.dataset.url;

            if (url && url !== "") {
                window.open(url, '_blank');
            } else {
                copyPromptToClipboard(file);
            }
        });
    });
}

/**
 * Handle filter pill click
 */
function handleFilterClick(e) {
    const pill = e.currentTarget;
    const category = pill.dataset.category;

    // Update active state
    elements.filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Update state and re-render
    state.currentFilter = category;
    renderGems();
}

/**
 * Handle search input
 */
function handleSearchInput(e) {
    state.searchQuery = e.target.value.trim();
    renderGems();
}

/**
 * Handle copy button click
 */
function handleCopyClick(e) {
    e.stopPropagation();
    const file = e.currentTarget.dataset.file;
    copyPromptToClipboard(file);
}

/**
 * Copy prompt content to clipboard
 */
async function copyPromptToClipboard(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filePath}`);
        }
        const text = await response.text();

        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy:', error);
        showToast('Failed to copy. Try again.');
    }
}

/**
 * Show toast notification
 */
function showToast(message) {
    const toastMessage = elements.toast.querySelector('.toast-message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }

    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 2500);
}

/**
 * Show error message
 */
function showError(message) {
    const contentGrid = document.querySelector('.content-grid');
    contentGrid.innerHTML = `
        <div class="empty-state" style="height: 100%; justify-content: center;">
            <div class="empty-state-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
