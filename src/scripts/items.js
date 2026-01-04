class FallingAnimation {
  constructor() {
    this.fallingItems = [];
    this.animationFrame = null;
    this.isActive = false;
    this.itemCreationInterval = null;
    this.maxItems = 100; // Обмеження кількості активних елементів
  }

  createConfettiItem() {
    const item = document.createElement('img');
    const itemNumber = Math.floor(Math.random() * 10) + 1;
    item.src = `src/resources/items/item${itemNumber}.png`;
    item.className = 'falling-item';

    // Зменшені розміри іконок
    const size = Math.random() * 100 + 10;
    item.style.width = size + 'px';
    item.style.height = size + 'px';

    // Випадковий вибір сторони (ліва або права)
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -50 : window.innerWidth + 50;

    // Початкова позиція з нижньої третини екрану
    const startY = window.innerHeight - (Math.random() * 200 + 100);

    // Швидкість руху вгору
    const verticalSpeed = Math.random() * 5 + 8;

    // Горизонтальна швидкість до центру екрану
    const targetX = window.innerWidth / 2 + (Math.random() - 0.5) * 500;
    const horizontalSpeed = (targetX - startX) / 100;

    // Швидкість обертання навколо себе (вліво або вправо) - ЗМЕНШЕНА
    const rotationDirection = Math.random() > 0.5 ? 1 : -1; // 1 = вправо, -1 = вліво
    const rotationSpeedZ = (Math.random() * 2 + 1) * rotationDirection; // 1-3 градусів за кадр (було 3-8)

    item.style.position = 'fixed';
    item.style.left = startX + 'px';
    item.style.top = startY + 'px';
    item.style.zIndex = '999';
    item.style.pointerEvents = 'none';
    item.style.opacity = '1';
    item.style.willChange = 'transform, opacity'; // Оптимізація рендерингу

    document.body.appendChild(item);

    return {
      element: item,
      x: startX,
      y: startY,
      verticalSpeed: verticalSpeed,
      horizontalSpeed: horizontalSpeed,
      rotationZ: 0,
      rotationSpeedZ: rotationSpeedZ,
      opacity: 1,
      fadeStartY: 50,
      gravity: 0.15,
    };
  }

  startAnimation() {
    if (this.isActive) return;

    this.isActive = true;

    // Початковий залп конфетті
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        if (this.isActive && this.fallingItems.length < this.maxItems) {
          this.fallingItems.push(this.createConfettiItem());
        }
      }, i * 50);
    }

    // Постійне створення конфетті
    this.itemCreationInterval = setInterval(() => {
      if (this.isActive && this.fallingItems.length < this.maxItems) {
        const count = Math.min(3, this.maxItems - this.fallingItems.length);
        for (let i = 0; i < count; i++) {
          this.fallingItems.push(this.createConfettiItem());
        }
      }
    }, 200);

    this.animate();
  }

  animate() {
    // Batch DOM updates для оптимізації
    const updates = [];

    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const item = this.fallingItems[i];

      // Рух вгору
      item.y -= item.verticalSpeed;

      // Рух в сторони (до центру)
      item.x += item.horizontalSpeed;

      // Поступове уповільнення (гравітація)
      item.verticalSpeed -= item.gravity;

      // Обертання навколо себе
      item.rotationZ += item.rotationSpeedZ;

      // Зникнення вгорі екрану
      if (item.y < item.fadeStartY) {
        const fadeDistance = 50;
        const distanceIntoFade = item.fadeStartY - item.y;
        const fadeProgress = Math.min(distanceIntoFade / fadeDistance, 1);
        item.opacity = 1 - fadeProgress;
      }

      // Видалення коли зникло або вилетіло за екран
      if (item.opacity <= 0 || item.y < -100) {
        item.element.remove();
        this.fallingItems.splice(i, 1);
        continue;
      }

      // Зберігаємо оновлення для batch застосування
      updates.push({
        element: item.element,
        x: item.x,
        y: item.y,
        opacity: item.opacity,
        rotationZ: item.rotationZ,
      });
    }

    // Застосовуємо всі оновлення одночасно
    updates.forEach((update) => {
      update.element.style.transform = `rotate(${update.rotationZ}deg)`;
      update.element.style.left = update.x + 'px';
      update.element.style.top = update.y + 'px';
      update.element.style.opacity = update.opacity;
    });

    if (this.isActive || this.fallingItems.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }

  stopCreatingItems() {
    this.isActive = false;
    if (this.itemCreationInterval) {
      clearInterval(this.itemCreationInterval);
      this.itemCreationInterval = null;
    }
  }

  clearAll() {
    this.stopCreatingItems();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.fallingItems.forEach((item) => {
      if (item.element && item.element.parentNode) {
        item.element.remove();
      }
    });
    this.fallingItems = [];
  }

  isAnimating() {
    return this.isActive || this.fallingItems.length > 0;
  }
}

window.fallingAnimation = new FallingAnimation();
