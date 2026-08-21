/* ===================================================
   STORAGE & GAMIFICATION MANAGER
   Tracks stars, unlocked badges, learning stats & persistent settings
   =================================================== */

const STORAGE_KEY = 'kidedu_grade2_data';

const DEFAULT_DATA = {
  stars: 0,
  stats: {
    mathCompleted: 0,
    mathCorrect: 0,
    vnCompleted: 0,
    vnCorrect: 0,
    engCompleted: 0,
    engCorrect: 0,
    creativeCompleted: 0
  },
  badges: [
    { id: 'first_step', name: 'Bước Đầu Tiên', icon: '🌱', desc: 'Đạt được 5 ngôi sao', target: 5, unlocked: false },
    { id: 'math_wizard', name: 'Nhà Toán Học Nhí', icon: '🧮', desc: 'Hoàn thành 10 phép tính đúng', target: 10, unlocked: false, key: 'mathCorrect' },
    { id: 'spelling_bee', name: 'Ong Chăm Học Chữ', icon: '🐝', desc: 'Đúng 10 câu Tiếng Việt', target: 10, unlocked: false, key: 'vnCorrect' },
    { id: 'english_star', name: 'Bé Giỏi Tiếng Anh', icon: '🌟', desc: 'Học 10 từ vựng Tiếng Anh', target: 10, unlocked: false, key: 'engCorrect' },
    { id: 'little_artist', name: 'Họa Sĩ Tí Hon', icon: '🎨', desc: 'Sáng tạo 3 bức vẽ hoặc game trí nhớ', target: 3, unlocked: false, key: 'creativeCompleted' },
    { id: 'champion_50', name: 'Quán Quân Siêu Nhí', icon: '👑', desc: 'Đạt mốc 50 ngôi sao vàng', target: 50, unlocked: false }
  ],
  settings: {
    sound: true,
    speech: true
  }
};

class StorageManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedBadges = Array.isArray(parsed.badges) ? parsed.badges : [];

        return {
          ...DEFAULT_DATA,
          ...parsed,
          stats: { ...DEFAULT_DATA.stats, ...(parsed.stats || {}) },
          settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          badges: DEFAULT_DATA.badges.map(defaultBadge => ({
            ...defaultBadge,
            ...(savedBadges.find(savedBadge => savedBadge.id === defaultBadge.id) || {})
          }))
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    this.updateHeaderUI();
  }

  addStars(count = 1) {
    this.data.stars += count;
    if (window.soundEngine) {
      window.soundEngine.playStar();
    }
    this.checkBadges();
    this.save();
    return this.data.stars;
  }

  recordProgress(category, isCorrect = true) {
    if (category === 'math') {
      this.data.stats.mathCompleted++;
      if (isCorrect) this.data.stats.mathCorrect++;
    } else if (category === 'vn') {
      this.data.stats.vnCompleted++;
      if (isCorrect) this.data.stats.vnCorrect++;
    } else if (category === 'eng') {
      this.data.stats.engCompleted++;
      if (isCorrect) this.data.stats.engCorrect++;
    } else if (category === 'creative') {
      this.data.stats.creativeCompleted++;
    }
    this.checkBadges();
    this.save();
  }

  checkBadges() {
    let newlyUnlocked = [];
    this.data.badges.forEach(badge => {
      if (badge.unlocked) return;

      let isEligible = false;
      if (badge.id === 'first_step' && this.data.stars >= badge.target) {
        isEligible = true;
      } else if (badge.id === 'champion_50' && this.data.stars >= badge.target) {
        isEligible = true;
      } else if (badge.key && this.data.stats[badge.key] >= badge.target) {
        isEligible = true;
      }

      if (isEligible) {
        badge.unlocked = true;
        newlyUnlocked.push(badge);
      }
    });

    if (newlyUnlocked.length > 0 && window.app) {
      newlyUnlocked.forEach(b => {
        window.app.showBadgeModal(b);
      });
    }
  }

  updateHeaderUI() {
    const starCountEl = document.getElementById('global-star-count');
    if (starCountEl) {
      starCountEl.textContent = this.data.stars;
    }
  }

  resetAll() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
    if (window.app) {
      window.app.renderRewardsTab();
      window.app.showToast("Đã thiết lập lại dữ liệu học tập!", "info");
    }
  }
}

window.storageManager = new StorageManager();
