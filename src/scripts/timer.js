class GameTimer {
  constructor() {
    this.timeLeft = 300;
    this.totalTime = 300;
    this.timerInterval = null;
    this.isRunning = false;
    this.isPaused = false;
    this.warningPlayed = false;
    this.timerContainer = null;
    this.timerText = null;
    this.defeatSound = null;
    this.warningSound = null;
    this.defeatOverlay = null;
    this.defeatImages = null;
    this.isDefeatShowing = false;
    this.isWarningPlaying = false;
    this.warningStartTime = null;
    this.initializeTimer();
    this.initializeDefeatElements();
  }

  initializeTimer() {
    this.timerContainer = document.createElement('div');
    this.timerContainer.className = 'timer-container';
    this.timerContainer.id = 'timerContainer';
    this.timerText = document.createElement('div');
    this.timerText.className = 'timer-text';
    this.timerText.textContent = this.formatTime(this.timeLeft);
    this.timerContainer.appendChild(this.timerText);
    document.body.appendChild(this.timerContainer);
  }

  initializeDefeatElements() {
    this.warningSound = document.createElement('audio');
    this.warningSound.src = 'src/resources/timer.mp3';
    this.warningSound.preload = 'auto';
    document.body.appendChild(this.warningSound);

    this.warningSound.addEventListener('ended', () => {
      this.isWarningPlaying = false;
    });

    this.defeatSound = document.createElement('audio');
    this.defeatSound.src = 'src/resources/defeat.mp3';
    this.defeatSound.preload = 'auto';
    document.body.appendChild(this.defeatSound);

    this.defeatOverlay = document.createElement('div');
    this.defeatOverlay.className = 'victory-overlay';
    this.defeatOverlay.id = 'defeatOverlay';
    document.body.appendChild(this.defeatOverlay);

    this.defeatImages = document.createElement('div');
    this.defeatImages.className = 'victory-images';
    this.defeatImages.id = 'defeatImages';

    const defeatImage = document.createElement('img');
    defeatImage.src = 'src/resources/defeat.gif';
    defeatImage.alt = '...';
    defeatImage.className = 'victory-image';

    this.defeatImages.appendChild(defeatImage);
    document.body.appendChild(this.defeatImages);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timeLeft = this.totalTime;
    this.warningPlayed = false;
    this.warningStartTime = null;
    this.isWarningPlaying = false;
    this.timerContainer.classList.add('show');
    this.timerContainer.classList.remove('warning');
    this.timerText.classList.remove('warning');
    this.timerText.textContent = this.formatTime(this.timeLeft);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerText.textContent = this.formatTime(this.timeLeft);

      if (this.timeLeft < 30 && !this.warningPlayed) {
        this.warningPlayed = true;
        this.playWarning();
      }

      if (this.timeLeft <= 0) {
        this.triggerDefeat();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.isRunning = false;

    if (this.warningSound && this.isWarningPlaying) {
      this.warningSound.pause();
      this.warningSound.currentTime = 0;
      this.isWarningPlaying = false;
      this.warningStartTime = null;
    }
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.isPaused = true;

    if (this.warningSound && this.isWarningPlaying && !this.warningSound.paused) {
      this.warningSound.pause();
    }

    if (this.timerText.classList.contains('warning')) {
      this.timerText.style.animationPlayState = 'paused';
    }
  }

  resumeTimer() {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;

    if (this.timeLeft < 30 && this.warningPlayed && this.isWarningPlaying && this.warningSound.paused) {
      this.warningSound.play().catch(() => {});
    }

    if (this.timerText.classList.contains('warning')) {
      this.timerText.style.animationPlayState = 'running';
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerText.textContent = this.formatTime(this.timeLeft);

      if (this.timeLeft < 30 && !this.warningPlayed) {
        this.warningPlayed = true;
        this.playWarning();
      }

      if (this.timeLeft <= 0) {
        this.triggerDefeat();
      }
    }, 1000);
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.totalTime;
    this.warningPlayed = false;
    this.warningStartTime = null;
    this.timerContainer.classList.remove('warning');
    this.timerText.classList.remove('warning');
    this.timerContainer.classList.add('show');
    this.timerText.style.animation = '';

    if (this.warningSound) {
      this.warningSound.pause();
      this.warningSound.currentTime = 0;
      this.isWarningPlaying = false;
    }

    if (this.isDefeatShowing) {
      this.hideDefeat();
    }
  }

  hideTimer() {
    this.timerContainer.classList.remove('show');
  }

  playWarning() {
    this.isWarningPlaying = true;
    this.warningStartTime = Date.now();
    this.warningSound.currentTime = 0;
    this.warningSound.play().catch(() => {});
    this.timerContainer.classList.add('warning');
    this.timerText.classList.add('warning');
  }

  triggerDefeat() {
    this.stopTimer();

    if (this.timerText.classList.contains('warning')) {
      this.timerText.style.animation = 'none';
    }

    if (this.warningSound) {
      this.warningSound.pause();
      this.warningSound.currentTime = 0;
      this.isWarningPlaying = false;
    }

    if (this.isDefeatShowing) return;
    this.isDefeatShowing = true;

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

    this.defeatSound.currentTime = 0;
    this.defeatSound.play().catch(() => {});
    this.defeatOverlay.classList.add('show');

    setTimeout(() => {
      this.defeatImages.classList.add('show');
    }, 100);

    setTimeout(() => {
      this.hideDefeat();
    }, 5000);
  }

  hideDefeat() {
    this.defeatOverlay.classList.remove('show');
    this.defeatImages.classList.remove('show');
    this.defeatImages.classList.add('hide');

    setTimeout(() => {
      this.defeatImages.classList.remove('hide');
      this.isDefeatShowing = false;

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

  isGameRunning() {
    return this.isRunning;
  }

  getTimeLeft() {
    return this.timeLeft;
  }

  isTimerPaused() {
    return this.isPaused;
  }

  isWarningActive() {
    return this.isWarningPlaying;
  }
}

window.gameTimer = new GameTimer();