class FallingAnimation {
  constructor() {
    this.fallingItems = [];
    this.animationFrame = null;
    this.isActive = false;
    this.itemCreationInterval = null;
  }

  createFallingItem() {
    const item = document.createElement('img');
    const itemNumber = Math.floor(Math.random() * 9) + 1;
    item.src = `src/resources/items/item${itemNumber}.png`;
    item.className = 'falling-item';

    const size = Math.random() * 70 + 30;
    item.style.width = size + 'px';
    item.style.height = size + 'px';

    const startX = Math.random() * window.innerWidth;
    const fallSpeed = Math.random() * 3 + 2;
    const rotationSpeedX = (Math.random() - 0.5) * 8;
    const rotationSpeedY = (Math.random() - 0.5) * 8;
    const rotationSpeedZ = (Math.random() - 0.5) * 6;
    const horizontalSpeed = (Math.random() - 0.5) * 2;

    item.style.position = 'fixed';
    item.style.left = startX + 'px';
    item.style.top = '-100px';
    item.style.zIndex = '1003';
    item.style.pointerEvents = 'none';
    item.style.transformStyle = 'preserve-3d';
    item.style.opacity = '1';

    document.body.appendChild(item);

    return {
      element: item,
      x: startX,
      y: -100,
      fallSpeed: fallSpeed,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      rotationSpeedX: rotationSpeedX,
      rotationSpeedY: rotationSpeedY,
      rotationSpeedZ: rotationSpeedZ,
      horizontalSpeed: horizontalSpeed,
      opacity: 1,
      fadeStartY: window.innerHeight - 200
    };
  }

  startAnimation() {
    if (this.isActive) return;

    this.isActive = true;

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        if (this.isActive) {
          this.fallingItems.push(this.createFallingItem());
        }
      }, i * 100);
    }

    this.itemCreationInterval = setInterval(() => {
      if (this.isActive) {
        this.fallingItems.push(this.createFallingItem());
        this.fallingItems.push(this.createFallingItem());
      }
    }, 200);

    this.animate();
  }

  animate() {
    this.fallingItems.forEach((item, index) => {
      item.y += item.fallSpeed;
      item.x += item.horizontalSpeed;
      item.rotationX += item.rotationSpeedX;
      item.rotationY += item.rotationSpeedY;
      item.rotationZ += item.rotationSpeedZ;

      if (item.y > item.fadeStartY) {
        const fadeDistance = 200;
        const distanceIntoFade = item.y - item.fadeStartY;
        const fadeProgress = Math.min(distanceIntoFade / fadeDistance, 1);
        item.opacity = 1 - fadeProgress;
      }

      item.element.style.left = item.x + 'px';
      item.element.style.top = item.y + 'px';
      item.element.style.opacity = item.opacity;
      item.element.style.transform = `
        rotateX(${item.rotationX}deg) 
        rotateY(${item.rotationY}deg) 
        rotateZ(${item.rotationZ}deg)
        perspective(1000px)
      `;

      if (item.opacity <= 0 && item.y > window.innerHeight) {
        item.element.remove();
        this.fallingItems.splice(index, 1);
      }
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

    this.fallingItems.forEach(item => {
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