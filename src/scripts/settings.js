class SettingsModal {
  constructor() {
    this.modal = null;
    this.settingsButton = null;
    this.closeButton = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.getElements();
    this.bindEvents();
  }

  getElements() {
    this.modal = document.getElementById('settingsModal');
    this.settingsButton = document.getElementById('settingsButton');
    this.closeButton = document.getElementById('settingsClose');
  }

  bindEvents() {
    if (this.settingsButton) {
      this.settingsButton.addEventListener('click', (e) => {
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

  openModal() {
    if (!this.isOpen && this.modal) {
      this.modal.classList.add('show');
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.isOpen && this.modal) {
      this.modal.classList.remove('show');
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SettingsModal();
});