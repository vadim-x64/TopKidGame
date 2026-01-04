class GameplayManager {
  constructor() {
    this.storageKey = 'spots_game_gameplay_settings';
    this.isTimerDisabled = false;
    this.gameplayTab = null;
    this.gameplayContent = null;
    this.timerCheckbox = null;
    this.isPanelOpen = false;
    this.confirmModal = null;
    this.loadSettings();
    this.init();
  }

  init() {
    this.createGameplayPanel();
    this.createConfirmModal();
    this.bindEvents();
    this.bindSettingsCloseEvent();
    this.updateUI();
  }

  createConfirmModal() {
    this.confirmModal = document.createElement('div');
    this.confirmModal.className = 'modal-overlay';
    this.confirmModal.id = 'timerChangeModal';
    this.confirmModal.innerHTML = `
      <div class="modal">
        <h3>Змінити режим таймера?</h3>
        <p>Поточна гра буде перезапущена.</p>
        <div class="modal-buttons">
          <button class="modal-button cancel" id="timerCancelButton">Скасувати</button>
          <button class="modal-button confirm" id="timerConfirmButton">Так, змінити</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.confirmModal);
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
        this.isTimerDisabled = settings.isTimerDisabled !== undefined ? settings.isTimerDisabled : false;
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
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      console.log('Налаштування геймплею збережені:', settings);
    } catch (error) {
      console.warn('Помилка збереження налаштувань геймплею:', error);
    }
  }

  resetToDefaults() {
    this.isTimerDisabled = false;
    this.saveSettings();
  }

  isGameActive() {
    const gamePanel = document.getElementById('gamePanel');
    return gamePanel && (gamePanel.style.display === 'flex' || gamePanel.classList.contains('show'));
  }

  createGameplayPanel() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const sidebar = settingsContainer.querySelector('.settings-sidebar');
    const content = settingsContainer.querySelector('.settings-content');

    if (!sidebar || !content) return;

    const gameplayTab = document.createElement('button');
    gameplayTab.className = 'gameplay-tab';
    gameplayTab.innerHTML = `
      <span>ГЕЙМПЛЕЙ</span>
    `;
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
    `;
    content.appendChild(gameplayContent);

    this.gameplayTab = gameplayTab;
    this.gameplayContent = gameplayContent;
    this.timerCheckbox = document.getElementById('timerDisabledCheckbox');
    this.timerCustomCheckbox = document.getElementById('timerCustomCheckbox');
    this.timerCheckboxContainer = document.getElementById('timerCheckboxContainer');
  }

  bindEvents() {
    if (!this.gameplayTab || !this.timerCheckbox) return;

    this.gameplayTab.addEventListener('click', () => {
      this.toggleGameplayPanel();
    });

    this.timerCheckbox.addEventListener('change', () => {
      this.handleTimerToggle();
    });

    this.timerCheckboxContainer.addEventListener('click', (e) => {
      if (e.target !== this.timerCheckbox) {
        this.timerCheckbox.checked = !this.timerCheckbox.checked;
        this.handleTimerToggle();
      }
    });

    const confirmButton = document.getElementById('timerConfirmButton');
    const cancelButton = document.getElementById('timerCancelButton');

    if (confirmButton && cancelButton) {
      confirmButton.addEventListener('click', () => {
        this.confirmTimerChange();
      });

      cancelButton.addEventListener('click', () => {
        this.cancelTimerChange();
      });
    }
  }

  handleTimerToggle() {
    const newTimerState = this.timerCheckbox.checked;

    if (!this.isGameActive()) {
      this.isTimerDisabled = newTimerState;
      this.updateUI();
      this.saveSettings();
      return;
    }

    this.showConfirmModal();
  }

  showConfirmModal() {
    if (window.gameTimer && window.gameTimer.isGameRunning()) {
      window.gameTimer.pauseTimer();
    }

    this.confirmModal.style.display = 'flex';
  }

  confirmTimerChange() {
    const newTimerState = this.timerCheckbox.checked;
    this.isTimerDisabled = newTimerState;
    this.updateUI();
    this.saveSettings();
    this.confirmModal.style.display = 'none';
    this.closeGameplayPanel();

    if (window.settingsModal) {
      window.settingsModal.closeModal();
    }

    this.restartGame();
  }

  cancelTimerChange() {
    this.timerCheckbox.checked = this.isTimerDisabled;
    this.updateUI();
    this.confirmModal.style.display = 'none';

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

    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach(content => content.classList.remove('active'));
    allTabs.forEach(tab => tab.classList.remove('active'));
  }

  showGameplayPanel() {
    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach(content => content.classList.remove('active'));
    allTabs.forEach(tab => tab.classList.remove('active'));

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
  }

  getTimerDisabled() {
    return this.isTimerDisabled;
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
      isTimerDisabled: this.isTimerDisabled
    };
  }

  importSettings(settings) {
    if (settings && typeof settings === 'object') {
      this.isTimerDisabled = settings.isTimerDisabled !== undefined ? settings.isTimerDisabled : this.isTimerDisabled;
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