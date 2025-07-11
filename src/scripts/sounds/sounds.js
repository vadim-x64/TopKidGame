class SoundManager {
  constructor() {
    this.storageKey = 'spots_game_sound_settings';
    this.volume = 0.5;
    this.isMuted = false;
    this.previousVolume = 0.5;
    this.audioElements = [];
    this.sfxVolume = 0.5;
    this.isSfxMuted = false;
    this.previousSfxVolume = 0.5;
    this.volumeSlider = null;
    this.volumeValue = null;
    this.muteButton = null;
    this.sfxVolumeSlider = null;
    this.sfxVolumeValue = null;
    this.sfxMuteButton = null;
    this.isPanelOpen = false;
    this.loadSettings();
    this.init();
  }

  init() {
    this.findAudioElements();
    this.createSoundPanel();
    this.bindEvents();
    this.bindSettingsCloseEvent();
    this.updateVolume();
    this.updateUI();
  }

  bindSettingsCloseEvent() {
    const settingsClose = document.getElementById('settingsClose');

    if (settingsClose) {
      settingsClose.addEventListener('click', () => {
        this.closeSoundPanel();
      });
    }
  }

  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.volume = settings.volume !== undefined ? settings.volume : 0.5;
        this.isMuted = settings.isMuted !== undefined ? settings.isMuted : false;
        this.previousVolume = settings.previousVolume !== undefined ? settings.previousVolume : 0.5;
        this.sfxVolume = settings.sfxVolume !== undefined ? settings.sfxVolume : 0.5;
        this.isSfxMuted = settings.isSfxMuted !== undefined ? settings.isSfxMuted : false;
        this.previousSfxVolume = settings.previousSfxVolume !== undefined ? settings.previousSfxVolume : 0.5;
        console.log('Налаштування звуку завантажені:', settings);
      }
    } catch (error) {
      console.warn('Помилка завантаження налаштувань звуку:', error);
      this.resetToDefaults();
    }
  }

  saveSettings() {
    try {
      const settings = {
        volume: this.volume,
        isMuted: this.isMuted,
        previousVolume: this.previousVolume,
        sfxVolume: this.sfxVolume,
        isSfxMuted: this.isSfxMuted,
        previousSfxVolume: this.previousSfxVolume,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      console.log('Налаштування звуку збережені:', settings);
    } catch (error) {
      console.warn('Помилка збереження налаштувань звуку:', error);
    }
  }

  resetToDefaults() {
    this.volume = 0.5;
    this.isMuted = false;
    this.previousVolume = 0.5;
    this.sfxVolume = 0.5;
    this.isSfxMuted = false;
    this.previousSfxVolume = 0.5;
    this.saveSettings();
  }

  findAudioElements() {
    this.audioElements = [
      document.getElementById('backgroundMusic'),
      document.getElementById('gameMusic')
    ].filter(el => el !== null);
  }

  createSoundPanel() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const sidebar = settingsContainer.querySelector('.settings-sidebar');
    const content = settingsContainer.querySelector('.settings-content');

    if (!sidebar || !content) return;

    if (!settingsContainer.querySelector('.settings-logo')) {
      const logo = document.createElement('img');
      logo.className = 'settings-logo';
      logo.src = 'src/resources/logotype.png';
      logo.alt = '...';
      settingsContainer.appendChild(logo);
    }

    const soundTab = document.createElement('button');
    soundTab.className = 'sound-tab';
    soundTab.innerHTML = `
    <img src="https://cdn-icons-png.flaticon.com/128/727/727269.png" alt="..." class="sound-tab-icon">
    <span>ЗВУК</span>
  `;
    sidebar.appendChild(soundTab);

    const soundContent = document.createElement('div');
    soundContent.className = 'sound-content';
    soundContent.innerHTML = `
    <h3>Налаштування звуку</h3>
    
    <div class="volume-control">
      <label class="volume-label">Гучність музики:</label>
      <div class="volume-slider-container">
        <input type="range" min="0" max="100" value="${Math.round(this.volume * 100)}" class="volume-slider" id="volumeSlider">
        <span class="volume-value" id="volumeValue">${Math.round(this.volume * 100)}%</span>
      </div>
    </div>
    
    <button class="mute-button" id="muteButton">
      <img src="https://cdn-icons-png.flaticon.com/128/727/727269.png" alt="..." class="mute-icon">
      <span class="mute-text">Вимкнути музику</span>
    </button>
    
    <div class="volume-control">
      <label class="volume-label">Гучність звукових ефектів:</label>
      <div class="volume-slider-container">
        <input type="range" min="0" max="100" value="${Math.round(this.sfxVolume * 100)}" class="volume-slider" id="sfxVolumeSlider">
        <span class="volume-value" id="sfxVolumeValue">${Math.round(this.sfxVolume * 100)}%</span>
      </div>
    </div>
    
    <button class="mute-button" id="sfxMuteButton">
      <img src="https://cdn-icons-png.flaticon.com/128/3771/3771928.png" alt="..." class="mute-icon">
      <span class="mute-text">Вимкнути ефекти</span>
    </button>
  `;
    content.appendChild(soundContent);

    this.volumeSlider = document.getElementById('volumeSlider');
    this.volumeValue = document.getElementById('volumeValue');
    this.muteButton = document.getElementById('muteButton');
    this.sfxVolumeSlider = document.getElementById('sfxVolumeSlider');
    this.sfxVolumeValue = document.getElementById('sfxVolumeValue');
    this.sfxMuteButton = document.getElementById('sfxMuteButton');
    this.soundTab = soundTab;
    this.soundContent = soundContent;
  }

  bindEvents() {
    if (!this.volumeSlider || !this.muteButton) return;

    this.volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      this.setVolume(volume);
    });

    this.muteButton.addEventListener('click', () => {
      this.toggleMute();
    });

    if (this.sfxVolumeSlider && this.sfxMuteButton) {
      this.sfxVolumeSlider.addEventListener('input', (e) => {
        const volume = parseInt(e.target.value);
        this.setSfxVolume(volume);
      });

      this.sfxMuteButton.addEventListener('click', () => {
        this.toggleSfxMute();
      });
    }

    this.soundTab.addEventListener('click', () => {
      this.toggleSoundPanel();
    });
  }

  toggleSoundPanel() {
    if (this.isPanelOpen) {
      this.closeSoundPanel();
    } else {
      this.closeAllPanels();
      this.showSoundPanel();
    }
  }

  openSettingsWithSoundPanel() {
    const settingsModal = document.getElementById('settingsModal');
    if (!settingsModal) return;
    settingsModal.style.display = 'flex';
    this.showSoundPanel();
  }

  closeSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (!settingsModal) return;
    settingsModal.style.display = 'none';
    this.closeSoundPanel();
  }

  showSoundPanel() {
    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach(content => content.classList.remove('active'));
    allTabs.forEach(tab => tab.classList.remove('active'));

    this.soundContent.classList.add('active');
    this.soundTab.classList.add('active');
    this.isPanelOpen = true;
  }

  closeSoundPanel() {
    if (this.soundContent) {
      this.soundContent.classList.remove('active');
    }
    if (this.soundTab) {
      this.soundTab.classList.remove('active');
    }
    this.isPanelOpen = false;
  }

  closeAllPanels() {
    if (window.gameplayManager && window.gameplayManager.isGameplayPanelOpen()) {
      window.gameplayManager.closeGameplayPanel();
    }

    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach(content => content.classList.remove('active'));
    allTabs.forEach(tab => tab.classList.remove('active'));
  }

  isSoundPanelOpen() {
    return this.isPanelOpen;
  }

  setSfxVolume(volume) {
    this.sfxVolume = volume / 100;

    if (volume === 0) {
      this.isSfxMuted = true;
    } else if (this.isSfxMuted) {
      this.isSfxMuted = false;
    }

    this.updateSfxVolume();
    this.updateUI();
    this.saveSettings();
  }

  toggleSfxMute() {
    if (this.isSfxMuted) {
      this.isSfxMuted = false;
      this.sfxVolume = this.previousSfxVolume;
    } else {
      this.previousSfxVolume = this.sfxVolume > 0 ? this.sfxVolume : 0.5;
      this.isSfxMuted = true;
      this.sfxVolume = 0;
    }
    this.updateSfxVolume();
    this.updateUI();
    this.saveSettings();
  }

  updateSfxVolume() {
    if (window.clickSoundManager) {
      window.clickSoundManager.setVolume(this.isSfxMuted ? 0 : this.sfxVolume);
    }

    if (window.gameMechanics) {
      window.gameMechanics.setTransitionVolume(this.isSfxMuted ? 0 : this.sfxVolume);
    }
  }

  setVolume(volume) {
    this.volume = volume / 100;

    if (volume === 0) {
      this.isMuted = true;
    } else if (this.isMuted) {
      this.isMuted = false;
    }

    this.updateVolume();
    this.updateUI();
    this.saveSettings();
  }

  toggleMute() {
    if (this.isMuted) {
      this.isMuted = false;
      this.volume = this.previousVolume;
    } else {
      this.previousVolume = this.volume > 0 ? this.volume : 0.5;
      this.isMuted = true;
      this.volume = 0;
    }
    this.updateVolume();
    this.updateUI();
    this.saveSettings();
  }

  updateVolume() {
    this.audioElements.forEach(audio => {
      if (audio) {
        audio.volume = this.isMuted ? 0 : this.volume;
      }
    });
  }

  updateUI() {
    if (!this.volumeSlider || !this.volumeValue || !this.muteButton) return;

    const displayVolume = Math.round(this.volume * 100);
    const displaySfxVolume = Math.round(this.sfxVolume * 100);

    this.volumeSlider.value = displayVolume;
    this.volumeValue.textContent = `${displayVolume}%`;

    if (this.sfxVolumeSlider && this.sfxVolumeValue) {
      this.sfxVolumeSlider.value = displaySfxVolume;
      this.sfxVolumeValue.textContent = `${displaySfxVolume}%`;
    }

    const muteText = this.muteButton.querySelector('.mute-text');
    const muteIcon = this.muteButton.querySelector('.mute-icon');

    if (this.isMuted || this.volume === 0) {
      this.muteButton.classList.add('muted');
      muteText.textContent = 'Увімкнути музику';
      muteIcon.src = 'https://cdn-icons-png.flaticon.com/128/727/727280.png';
    } else {
      this.muteButton.classList.remove('muted');
      muteText.textContent = 'Вимкнути музику';
      muteIcon.src = 'https://cdn-icons-png.flaticon.com/128/727/727269.png';
    }

    if (this.sfxMuteButton) {
      const sfxMuteText = this.sfxMuteButton.querySelector('.mute-text');
      const sfxMuteIcon = this.sfxMuteButton.querySelector('.mute-icon');

      if (this.isSfxMuted || this.sfxVolume === 0) {
        this.sfxMuteButton.classList.add('muted');
        sfxMuteText.textContent = 'Увімкнути ефекти';
        sfxMuteIcon.src = 'https://cdn-icons-png.flaticon.com/128/3771/3771957.png';
      } else {
        this.sfxMuteButton.classList.remove('muted');
        sfxMuteText.textContent = 'Вимкнути ефекти';
        sfxMuteIcon.src = 'https://cdn-icons-png.flaticon.com/128/3771/3771928.png';
      }
    }
  }

  addAudioElement(audioElement) {
    if (audioElement && !this.audioElements.includes(audioElement)) {
      this.audioElements.push(audioElement);
      audioElement.volume = this.isMuted ? 0 : this.volume;
    }
  }

  getCurrentSfxVolume() {
    return this.sfxVolume;
  }

  isSfxSoundMuted() {
    return this.isSfxMuted;
  }

  getCurrentVolume() {
    return this.volume;
  }

  isSoundMuted() {
    return this.isMuted;
  }

  clearSettings() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('Налаштування звуку очищені');
    } catch (error) {
      console.warn('Помилка очищення налаштувань:', error);
    }
  }

  exportSettings() {
    return {
      volume: this.volume,
      isMuted: this.isMuted,
      previousVolume: this.previousVolume,
      sfxVolume: this.sfxVolume,
      isSfxMuted: this.isSfxMuted,
      previousSfxVolume: this.previousSfxVolume
    };
  }

  importSettings(settings) {
    if (settings && typeof settings === 'object') {
      this.volume = settings.volume !== undefined ? settings.volume : this.volume;
      this.isMuted = settings.isMuted !== undefined ? settings.isMuted : this.isMuted;
      this.previousVolume = settings.previousVolume !== undefined ? settings.previousVolume : this.previousVolume;
      this.sfxVolume = settings.sfxVolume !== undefined ? settings.sfxVolume : this.sfxVolume;
      this.isSfxMuted = settings.isSfxMuted !== undefined ? settings.isSfxMuted : this.isSfxMuted;
      this.previousSfxVolume = settings.previousSfxVolume !== undefined ? settings.previousSfxVolume : this.previousSfxVolume;
      this.updateVolume();
      this.updateSfxVolume();
      this.updateUI();
      this.saveSettings();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.soundManager = new SoundManager();
  }, 100);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoundManager;
}