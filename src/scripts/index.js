class ClickSoundManager {
  constructor() {
    this.clickSound = null;
    this.init();
  }

  init() {
    this.clickSound = new Audio();
    this.clickSound.preload = 'auto';
    this.clickSound.src = 'src/resources/click.mp3';
    this.addClickHandlers();
  }

  addClickHandlers() {
    document.addEventListener('click', (event) => {
      if (this.isButton(event.target) && !this.isPauseButton(event.target)) {
        this.playClickSound();
      }
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (this.isButton(node)) { }
            const buttons = node.querySelectorAll && node.querySelectorAll(this.getButtonSelectors());
            if (buttons && buttons.length > 0) { }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  isButton(element) {
    if (!element || !element.tagName) return false;

    const tagName = element.tagName.toLowerCase();
    const hasButtonClass = element.classList.contains('game-button') ||
      element.classList.contains('back-button') ||
      element.classList.contains('modal-button');

    return tagName === 'button' || hasButtonClass || element.getAttribute('role') === 'button';
  }

  isPauseButton(element) {
    return element && (element.id === 'pauseButton' || element.classList.contains('pause-button') ||
      (element.parentElement && (element.parentElement.id === 'pauseButton' ||
        element.parentElement.classList.contains('pause-button'))));
  }

  getButtonSelectors() {
    return 'button, .game-button, .back-button, .modal-button, [role="button"]';
  }

  playClickSound() {
    try {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch((error) => {
        console.log('Click sound autoplay prevented:', error);
      });
    } catch (error) {
      console.log('Error playing click sound:', error);
    }
  }

  setClickSound(audioSrc) {
    this.clickSound.src = audioSrc;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.clickSoundManager = new ClickSoundManager();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.clickSoundManager = new ClickSoundManager();
  });
} else {
  window.clickSoundManager = new ClickSoundManager();
}