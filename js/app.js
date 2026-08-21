/* ===================================================
   MAIN APPLICATION ORCHESTRATOR (app.js)
   Tabs, Modal System, Canvas Confetti, Mascot, Background Music & UI Events
   =================================================== */

class App {
  constructor() {
    this.currentTab = 'math';
    this.confettiParticles = [];
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.isConfettiActive = false;
    this.bgMusicEnabled = false;
    this.bgMusicOscillators = [];

    this.init();
  }

  init() {
    this.setupTabs();
    this.setupMascot();
    this.setupModals();
    this.setupConfetti();
    this.setupHeaderActions();
    this.renderRewardsTab();

    // Initial Mascot speech
    setTimeout(() => {
      this.speakMascot("Chào bé yêu! Chúc bé học thật vui và gom thật nhiều sao vàng nhé!");
    }, 800);
  }

  // --- 1. TAB NAVIGATION ---
  setupTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
        window.soundEngine.playClick();
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('active', c.id === `${tabName}-tab`);
    });

    this.updateMascotForTab(tabName);

    if (tabName === 'rewards') {
      this.renderRewardsTab();
    } else if (tabName === 'creative' && window.creativeModule) {
      setTimeout(() => window.creativeModule.resizeCanvas(), 50);
    }
  }

  // --- 2. MASCOT BANNER ---
  setupMascot() {
    const speakBtn = document.getElementById('mascot-speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        const text = document.getElementById('mascot-text').textContent;
        window.soundEngine.speak(text);
      });
    }
  }

  updateMascotForTab(tabName) {
    const mascotTitle = document.getElementById('mascot-title');
    const mascotText = document.getElementById('mascot-text');
    const mascotAvatar = document.querySelector('.mascot-avatar');

    if (!mascotTitle || !mascotText) return;

    const messages = {
      math: {
        avatar: '🐝',
        title: 'Bé Ong Chăm Chỉ chào bạn!',
        text: 'Cùng thử tài tính nhẩm, xem đồng hồ, giải toán đố và khám phá bảng nhân chia 2, 5 nhé!'
      },
      vietnamese: {
        avatar: '🦉',
        title: 'Cú Mèo Thông Thái dẫn đường!',
        text: 'Luyện chính tả chuẩn, ghép từ thành câu và giải câu đố vui dân gian thật hay!'
      },
      english: {
        avatar: '🦖',
        title: 'Khủng Long Tinh Nghịch khám phá!',
        text: 'Học từ vựng tiếng Anh qua hình ảnh sinh động, luyện nghe và điền chữ còn thiếu!'
      },
      creative: {
        avatar: '🎨',
        title: 'Góc Sáng Tạo & Trí Tuệ',
        text: 'Vẽ tranh rực rỡ với bút ma thuật và thử thách trí nhớ siêu phàm với thẻ bài!'
      },
      rewards: {
        avatar: '👑',
        title: 'Bảng Vàng Danh Dự Của Bé',
        text: 'Xem bộ sưu tập huân chương lấp lánh và điểm sao bé đã tích lũy được nhé!'
      }
    };

    const msg = messages[tabName] || messages.math;
    mascotAvatar.textContent = msg.avatar;
    mascotTitle.textContent = msg.title;
    mascotText.textContent = msg.text;
  }

  speakMascot(text) {
    window.soundEngine.speak(text);
  }

  // --- 3. REWARDS & SETTINGS TAB ---
  renderRewardsTab() {
    const stats = window.storageManager.data.stats;
    const badges = window.storageManager.data.badges;
    const stars = window.storageManager.data.stars;

    // Badges grid
    const badgesGrid = document.getElementById('badges-display-grid');
    if (badgesGrid) {
      badgesGrid.innerHTML = '';
      badges.forEach(b => {
        const item = document.createElement('div');
        item.className = `badge-item ${b.unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
          <span class="badge-icon">${b.icon}</span>
          <div class="badge-name">${b.name}</div>
          <div class="badge-condition">${b.unlocked ? '✨ Đã đạt được' : b.desc}</div>
        `;
        badgesGrid.appendChild(item);
      });
    }

    // Progress percentages
    const mathPercent = Math.min(100, Math.round((stats.mathCorrect / Math.max(10, stats.mathCompleted || 1)) * 100));
    const vnPercent = Math.min(100, Math.round((stats.vnCorrect / Math.max(10, stats.vnCompleted || 1)) * 100));
    const engPercent = Math.min(100, Math.round((stats.engCorrect / Math.max(10, stats.engCompleted || 1)) * 100));

    const setProgress = (id, val, textId, text) => {
      const el = document.getElementById(id);
      const txt = document.getElementById(textId);
      if (el) el.style.width = `${val}%`;
      if (txt) txt.textContent = text;
    };

    setProgress('progress-math-fill', mathPercent, 'progress-math-text', `${stats.mathCorrect} câu đúng`);
    setProgress('progress-vn-fill', vnPercent, 'progress-vn-text', `${stats.vnCorrect} câu đúng`);
    setProgress('progress-eng-fill', engPercent, 'progress-eng-text', `${stats.engCorrect} từ vựng`);
    setProgress('progress-creative-fill', Math.min(100, stats.creativeCompleted * 20), 'progress-creative-text', `${stats.creativeCompleted} tác phẩm`);

    // Star Certificate
    const certEl = document.getElementById('star-certificate');
    if (certEl && stars > 0) {
      certEl.style.display = 'flex';
      const levels = [
        { min: 100, level: '⭐ Siêu Sao Rực Rỡ' },
        { min: 50, level: '🏅 Quán Quân Xuất Sắc' },
        { min: 20, level: '🎖️ Học Sinh Giỏi' },
        { min: 10, level: '📚 Học Sinh Tiêu Biểu' },
        { min: 1, level: '🌱 Người Mới Bắt Đầu' }
      ];
      const levelInfo = levels.find(l => stars >= l.min) || levels[levels.length - 1];
      document.getElementById('cert-level').textContent = levelInfo.level;
      document.getElementById('cert-stars').textContent = stars;
    }
  }

  // --- 4. HEADER CONTROLS ---
  setupHeaderActions() {
    // Sound toggle
    const soundToggleBtn = document.getElementById('btn-toggle-sound');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        window.soundEngine.soundEnabled = !window.soundEngine.soundEnabled;
        window.soundEngine.speechEnabled = window.soundEngine.soundEnabled;
        soundToggleBtn.textContent = window.soundEngine.soundEnabled ? '🔊' : '🔇';
        this.showToast(window.soundEngine.soundEnabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT", "info");
      });
    }

    // Music toggle
    const musicToggleBtn = document.getElementById('btn-toggle-music');
    if (musicToggleBtn) {
      musicToggleBtn.addEventListener('click', () => {
        this.bgMusicEnabled = !this.bgMusicEnabled;
        musicToggleBtn.textContent = this.bgMusicEnabled ? '🎵' : '🎶';
        musicToggleBtn.style.background = this.bgMusicEnabled ? '#dbeafe' : '';
        this.showToast(this.bgMusicEnabled ? "Nhạc nền: BẬT" : "Nhạc nền: TẮT", "info");
        if (this.bgMusicEnabled) {
          window.soundEngine.startAmbientMusic();
        } else {
          window.soundEngine.stopAmbientMusic();
        }
      });
    }

    // Reset data
    const resetDataBtn = document.getElementById('btn-reset-data');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm("Bé hoặc phụ huynh có chắc muốn xóa điểm và làm lại từ đầu không?")) {
          window.storageManager.resetAll();
        }
      });
    }
  }

  // --- 5. MODAL SYSTEM ---
  setupModals() {
    const overlay = document.getElementById('main-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    const actionBtn = document.getElementById('modal-action-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.hideModal());
    if (actionBtn) actionBtn.addEventListener('click', () => this.hideModal());
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.hideModal();
      });
    }
  }

  showModal({ icon, title, desc, rewardStars = 0 }) {
    const overlay = document.getElementById('main-modal-overlay');
    const iconEl = document.getElementById('modal-icon');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const starsEl = document.getElementById('modal-reward-stars');

    if (!overlay) return;

    iconEl.textContent = icon || '🎉';
    titleEl.textContent = title || 'Chúc Mừng!';
    descEl.textContent = desc || '';

    if (rewardStars > 0) {
      starsEl.style.display = 'inline-block';
      starsEl.textContent = `+${rewardStars} ⭐ Ngôi Sao Vàng!`;
    } else {
      starsEl.style.display = 'none';
    }

    overlay.classList.add('active');
  }

  showBadgeModal(badge) {
    window.soundEngine.playFanfare();
    this.triggerConfetti();
    this.showModal({
      icon: badge.icon,
      title: `🎉 Mở Khóa: ${badge.name}!`,
      desc: `Hoan hô bé! Bé vừa đạt được huy hiệu danh dự "${badge.name}". Hãy tiếp tục phát huy nhé!`
    });
  }

  hideModal() {
    const overlay = document.getElementById('main-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  // --- 6. TOAST NOTIFICATIONS ---
  showToast(message, type = "info") {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Limit to 3 toasts
    while (container.children.length >= 3) {
      container.removeChild(container.firstChild);
    }

    const icons = { success: '🌟', error: '💡', info: '📢' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || '📢'}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- 7. CANVAS CONFETTI CELEBRATION ---
  setupConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');

    const updateSize = () => {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
  }

  triggerConfetti() {
    if (!this.confettiCanvas || !this.confettiCtx) return;

    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FF70A6', '#FF9F1C'];
    for (let i = 0; i < 100; i++) {
      this.confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() * 200 - 100),
        y: window.innerHeight / 2 - 50,
        r: Math.random() * 6 + 4,
        d: Math.random() * 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }

    if (!this.isConfettiActive) {
      this.isConfettiActive = true;
      this.renderConfetti();
    }
  }

  renderConfetti() {
    if (this.confettiParticles.length === 0) {
      this.isConfettiActive = false;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      return;
    }

    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.tiltAngle += p.tiltAngleInc;
      p.y += p.vy;
      p.x += p.vx;
      p.vy += 0.28;
      p.vx *= 0.98;

      this.confettiCtx.beginPath();
      this.confettiCtx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.confettiCtx.fill();
      } else {
        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate(p.tiltAngle);
        this.confettiCtx.fillRect(-p.r / 2, -p.r / 2, p.r * 2, p.r);
        this.confettiCtx.restore();
      }

      if (p.y > window.innerHeight + 20) {
        this.confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.renderConfetti());
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.storageManager.updateHeaderUI();
});
