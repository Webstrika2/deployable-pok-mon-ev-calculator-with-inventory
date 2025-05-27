# Pokémon EV Calculator (Vanilla JS)

An interactive web application to calculate Pokémon EV (Effort Value) distribution based on your desired stats, available items (Vitamins, Mochi, Feathers), and in-game currencies. It helps optimize item usage and plan purchases to reach your EV goals efficiently.

**This version is built with HTML, CSS (Tailwind via CDN), and Vanilla JavaScript, making it directly deployable on platforms like GitHub Pages without any build process.**

<!-- Consider adding a screenshot of the EV Calculator in action! -->
<!-- ![Screenshot](link_to_your_screenshot.png) -->

## 🌟 Key Features

*   **Comprehensive EV Configuration:**
    *   Set Current EVs for your Pokémon.
    *   Define Target EVs for each stat (HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed) using intuitive sliders.
    *   Visual progress bar for Total Target EVs, preventing allocation beyond the 510 maximum.
    *   Individual stat cap of 252 EVs enforced.
    *   "Reset All Target EVs" button for quick clearing.
*   **Inventory Management:**
    *   Input quantities for owned Vitamins, Mochi, and Feathers.
    *   Collapsible sections for easy organization.
    *   Quick increment/decrement buttons (+/-) for item quantities.
*   **Currency Tracking:**
    *   Enter your available Poké Dollars and League Points.
    *   Vitamins are priced at 10,000 (Poké Dollars or LP).
*   **Smart Item Optimization & Purchase Planning:**
    *   The calculator first utilizes your existing inventory (Vitamins, then Mochi, then Feathers) to meet EV goals.
    *   If owned items are insufficient, it suggests purchasing the required Vitamins.
    *   **Granular Purchase Logic:**
        *   Calculates the exact number of Vitamins needed per stat.
        *   Checks affordability against your combined currencies (Poké Dollars prioritized).
        *   If you can't afford all suggested Vitamins for a stat, it tells you how many you *can* buy with remaining funds.
        *   Clearly indicates any partial purchases and the remaining quantity/cost needed for that specific item.
*   **Detailed & User-Friendly Results:**
    *   **Overall Status:** Clear message indicating if EV goals were met.
    *   **Purchase Overview:** Summarizes total ideal cost, actual amount spent, and total additional currency needed if goals aren't fully met.
    *   **Per-Stat Breakdown:** Details items used from inventory and Vitamins to purchase (including partial/unaffordable).
    *   **Important Notes & Warnings:** Highlights any shortfalls or issues.
*   **Visual Appeal:**
    *   Uses item sprites from PokeAPI where available, with emoji fallbacks.
    *   Themed colors for stats and UI elements (via Tailwind CSS).
    *   Responsive design.

## 🛠️ Tech Stack

*   **HTML**
*   **CSS** (Tailwind CSS via CDN)
*   **Vanilla JavaScript** (ES6 Modules)

This project runs directly in the browser without any build steps or framework dependencies.

## 🚀 How to Use / Run

1.  **Download or Clone:**
    *   Download the files (`index.html`, `app.js`, `README.md`, `metadata.json`).
    *   Or, if you have Git: `git clone <repository-url>`
2.  **Open `index.html`:**
    Simply open the `index.html` file in a modern web browser (like Chrome, Firefox, Edge, Safari).

That's it! The application is entirely client-side.


## ℹ️ Item Information

*   **🧪 Vitamins** (+10 EVs per item)
    *   HP Up, Protein, Iron, Carbos, Calcium, Zinc
    *   Cost: 10,000 Poké Dollars or League Points each.
*   **🍡 Mochi** (+10 EVs per item)
*   **🪶 Feathers** (+1 EV per item)

## ✨ Potential Future Enhancements

*   Saving/Loading settings to/from LocalStorage.
*   Support for EV-reducing berries.
*   Dark/Light mode toggle (though Tailwind provides utilities for this if desired).

---

*Pokémon and Pokémon character names are trademarks of Nintendo.*
*This project is a fan-made tool and is not affiliated with Nintendo or The Pokémon Company.*
```#   d e p l o y a b l e - p o k - m o n - e v - c a l c u l a t o r - w i t h - i n v e n t o r y 
 
 
