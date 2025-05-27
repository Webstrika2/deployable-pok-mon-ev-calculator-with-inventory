// Constants
const STAT_ORDER = ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
const Stat = {
  HP: "HP",
  Attack: "Attack",
  Defense: "Defense",
  SpAttack: "Sp. Attack",
  SpDefense: "Sp. Defense",
  Speed: "Speed",
};

const MAX_EV_PER_STAT = 252;
const MAX_TOTAL_EVS = 510;
const VITAMIN_COST = 10000;

const ITEMS = [
  { id: 'hp-up', name: 'HP Up', category: 'Vitamin', affectedStat: Stat.HP, evGain: 10, pokeApiSpriteName: 'hp-up' },
  { id: 'protein', name: 'Protein', category: 'Vitamin', affectedStat: Stat.Attack, evGain: 10, pokeApiSpriteName: 'protein' },
  { id: 'iron', name: 'Iron', category: 'Vitamin', affectedStat: Stat.Defense, evGain: 10, pokeApiSpriteName: 'iron' },
  { id: 'carbos', name: 'Carbos', category: 'Vitamin', affectedStat: Stat.Speed, evGain: 10, pokeApiSpriteName: 'carbos' },
  { id: 'calcium', name: 'Calcium', category: 'Vitamin', affectedStat: Stat.SpAttack, evGain: 10, pokeApiSpriteName: 'calcium' },
  { id: 'zinc', name: 'Zinc', category: 'Vitamin', affectedStat: Stat.SpDefense, evGain: 10, pokeApiSpriteName: 'zinc' },
  { id: 'health-mochi', name: 'Health Mochi', category: 'Mochi', affectedStat: Stat.HP, evGain: 10, pokeApiSpriteName: 'health-mochi' },
  { id: 'muscle-mochi', name: 'Muscle Mochi', category: 'Mochi', affectedStat: Stat.Attack, evGain: 10, pokeApiSpriteName: 'muscle-mochi' },
  { id: 'resist-mochi', name: 'Resist Mochi', category: 'Mochi', affectedStat: Stat.Defense, evGain: 10, pokeApiSpriteName: 'resist-mochi' },
  { id: 'genius-mochi', name: 'Genius Mochi', category: 'Mochi', affectedStat: Stat.SpAttack, evGain: 10, pokeApiSpriteName: 'genius-mochi' },
  { id: 'clever-mochi', name: 'Clever Mochi', category: 'Mochi', affectedStat: Stat.SpDefense, evGain: 10, pokeApiSpriteName: 'clever-mochi' },
  { id: 'swift-mochi', name: 'Swift Mochi', category: 'Mochi', affectedStat: Stat.Speed, evGain: 10, pokeApiSpriteName: 'swift-mochi' },
  { id: 'health-feather', name: 'Health Feather', category: 'Feather', affectedStat: Stat.HP, evGain: 1, pokeApiSpriteName: 'health-wing' },
  { id: 'muscle-feather', name: 'Muscle Feather', category: 'Feather', affectedStat: Stat.Attack, evGain: 1, pokeApiSpriteName: 'muscle-wing' },
  { id: 'resist-feather', name: 'Resist Feather', category: 'Feather', affectedStat: Stat.Defense, evGain: 1, pokeApiSpriteName: 'resist-wing' },
  { id: 'genius-feather', name: 'Genius Feather', category: 'Feather', affectedStat: Stat.SpAttack, evGain: 1, pokeApiSpriteName: 'genius-wing' },
  { id: 'clever-feather', name: 'Clever Feather', category: 'Feather', affectedStat: Stat.SpDefense, evGain: 1, pokeApiSpriteName: 'clever-wing' },
  { id: 'swift-feather', name: 'Swift Feather', category: 'Feather', affectedStat: Stat.Speed, evGain: 1, pokeApiSpriteName: 'swift-wing' },
];

const INITIAL_TARGET_EVS = STAT_ORDER.reduce((acc, stat) => ({ ...acc, [stat]: 0 }), {});
const INITIAL_CURRENT_EVS = STAT_ORDER.reduce((acc, stat) => ({ ...acc, [stat]: 0 }), {});
const INITIAL_INVENTORY = ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {});
const INITIAL_POKE_DOLLARS = 0;
const INITIAL_LEAGUE_POINTS = 0;

const STAT_COLORS = {
  [Stat.HP]: 'bg-red-500', [Stat.Attack]: 'bg-orange-500', [Stat.Defense]: 'bg-yellow-400',
  [Stat.SpAttack]: 'bg-blue-500', [Stat.SpDefense]: 'bg-green-500', [Stat.Speed]: 'bg-pink-500',
};
const STAT_TEXT_COLORS = {
  [Stat.HP]: 'text-red-300', [Stat.Attack]: 'text-orange-300', [Stat.Defense]: 'text-yellow-300',
  [Stat.SpAttack]: 'text-blue-300', [Stat.SpDefense]: 'text-green-300', [Stat.Speed]: 'text-pink-300',
};
const STAT_BORDER_COLORS = {
  [Stat.HP]: 'border-red-500', [Stat.Attack]: 'border-orange-500', [Stat.Defense]: 'border-yellow-400',
  [Stat.SpAttack]: 'border-blue-500', [Stat.SpDefense]: 'border-green-500', [Stat.Speed]: 'border-pink-500',
};


// State variables
let targetEVs = { ...INITIAL_TARGET_EVS };
let currentEVs = { ...INITIAL_CURRENT_EVS };
let inventory = { ...INITIAL_INVENTORY };
let pokeDollars = INITIAL_POKE_DOLLARS;
let leaguePoints = INITIAL_LEAGUE_POINTS;
let calculationResult = null;

// DOM Element
const rootElement = document.getElementById('root');

// Helper Functions
const getItemById = (itemId) => ITEMS.find(item => item.id === itemId);
const SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

function getItemIconHTML(itemName, spriteName, category, isLarge = false) {
  const sizeClass = isLarge ? 'w-10 h-10' : 'w-8 h-8';
  const fallbackEmoji = category === 'Vitamin' ? '🧪' : category === 'Mochi' ? '🍡' : '🪶';
  
  // Simplified error handling for vanilla JS: assume sprite exists or use emoji.
  // For a robust solution, one might add an actual onerror to the img tag via JS after insertion.
  // Mochi sprites aren't typically in PokeAPI items, use emoji directly for them.
  if (!spriteName || spriteName.includes('placeholder') || spriteName.endsWith('-mochi')) {
    return `<span title="${itemName}" class="text-2xl flex items-center justify-center ${sizeClass}">${fallbackEmoji}</span>`;
  }
  return `<img src="${SPRITE_BASE_URL}${spriteName}.png" alt="${itemName}" class="${sizeClass} object-contain" loading="lazy" onerror="this.outerHTML = '<span title=&quot;${itemName}&quot; class=&quot;text-2xl flex items-center justify-center ${sizeClass}&quot;>${fallbackEmoji}</span>'">`;
}


// Rendering Functions
function renderApp() {
  const totalTargetEVsVal = STAT_ORDER.reduce((sum, stat) => sum + targetEVs[stat], 0);
  const isTotalEVsMaxedVal = totalTargetEVsVal >= MAX_TOTAL_EVS;

  rootElement.innerHTML = `
    <header class="text-center mb-8">
      <h1 class="text-4xl sm:text-5xl font-bold text-pokeYellow tracking-tight">Pokémon EV Calculator</h1>
      <p class="text-slate-300 mt-2 text-sm sm:text-base">Optimize Effort Values with your items and currency!</p>
    </header>

    <div class="w-full max-w-5xl space-y-8 mx-auto">
      <section class="p-5 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-3">
          <h2 class="text-2xl sm:text-3xl font-semibold text-slate-100 mb-2 sm:mb-0">EV Configuration</h2>
          <button id="reset-target-evs-btn" class="px-4 py-2 bg-pokeRed/80 hover:bg-pokeRed text-white text-xs font-semibold rounded-md shadow-sm transition-colors duration-150">
            Reset All Target EVs
          </button>
        </div>
        <p class="text-sm text-slate-400 mb-4">Set your Pokémon's current EVs and desired target EVs.</p>
        ${renderTotalEVBar(totalTargetEVsVal, MAX_TOTAL_EVS)}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          ${STAT_ORDER.map(stat => renderStatInput(stat, currentEVs[stat], targetEVs[stat], totalTargetEVsVal, isTotalEVsMaxedVal)).join('')}
        </div>
      </section>

      ${renderCurrencyInputs(pokeDollars, leaguePoints)}
      ${renderInventorySections()}

      <button id="calculate-btn" class="w-full py-3.5 px-6 bg-pokeBlue hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 text-lg">
        Calculate Optimal Item Usage
      </button>

      <div id="results-container">
        ${calculationResult ? renderResultsDisplay(calculationResult) : ''}
      </div>
      
      <footer class="text-center mt-16 py-6 border-t border-slate-700">
        <p class="text-sm text-slate-500">Pokémon EV Calculator. Pokémon and Pokémon character names are trademarks of Nintendo.</p>
        <p class="text-xs text-slate-600 mt-1">Vitamin cost: ${VITAMIN_COST.toLocaleString()} Poké Dollars or League Points each.</p>
      </footer>
    </div>
  `;
  attachEventListeners();
}

function renderTotalEVBar(totalEVs, maxEVs) {
  const percentage = Math.min((totalEVs / maxEVs) * 100, 100);
  let barColor = 'bg-green-500';
  let textColor = 'text-slate-200';

  if (totalEVs > maxEVs) barColor = 'bg-red-600';
  else if (totalEVs === maxEVs) barColor = 'bg-pokeRed';
  else if (totalEVs > maxEVs * 0.85) barColor = 'bg-yellow-500';
  
  if (totalEVs === maxEVs && totalEVs > 0) textColor = 'text-pokeRed';


  return `
    <div class="my-4 p-4 bg-slate-700/70 rounded-lg shadow-inner">
      <div class="flex justify-between items-center mb-1.5">
        <h3 class="text-lg font-semibold text-slate-100">Total Target EVs Allocated</h3>
        <span class="text-xl font-bold ${textColor}">${totalEVs} / ${maxEVs}</span>
      </div>
      <div class="w-full bg-slate-600 rounded-full h-5 overflow-hidden shadow-md">
        <div class="h-full rounded-full transition-all duration-300 ease-out flex items-center justify-center text-xs font-medium text-white/80 ${barColor}"
             style="width: ${percentage}%;" role="progressbar" aria-valuenow="${totalEVs}" aria-valuemin="0" aria-valuemax="${maxEVs}">
        </div>
      </div>
      ${totalEVs > maxEVs ? `<p class="text-red-400 text-xs mt-1.5 text-center font-medium">Total EVs exceed maximum of ${maxEVs}.</p>` : ''}
      ${totalEVs === maxEVs && totalEVs > 0 ? `<p class="text-pokeRed text-xs mt-1.5 text-center font-semibold">Maximum total EVs reached!</p>` : ''}
    </div>
  `;
}

function renderStatInput(stat, currentEV, targetEV, totalTargetEVsVal, isTotalEVsMaxedVal) {
  const baseStatColor = STAT_COLORS[stat] || 'bg-gray-500';
  const sliderColor = isTotalEVsMaxedVal ? 'bg-slate-500 hover:bg-slate-400' : `${baseStatColor} hover:opacity-90`;
  const statDotColor = isTotalEVsMaxedVal ? 'bg-slate-400' : baseStatColor;

  return `
    <div class="p-3 bg-slate-700/80 rounded-lg shadow-md hover:shadow-slate-600/50 transition-shadow">
      <div class="flex justify-between items-center mb-2">
        <label for="${stat}-target-slider" class="font-semibold text-sm ${STAT_TEXT_COLORS[stat]} flex items-center">
          <span class="w-3 h-3 rounded-full mr-2 ${statDotColor}"></span>${stat}
        </label>
        <span class="text-xs text-slate-400">Max: ${MAX_EV_PER_STAT}</span>
      </div>
      <div class="mb-3">
        <label for="${stat}-current" class="block text-xs font-medium text-slate-400 mb-1">Current EVs</label>
        <input type="text" inputmode="numeric" id="${stat}-current" data-stat="${stat}" value="${currentEV}"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-sm focus:ring-pokeBlue focus:border-pokeBlue current-ev-input" placeholder="0">
      </div>
      <div>
        <label for="${stat}-target-slider" class="block text-xs font-medium text-slate-400 mb-1">Target EVs: ${targetEV}</label>
        <input type="range" id="${stat}-target-slider" data-stat="${stat}" value="${targetEV}" min="0" max="${MAX_EV_PER_STAT}" step="1"
               class="w-full h-3 rounded-lg appearance-none cursor-pointer transition-colors duration-150 ${sliderColor} target-ev-slider">
      </div>
    </div>
  `;
}

function renderCurrencyInputs(currentPokeDollars, currentLeaguePoints) {
  return `
    <section class="p-5 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-slate-100">Your Currencies</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label for="pokeDollars" class="block text-sm font-medium text-slate-300 mb-1.5">Poké Dollars ($)</label>
          <input type="text" inputmode="numeric" id="pokeDollars" value="${currentPokeDollars}"
                 class="w-full p-2.5 bg-slate-900/70 border border-slate-700 rounded-md text-sm focus:ring-pokeYellow focus:border-pokeYellow currency-input" placeholder="e.g. 100000">
        </div>
        <div>
          <label for="leaguePoints" class="block text-sm font-medium text-slate-300 mb-1.5">League Points (LP)</label>
          <input type="text" inputmode="numeric" id="leaguePoints" value="${currentLeaguePoints}"
                 class="w-full p-2.5 bg-slate-900/70 border border-slate-700 rounded-md text-sm focus:ring-pokeYellow focus:border-pokeYellow currency-input" placeholder="e.g. 50000">
        </div>
      </div>
      <p class="text-xs text-slate-500 mt-4">Vitamins cost ${VITAMIN_COST.toLocaleString()} of either currency.</p>
    </section>
  `;
}

function renderInventorySections() {
    const itemCategories = { Vitamins: [], Mochi: [], Feathers: [] };
    ITEMS.forEach(item => {
        if (item.category === 'Vitamin') itemCategories.Vitamins.push(item);
        else if (item.category === 'Mochi') itemCategories.Mochi.push(item);
        else if (item.category === 'Feather') itemCategories.Feathers.push(item);
    });
     const vitaminOrder = ['hp-up', 'protein', 'iron', 'carbos', 'calcium', 'zinc'];
    itemCategories.Vitamins.sort((a,b) => vitaminOrder.indexOf(a.id) - vitaminOrder.indexOf(b.id));


  return `
    <section>
      <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-slate-100 text-center">Your Inventory</h2>
      ${Object.entries(itemCategories).map(([categoryName, items]) => {
        if (items.length === 0) return '';
        const categoryEmoji = items[0].category === 'Vitamin' ? '🧪' : items[0].category === 'Mochi' ? '🍡' : '🪶';
        return renderCollapsibleSection(
          `${categoryName} ${categoryEmoji}`,
          items.map(item => renderInventoryItemInput(item, inventory[item.id] || 0)).join(''),
          categoryName === 'Vitamins' // Default open for Vitamins
        );
      }).join('')}
    </section>
  `;
}

function renderCollapsibleSection(title, content, defaultOpen = false) {
  // For vanilla JS, collapse/expand will need to be handled via JS event listeners
  // Adding a unique ID for each section for easier targeting
  const sectionId = `collapsible-${title.replace(/\s+/g, '-').toLowerCase()}`;
  return `
    <div class="mb-4 bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <button data-collapsible-target="${sectionId}-content"
              class="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-slate-100 bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none collapsible-trigger">
        ${title}
        <span class="transform transition-transform duration-200 ${defaultOpen ? 'rotate-180' : 'rotate-0'} collapsible-arrow">▼</span>
      </button>
      <div id="${sectionId}-content" class="p-4 space-y-3 ${defaultOpen ? '' : 'hidden'} collapsible-content">
        ${content}
      </div>
    </div>
  `;
}

function renderInventoryItemInput(item, quantity) {
  return `
    <div class="flex items-center justify-between p-2.5 bg-slate-700/60 rounded hover:bg-slate-700/90 transition-colors duration-150">
      <div class="flex items-center space-x-3">
        ${getItemIconHTML(item.name, item.pokeApiSpriteName, item.category, false)}
        <label for="${item.id}" class="text-sm text-slate-200">${item.name}</label>
      </div>
      <div class="flex items-center space-x-1.5">
        <button data-item-id="${item.id}" data-action="decrement" class="inventory-btn px-2 py-1 bg-slate-600 hover:bg-pokeRed text-slate-100 rounded text-sm leading-none">-</button>
        <input type="text" inputmode="numeric" id="${item.id}" data-item-id="${item.id}" value="${quantity}"
               class="inventory-input w-16 p-1.5 bg-slate-800 border border-slate-600 rounded-md text-sm text-center focus:ring-pokeBlue focus:border-pokeBlue" placeholder="0">
        <button data-item-id="${item.id}" data-action="increment" class="inventory-btn px-2 py-1 bg-slate-600 hover:bg-pokeGreen text-slate-100 rounded text-sm leading-none">+</button>
      </div>
    </div>
  `;
}

function renderResultsDisplay(res) {
    const {
        statDetails, totalPurchaseCostAllSuggestions, totalCostAffordablePurchases,
        totalAdditionalCurrencyNeededToMeetAllGoals, canAffordAllSuggestedPurchases,
        pokeDollarsAfterAffordablePurchases, leaguePointsAfterAffordablePurchases,
        warnings, overallStatusMessage, targetEVs: resTargetEVs, currentEVs: resCurrentEVs
    } = res;

    const isAnyEVChangeIntended = STAT_ORDER.some(stat => resTargetEVs[stat] > resCurrentEVs[stat]);
    const isAnythingNeededOverall = STAT_ORDER.some(stat => statDetails[stat].initialNeed > 0);
    
    let statusBoxClass = 'bg-blue-500/30 text-blue-200';
    if (isAnyEVChangeIntended || isAnythingNeededOverall) {
        if (warnings.length > 0 || STAT_ORDER.some(s => statDetails[s].evsStillNeeded > 0 && statDetails[s].initialNeed > 0)) {
            statusBoxClass = 'bg-red-500/30 text-red-200';
        } else {
            statusBoxClass = 'bg-green-500/30 text-green-200';
        }
    }

    return `
        <div class="mt-8 p-5 bg-slate-800/70 rounded-xl shadow-2xl">
            <h2 class="text-3xl font-bold mb-6 text-pokeYellow text-center">Calculation Results</h2>
            <div class="p-4 rounded-lg mb-6 text-center font-semibold text-lg ${statusBoxClass}">
                ${overallStatusMessage}
            </div>

            ${(totalPurchaseCostAllSuggestions > 0) ? `
                <div class="mb-6 p-4 border border-pokeBlue/60 rounded-lg bg-slate-700/30">
                    <h3 class="text-xl font-semibold mb-3 text-pokeBlue">Purchase Overview:</h3>
                    <p class="text-md text-slate-200 mb-1">Total ideal cost for all suggested Vitamins: <span class="font-bold text-pokeYellow">${totalPurchaseCostAllSuggestions.toLocaleString()}</span></p>
                    ${totalCostAffordablePurchases > 0 ? `<p class="text-md text-slate-200 mb-1">Actual amount spent on affordable Vitamins: <span class="font-bold text-green-400">${totalCostAffordablePurchases.toLocaleString()}</span></p>` : ''}
                    
                    ${canAffordAllSuggestedPurchases ? `
                        <div class="p-3 bg-green-600/30 rounded text-green-200 text-sm mt-2">
                            <p class="font-semibold">✅ You have enough currency for all suggested purchases.</p>
                            <p>Poké Dollars Remaining (if all bought): ${pokeDollarsAfterAffordablePurchases.toLocaleString()}</p>
                            <p>League Points Remaining (if all bought): ${leaguePointsAfterAffordablePurchases.toLocaleString()}</p>
                        </div>
                    ` : `
                        <div class="p-3 bg-red-600/30 rounded text-red-200 text-sm mt-2">
                            <p class="font-semibold">❌ Insufficient currency for all suggested purchases.</p>
                            ${totalAdditionalCurrencyNeededToMeetAllGoals > 0 ? `<p>Total additional currency needed for all unmet goals: <strong class="text-red-100">${totalAdditionalCurrencyNeededToMeetAllGoals.toLocaleString()}</strong></p>` : ''}
                            <p class="text-xs mt-1 text-slate-400">(Calculations below reflect what's possible with current funds.)</p>
                        </div>
                    `}
                </div>
            ` : ''}
            
            <div class="space-y-6">
                ${STAT_ORDER.map(stat => {
                    const detail = statDetails[stat];
                    if (detail.initialNeed <= 0 && detail.usedOwnedItems.length === 0 && detail.suggestedPurchases.every(p => p.quantitySuggested === 0)) {
                        if (resTargetEVs[stat] === 0 && resCurrentEVs[stat] === 0 && detail.initialNeed === 0) return '';
                    }

                    const itemDetailsCache = {}; // Simple cache for item details
                    const getItemDetails = (itemId) => {
                        if (!itemDetailsCache[itemId]) itemDetailsCache[itemId] = getItemById(itemId);
                        return itemDetailsCache[itemId];
                    };

                    return `
                    <div class="p-4 rounded-lg bg-slate-700/70 shadow-lg border-l-4 ${STAT_BORDER_COLORS[stat] || 'border-gray-500'}">
                        <div class="flex items-center mb-3">
                            <span class="w-4 h-4 rounded-full mr-3 ${STAT_COLORS[stat] || 'bg-gray-500'}"></span>
                            <h4 class="text-xl font-semibold ${STAT_TEXT_COLORS[stat] || 'text-gray-300'}">${stat}</h4>
                        </div>
                        <div class="grid grid-cols-3 gap-2 text-xs text-slate-300 mb-3 pb-2 border-b border-slate-600">
                            <p>Target: <span class="font-bold text-slate-100">${detail.targetEV}</span></p>
                            <p>Current: <span class="font-bold text-slate-100">${detail.currentEV}</span></p>
                            <p>Initial Need: <span class="font-bold text-slate-100">${Math.max(0, detail.initialNeed)} EVs</span></p>
                        </div>
                        
                        ${(detail.usedOwnedItems.length === 0 && detail.suggestedPurchases.every(p => p.quantitySuggested === 0) && detail.initialNeed <=0) ? `<p class="text-sm text-slate-400 italic">No changes needed or no items applicable for this stat.</p>` : ''}

                        ${detail.usedOwnedItems.length > 0 ? `
                            <div class="mb-2">
                                <p class="text-sm font-medium text-slate-300 mb-1">From Your Inventory:</p>
                                <ul class="space-y-1.5">
                                    ${detail.usedOwnedItems.map(used => {
                                        const item = getItemDetails(used.itemId);
                                        return `
                                        <li class="flex items-center text-sm text-slate-200">
                                            ${item ? getItemIconHTML(used.itemName, item.pokeApiSpriteName, item.category, true) : ''}
                                            <span class="font-semibold ml-2">${used.quantity}x ${used.itemName}</span>
                                            <span class="ml-1 text-green-400">(+${used.evsGained} EVs)</span>
                                        </li>`;
                                    }).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        ${detail.suggestedPurchases.some(p => p.quantitySuggested > 0) ? `
                            <div class="mt-3">
                                <p class="text-sm font-medium text-slate-300 mb-1">To Purchase (Vitamins):</p>
                                <ul class="space-y-2">
                                    ${detail.suggestedPurchases.filter(p => p.quantitySuggested > 0).map(purchase => {
                                        const item = getItemDetails(purchase.itemId);
                                        let purchaseLabel = '';
                                        if (purchase.isPartialPurchase) purchaseLabel = `<span class="font-semibold text-yellow-400">BUY (Partial):</span>`;
                                        else if (purchase.quantityAffordable > 0) purchaseLabel = `<span class="font-semibold text-pokeBlue">BUY:</span>`;
                                        else purchaseLabel = `<span class="font-semibold text-red-400">UNABLE TO BUY:</span>`;
                                        
                                        return `
                                        <li class="text-sm text-slate-200">
                                            <div class="flex items-center">
                                                ${item ? getItemIconHTML(purchase.itemName, item.pokeApiSpriteName, item.category, true) : ''}
                                                ${purchaseLabel}
                                                <span class="ml-1 font-semibold">
                                                    ${purchase.quantityAffordable > 0 ? `${purchase.quantityAffordable} of ${purchase.quantitySuggested}` : purchase.quantitySuggested}x ${purchase.itemName}
                                                </span>
                                                ${purchase.quantityAffordable > 0 ? `<span class="ml-1 text-green-400">(+${purchase.evsGainedFromThisPurchase} EVs)</span>` : ''}
                                                ${purchase.quantityAffordable > 0 ? `<span class="ml-2 text-xs text-slate-400">- Cost: ${purchase.costPaid.toLocaleString()}</span>` : ''}
                                                ${(purchase.quantityAffordable === 0 && purchase.quantitySuggested > 0) ? `<span class="ml-2 text-xs text-red-400">- Needs: ${purchase.totalCostSuggested.toLocaleString()}</span>` : ''}
                                            </div>
                                            ${purchase.quantityStillNeeded > 0 ? `
                                                <p class="text-xs text-yellow-300 pl-12 mt-0.5"> <!-- Adjusted pl based on icon size -->
                                                    (Still need ${purchase.quantityStillNeeded} more ${purchase.itemName}. Additional cost: ${purchase.costForStillNeeded.toLocaleString()})
                                                </p>
                                            ` : ''}
                                        </li>`;
                                    }).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        <div class="mt-4 pt-3 border-t border-slate-600 text-sm">
                            <p class="text-slate-200">Final EVs: <span class="font-bold text-lg">${detail.finalEVs}</span> (Gained: +${detail.evsGainedFromOwned + detail.evsGainedFromAffordablePurchases})</p>
                            ${detail.evsStillNeeded > 0 ? `<p class="text-red-300">Still Need: <span class="font-bold">${detail.evsStillNeeded} EVs</span></p>` 
                                : detail.initialNeed > 0 ? `<p class="text-green-300 font-semibold">✅ Target Met!</p>` : ''}
                        </div>
                    </div>`;
                }).join('')}
            </div>

            ${warnings.length > 0 ? `
                <div class="mt-8 p-4 border border-red-500/60 rounded-lg bg-red-900/30">
                    <h3 class="text-lg font-semibold mb-2 text-red-300">Important Notes & Warnings:</h3>
                    <ul class="list-disc list-inside pl-2 space-y-1 text-sm text-red-300">
                        ${warnings.map(warning => `<li>${warning}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}


// Event Handlers and Logic
function handleStatEvChange(statKey, inputType, valueStr) {
    let value = parseInt(valueStr, 10);
    if (isNaN(value) || valueStr === "") value = 0;
    value = Math.max(0, Math.min(value, MAX_EV_PER_STAT));

    if (inputType === 'current') {
        currentEVs[statKey] = value;
    } else if (inputType === 'target') {
        const oldTarget = targetEVs[statKey];
        targetEVs[statKey] = value;
        let currentTotal = STAT_ORDER.reduce((sum, s) => sum + targetEVs[s], 0);
        if (currentTotal > MAX_TOTAL_EVS) {
            targetEVs[statKey] = Math.max(0, value - (currentTotal - MAX_TOTAL_EVS));
        }
    }
    calculationResult = null;
    renderApp();
}

function handleInventoryChange(itemId, quantityStr, action = null) {
    let currentQuantity = parseInt(inventory[itemId] || 0, 10);
    let newQuantity;

    if (action === 'increment') {
        newQuantity = currentQuantity + 1;
    } else if (action === 'decrement') {
        newQuantity = Math.max(0, currentQuantity - 1);
    } else {
        newQuantity = parseInt(quantityStr, 10);
        if (isNaN(newQuantity) || quantityStr === "") newQuantity = 0;
    }
    inventory[itemId] = Math.max(0, newQuantity);
    calculationResult = null;
    renderApp();
}

function handleCurrencyChange(type, valueStr) {
    let value = parseInt(valueStr, 10);
    if (isNaN(value) || valueStr === "") value = 0;
    value = Math.max(0, value);

    if (type === 'pokeDollars') pokeDollars = value;
    else if (type === 'leaguePoints') leaguePoints = value;
    
    calculationResult = null;
    renderApp();
}

function resetAllTargetEVs() {
    targetEVs = { ...INITIAL_TARGET_EVS };
    calculationResult = null;
    renderApp();
}

function calculateOptimalUsageLogic() {
    let tempInventory = { ...inventory };
    const warnings = [];
    const workingStatDetails = STAT_ORDER.reduce((acc, stat) => {
        const initialNeed = Math.max(0, targetEVs[stat] - currentEVs[stat]);
        acc[stat] = {
            targetEV: targetEVs[stat], currentEV: currentEVs[stat], initialNeed,
            evsGainedFromOwned: 0, usedOwnedItems: [],
            evsGainedFromAffordablePurchases: 0, suggestedPurchases: [],
            finalEVs: currentEVs[stat], evsStillNeeded: initialNeed,
        };
        return acc;
    }, {});

    // Phase 1: Use existing inventory
    ['Vitamin', 'Mochi', 'Feather'].forEach(category => {
        ITEMS.filter(item => item.category === category).forEach(item => {
            const stat = item.affectedStat;
            if (workingStatDetails[stat].evsStillNeeded <= 0) return;
            let itemsAvailable = tempInventory[item.id] || 0;
            if (itemsAvailable <= 0) return;

            let itemsToUse = (item.evGain === 1)
                ? Math.min(workingStatDetails[stat].evsStillNeeded, itemsAvailable)
                : Math.min(Math.floor(workingStatDetails[stat].evsStillNeeded / item.evGain), itemsAvailable);

            if (itemsToUse > 0) {
                const gainedEVs = itemsToUse * item.evGain;
                workingStatDetails[stat].evsGainedFromOwned += gainedEVs;
                workingStatDetails[stat].usedOwnedItems.push({ itemId: item.id, itemName: item.name, quantity: itemsToUse, evsGained: gainedEVs });
                workingStatDetails[stat].finalEVs += gainedEVs;
                workingStatDetails[stat].evsStillNeeded -= gainedEVs;
                tempInventory[item.id] -= itemsToUse;
            }
        });
    });

    // Phase 2: Determine purchase needs
    let totalPurchaseCostAllSuggestions = 0;
    STAT_ORDER.forEach(stat => {
        if (workingStatDetails[stat].evsStillNeeded > 0) {
            const vitamin = ITEMS.find(item => item.category === 'Vitamin' && item.affectedStat === stat);
            if (vitamin) {
                const numNeeded = Math.ceil(workingStatDetails[stat].evsStillNeeded / vitamin.evGain);
                if (numNeeded > 0) {
                    const cost = numNeeded * VITAMIN_COST;
                    workingStatDetails[stat].suggestedPurchases.push({
                        itemId: vitamin.id, itemName: vitamin.name, costPerItem: VITAMIN_COST,
                        quantitySuggested: numNeeded, totalCostSuggested: cost, evsGainedIfFullyPurchased: numNeeded * vitamin.evGain,
                        quantityAffordable: 0, costPaid: 0, evsGainedFromThisPurchase: 0,
                        isPartialPurchase: false, quantityStillNeeded: numNeeded, costForStillNeeded: cost,
                    });
                    totalPurchaseCostAllSuggestions += cost;
                }
            }
        }
    });
    
    // Phase 3: Financial Calculation
    let currentPokeDollars = pokeDollars;
    let currentLeaguePoints = leaguePoints;
    let totalCostAffordablePurchases = 0;

    STAT_ORDER.forEach(stat => {
        workingStatDetails[stat].suggestedPurchases.forEach(purchase => {
            if (purchase.quantitySuggested === 0) return;
            const currentTotalCurrency = currentPokeDollars + currentLeaguePoints;
            const maxAffordableForThisItem = Math.floor(currentTotalCurrency / purchase.costPerItem);
            purchase.quantityAffordable = Math.min(purchase.quantitySuggested, maxAffordableForThisItem);

            if (purchase.quantityAffordable > 0) {
                purchase.costPaid = purchase.quantityAffordable * purchase.costPerItem;
                const itemDetails = getItemById(purchase.itemId);
                if(itemDetails) purchase.evsGainedFromThisPurchase = purchase.quantityAffordable * itemDetails.evGain;

                workingStatDetails[stat].evsGainedFromAffordablePurchases += purchase.evsGainedFromThisPurchase;
                workingStatDetails[stat].finalEVs += purchase.evsGainedFromThisPurchase;
                totalCostAffordablePurchases += purchase.costPaid;

                let costRemainingPayment = purchase.costPaid;
                const spentPoke = Math.min(costRemainingPayment, currentPokeDollars);
                currentPokeDollars -= spentPoke;
                costRemainingPayment -= spentPoke;
                const spentLP = Math.min(costRemainingPayment, currentLeaguePoints);
                currentLeaguePoints -= spentLP;
                
                if (purchase.quantityAffordable < purchase.quantitySuggested) purchase.isPartialPurchase = true;
            }
            purchase.quantityStillNeeded = purchase.quantitySuggested - purchase.quantityAffordable;
            purchase.costForStillNeeded = purchase.quantityStillNeeded * purchase.costPerItem;
        });
        workingStatDetails[stat].evsStillNeeded = Math.max(0, workingStatDetails[stat].targetEV - workingStatDetails[stat].finalEVs);
    });

    let totalAdditionalCurrencyNeededToMeetAllGoals = STAT_ORDER.reduce((sum, stat) =>
        sum + workingStatDetails[stat].suggestedPurchases.reduce((s, p) => s + (p.quantityStillNeeded > 0 ? p.costForStillNeeded : 0), 0)
    , 0);

    // Phase 4: Final messages
    let overallStatusMessage = "";
    const allGoalsMet = STAT_ORDER.every(stat => workingStatDetails[stat].evsStillNeeded === 0 || workingStatDetails[stat].initialNeed <= 0);
    
    if (STAT_ORDER.every(stat => workingStatDetails[stat].initialNeed <= 0)) {
        overallStatusMessage = "Targets match current EVs or require no increase. No items needed.";
    } else if (allGoalsMet) {
        overallStatusMessage = "Success! All EV goals met using your items" + (totalCostAffordablePurchases > 0 ? " and affordable purchases." : ".");
    } else {
        overallStatusMessage = "Could not meet all EV goals. See breakdown below.";
        if (totalPurchaseCostAllSuggestions > 0 && totalAdditionalCurrencyNeededToMeetAllGoals > 0) {
            warnings.push(`Some vitamin purchases could not be fully completed. You need an additional ${totalAdditionalCurrencyNeededToMeetAllGoals.toLocaleString()} for all suggested vitamins.`);
        }
        STAT_ORDER.forEach(stat => {
            if(workingStatDetails[stat].evsStillNeeded > 0 && workingStatDetails[stat].initialNeed > 0) {
                 warnings.push(`For ${stat}, ${workingStatDetails[stat].evsStillNeeded} EVs are still needed.`);
            }
        });
         if (warnings.length === 0 && !allGoalsMet) {
             warnings.push("Some EV goals remain unmet. This might be due to item unavailability or insufficient currency.");
         }
    }

    calculationResult = {
      statDetails: workingStatDetails, totalPurchaseCostAllSuggestions, totalCostAffordablePurchases,
      totalAdditionalCurrencyNeededToMeetAllGoals, 
      canAffordAllSuggestedPurchases: totalAdditionalCurrencyNeededToMeetAllGoals === 0,
      pokeDollarsAfterAffordablePurchases: currentPokeDollars, leaguePointsAfterAffordablePurchases: currentLeaguePoints,
      warnings, overallStatusMessage, targetEVs, currentEVs,
    };
    renderApp();
}

// Attach Event Listeners
function attachEventListeners() {
  document.getElementById('reset-target-evs-btn')?.addEventListener('click', resetAllTargetEVs);
  document.getElementById('calculate-btn')?.addEventListener('click', calculateOptimalUsageLogic);

  document.querySelectorAll('.current-ev-input').forEach(input => {
    input.addEventListener('change', (e) => handleStatEvChange(e.target.dataset.stat, 'current', e.target.value));
    input.addEventListener('blur', (e) => { // Ensure value is formatted/validated on blur
        const val = parseInt(e.target.value, 10);
        e.target.value = (isNaN(val) || val < 0) ? '0' : Math.min(val, MAX_EV_PER_STAT);
        handleStatEvChange(e.target.dataset.stat, 'current', e.target.value);
    });
  });
  document.querySelectorAll('.target-ev-slider').forEach(input => {
    input.addEventListener('input', (e) => handleStatEvChange(e.target.dataset.stat, 'target', e.target.value));
  });

  document.querySelectorAll('.currency-input').forEach(input => {
    input.addEventListener('change', (e) => handleCurrencyChange(e.target.id, e.target.value));
     input.addEventListener('blur', (e) => {
        const val = parseInt(e.target.value, 10);
        e.target.value = (isNaN(val) || val < 0) ? '0' : val;
        handleCurrencyChange(e.target.id, e.target.value);
    });
  });
  
  document.querySelectorAll('.inventory-input').forEach(input => {
    input.addEventListener('change', (e) => handleInventoryChange(e.target.dataset.itemId, e.target.value));
    input.addEventListener('blur', (e) => {
        const val = parseInt(e.target.value, 10);
        e.target.value = (isNaN(val) || val < 0) ? '0' : val;
        handleInventoryChange(e.target.dataset.itemId, e.target.value);
    });
  });
  document.querySelectorAll('.inventory-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const target = e.currentTarget; // Use currentTarget for delegated events if any in future
        handleInventoryChange(target.dataset.itemId, null, target.dataset.action);
    });
  });
  
  document.querySelectorAll('.collapsible-trigger').forEach(button => {
    button.addEventListener('click', (e) => {
        const contentId = e.currentTarget.dataset.collapsibleTarget;
        const contentElement = document.getElementById(contentId);
        const arrowElement = e.currentTarget.querySelector('.collapsible-arrow');
        if (contentElement) {
            contentElement.classList.toggle('hidden');
            arrowElement.classList.toggle('rotate-180');
        }
    });
  });
}

// Initial Render
renderApp();
