class RulesManager {
  constructor() {
    this.rulesTab = null;
    this.rulesContent = null;
    this.isPanelOpen = false;
    this.init();
  }

  init() {
    this.createRulesPanel();
    this.bindEvents();
    this.bindSettingsCloseEvent();
  }

  createRulesPanel() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const sidebar = settingsContainer.querySelector('.settings-sidebar');
    const content = settingsContainer.querySelector('.settings-content');

    if (!sidebar || !content) return;

    const rulesTab = document.createElement('button');
    rulesTab.className = 'rules-tab';
    rulesTab.innerHTML = `<span>ПРАВИЛА ГРИ</span>`;
    sidebar.appendChild(rulesTab);

    const rulesContent = document.createElement('div');
    rulesContent.className = 'rules-content';
    rulesContent.innerHTML = `
      <h3>Правила гри</h3>
      <div class="rules-text">
        <p>Тут будуть правила гри...</p>
        <p>Мета гри: зібрати всі пари однакових плиток</p>
        <p>Натисніть на плитку щоб відкрити її</p>
        <p>Знайдіть дві однакові плитки підряд</p>
        <p>Гра закінчується коли всі пари знайдені</p>
      </div>
    `;

    content.appendChild(rulesContent);

    this.rulesTab = rulesTab;
    this.rulesContent = rulesContent;
  }

  bindEvents() {
    if (!this.rulesTab) return;

    this.rulesTab.addEventListener('click', () => {
      this.toggleRulesPanel();
    });
  }

  bindSettingsCloseEvent() {
    const settingsClose = document.getElementById('settingsClose');

    if (settingsClose) {
      settingsClose.addEventListener('click', () => {
        this.closeRulesPanel();
      });
    }
  }

  toggleRulesPanel() {
    if (this.isPanelOpen) {
      this.closeRulesPanel();
    } else {
      this.closeAllPanels();
      this.showRulesPanel();
    }
  }

  closeAllPanels() {
    if (window.soundManager && window.soundManager.isSoundPanelOpen()) {
      window.soundManager.closeSoundPanel();
    }

    if (
      window.gameplayManager &&
      window.gameplayManager.isGameplayPanelOpen()
    ) {
      window.gameplayManager.closeGameplayPanel();
    }

    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));
  }

  showRulesPanel() {
    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));

    this.rulesContent.classList.add('active');
    this.rulesTab.classList.add('active');
    this.isPanelOpen = true;
  }

  closeRulesPanel() {
    if (this.rulesContent) {
      this.rulesContent.classList.remove('active');
    }
    if (this.rulesTab) {
      this.rulesTab.classList.remove('active');
    }
    this.isPanelOpen = false;
  }

  isRulesPanelOpen() {
    return this.isPanelOpen;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.rulesManager = new RulesManager();
  }, 100);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulesManager;
}
