class GamePanel {
  constructor() {
    this.grid = [];
    this.emptyPosition = { row: 3, col: 3 };
    this.gridSize = 4;
    this.backgroundMusic = document.getElementById('backgroundMusic');
    this.gameMusic = document.getElementById('gameMusic');
    this.loadingScreen = document.getElementById('loadingScreen');
    this.fadeOverlay = document.getElementById('fadeOverlay');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.backgroundVideo = document.getElementById('backgroundVideo');
    this.gameBackgroundVideo = document.getElementById('gameBackgroundVideo');
    this.animationTimeouts = [];
    this.isInitializing = false;
    this.updateGridSize();
    this.initializeGrid();
    this.bindEvents();
  }

  updateGridSize() {
    if (window.gameplayManager) {
      this.gridSize = window.gameplayManager.getGridSize();
    } else {
      this.gridSize = 4;
    }
    this.emptyPosition = { row: this.gridSize - 1, col: this.gridSize - 1 };
  }

  initializeGrid() {
    this.grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        if (i === this.gridSize - 1 && j === this.gridSize - 1) {
          this.grid[i][j] = 0;
        } else {
          this.grid[i][j] = i * this.gridSize + j + 1;
        }
      }
    }
  }

  shuffleGrid() {
    const numbers = [];
    const totalCells = this.gridSize * this.gridSize;

    for (let i = 1; i < totalCells; i++) {
      numbers.push(i);
    }

    // Перемішування масиву
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let index = 0;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (i === this.gridSize - 1 && j === this.gridSize - 1) {
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
      panelGrid.setAttribute('data-grid-size', this.gridSize);
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
    const settingsButton = document.getElementById('settingsButton');

    backButton.style.display = 'block';
    shuffleButton.style.display = 'block';
    gameSettingsButton.style.display = 'block';
    settingsButton.style.display = 'none';

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

    this.updateGridSize();
    this.initializeGrid();
    this.shuffleGrid();
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

    // Оновити CSS Grid для нового розміру
    panelGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    panelGrid.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

    // Визначити розмір шрифту в залежності від розміру сітки
    let fontSize;
    if (this.gridSize === 3) {
      fontSize = window.innerWidth <= 768 ? '48px' : '100px';
    } else if (this.gridSize === 4) {
      fontSize = window.innerWidth <= 768 ? '36px' : '80px';
    } else { // 5
      fontSize = window.innerWidth <= 768 ? '28px' : '64px';
    }

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'panel-cell';
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        cell.style.opacity = '0';
        cell.style.fontSize = fontSize;

        if (this.grid[i][j] === 0) {
          cell.classList.add('empty');
          cell.textContent = '';
        } else {
          cell.textContent = this.grid[i][j];
        }

        panelGrid.appendChild(cell);

        const delay = (i * this.gridSize + j) * 100;
        const timeoutId = setTimeout(() => {
          if (!window.gamePause || !window.gamePause.getIsPaused()) {
            cell.classList.add('animate-in');
          }
        }, delay);
        this.animationTimeouts.push(timeoutId);
      }
    }

    const totalCells = this.gridSize * this.gridSize;
    const finalTimeoutId = setTimeout(() => {
      if (window.gameMechanics && (!window.gamePause || !window.gamePause.getIsPaused())) {
        window.gameMechanics.initializeMechanics();
      }
      this.isInitializing = false;
    }, totalCells * 100 + 500);
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

          this.updateGridSize();
          this.initializeGrid();
          this.shuffleGrid();
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
    const settingsButton = document.getElementById('settingsButton');

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

        settingsButton.style.display = 'block';

        setTimeout(() => {
          backButton.style.display = 'none';
          backButton.style.opacity = '';
          backButton.style.transform = '';
          backButton.style.transition = '';

          shuffleButton.style.display = 'none';
          shuffleButton.style.opacity = '';
          shuffleButton.style.transform = '';
          shuffleButton.style.transition = '';

          gameSettingsButton.style.display = 'none';
          gameSettingsButton.style.opacity = '';
          gameSettingsButton.style.transform = '';
          gameSettingsButton.style.transition = '';

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

  getGridSize() {
    return this.gridSize;
  }
}

window.gamePanel = new GamePanel();