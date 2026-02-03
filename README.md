# 💎 Gem Dashboard

Gem Dashboard is a modern, visually striking web interface developed to manage and quickly access a personal collection of AI prompts and "Gems". Designed with a premium "Electric Glass" aesthetic, it offers a distraction-free environment to browse, search, and copy prompt instructions for various AI agents.

## ✨ Features

- **Electric Glass Aesthetic**: A premium interface featuring glassmorphism, dynamic background elements, and smooth interactions.
- **Tiered Organization**: Gems are organized into logical tiers for quick scanning:
  - **💎 Essentials**: Daily drivers and core tools.
  - **🔧 Toolkit**: Specialized utilities for specific tasks.
  - **📁 Miscellaneous**: Everything else.
- **Smart Filtering**:
  - **Category Filters**: Quickly toggle between "All", "Utilities", and "Leisure".
  - **Search**: Real-time filtering by name and description.
  - **Work Mode**: A dedicated toggle to hide non-work-related gems for professional focus.
- **One-Click Actions**:
  - **Copy Prompt**: Instantly copy the content of linked prompt files to your clipboard.
  - **Direct Links**: specific gems can open directly in their respective AI interface (e.g., Google Gem access).
- **Responsive Design**: precise layout control (non-scrolling 100vh on desktop) that adapts gracefully to different screen sizes.

## 🚀 Getting Started

This is a static web application. No build process or backend server is required.

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/gem-dashboard.git
    cd gem-dashboard
    ```

2.  **Open the Dashboard**:
    Simply open the `index.html` file in your preferred web browser.

## ⚙️ Configuration

The dashboard is data-driven by the `gems.json` file. To add or modify gems:

1.  Open `gems.json`.
2.  Add a new entry to the `gems` array:

```json
{
  "id": "unique-id",
  "name": "Gem Name",
  "description": "Short description of what this gem does.",
  "file": "prompts/your-prompt-file.txt",
  "category": "Utilities", // "Utilities" or "Leisure"
  "is_private": false, // Adds a visual indicator if true
  "work": "work", // "work", "work-only", or "false"
  "tier": "essentials", // "essentials", "toolkit", or "miscellaneous"
  "icon": "🚀", // Emoji icon
  "url": "falker47.github.io/GemDashboard/" // Optional: Direct link to the gem
}
```

3.  **Place your prompt file**: Ensure the text file referenced in `"file"` exists in the `prompts/` directory.

## 📂 Project Structure

- `index.html`: Main application structure.
- `styles.css`: All visual styling, animations, and responsive rules.
- `app.js`: Application logic (fetching data, rendering, filtering, clipboard actions).
- `gems.json`: Data source for all gems and categories.
- `prompts/`: Directory storing the raw text files for each prompt.

## 🛠️ Technology Stack

- **HTML5**: Semantic and accessible markup.
- **CSS3**: Custom properties, Flexbox/Grid, backdrop-filter for glass effects.
- **JavaScript (ES6+)**: Vanilla JS for logic, no frameworks required.
