class GameMechanics {
  constructor() {
    this.isDragging = false;
    this.currentDragCell = null;
    this.startPosition = { x: 0, y: 0 };
    this.touchStarted = false;
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeMechanics();
    });
  }

  initializeMechanics() {
    const panelGrid = document.getElementById('panelGrid');
    if (!panelGrid) return;

    panelGrid.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    panelGrid.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    panelGrid.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    panelGrid.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
    panelGrid.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    panelGrid.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    panelGrid.addEventListener('mouseup', (e) => this.handleMouseEnd(e));
    panelGrid.addEventListener('mouseleave', (e) => this.handleMouseEnd(e));

    document.body.addEventListener('touchstart', (e) => {
      if (e.target.closest('.panel-grid')) {
        e.preventDefault();
      }
    }, { passive: false });

    document.body.addEventListener('touchmove', (e) => {
      if (this.isDragging || e.target.closest('.panel-grid')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  handleTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const cell = e.target.closest('.panel-cell');

    if (cell && !cell.classList.contains('empty')) {
      this.touchStarted = true;
      this.startDrag(cell, touch.clientX, touch.clientY);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.isDragging && this.touchStarted) {
      const touch = e.touches[0];
      this.updateDrag(touch.clientX, touch.clientY);
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.isDragging && this.touchStarted) {
      this.endDrag();
    }
    this.touchStarted = false;
  }

  handleMouseDown(e) {
    if (this.touchStarted) return;

    const cell = e.target.closest('.panel-cell');
    if (cell && !cell.classList.contains('empty')) {
      this.startDrag(cell, e.clientX, e.clientY);
    }
  }

  handleMouseMove(e) {
    if (this.touchStarted) return;

    if (this.isDragging) {
      this.updateDrag(e.clientX, e.clientY);
    }
  }

  handleMouseEnd(e) {
    if (this.touchStarted) return;

    if (this.isDragging) {
      this.endDrag();
    }
  }

  startDrag(cell, clientX, clientY) {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    if (!this.canMove(row, col)) {
      return;
    }

    this.isDragging = true;
    this.currentDragCell = cell;
    this.startPosition = { x: clientX, y: clientY };

    cell.classList.add('dragging');
    document.body.classList.add('dragging-active');
  }

  updateDrag(clientX, clientY) {
    if (!this.currentDragCell) return;

    const deltaX = clientX - this.startPosition.x;
    const deltaY = clientY - this.startPosition.y;
    const maxMove = window.innerWidth < 768 ? 60 : 50;
    const constrainedX = Math.max(-maxMove, Math.min(maxMove, deltaX));
    const constrainedY = Math.max(-maxMove, Math.min(maxMove, deltaY));

    this.currentDragCell.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
  }

  endDrag() {
    if (!this.currentDragCell) return;

    const cell = this.currentDragCell;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    const transform = cell.style.transform;
    const matches = transform.match(/translate\((-?\d+)px, (-?\d+)px\)/);

    if (matches) {
      const deltaX = parseInt(matches[1]);
      const deltaY = parseInt(matches[2]);
      const threshold = window.innerWidth < 768 ? 25 : 30;

      let newRow = row;
      let newCol = col;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) newCol++;
        else if (deltaX < -threshold) newCol--;
      } else {
        if (deltaY > threshold) newRow++;
        else if (deltaY < -threshold) newRow--;
      }

      if (this.isValidMove(row, col, newRow, newCol)) {
        this.moveCell(row, col, newRow, newCol);
      }
    }

    cell.style.transform = '';
    cell.classList.remove('dragging');
    document.body.classList.remove('dragging-active');
    this.isDragging = false;
    this.currentDragCell = null;
  }

  canMove(row, col) {
    const emptyPos = gamePanel.emptyPosition;
    const deltaRow = Math.abs(row - emptyPos.row);
    const deltaCol = Math.abs(col - emptyPos.col);

    return (deltaRow === 1 && deltaCol === 0) || (deltaRow === 0 && deltaCol === 1);
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const emptyPos = gamePanel.emptyPosition;
    return toRow === emptyPos.row && toCol === emptyPos.col &&
      toRow >= 0 && toRow < 4 && toCol >= 0 && toCol < 4;
  }

  moveCell(fromRow, fromCol, toRow, toCol) {
    const value = gamePanel.grid[fromRow][fromCol];
    gamePanel.grid[fromRow][fromCol] = 0;
    gamePanel.grid[toRow][toCol] = value;
    gamePanel.emptyPosition = { row: fromRow, col: fromCol };

    this.updateDOM(fromRow, fromCol, toRow, toCol, value);

    setTimeout(() => {
      if (this.checkWin()) {
        alert('Вітаємо! Ви виграли! 🎉');
      }
    }, 300);
  }

  updateDOM(fromRow, fromCol, toRow, toCol, value) {
    const panelGrid = document.getElementById('panelGrid');
    const cells = panelGrid.querySelectorAll('.panel-cell');

    cells.forEach(cell => {
      const row = parseInt(cell.getAttribute('data-row'));
      const col = parseInt(cell.getAttribute('data-col'));

      if (row === fromRow && col === fromCol) {
        cell.classList.add('empty');
        cell.textContent = '';
      } else if (row === toRow && col === toCol) {
        cell.classList.remove('empty');
        cell.textContent = value;
        cell.style.opacity = '1';
      }
    });
  }

  checkWin() {
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