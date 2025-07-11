class GamePanel {
  constructor() {
    this.grid = [];
    this.emptyPosition = { row: 3, col: 3 };
    this.backgroundMusic = document.getElementById('backgroundMusic');
    this.gameMusic = document.getElementById('gameMusic');
    this.loadingScreen = document.getElementById('loadingScreen');
    this.fadeOverlay = document.getElementById('fadeOverlay');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.backgroundVideo = document.getElementById('backgroundVideo');
    this.gameBackgroundVideo = document.getElementById('gameBackgroundVideo');
    this.animationTimeouts = [];
    this.isInitializing = false;
    this.initializeGrid();
    this.bindEvents();
  }

  initializeGrid() {
    this.grid = [];
    for (let i = 0; i < 4; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 4; j++) {
        if (i === 3 && j === 3) {
          this.grid[i][j] = 0;
        } else {
          this.grid[i][j] = i * 4 + j + 1;
        }
      }
    }
  }

  shuffleGrid() {
    const numbers = [];
    for (let i = 1; i <= 15; i++) {
      numbers.push(i);
    }

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let index = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i === 3 && j === 3) {
          this.grid[i][j] = 0;
          this.emptyPosition = { row: i, col: j };
        } else {
          this.grid[i][j] = numbers[index];
          index++;
        }
      }
    }
  }

  clearAnimationTimeouts() {
    this.animationTimeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.animationTimeouts = [];
  }

  pauseInitialization() {
    if (this.isInitializing) {
      this.clearAnimationTimeouts();

      const panelGrid = document.getElementById('panelGrid');
      const cells = panelGrid.querySelectorAll('.panel-cell:not(.animate-in)');

      this.pendingCells = Array.from(cells).map(cell => ({
        element: cell,
        row: parseInt(cell.getAttribute('data-row')),
        col: parseInt(cell.getAttribute('data-col'))
      }));
    }
  }

  resumeInitialization() {
    if (this.isInitializing && this.pendingCells && this.pendingCells.length > 0) {
      this.pendingCells.forEach((cellData, index) => {
        const delay = index * 100;
        const timeoutId = setTimeout(() => {
          if (!window.gamePause || !window.gamePause.getIsPaused()) {
            cellData.element.classList.add('animate-in');
          }
        }, delay);
        this.animationTimeouts.push(timeoutId);
      });

      this.pendingCells = [];

      const finalTimeoutId = setTimeout(() => {
        if (window.gameMechanics && (!window.gamePause || !window.gamePause.getIsPaused())) {
          window.gameMechanics.initializeMechanics();
        }
        this.isInitializing = false;
      }, this.pendingCells.length * 100 + 500);
      this.animationTimeouts.push(finalTimeoutId);
    }
  }

  showGameButtons() {
    const backButton = document.getElementById('backButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const gameSettingsButton = document.getElementById('gameSettingsButton');

    backButton.style.display = 'block';
    shuffleButton.style.display = 'block';
    gameSettingsButton.style.display = 'block';

    backButton.addEventListener('click', () => {
      this.showConfirmModal();
    });

    shuffleButton.addEventListener('click', () => {
      this.shuffleAndRender();
    });

    gameSettingsButton.addEventListener('click', () => {
      if (window.settingsModal) {
        window.settingsModal.openModal();
      }
    });
  }

  showBackButton() {
    this.showGameButtons();
  }

  shuffleAndRender() {
    if (window.victoryHandler) {
      window.victoryHandler.resetVictoryState();
      if (window.gameTimer) {
        window.gameTimer.resetTimer();
        window.gameTimer.startTimer();
      }
    }

    if (window.gamePause) {
      window.gamePause.enablePauseButton();
    }

    const gameSettingsButton = document.getElementById('gameSettingsButton');
    if (gameSettingsButton) {
      gameSettingsButton.disabled = false;
      gameSettingsButton.style.opacity = '';
      gameSettingsButton.style.pointerEvents = '';
    }

    // this.shuffleGrid();
    this.renderPanel();
  }

  showConfirmModal() {
    if (window.gameTimer && window.gameTimer.isGameRunning()) {
      window.gameTimer.pauseTimer();
    }

    this.modalOverlay.style.display = 'flex';

    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    const confirmHandler = () => {
      this.modalOverlay.style.display = 'none';
      this.hidePanel();
      confirmButton.removeEventListener('click', confirmHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    };

    const cancelHandler = () => {
      if (window.gameTimer && window.gameTimer.isTimerPaused()) {
        window.gameTimer.resumeTimer();
      }

      this.modalOverlay.style.display = 'none';
      confirmButton.removeEventListener('click', confirmHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    };

    confirmButton.addEventListener('click', confirmHandler);
    cancelButton.addEventListener('click', cancelHandler);
  }

  renderPanel() {
    this.clearAnimationTimeouts();
    this.isInitializing = true;

    const panelGrid = document.getElementById('panelGrid');
    panelGrid.innerHTML = '';

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 'panel-cell';
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        cell.style.opacity = '0';

        if (this.grid[i][j] === 0) {
          cell.classList.add('empty');
          cell.textContent = '';
        } else {
          cell.textContent = this.grid[i][j];
        }

        panelGrid.appendChild(cell);

        const delay = (i * 4 + j) * 100;
        const timeoutId = setTimeout(() => {
          if (!window.gamePause || !window.gamePause.getIsPaused()) {
            cell.classList.add('animate-in');
          }
        }, delay);
        this.animationTimeouts.push(timeoutId);
      }
    }

    const finalTimeoutId = setTimeout(() => {
      if (window.gameMechanics && (!window.gamePause || !window.gamePause.getIsPaused())) {
        window.gameMechanics.initializeMechanics();
      }
      this.isInitializing = false;
    }, 2000);
    this.animationTimeouts.push(finalTimeoutId);
  }

  showPanel() {
    const mainMenu = document.getElementById('mainMenu');
    const gamePanel = document.getElementById('gamePanel');

    this.loadingScreen.style.display = 'flex';

    setTimeout(() => {
      this.fadeOverlay.classList.add('active');

      setTimeout(() => {
        this.backgroundVideo.classList.remove('show');
        this.gameBackgroundVideo.classList.add('show');
        this.backgroundMusic.pause();
        this.gameMusic.currentTime = 0;
        this.gameMusic.play().catch(() => {});

        mainMenu.style.opacity = '0';
        mainMenu.style.transform = 'scale(0.8)';

        setTimeout(() => {
          mainMenu.style.display = 'none';
          gamePanel.style.display = 'flex';
          this.loadingScreen.style.display = 'none';

          // this.shuffleGrid();
          this.renderPanel();
          this.showGameButtons();

          if (window.gameTimer) {
            window.gameTimer.startTimer();
          }

          setTimeout(() => {
            gamePanel.classList.add('show');
            this.fadeOverlay.classList.remove('active');
          }, 50);
        }, 500);
      }, 1000);
    }, 2000);
  }

  hidePanel() {
    this.clearAnimationTimeouts();
    this.isInitializing = false;

    const mainMenu = document.getElementById('mainMenu');
    const gamePanel = document.getElementById('gamePanel');
    const backButton = document.getElementById('backButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const gameSettingsButton = document.getElementById('gameSettingsButton');

    this.loadingScreen.style.display = 'flex';

    setTimeout(() => {
      this.fadeOverlay.classList.add('active');

      setTimeout(() => {
        this.gameBackgroundVideo.classList.remove('show');
        this.backgroundVideo.classList.add('show');

        this.gameMusic.pause();

        if (window.gameTimer) {
          window.gameTimer.stopTimer();
          window.gameTimer.hideTimer();
        }

        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic.play().catch(() => {});

        // Анімація приховування кнопок
        backButton.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        backButton.style.opacity = '0';
        backButton.style.transform = 'scale(0.8)';

        shuffleButton.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        shuffleButton.style.opacity = '0';
        shuffleButton.style.transform = 'scale(0.8)';

        gameSettingsButton.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        gameSettingsButton.style.opacity = '0';
        gameSettingsButton.style.transform = 'scale(0.8)';

        gamePanel.style.transform = 'scale(0.3)';
        gamePanel.style.opacity = '0';

        setTimeout(() => {
          // ПРОСТО ХОВАЄМО КНОПКИ, НЕ СКИДАЄМО СТИЛІ!
          backButton.style.display = 'none';
          shuffleButton.style.display = 'none';
          gameSettingsButton.style.display = 'none';

          gamePanel.classList.remove('show');
          gamePanel.style.display = 'none';
          gamePanel.style.transform = '';
          gamePanel.style.opacity = '';
          this.loadingScreen.style.display = 'none';

          mainMenu.style.display = 'flex';
          mainMenu.style.opacity = '0';
          mainMenu.style.transform = 'scale(0.8)';

          setTimeout(() => {
            mainMenu.style.opacity = '1';
            mainMenu.style.transform = 'scale(1)';
            this.fadeOverlay.classList.remove('active');
          }, 50);
        }, 500);
      }, 1000);
    }, 2000);
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      const newGameButton = document.getElementById('newGameButton');
      if (newGameButton) {
        newGameButton.addEventListener('click', () => {
          this.showPanel();
        });
      }
    });

    const newGameButton = document.getElementById('newGameButton');
    if (newGameButton) {
      newGameButton.addEventListener('click', () => {
        this.showPanel();
      });
    }
  }
}

window.gamePanel = new GamePanel();