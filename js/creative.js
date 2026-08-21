/* ===================================================
   CREATIVE & PLAY ZONE (GÓC SÁNG TẠO & GAME TRÍ NHỚ)
   Canvas Drawing Board + Emoji Sticker + Memory Card Game + Timer
   =================================================== */

class CreativeModule {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.currentColor = '#FF6B6B';
    this.currentBrushSize = 6;
    this.isRainbow = false;
    this.selectedSticker = null;
    this.currentMode = 'draw'; // draw, eraser, fill
    this.hue = 0;
    this.drawHistory = []; // for undo
    this.lastPos = null;

    // Memory Game state
    this.memoryCards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 6;
    this.moves = 0;
    this.memoryTimerInterval = null;
    this.memoryElapsed = 0;
    this.isMemoryLocked = false;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupMemoryGame();
  }

  // --- 1. MAGIC CANVAS DRAWING ---
  setupCanvas() {
    this.canvas = document.getElementById('paintCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Mouse & Touch listeners
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDraw());
    this.canvas.addEventListener('mouseleave', () => this.stopDraw());

    this.canvas.addEventListener('touchstart', (e) => this.startDraw(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
    this.canvas.addEventListener('touchend', () => this.stopDraw());

    // Tool mode buttons
    const toolBtns = document.querySelectorAll('.tool-mode-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = btn.getAttribute('data-mode');
        this.selectedSticker = null;
        document.querySelectorAll('.sticker-btn').forEach(s => s.style.borderColor = '#e9d5ff');
        if (this.currentMode === 'eraser') {
          this.canvas.style.cursor = 'cell';
        } else {
          this.canvas.style.cursor = 'crosshair';
        }
        window.soundEngine.playClick();
      });
    });

    // Color buttons
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        this.isRainbow = dot.getAttribute('data-color') === 'rainbow';
        this.currentColor = dot.getAttribute('data-color');
        this.selectedSticker = null;
        this.currentMode = 'draw';
        document.querySelectorAll('.tool-mode-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('tool-draw')?.classList.add('active');
        this.canvas.style.cursor = 'crosshair';
      });
    });

    // Brush sizes
    const sizeBtns = document.querySelectorAll('.brush-size-btn');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentBrushSize = parseInt(btn.getAttribute('data-size'));
      });
    });

    // Stickers
    const stickerBtns = document.querySelectorAll('.sticker-btn');
    stickerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        stickerBtns.forEach(b => b.style.borderColor = '#e9d5ff');
        btn.style.borderColor = '#9333ea';
        btn.style.background = '#f3e8ff';
        setTimeout(() => btn.style.background = '', 200);
        this.selectedSticker = btn.getAttribute('data-sticker');
        this.currentMode = 'sticker';
        window.app.showToast(`Đã chọn ${this.selectedSticker}, bấm vào bảng vẽ để dán!`, "info");
      });
    });

    // Clear and Save and Undo buttons
    document.getElementById('btn-clear-canvas')?.addEventListener('click', () => this.clearCanvas());
    document.getElementById('btn-save-canvas')?.addEventListener('click', () => this.saveDrawing());
    document.getElementById('btn-undo-canvas')?.addEventListener('click', () => this.undoDraw());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const tempImage = this.canvas.toDataURL();

    this.canvas.width = rect.width || 600;
    this.canvas.height = 420;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (tempImage && tempImage.length > 50) {
      const img = new Image();
      img.src = tempImage;
      img.onload = () => this.ctx.drawImage(img, 0, 0);
    }
  }

  getCanvasPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  saveHistory() {
    if (this.drawHistory.length > 20) this.drawHistory.shift();
    this.drawHistory.push(this.canvas.toDataURL());
  }

  undoDraw() {
    if (this.drawHistory.length === 0) {
      window.app.showToast("Không có thao tác nào để hoàn tác!", "info");
      return;
    }
    const prev = this.drawHistory.pop();
    const img = new Image();
    img.src = prev;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
    };
    window.soundEngine.playClick();
  }

  startDraw(e) {
    if (e.cancelable) e.preventDefault();
    const pos = this.getCanvasPos(e);

    if (this.currentMode === 'sticker' && this.selectedSticker) {
      this.saveHistory();
      this.ctx.font = `${this.currentBrushSize * 4}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(this.selectedSticker, pos.x, pos.y);
      window.soundEngine.playClick();
      return;
    }

    if (this.currentMode === 'fill') {
      this.saveHistory();
      this.floodFill(Math.round(pos.x), Math.round(pos.y), this.currentColor);
      return;
    }

    this.saveHistory();
    this.isDrawing = true;
    this.lastPos = pos;
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(e) {
    if (!this.isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const pos = this.getCanvasPos(e);
    this.ctx.lineWidth = this.currentMode === 'eraser' ? this.currentBrushSize * 3 : this.currentBrushSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.currentMode === 'eraser') {
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.globalCompositeOperation = 'destination-out';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      if (this.isRainbow) {
        this.ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        this.hue = (this.hue + 4) % 360;
      } else {
        this.ctx.strokeStyle = this.currentColor;
      }
    }

    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    this.lastPos = pos;
  }

  stopDraw() {
    if (this.isDrawing) {
      this.ctx.globalCompositeOperation = 'source-over';
    }
    this.isDrawing = false;
    this.lastPos = null;
  }

  // Simple flood fill
  floodFill(x, y, fillColor) {
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) return;
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const targetColor = this.getPixelColor(data, x, y);
    const fill = this.hexToRgba(fillColor === 'rainbow' ? '#FF6B6B' : fillColor);

    if (this.colorsMatch(targetColor, fill)) return;

    const stack = [[x, y]];
    const visited = new Set();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      if (cx < 0 || cx >= this.canvas.width || cy < 0 || cy >= this.canvas.height) continue;

      const current = this.getPixelColor(data, cx, cy);
      if (!this.colorsMatch(current, targetColor)) continue;

      visited.add(key);
      this.setPixelColor(data, cx, cy, fill);

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  getPixelColor(data, x, y) {
    const i = (y * this.canvas.width + x) * 4;
    return [data[i], data[i+1], data[i+2], data[i+3]];
  }

  setPixelColor(data, x, y, [r, g, b, a]) {
    const i = (y * this.canvas.width + x) * 4;
    data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = a;
  }

  colorsMatch([r1,g1,b1,a1], [r2,g2,b2,a2]) {
    return Math.abs(r1-r2) < 30 && Math.abs(g1-g2) < 30 && Math.abs(b1-b2) < 30 && Math.abs(a1-a2) < 30;
  }

  hexToRgba(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return [r, g, b, 255];
  }

  clearCanvas() {
    if (!this.ctx) return;
    this.saveHistory();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    window.soundEngine.playClick();
    window.app.showToast("Bảng vẽ đã được làm sạch!", "info");
  }

  saveDrawing() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = `tranh-ve-be-lop-2-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
    window.soundEngine.playFanfare();
    window.storageManager.addStars(2);
    window.storageManager.recordProgress('creative', true);
    window.app.showToast("Đã tải tranh về máy! Bé thật tài năng! +2 ⭐", "success");
  }

  // --- 2. MEMORY CARD MATCH GAME ---
  setupMemoryGame() {
    const restartBtn = document.getElementById('btn-restart-memory');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        const diff = parseInt(document.getElementById('memory-difficulty')?.value || 6);
        this.totalPairs = diff;
        this.startMemoryGame();
      });
    }

    const diffSelect = document.getElementById('memory-difficulty');
    if (diffSelect) {
      diffSelect.addEventListener('change', () => {
        this.totalPairs = parseInt(diffSelect.value);
        this.startMemoryGame();
      });
    }

    this.startMemoryGame();
  }

  startMemoryGame() {
    const allEmojis = ['🦁', '🐬', '🐼', '🦄', '🚀', '🌈', '🦊', '🐸', '🎃', '🎯'];
    const emojis = allEmojis.slice(0, this.totalPairs);
    const cardPool = [...emojis, ...emojis];
    cardPool.sort(() => Math.random() - 0.5);

    this.memoryCards = cardPool;
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isMemoryLocked = false;
    this.stopMemoryTimer();
    this.memoryElapsed = 0;
    this.updateMemoryStats();

    const board = document.getElementById('memory-board');
    if (!board) return;

    // Adjust grid based on total pairs
    const cols = this.totalPairs <= 6 ? 4 : (this.totalPairs <= 8 ? 4 : 5);
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    board.innerHTML = '';
    this.memoryCards.forEach((emoji, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-index', idx);
      card.setAttribute('data-emoji', emoji);

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">${emoji}</div>
          <div class="card-back">❓</div>
        </div>
      `;

      card.addEventListener('click', () => this.handleCardFlip(card, idx, emoji));
      board.appendChild(card);
    });

    this.startMemoryTimer();
  }

  startMemoryTimer() {
    this.stopMemoryTimer();
    this.memoryElapsed = 0;
    this.memoryTimerInterval = setInterval(() => {
      this.memoryElapsed++;
      const mins = String(Math.floor(this.memoryElapsed / 60)).padStart(2, '0');
      const secs = String(this.memoryElapsed % 60).padStart(2, '0');
      const timerEl = document.getElementById('memory-timer');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  stopMemoryTimer() {
    if (this.memoryTimerInterval) {
      clearInterval(this.memoryTimerInterval);
      this.memoryTimerInterval = null;
    }
  }

  handleCardFlip(card, idx, emoji) {
    if (
      this.isMemoryLocked ||
      card.classList.contains('flipped') ||
      card.classList.contains('matched') ||
      this.flippedCards.length >= 2
    ) {
      return;
    }

    window.soundEngine.playClick();
    card.classList.add('flipped');
    this.flippedCards.push({ card, idx, emoji });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateMemoryStats();
      this.isMemoryLocked = true;
      const [first, second] = this.flippedCards;

      if (first.emoji === second.emoji) {
        setTimeout(() => {
          first.card.classList.add('matched');
          second.card.classList.add('matched');
          window.soundEngine.playCorrect();
          this.matchedPairs++;
          this.flippedCards = [];
          this.isMemoryLocked = false;
          this.updateMemoryStats();

          if (this.matchedPairs === this.totalPairs) {
            this.stopMemoryTimer();
            const mins = String(Math.floor(this.memoryElapsed / 60)).padStart(2, '0');
            const secs = String(this.memoryElapsed % 60).padStart(2, '0');
            setTimeout(() => {
              const stars = this.moves <= this.totalPairs + 2 ? 5 : this.moves <= this.totalPairs * 2 ? 3 : 2;
              window.soundEngine.playFanfare();
              window.storageManager.addStars(stars);
              window.storageManager.recordProgress('creative', true);
              window.app.triggerConfetti();
              window.app.showModal({
                icon: "🏆",
                title: "Chiến Thắng Tuyệt Vời!",
                desc: `Bé hoàn thành trong ${mins}:${secs} với ${this.moves} lượt lật. Trí nhớ của bé thật siêu phàm!`,
                rewardStars: stars
              });
            }, 500);
          }
        }, 500);
      } else {
        setTimeout(() => {
          first.card.classList.remove('flipped');
          second.card.classList.remove('flipped');
          this.flippedCards = [];
          this.isMemoryLocked = false;
        }, 900);
      }
    }
  }

  updateMemoryStats() {
    const moveEl = document.getElementById('memory-moves');
    const pairsEl = document.getElementById('memory-pairs');
    if (moveEl) moveEl.textContent = this.moves;
    if (pairsEl) pairsEl.textContent = `${this.matchedPairs} / ${this.totalPairs}`;
  }
}

window.creativeModule = new CreativeModule();
