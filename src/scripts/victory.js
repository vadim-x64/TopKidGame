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
    firstImage.src = 'src/resources/victory.png';
    firstImage.alt = '...';
    firstImage.className = 'victory-image first-image';

    this.victoryImages.appendChild(firstImage);
    document.body.appendChild(this.victoryImages);
  }

  updateVolumeFromSoundManager() {
    if (window.soundManager && this.victorySound) {
      const sfxVolume = window.soundManager.getCurrentSfxVolume();
      const isMuted = window.soundManager.isSfxSoundMuted();
      this.victorySound.volume = isMuted ? 0 : sfxVolume;
    }
  }

  showVictory() {
    if (this.isVictoryPlaying) return;

    this.isVictoryPlaying = true;
    if (window.gameTimer) {
      window.gameTimer.stopTimer();

      if (window.gameTimer.warningSound) {
        window.gameTimer.warningSound.pause();
        window.gameTimer.warningSound.currentTime = 0;
      }

      if (window.gameTimer.timerText.classList.contains('warning')) {
        window.gameTimer.timerText.style.animation = 'none';
      }
    }

    this.gameWon = true;

    const backButton = document.getElementById('backButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const gameSettingsButton = document.getElementById('gameSettingsButton'); // Додано

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
    // Додано: блокування кнопки налаштувань
    if (gameSettingsButton) {
      gameSettingsButton.disabled = true;
      gameSettingsButton.style.opacity = '0.5';
      gameSettingsButton.style.pointerEvents = 'none';
    }

    if (window.gamePause) {
      window.gamePause.disablePauseButton();
    }

    if (window.gameMechanics) {
      window.gameMechanics.setVictoryState(true);
    }

    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic) {
      gameMusic.pause();
    }

    this.updateVolumeFromSoundManager();
    this.victorySound.currentTime = 0;
    this.victorySound.play().catch(error => {
      console.log('Victory sound could not be played:', error);
    });
    this.victoryOverlay.classList.add('show');

    setTimeout(() => {
      this.victoryImages.classList.add('show');

      if (window.fallingAnimation) {
        window.fallingAnimation.startAnimation();
      }
    }, 100);
    setTimeout(() => {
      this.hideVictory();
    }, 5000);
  }

  hideVictory() {
    this.victoryOverlay.classList.remove('show');
    this.victoryImages.classList.remove('show');
    this.victoryImages.classList.add('hide');

    if (window.fallingAnimation) {
      window.fallingAnimation.stopCreatingItems();
    }

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

    if (window.fallingAnimation) {
      window.fallingAnimation.clearAll();
    }

    if (window.gameMechanics) {
      window.gameMechanics.setVictoryState(false);
    }

    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic && gameMusic.paused) {
      gameMusic.play().catch(error => {
        console.log('Game music could not be resumed:', error);
      });

      if (window.gameTimer) {
        window.gameTimer.resetTimer();
      }
    }

    if (window.gamePause) {
      window.gamePause.enablePauseButton();
    }
  }

  isGameWon() {
    return this.gameWon;
  }
}

window.victoryHandler = new VictoryHandler();