class VictoryHandler {
  constructor() {
    this.victorySound = null;
    this.victoryOverlay = null;
    this.victoryImages = null;
    this.isVictoryPlaying = false;
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
      const gameMusic = document.getElementById('gameMusic');
      if (gameMusic && gameMusic.paused) {
        gameMusic.play().catch(error => {
          console.log('Game music could not be resumed:', error);
        });
      }

      this.victoryImages.classList.remove('hide');
      this.isVictoryPlaying = false;

      if (window.gameMechanics) {
        window.gameMechanics.setVictoryState(false);
      }
    }, 1000);
  }

  triggerVictory() {
    this.showVictory();
  }
}

window.victoryHandler = new VictoryHandler();