class VictoryHandler {
  constructor() {
    this.victorySound = null;
    this.victoryOverlay = null;
    this.victoryImages = null;
    this.isVictoryPlaying = false;
    this.gameWon = false;
    this.initializeVictoryElements();
  }

  initializeVictoryElements() {
    this.victorySound = document.createElement('audio');
    this.victorySound.src = 'src/resources/victory.mp3';
    this.victorySound.preload = 'auto';
    document.body.appendChild(this.victorySound);

    this.victoryOverlay = document.createElement('div');
    this.victoryOverlay.className = 'victory-overlay';
    this.victoryOverlay.id = 'victoryOverlay';
    document.body.appendChild(this.victoryOverlay);

    this.victoryImages = document.createElement('div');
    this.victoryImages.className = 'victory-images';
    this.victoryImages.id = 'victoryImages';

    const firstImage = document.createElement('img');
    firstImage.src = 'src/resources/victory.gif'; // Замініть на своє посилання
    firstImage.alt = 'Victory Image 1';
    firstImage.className = 'victory-image first-image';

    this.victoryImages.appendChild(firstImage);
    document.body.appendChild(this.victoryImages);
  }

  showVictory() {
    if (this.isVictoryPlaying) return;

    this.isVictoryPlaying = true;
    this.gameWon = true;

    const backButton = document.getElementById('backButton');
    const shuffleButton = document.getElementById('shuffleButton');
    if (backButton) {
      backButton.disabled = true;
      backButton.style.opacity = '0.5';
      backButton.style.pointerEvents = 'none';
    }
    if (shuffleButton) {
      shuffleButton.disabled = true;
      shuffleButton.style.opacity = '0.5';
      shuffleButton.style.pointerEvents = 'none';
    }

    if (window.gameMechanics) {
      window.gameMechanics.setVictoryState(true);
    }

    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic) {
      gameMusic.pause();
    }

    this.victorySound.currentTime = 0;
    this.victorySound.play().catch(error => {
      console.log('Victory sound could not be played:', error);
    });

    this.victoryOverlay.classList.add('show');

    setTimeout(() => {
      this.victoryImages.classList.add('show');
    }, 100);

    setTimeout(() => {
      this.hideVictory();
    }, 5000);
  }

  hideVictory() {
    this.victoryOverlay.classList.remove('show');
    this.victoryImages.classList.remove('show');
    this.victoryImages.classList.add('hide');

    setTimeout(() => {
      this.victoryImages.classList.remove('hide');
      this.isVictoryPlaying = false;

      const backButton = document.getElementById('backButton');
      const shuffleButton = document.getElementById('shuffleButton');
      if (backButton) {
        backButton.disabled = false;
        backButton.style.opacity = '';
        backButton.style.pointerEvents = '';
      }
      if (shuffleButton) {
        shuffleButton.disabled = false;
        shuffleButton.style.opacity = '';
        shuffleButton.style.pointerEvents = '';
      }

    }, 1000);
  }

  triggerVictory() {
    this.showVictory();
  }

  resetVictoryState() {
    this.gameWon = false;
    if (window.gameMechanics) {
      window.gameMechanics.setVictoryState(false);
    }

    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic && gameMusic.paused) {
      gameMusic.play().catch(error => {
        console.log('Game music could not be resumed:', error);
      });
    }
  }

  isGameWon() {
    return this.gameWon;
  }
}

window.victoryHandler = new VictoryHandler();