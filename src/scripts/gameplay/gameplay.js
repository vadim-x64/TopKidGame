class GameplayManager {
  constructor() {
    this.storageKey = 'spots_game_gameplay_settings';
    this.isTimerDisabled = false;
    this.gridSize = 4;
    this.gameplayTab = null;
    this.gameplayContent = null;
    this.timerCheckbox = null;
    this.isPanelOpen = false;
    this.confirmModal = null;
    this.confirmButton = null;
    this.cancelButton = null;
    this.gridSizeButtons = [];
    this.pendingGridSize = null;
    this.pendingTimerChange = null;
    this.loadSettings();
    this.init();
  }

  init() {
    this.createGameplayPanel();
    this.createConfirmModal();
    this.bindModalEvents(); // Окремо прив'язуємо події модалки
    this.bindEvents();
    this.bindSettingsCloseEvent();
    this.updateUI();
  }

  createConfirmModal() {
    this.confirmModal = document.createElement('div');
    this.confirmModal.className = 'modal-overlay';
    this.confirmModal.id = 'gameplayChangeModal';
    this.confirmModal.innerHTML = `
      <div class="modal">
        <h3>Примінити внесені зміни?</h3>
        <p>Поточна гра буде перезапущена.</p>
        <div class="modal-buttons">
          <button class="modal-button cancel" id="gameplayCancelButton">Скасувати</button>
          <button class="modal-button confirm" id="gameplayConfirmButton">Так, змінити</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.confirmModal);

    this.confirmButton = document.getElementById('gameplayConfirmButton');
    this.cancelButton = document.getElementById('gameplayCancelButton');
  }

  bindModalEvents() {
    if (this.confirmButton && this.cancelButton) {
      // Видаляємо старі слухачі, якщо є
      this.confirmButton.replaceWith(this.confirmButton.cloneNode(true));
      this.cancelButton.replaceWith(this.cancelButton.cloneNode(true));

      // Оновлюємо посилання після клонування
      this.confirmButton = document.getElementById('gameplayConfirmButton');
      this.cancelButton = document.getElementById('gameplayCancelButton');

      // Додаємо нові слухачі
      this.confirmButton.addEventListener('click', () => {
        this.confirmChanges();
      });

      this.cancelButton.addEventListener('click', () => {
        this.cancelChanges();
      });
    }
  }

  bindSettingsCloseEvent() {
    const settingsClose = document.getElementById('settingsClose');

    if (settingsClose) {
      settingsClose.addEventListener('click', () => {
        this.closeGameplayPanel();
      });
    }
  }

  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.isTimerDisabled =
          settings.isTimerDisabled !== undefined
            ? settings.isTimerDisabled
            : false;
        this.gridSize = settings.gridSize !== undefined ? settings.gridSize : 4;
        console.log('Налаштування геймплею завантажені:', settings);
      }
    } catch (error) {
      console.warn('Помилка завантаження налаштувань геймплею:', error);
      this.resetToDefaults();
    }
  }

  saveSettings() {
    try {
      const settings = {
        isTimerDisabled: this.isTimerDisabled,
        gridSize: this.gridSize,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      console.log('Налаштування геймплею збережені:', settings);
    } catch (error) {
      console.warn('Помилка збереження налаштувань геймплею:', error);
    }
  }

  resetToDefaults() {
    this.isTimerDisabled = false;
    this.gridSize = 4;
    this.saveSettings();
  }

  isGameActive() {
    const gamePanel = document.getElementById('gamePanel');
    return (
      gamePanel &&
      (gamePanel.style.display === 'flex' ||
        gamePanel.classList.contains('show'))
    );
  }

  createGameplayPanel() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const sidebar = settingsContainer.querySelector('.settings-sidebar');
    const content = settingsContainer.querySelector('.settings-content');

    if (!sidebar || !content) return;

    const gameplayTab = document.createElement('button');
    gameplayTab.className = 'gameplay-tab';
    gameplayTab.innerHTML = `<span>ГЕЙМПЛЕЙ</span>`;
    sidebar.appendChild(gameplayTab);

    const gameplayContent = document.createElement('div');
    gameplayContent.className = 'gameplay-content';
    gameplayContent.innerHTML = `
      <h3>Налаштування геймплею</h3>
      
      <div class="gameplay-option">
        <div class="checkbox-container" id="timerCheckboxContainer">
          <input type="checkbox" id="timerDisabledCheckbox" class="hidden-checkbox" ${this.isTimerDisabled ? 'checked' : ''}>
          <div class="custom-checkbox ${this.isTimerDisabled ? 'checked' : ''}" id="timerCustomCheckbox"></div>
          <label class="checkbox-label" for="timerDisabledCheckbox">
            Гра не на час
            <div class="checkbox-description">
              Відключити 5-хвилинний таймер та грати без обмежень часу
            </div>
          </label>
        </div>
      </div>
      
      <div class="gameplay-option">
        <label class="option-label">Складність гри</label>
        <div class="grid-size-selector">
          <button class="grid-size-button" data-size="3">
            <span class="grid-label">3×3</span>
            <span class="grid-description">Легкий</span>
          </button>
          <button class="grid-size-button active" data-size="4">
            <span class="grid-label">4×4</span>
            <span class="grid-description">Стандартний</span>
          </button>
          <button class="grid-size-button" data-size="5">
            <span class="grid-label">5×5</span>
            <span class="grid-description">Складний</span>
          </button>
        </div>
      </div>
    `;

    content.appendChild(gameplayContent);

    this.gameplayTab = gameplayTab;
    this.gameplayContent = gameplayContent;
    this.timerCheckbox = document.getElementById('timerDisabledCheckbox');
    this.timerCustomCheckbox = document.getElementById('timerCustomCheckbox');
    this.timerCheckboxContainer = document.getElementById(
      'timerCheckboxContainer',
    );
    this.gridSizeButtons = Array.from(
      gameplayContent.querySelectorAll('.grid-size-button'),
    );
  }

  bindEvents() {
    if (!this.gameplayTab) return;

    this.gameplayTab.addEventListener('click', () => {
      this.toggleGameplayPanel();
    });

    if (this.timerCheckbox) {
      this.timerCheckbox.addEventListener('change', () => {
        this.handleTimerToggle();
      });
    }

    if (this.timerCheckboxContainer) {
      this.timerCheckboxContainer.addEventListener('click', (e) => {
        if (e.target !== this.timerCheckbox) {
          this.timerCheckbox.checked = !this.timerCheckbox.checked;
          this.handleTimerToggle();
        }
      });
    }

    this.gridSizeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const newSize = parseInt(button.dataset.size);
        this.handleGridSizeChange(newSize);
      });
    });
  }

  handleTimerToggle() {
    const newTimerState = this.timerCheckbox.checked;

    if (!this.isGameActive()) {
      this.isTimerDisabled = newTimerState;
      this.updateUI();
      this.saveSettings();
      return;
    }

    this.pendingTimerChange = newTimerState;
    this.showConfirmModal();
  }

  handleGridSizeChange(newSize) {
    if (newSize === this.gridSize && !this.isGameActive()) {
      return;
    }

    if (!this.isGameActive()) {
      this.gridSize = newSize;
      this.updateUI();
      this.saveSettings();
      return;
    }

    this.pendingGridSize = newSize;
    this.showConfirmModal();
  }

  showConfirmModal() {
    if (window.gameTimer && window.gameTimer.isGameRunning()) {
      window.gameTimer.pauseTimer();
    }

    if (this.confirmModal) {
      this.confirmModal.style.display = 'flex';
    }
  }

  confirmChanges() {
    console.log('Підтвердження змін');

    if (this.pendingGridSize !== null && this.pendingGridSize !== undefined) {
      this.gridSize = this.pendingGridSize;
      this.pendingGridSize = null;
    }

    if (
      this.pendingTimerChange !== null &&
      this.pendingTimerChange !== undefined
    ) {
      this.isTimerDisabled = this.pendingTimerChange;
      this.pendingTimerChange = null;
    }

    this.updateUI();
    this.saveSettings();

    if (this.confirmModal) {
      this.confirmModal.style.display = 'none';
    }

    this.closeGameplayPanel();

    if (window.settingsModal) {
      window.settingsModal.closeModal();
    }

    this.restartGame();
  }

  cancelChanges() {
    console.log('Скасування змін');

    this.pendingGridSize = null;
    this.pendingTimerChange = null;

    if (this.timerCheckbox) {
      this.timerCheckbox.checked = this.isTimerDisabled;
    }

    this.updateUI();

    if (this.confirmModal) {
      this.confirmModal.style.display = 'none';
    }

    if (window.gameTimer && window.gameTimer.isTimerPaused()) {
      window.gameTimer.resumeTimer();
    }
  }

  restartGame() {
    if (window.gamePanel) {
      window.gamePanel.shuffleAndRender();
    }
  }

  toggleGameplayPanel() {
    if (this.isPanelOpen) {
      this.closeGameplayPanel();
    } else {
      this.closeAllPanels();
      this.showGameplayPanel();
    }
  }

  closeAllPanels() {
    if (window.soundManager && window.soundManager.isSoundPanelOpen()) {
      window.soundManager.closeSoundPanel();
    }

    if (window.rulesManager && window.rulesManager.isRulesPanelOpen()) {
      window.rulesManager.closeRulesPanel();
    }

    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));
  }

  showGameplayPanel() {
    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));

    this.gameplayContent.classList.add('active');
    this.gameplayTab.classList.add('active');
    this.isPanelOpen = true;
  }

  closeGameplayPanel() {
    if (this.gameplayContent) {
      this.gameplayContent.classList.remove('active');
    }
    if (this.gameplayTab) {
      this.gameplayTab.classList.remove('active');
    }
    this.isPanelOpen = false;
  }

  isGameplayPanelOpen() {
    return this.isPanelOpen;
  }

  updateUI() {
    if (!this.timerCheckbox || !this.timerCustomCheckbox) return;

    if (this.isTimerDisabled) {
      this.timerCustomCheckbox.classList.add('checked');
    } else {
      this.timerCustomCheckbox.classList.remove('checked');
    }
    this.timerCheckbox.checked = this.isTimerDisabled;

    this.gridSizeButtons.forEach((button) => {
      const buttonSize = parseInt(button.dataset.size);
      if (buttonSize === this.gridSize) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  getGridSize() {
    return this.gridSize;
  }

  getTimerDisabled() {
    return this.isTimerDisabled;
  }

  setGridSize(size) {
    this.gridSize = size;
    this.updateUI();
    this.saveSettings();
  }

  setTimerDisabled(disabled) {
    this.isTimerDisabled = disabled;
    this.updateUI();
    this.saveSettings();
  }

  clearSettings() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('Налаштування геймплею очищені');
    } catch (error) {
      console.warn('Помилка очищення налаштувань:', error);
    }
  }

  exportSettings() {
    return {
      isTimerDisabled: this.isTimerDisabled,
      gridSize: this.gridSize,
    };
  }

  importSettings(settings) {
    if (settings && typeof settings === 'object') {
      this.isTimerDisabled =
        settings.isTimerDisabled !== undefined
          ? settings.isTimerDisabled
          : this.isTimerDisabled;
      this.gridSize =
        settings.gridSize !== undefined ? settings.gridSize : this.gridSize;
      this.updateUI();
      this.saveSettings();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.gameplayManager = new GameplayManager();
  }, 100);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameplayManager;
}