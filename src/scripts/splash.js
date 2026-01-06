setTimeout(() => {
  const splashScreen = document.getElementById('splashScreen');
  const mainMenu = document.getElementById('mainMenu');
  const settingsButton = document.getElementById('settingsButton');
  const backgroundVideo = document.getElementById('backgroundVideo');
  const backgroundMusic = document.getElementById('backgroundMusic');

  splashScreen.classList.add('fade-out');

  setTimeout(() => {
    splashScreen.style.display = 'none';
    backgroundVideo.classList.add('show');
    mainMenu.style.display = 'flex';
    settingsButton.style.display = 'block';
    backgroundMusic.play();
  }, 1000);
}, 0);