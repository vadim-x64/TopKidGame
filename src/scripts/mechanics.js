class GameMechanics {
  constructor() {
    this.isDragging = false;
    this.currentDragCell = null;
    this.startPosition = { x: 0, y: 0 };
    this.touchStarted = false;
    this.floatingCell = null;
    this.originalPosition = null;
    this.dragThreshold = 5;
    this.isVictoryPlaying = false;
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeMechanics();
    });
  }

  // Додано метод для встановлення стану перемоги
  setVictoryState(isPlaying) {
    this.isVictoryPlaying = isPlaying;
    if (isPlaying && this.isDragging) {
      this.cleanup();
    }
  }

  initializeMechanics() {
    const panelGrid = document.getElementById('panelGrid');
    if (!panelGrid) return;

    panelGrid.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    panelGrid.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    panelGrid.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    panelGrid.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
    panelGrid.addEventListener('mousedown', (e) => this.handleMouseDown(e));

    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseEnd(e));
    document.body.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  handleTouchStart(e) {
    if (this.isVictoryPlaying) return;

    const touch = e.touches[0];
    const cell = e.target.closest('.panel-cell');

    if (cell && !cell.classList.contains('empty')) {
      e.preventDefault();
      this.touchStarted = true;
      this.prepareForDrag(cell, touch.clientX, touch.clientY);
    }
  }

  handleTouchMove(e) {
    if (this.isVictoryPlaying || !this.touchStarted) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.startPosition.x);
    const deltaY = Math.abs(touch.clientY - this.startPosition.y);

    if (!this.isDragging && (deltaX > this.dragThreshold || deltaY > this.dragThreshold)) {
      this.startDrag();
    }

    if (this.isDragging) {
      e.preventDefault();
      this.updateDrag(touch.clientX, touch.clientY);
    }
  }

  handleTouchEnd(e) {
    if (this.isVictoryPlaying) return;

    e.preventDefault();

    if (this.isDragging) {
      this.endDrag();
    }

    this.touchStarted = false;
  }

  handleMouseDown(e) {
    if (this.isVictoryPlaying || this.touchStarted) return;

    const cell = e.target.closest('.panel-cell');
    if (cell && !cell.classList.contains('empty')) {
      e.preventDefault();
      this.prepareForDrag(cell, e.clientX, e.clientY);
    }
  }

  handleMouseMove(e) {
    if (this.isVictoryPlaying || this.touchStarted) return;

    if (!this.isDragging && this.currentDragCell) {
      const deltaX = Math.abs(e.clientX - this.startPosition.x);
      const deltaY = Math.abs(e.clientY - this.startPosition.y);

      if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
        this.startDrag();
      }
    }

    if (this.isDragging) {
      this.updateDrag(e.clientX, e.clientY);
    }
  }

  handleMouseEnd(e) {
    if (this.isVictoryPlaying || this.touchStarted) return;

    if (this.isDragging) {
      this.endDrag();
    } else {
      this.cleanup();
    }
  }

  prepareForDrag(cell, clientX, clientY) {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    if (!this.canMove(row, col)) {
      return;
    }

    this.currentDragCell = cell;
    this.startPosition = { x: clientX, y: clientY };
    this.originalPosition = { row, col };
  }

  startDrag() {
    if (!this.currentDragCell || this.isDragging) return;

    this.isDragging = true;

    this.createFloatingCell(this.currentDragCell);

    this.currentDragCell.classList.add('drag-shadow');

    document.body.classList.add('dragging-active');
  }

  createFloatingCell(originalCell) {
    this.removeFloatingCell();

    this.floatingCell = originalCell.cloneNode(true);
    this.floatingCell.classList.add('floating');
    this.floatingCell.classList.remove('drag-shadow');

    const rect = originalCell.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const borderWidth = isMobile ? '5px' : '10px';

    this.floatingCell.style.cssText = `
    position: fixed !important;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    z-index: 1000;
    pointer-events: none;
    transition: none;
    transform-origin: center;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
    filter: brightness(1.2);
    background: linear-gradient(145deg, #FFB347, #FF8C00) !important;
    border: ${borderWidth} solid #333 !important;
    color: #333 !important;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5) !important;
    font-weight: bold !important;
  `;

    document.body.appendChild(this.floatingCell);
  }

  updateDrag(clientX, clientY) {
    if (!this.floatingCell) return;

    const panelGrid = document.getElementById('panelGrid');
    const panelRect = panelGrid.getBoundingClientRect();
    const cellWidth = this.floatingCell.offsetWidth;
    const cellHeight = this.floatingCell.offsetHeight;

    let newX = clientX - cellWidth / 2;
    let newY = clientY - cellHeight / 2;

    newX = Math.max(panelRect.left, Math.min(newX, panelRect.right - cellWidth));
    newY = Math.max(panelRect.top, Math.min(newY, panelRect.bottom - cellHeight));

    this.floatingCell.style.left = newX + 'px';
    this.floatingCell.style.top = newY + 'px';
    this.floatingCell.style.pointerEvents = 'none';
    const elementUnder = document.elementFromPoint(clientX, clientY);
    this.floatingCell.style.pointerEvents = 'none';

    const cellUnder = elementUnder?.closest('.panel-cell');
    this.clearHighlights();

    if (cellUnder && cellUnder !== this.currentDragCell) {
      const row = parseInt(cellUnder.getAttribute('data-row'));
      const col = parseInt(cellUnder.getAttribute('data-col'));

      if (this.isValidMove(this.originalPosition.row, this.originalPosition.col, row, col)) {
        cellUnder.classList.add('drop-target');
      } else {
        if (!cellUnder.classList.contains('empty')) {
          cellUnder.classList.add('blocked');
        }
      }
    }
  }

  endDrag() {
    if (!this.isDragging || !this.floatingCell) {
      this.cleanup();
      return;
    }

    const rect = this.floatingCell.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.floatingCell.style.pointerEvents = 'none';
    const elementUnder = document.elementFromPoint(centerX, centerY);
    const cellUnder = elementUnder?.closest('.panel-cell');

    let moved = false;

    if (cellUnder) {
      const newRow = parseInt(cellUnder.getAttribute('data-row'));
      const newCol = parseInt(cellUnder.getAttribute('data-col'));

      if (this.isValidMove(this.originalPosition.row, this.originalPosition.col, newRow, newCol)) {
        this.moveCell(this.originalPosition.row, this.originalPosition.col, newRow, newCol);
        moved = true;
      }
    }

    if (!moved) {
      this.returnToOriginalPosition();
    }

    this.cleanup();
  }

  returnToOriginalPosition() {
    if (this.currentDragCell) {
      this.currentDragCell.style.opacity = '1';
      this.currentDragCell.classList.remove('drag-shadow');
    }
  }

  removeFloatingCell() {
    if (this.floatingCell) {
      this.floatingCell.remove();
      this.floatingCell = null;
    }
  }

  clearHighlights() {
    const cells = document.querySelectorAll('.panel-cell');
    cells.forEach(cell => {
      cell.classList.remove('drop-target', 'blocked');
    });
  }

  cleanup() {
    this.removeFloatingCell();
    this.clearHighlights();

    if (this.currentDragCell) {
      this.currentDragCell.classList.remove('drag-shadow');
      this.currentDragCell.style.opacity = '';
    }

    document.body.classList.remove('dragging-active');
    this.isDragging = false;
    this.currentDragCell = null;
    this.originalPosition = null;
  }

  canMove(row, col) {
    if (!window.gamePanel) return false;

    const emptyPos = gamePanel.emptyPosition;
    const deltaRow = Math.abs(row - emptyPos.row);
    const deltaCol = Math.abs(col - emptyPos.col);

    return (deltaRow === 1 && deltaCol === 0) || (deltaRow === 0 && deltaCol === 1);
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (!window.gamePanel) return false;

    const emptyPos = gamePanel.emptyPosition;

    return toRow === emptyPos.row &&
      toCol === emptyPos.col &&
      toRow >= 0 && toRow < 4 &&
      toCol >= 0 && toCol < 4 &&
      this.canMove(fromRow, fromCol);
  }

  moveCell(fromRow, fromCol, toRow, toCol) {
    if (!window.gamePanel) return;

    const value = gamePanel.grid[fromRow][fromCol];

    gamePanel.grid[fromRow][fromCol] = 0;
    gamePanel.grid[toRow][toCol] = value;
    gamePanel.emptyPosition = { row: fromRow, col: fromCol };

    this.updateDOM(fromRow, fromCol, toRow, toCol, value);

    setTimeout(() => {
      if (this.checkWin()) {
        if (window.victoryHandler) {
          window.victoryHandler.triggerVictory();
        }
      }
    }, 100);
  }

  updateDOM(fromRow, fromCol, toRow, toCol, value) {
    const cells = document.querySelectorAll('.panel-cell');

    cells.forEach(cell => {
      const row = parseInt(cell.getAttribute('data-row'));
      const col = parseInt(cell.getAttribute('data-col'));

      if (row === fromRow && col === fromCol) {
        cell.classList.add('empty');
        cell.textContent = '';
        cell.style.opacity = '';
      } else if (row === toRow && col === toCol) {
        cell.classList.remove('empty');
        cell.textContent = value;
        cell.style.opacity = '1';
      }
    });
  }

  checkWin() {
    if (!window.gamePanel) return false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i === 3 && j === 3) {
          if (gamePanel.grid[i][j] !== 0) return false;
        } else {
          const expectedValue = i * 4 + j + 1;
          if (gamePanel.grid[i][j] !== expectedValue) return false;
        }
      }
    }
    return true;
  }
}

window.gameMechanics = new GameMechanics();