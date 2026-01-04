class VisibilityManager {
  constructor() {
    this.init();
  }

  init() {
    // Обробка зміни видимості вкладки
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllMedia();
      } else {
        this.resumeAllMedia();
      }
    });

    // Обробка для iOS Safari
    window.addEventListener('blur', () => {
      this.pauseAllMedia();
    });

    window.addEventListener('focus', () => {
      this.resumeAllMedia();
    });

    // Обробка для мобільних пристроїв
    window.addEventListener('pagehide', () => {
      this.pauseAllMedia();
    });
  }

  pauseAllMedia() {
    // Зупиняємо фонову музику
    const backgroundMusic = document.getElementById('backgroundMusic');
    const gameMusic = document.getElementById('gameMusic');

    if (backgroundMusic && !backgroundMusic.paused) {
      backgroundMusic.pause();
      backgroundMusic.dataset.wasPlaying = 'true';
    }

    if (gameMusic && !gameMusic.paused) {
      gameMusic.pause();
      gameMusic.dataset.wasPlaying = 'true';
    }
  }

  resumeAllMedia() {
    // Відновлюємо музику тільки якщо вона грала до паузи
    const backgroundMusic = document.getElementById('backgroundMusic');
    const gameMusic = document.getElementById('gameMusic');

    if (backgroundMusic && backgroundMusic.dataset.wasPlaying === 'true') {
      backgroundMusic
        .play()
        .catch((e) => console.log('Autoplay prevented:', e));
      delete backgroundMusic.dataset.wasPlaying;
    }

    if (gameMusic && gameMusic.dataset.wasPlaying === 'true') {
      gameMusic.play().catch((e) => console.log('Autoplay prevented:', e));
      delete gameMusic.dataset.wasPlaying;
    }
  }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
  window.visibilityManager = new VisibilityManager();
});
