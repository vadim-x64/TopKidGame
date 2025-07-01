// Блокування Ctrl+колесо миші та всіх zoom комбінацій
document.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('keydown', function(e) {
  // Блокуємо Ctrl + (+, -, 0)
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
    e.preventDefault();
  }
}, false);

// Блокування контекстного меню (правий клік)
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Блокування виділення тексту
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
});

// Блокування drag and drop
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
});

// Блокування touchstart для zoom на мобільних
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });