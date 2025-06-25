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

  showBackButton() {
    const backButton = document.getElementById('backButton');
    backButton.style.display = 'block';
    backButton.addEventListener('click', () => {
      this.showConfirmModal();
    });
  }

  showConfirmModal() {
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
      this.modalOverlay.style.display = 'none';
      confirmButton.removeEventListener('click', confirmHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    };

    confirmButton.addEventListener('click', confirmHandler);
    cancelButton.addEventListener('click', cancelHandler);
  }

  renderPanel() {
    const panelGrid = document.getElementById('panelGrid');
    panelGrid.innerHTML = '';

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 'panel-cell';
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);

        if (this.grid[i][j] === 0) {
          cell.classList.add('empty');
          cell.textContent = '';
        } else {
          cell.textContent = this.grid[i][j];
          cell.style.opacity = '0';

          const delay = (i * 4 + j) * 100;
          setTimeout(() => {
            cell.classList.add('animate-in');
          }, delay);
        }

        panelGrid.appendChild(cell);
      }
    }
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

          this.shuffleGrid();
          this.renderPanel();
          this.showBackButton();

          setTimeout(() => {
            gamePanel.classList.add('show');
            // Прибираємо чорне вицвітання
            this.fadeOverlay.classList.remove('active');
          }, 50);
        }, 500);
      }, 1000);
    }, 2000);
  }

  hidePanel() {
    const mainMenu = document.getElementById('mainMenu');
    const gamePanel = document.getElementById('gamePanel');
    const backButton = document.getElementById('backButton');

    this.loadingScreen.style.display = 'flex';

    setTimeout(() => {
      // Чорне вицвітання
      this.fadeOverlay.classList.add('active');

      setTimeout(() => {
        this.gameBackgroundVideo.classList.remove('show');
        this.backgroundVideo.classList.add('show');

        this.gameMusic.pause();
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic.play().catch(() => {});

        backButton.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        backButton.style.opacity = '0';
        backButton.style.transform = 'scale(0.8)';

        gamePanel.style.transform = 'scale(0.3)';
        gamePanel.style.opacity = '0';

        setTimeout(() => {
          backButton.style.display = 'none';
          backButton.style.opacity = '';
          backButton.style.transform = '';
          backButton.style.transition = '';

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

const gamePanel = new GamePanel();