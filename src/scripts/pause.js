class GamePause {
  constructor() {
    this.isPaused = false;
    this.pauseButton = null;
    this.pauseOverlay = null;
    this.pauseSound = null;
    this.pauseIcon = 'https://cdn-icons-png.flaticon.com/128/15338/15338147.png';
    this.playIcon = 'https://cdn-icons-png.flaticon.com/128/16081/16081328.png';

    this.initializePauseSystem();
  }

  initializePauseSystem() {
    this.createPauseButton();
    this.createPauseOverlay();
    this.createPauseSound();
    this.bindEvents();
  }

  createPauseButton() {
    this.pauseButton = document.createElement('button');
    this.pauseButton.className = 'pause-button';
    this.pauseButton.id = 'pauseButton';

    const img = document.createElement('img');
    img.src = this.pauseIcon;
    img.alt = '...';

    this.pauseButton.appendChild(img);
    document.body.appendChild(this.pauseButton);
  }

  createPauseOverlay() {
    this.pauseOverlay = document.createElement('div');
    this.pauseOverlay.className = 'pause-overlay';
    this.pauseOverlay.id = 'pauseOverlay';
    document.body.appendChild(this.pauseOverlay);
  }

  createPauseSound() {
    this.pauseSound = document.createElement('audio');
    this.pauseSound.src = 'src/resources/pause.mp3';
    this.pauseSound.preload = 'auto';
    document.body.appendChild(this.pauseSound);
  }

  bindEvents() {
    this.pauseButton.addEventListener('click', () => {
      this.togglePause();
    });

    document.addEventListener('DOMContentLoaded', () => {
      const gamePanel = document.getElementById('gamePanel');
      if (gamePanel) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
              if (gamePanel.style.display === 'flex') {
                this.showPauseButton();
              } else if (gamePanel.style.display === 'none') {
                this.hidePauseButton();
                this.resetPauseState();
              }
            }
          });
        });

        observer.observe(gamePanel, {
          attributes: true,
          attributeFilter: ['style']
        });

        const classObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (gamePanel.classList.contains('show')) {
                this.showPauseButton();
              } else {
                this.hidePauseButton();
                this.resetPauseState();
              }
            }
          });
        });

        classObserver.observe(gamePanel, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
    });
  }

  togglePause() {
    if (this.isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  pauseGame() {
    if (this.isPaused) return;

    this.isPaused = true;
    this.pauseSound.currentTime = 0;
    this.pauseSound.play().catch(() => {});

    const img = this.pauseButton.querySelector('img');
    if (img) {
      img.src = this.playIcon;
      img.alt = '...';
    }

    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic && !gameMusic.paused) {
      gameMusic.pause();
    }

    if (window.gameTimer && window.gameTimer.warningSound && !window.gameTimer.warningSound.paused) {
      window.gameTimer.warningSound.pause();
    }

    if (window.gameTimer && window.gameTimer.isGameRunning()) {
      window.gameTimer.pauseTimer();
    }

    if (window.gameMechanics) {
      window.gameMechanics.setVictoryState(true);
    }

    this.pauseOverlay.classList.add('show');

    const shuffleButton = document.getElementById('shuffleButton');
    if (shuffleButton) {
      shuffleButton.classList.add('disabled');
      shuffleButton.style.opacity = '0.5';
      shuffleButton.style.pointerEvents = 'none';
    }

    const timerContainer = document.getElementById('timerContainer');
    if (timerContainer) {
      timerContainer.style.filter = 'blur(3px)';
      timerContainer.style.opacity = '0.7';
    }
  }

  resumeGame() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.pauseSound.currentTime = 0;
    this.pauseSound.play().catch(() => {});

    const img = this.pauseButton.querySelector('img');
    if (img) {
      img.src = this.pauseIcon;
      img.alt = '...';
    }

    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic) {
      gameMusic.play().catch(() => {});
    }

    if (window.gameTimer) {
      window.gameTimer.resumeTimer();
    }

    if (window.gameMechanics) {
      window.gameMechanics.setVictoryState(false);
    }

    this.pauseOverlay.classList.remove('show');

    const shuffleButton = document.getElementById('shuffleButton');
    if (shuffleButton) {
      shuffleButton.classList.remove('disabled');
      shuffleButton.style.opacity = '';
      shuffleButton.style.pointerEvents = '';
    }

    const timerContainer = document.getElementById('timerContainer');
    if (timerContainer) {
      timerContainer.style.filter = '';
      timerContainer.style.opacity = '';
    }
  }

  showPauseButton() {
    if (this.pauseButton) {
      this.pauseButton.style.display = 'block';
    }
  }

  hidePauseButton() {
    if (this.pauseButton) {
      this.pauseButton.style.display = 'none';
    }
  }

  resetPauseState() {
    if (this.isPaused) {
      this.isPaused = false;

      const img = this.pauseButton.querySelector('img');
      if (img) {
        img.src = this.pauseIcon;
        img.alt = '...';
      }

      this.pauseOverlay.classList.remove('show');

      const shuffleButton = document.getElementById('shuffleButton');
      if (shuffleButton) {
        shuffleButton.classList.remove('disabled');
        shuffleButton.style.opacity = '';
        shuffleButton.style.pointerEvents = '';
      }

      const timerContainer = document.getElementById('timerContainer');
      if (timerContainer) {
        timerContainer.style.filter = '';
        timerContainer.style.opacity = '';
      }
    }

    this.enablePauseButton();
  }

  disablePauseButton() {
    if (this.pauseButton) {
      this.pauseButton.disabled = true;
      this.pauseButton.style.opacity = '0.5';
      this.pauseButton.style.pointerEvents = 'none';
    }
  }

  enablePauseButton() {
    if (this.pauseButton) {
      this.pauseButton.disabled = false;
      this.pauseButton.style.opacity = '';
      this.pauseButton.style.pointerEvents = '';
    }
  }

  getIsPaused() {
    return this.isPaused;
  }
}

window.gamePause = new GamePause();