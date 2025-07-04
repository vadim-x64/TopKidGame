class SettingsModal {
  constructor() {
    this.modal = null;
    this.settingsButton = null;
    this.gameSettingsButton = null;
    this.closeButton = null;
    this.isOpen = false;
    this.wasGamePaused = false;
    this.init();
  }

  init() {
    this.getElements();
    this.bindEvents();
  }

  getElements() {
    this.modal = document.getElementById('settingsModal');
    this.settingsButton = document.getElementById('settingsButton');
    this.gameSettingsButton = document.getElementById('gameSettingsButton');
    this.closeButton = document.getElementById('settingsClose');
  }

  bindEvents() {
    if (this.settingsButton) {
      this.settingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    }

    if (this.gameSettingsButton) {
      this.gameSettingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });
  }

  pauseGame() {
    this.wasGamePaused = window.gamePause && window.gamePause.getIsPaused();

    if (!this.wasGamePaused && window.gamePause) {
      window.gamePause.pauseGame();
    }
  }

  resumeGame() {
    if (!this.wasGamePaused && window.gamePause && window.gamePause.getIsPaused()) {
      window.gamePause.resumeGame();
    }
  }

  openModal() {
    if (!this.isOpen && this.modal) {
      const gamePanel = document.getElementById('gamePanel');
      if (gamePanel && gamePanel.style.display === 'flex') {
        this.pauseGame();
      }

      this.modal.classList.add('show');
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.isOpen && this.modal) {
      const gamePanel = document.getElementById('gamePanel');
      if (gamePanel && gamePanel.style.display === 'flex') {
        this.resumeGame();
      }

      this.modal.classList.remove('show');
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }
}

window.settingsModal = new SettingsModal();

document.addEventListener('DOMContentLoaded', () => {
  new SettingsModal();
});