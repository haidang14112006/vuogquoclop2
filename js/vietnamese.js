/* ===================================================
   VIETNAMESE KINGDOM (MÔN TIẾNG VIỆT LỚP 2) LOGIC
   Chính tả, Luyện từ và câu, Ghép câu, Đố vui dân gian & Đọc hiểu
   =================================================== */

class VietnameseModule {
  constructor() {
    this.currentSubTab = 'spelling';
    this.currentSpelling = null;
    this.currentSentenceData = null;
    this.currentPlacedWords = [];
    this.init();
  }

  init() {
    this.setupSubNav();
    this.generateSpellingQuiz();
    this.generateSentencePuzzle();
    this.generateRiddleQuiz();
  }

  setupSubNav() {
    const subNavBtns = document.querySelectorAll('#vietnamese-tab .sub-nav-btn');
    subNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const subId = btn.getAttribute('data-sub');
        this.switchSubTab(subId);
      });
    });
  }

  switchSubTab(subId) {
    this.currentSubTab = subId;
    document.querySelectorAll('.vn-sub-content').forEach(el => {
      el.style.display = 'none';
    });
    const activeSection = document.getElementById(`vn-sub-${subId}`);
    if (activeSection) {
      activeSection.style.display = 'block';
    }
  }

  // --- 1. CHÍNH TẢ THÔNG MINH ---
  generateSpellingQuiz() {
    const spellingBank = [
      { prefix: "con ", suffix: "á", missing: "c", options: ["c", "k"], full: "con cá", icon: "🐟", rule: "Âm 'c' đi với a, o, ô, ơ, u, ư" },
      { prefix: "cây ", suffix: "im", missing: "k", options: ["c", "k"], full: "cây kim", icon: "🪡", rule: "Âm 'k' đi với i, e, ê" },
      { prefix: "cái ", suffix: "hế", missing: "gh", options: ["g", "gh"], full: "cái ghế", icon: "🪑", rule: "Âm 'gh' đi với i, e, ê" },
      { prefix: "con ", suffix: "à", missing: "g", options: ["g", "gh"], full: "con gà", icon: "🐔", rule: "Âm 'g' đi với a, o, ô, ơ, u, ư" },
      { prefix: "chú ", suffix: "é", missing: "ngh", options: ["ng", "ngh"], full: "chú nghé", icon: "🐂", rule: "Âm 'ngh' đi với i, e, ê" },
      { prefix: "ngôi ", suffix: "à", missing: "nh", options: ["nh", "ng"], full: "ngôi nhà", icon: "🏠", rule: "Nhà cửa ấm cúng" },
      { prefix: "dòng ", suffix: "ông", missing: "s", options: ["s", "x"], full: "dòng sông", icon: "🌊", rule: "Dòng sông uốn lượn" },
      { prefix: "hoa ", suffix: "en", missing: "s", options: ["s", "x"], full: "hoa sen", icon: "🪷", rule: "Hoa sen thơm ngát" },
      { prefix: "quyển ", suffix: "ách", missing: "s", options: ["s", "x"], full: "quyển sách", icon: "📚", rule: "Quyển sách bổ ích" },
      { prefix: "quả ", suffix: "am", missing: "c", options: ["c", "k"], full: "quả cam", icon: "🍊", rule: "Âm 'c' đi với a" },
      { prefix: "", suffix: "ời", missing: "tr", options: ["tr", "ch"], full: "trời", icon: "☁️", rule: "Phân biệt tr/ch" },
      { prefix: "", suffix: "ời gian", missing: "th", options: ["th", "t"], full: "thời gian", icon: "⏰", rule: "Phân biệt th/t" },
      { prefix: "con ", suffix: "ướm", missing: "b", options: ["b", "v"], full: "con bướm", icon: "🦋", rule: "Phân biệt b/v" },
      { prefix: "bông ", suffix: "oa", missing: "h", options: ["h", "f"], full: "bông hoa", icon: "🌺", rule: "Âm h trong tiếng Việt" },
      { prefix: "chiếc ", suffix: "ón", missing: "n", options: ["n", "l"], full: "chiếc nón", icon: "👒", rule: "Phân biệt n/l" },
      { prefix: "", suffix: "ớp học", missing: "l", options: ["n", "l"], full: "lớp học", icon: "🏫", rule: "Âm 'l' ở đầu từ" },
    ];

    this.currentSpelling = spellingBank[Math.floor(Math.random() * spellingBank.length)];

    const wordEl = document.getElementById('spelling-word');
    const iconEl = document.getElementById('spelling-icon');
    const optContainer = document.getElementById('spelling-options');
    const ruleEl = document.getElementById('spelling-rule-hint');

    if (!wordEl) return;

    iconEl.textContent = this.currentSpelling.icon;
    wordEl.innerHTML = `${this.currentSpelling.prefix}<span class="spelling-slot">...</span>${this.currentSpelling.suffix}`;
    if (ruleEl) ruleEl.textContent = '';

    optContainer.innerHTML = '';
    this.currentSpelling.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'vn-btn-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        optContainer.querySelectorAll('.vn-btn-opt').forEach(b => b.style.pointerEvents = 'none');
        if (opt === this.currentSpelling.missing) {
          btn.classList.add('correct');
          wordEl.innerHTML = `${this.currentSpelling.prefix}<strong style="color:#16a34a; font-size:1.3em;">${opt}</strong>${this.currentSpelling.suffix}`;
          if (ruleEl) {
            ruleEl.textContent = `✅ Quy tắc: ${this.currentSpelling.rule}`;
            ruleEl.style.color = '#16a34a';
          }
          window.soundEngine.playCorrect();
          window.soundEngine.speak(this.currentSpelling.full);
          window.storageManager.addStars(1);
          window.storageManager.recordProgress('vn', true);
          window.app.showToast(`Chính xác! "${this.currentSpelling.full}" ✔️ +1 ⭐`, "success");
          setTimeout(() => this.generateSpellingQuiz(), 1800);
        } else {
          btn.classList.add('wrong');
          if (ruleEl) {
            ruleEl.textContent = `💡 Gợi ý: ${this.currentSpelling.rule}`;
            ruleEl.style.color = '#d97706';
          }
          // Show correct
          optContainer.querySelectorAll('.vn-btn-opt').forEach(b => {
            if (b.textContent === this.currentSpelling.missing) b.classList.add('correct');
          });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('vn', false);
          window.app.showToast("Chưa đúng rồi bé ơi! Bé nhớ lại quy tắc nhé!", "error");
          setTimeout(() => this.generateSpellingQuiz(), 2000);
        }
      });
      optContainer.appendChild(btn);
    });
  }

  // --- 2. LUYỆN TỪ VÀ CÂU (GHÉP CÂU HOÀN CHỈNH) ---
  generateSentencePuzzle() {
    const sentences = [
      { text: "Em là học sinh lớp hai", type: "Ai là gì?", words: ["Em", "là", "học sinh", "lớp hai"] },
      { text: "Bác nông dân đang cày ruộng", type: "Ai làm gì?", words: ["Bác nông dân", "đang", "cày ruộng"] },
      { text: "Bông hoa hồng rất thơm", type: "Ai thế nào?", words: ["Bông hoa hồng", "rất", "thơm ngát"] },
      { text: "Đàn chim hót líu lo", type: "Ai làm gì?", words: ["Đàn chim", "hót", "líu lo"] },
      { text: "Mẹ em rất hiền hậu", type: "Ai thế nào?", words: ["Mẹ em", "rất", "hiền hậu"] },
      { text: "Chú mèo đang bắt chuột", type: "Ai làm gì?", words: ["Chú mèo", "đang", "bắt chuột"] },
      { text: "Bầu trời hôm nay xanh trong", type: "Ai thế nào?", words: ["Bầu trời", "hôm nay", "xanh trong"] },
      { text: "Bạn Nam học bài chăm chỉ", type: "Ai làm gì?", words: ["Bạn Nam", "học bài", "chăm chỉ"] },
      { text: "Con chó nhỏ đang ngủ", type: "Ai làm gì?", words: ["Con chó nhỏ", "đang", "ngủ"] },
    ];

    this.currentSentenceData = sentences[Math.floor(Math.random() * sentences.length)];
    this.currentPlacedWords = [];

    const builderZone = document.getElementById('sentence-builder-zone');
    const wordBank = document.getElementById('sentence-word-bank');
    const typeLabel = document.getElementById('sentence-type-label');
    const resultFeedback = document.getElementById('sentence-result-feedback');

    if (!builderZone || !wordBank) return;

    typeLabel.textContent = `Kiểu câu: ${this.currentSentenceData.type}`;
    builderZone.innerHTML = `<span style="color:#94a3b8; font-weight:600;">Chạm vào các từ bên dưới để ghép câu...</span>`;
    if (resultFeedback) resultFeedback.innerHTML = '';

    const shuffled = [...this.currentSentenceData.words].sort(() => Math.random() - 0.5);
    wordBank.innerHTML = '';

    shuffled.forEach((word) => {
      const tile = document.createElement('div');
      tile.className = 'word-tile';
      tile.textContent = word;
      tile.addEventListener('click', () => {
        if (!tile.classList.contains('placed')) {
          tile.classList.add('placed');
          this.currentPlacedWords.push(word);
          this.updateBuilderZone();
        }
      });
      wordBank.appendChild(tile);
    });
  }

  updateBuilderZone() {
    const builderZone = document.getElementById('sentence-builder-zone');
    const resultFeedback = document.getElementById('sentence-result-feedback');
    if (!builderZone) return;

    builderZone.innerHTML = '';
    if (this.currentPlacedWords.length === 0) {
      builderZone.innerHTML = `<span style="color:#94a3b8; font-weight:600;">Chạm vào các từ bên dưới để ghép câu...</span>`;
      return;
    }

    this.currentPlacedWords.forEach((w, idx) => {
      const pill = document.createElement('span');
      pill.className = 'word-tile placed';
      pill.textContent = w;
      pill.title = "Bấm để bỏ từ này";
      pill.addEventListener('click', () => {
        this.removePlacedWord(idx, w);
      });
      builderZone.appendChild(pill);
    });

    if (this.currentPlacedWords.length === this.currentSentenceData.words.length) {
      const isMatch = this.currentPlacedWords.every((val, index) => val === this.currentSentenceData.words[index]);
      if (isMatch) {
        builderZone.style.background = '#dcfce7';
        builderZone.style.borderColor = '#16a34a';
        if (resultFeedback) resultFeedback.innerHTML = `<div style="color:#16a34a; font-family:var(--font-heading); font-size:1.1rem; margin-top:8px;">✅ Câu đúng: "${this.currentSentenceData.text}"</div>`;
        window.soundEngine.playCorrect();
        window.soundEngine.speak(this.currentSentenceData.text);
        window.storageManager.addStars(2);
        window.storageManager.recordProgress('vn', true);
        window.app.triggerConfetti();
        window.app.showToast("Bé ghép câu tuyệt vời! +2 ⭐", "success");
        setTimeout(() => this.generateSentencePuzzle(), 2200);
      } else {
        builderZone.style.background = '#fee2e2';
        builderZone.style.borderColor = '#ef4444';
        if (resultFeedback) resultFeedback.innerHTML = `<div style="color:#ef4444; font-family:var(--font-heading); font-size:1rem; margin-top:8px;">❌ Chưa đúng! Hãy thử sắp xếp lại thứ tự.</div>`;
        window.soundEngine.playWrong();
        window.storageManager.recordProgress('vn', false);
        window.app.showToast("Thứ tự các từ chưa đúng rồi, bé thử sắp xếp lại nhé!", "error");
        setTimeout(() => {
          builderZone.style.background = '';
          builderZone.style.borderColor = '';
        }, 1000);
      }
    }
  }

  removePlacedWord(index, word) {
    this.currentPlacedWords.splice(index, 1);
    const tiles = document.querySelectorAll('#sentence-word-bank .word-tile');
    for (let t of tiles) {
      if (t.textContent === word && t.classList.contains('placed')) {
        t.classList.remove('placed');
        break;
      }
    }
    const builderZone = document.getElementById('sentence-builder-zone');
    if (builderZone) {
      builderZone.style.background = '';
      builderZone.style.borderColor = '';
    }
    this.updateBuilderZone();
  }

  // --- 3. ĐỐ VUI DÂN GIAN & ĐỌC HIỂU ---
  generateRiddleQuiz() {
    const riddles = [
      {
        title: "Đố vui về con vật 🐇",
        text: "Con gì đuôi ngắn tai dài,\nMắt hồng lông mượt, có tài chạy nhanh?",
        options: [
          { text: "Con Thỏ 🐇", correct: true },
          { text: "Con Mèo 🐱", correct: false },
          { text: "Con Chó 🐶", correct: false }
        ]
      },
      {
        title: "Đố vui đồ dùng học tập ✏️",
        text: "Thân dài thon nhỏ,\nCó ruột đen ngòm,\nBé gọt nhọn đầu,\nViết chữ đều ngay?",
        options: [
          { text: "Cây bút chì ✏️", correct: true },
          { text: "Cây thước kẻ 📏", correct: false },
          { text: "Cục tẩy 🧼", correct: false }
        ]
      },
      {
        title: "Đọc hiểu: Bạn Gấu Tốt Bụng 🐻",
        text: "Mùa thu đến, bạn Gấu mang hạt dẻ chia cho các bạn Sóc, Thỏ và Nhím. Các bạn đều cảm ơn và cùng chơi vui vẻ dưới ánh nắng ấm áp.",
        question: "Bạn Gấu đã chia món gì cho các bạn?",
        options: [
          { text: "Hạt dẻ thơm ngon 🌰", correct: true },
          { text: "Mật ong ngọt ngào 🍯", correct: false },
          { text: "Quả táo đỏ 🍎", correct: false }
        ]
      },
      {
        title: "Đố vui về cây cối 🌳",
        text: "Cây gì lá xanh quanh năm,\nThân thẳng tắp vươn cao đến tận trời,\nLấy bóng mát cho người nghỉ ngơi?",
        options: [
          { text: "Cây đa cổ thụ 🌳", correct: true },
          { text: "Cây xương rồng 🌵", correct: false },
          { text: "Cây hoa hồng 🌹", correct: false }
        ]
      },
      {
        title: "Đọc hiểu: Chú Ong Cần Cù 🐝",
        text: "Chú ong nhỏ mỗi ngày bay đến hàng trăm bông hoa để hút mật. Nhờ chú ong, những bông hoa được thụ phấn và cho ra quả ngọt. Mật ong chú mang về tổ là món quà quý giá cho cả đàn.",
        question: "Nhờ chú ong, điều gì xảy ra với các bông hoa?",
        options: [
          { text: "Hoa được thụ phấn, cho quả ngọt 🌺", correct: true },
          { text: "Hoa bị héo úa và rụng đi 🥀", correct: false },
          { text: "Hoa đổi màu thành vàng 💛", correct: false }
        ]
      },
      {
        title: "Đố về hiện tượng thiên nhiên ⛅",
        text: "Sáng đến là chiếu sáng,\nTối đến là biến mất,\nCho ta ánh sáng ban ngày,\nLà vật thể sáng nhất trên trời?",
        options: [
          { text: "Mặt Trời ☀️", correct: true },
          { text: "Mặt Trăng 🌕", correct: false },
          { text: "Ngôi Sao ⭐", correct: false }
        ]
      },
      {
        title: "Đọc hiểu: Giọt Nước Mưa 💧",
        text: "Mưa rơi xuống mang nước uống cho người, tưới mát cho cây xanh và đồng ruộng. Sau cơn mưa, bầu trời trong xanh hơn, không khí mát mẻ và hương thơm của đất ướt thoảng nhẹ.",
        question: "Sau cơn mưa, bầu trời như thế nào?",
        options: [
          { text: "Trong xanh và mát mẻ hơn 🌈", correct: true },
          { text: "Xám xịt và u ám hơn 🌫️", correct: false },
          { text: "Nóng nực và ngột ngạt hơn 🔥", correct: false }
        ]
      },
      {
        title: "Đố vui về con vật 🐢",
        text: "Con gì mang nhà trên lưng,\nĐi chậm rãi nhưng bền bỉ kiên trì,\nSống rất lâu, nổi tiếng kiên định?",
        options: [
          { text: "Con rùa 🐢", correct: true },
          { text: "Con ốc sên 🐌", correct: false },
          { text: "Con cua 🦀", correct: false }
        ]
      }
    ];

    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    const titleEl = document.getElementById('riddle-title');
    const textEl = document.getElementById('riddle-text');
    const optionsList = document.getElementById('riddle-options-list');

    if (!titleEl) return;

    titleEl.textContent = riddle.title;
    textEl.innerHTML = (riddle.question ? `<em style="color:#1e40af; font-weight:700;">${riddle.question}</em><br><br>` : '') + riddle.text.replace(/\n/g, '<br>');

    optionsList.innerHTML = '';
    riddle.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span class="quiz-option-letter">${String.fromCharCode(65 + idx)}</span> <span>${opt.text}</span>`;
      btn.addEventListener('click', () => {
        optionsList.querySelectorAll('.quiz-option-btn').forEach(b => b.style.pointerEvents = 'none');
        if (opt.correct) {
          btn.style.background = 'linear-gradient(135deg, #86efac, #4ade80)';
          btn.style.borderColor = '#22c55e';
          btn.style.color = '#14532d';
          window.soundEngine.playCorrect();
          window.storageManager.addStars(1);
          window.storageManager.recordProgress('vn', true);
          window.app.showToast("Bé thông minh quá! +1 ⭐", "success");
          setTimeout(() => this.generateRiddleQuiz(), 1600);
        } else {
          btn.style.background = '#fca5a5';
          btn.style.borderColor = '#ef4444';
          optionsList.querySelectorAll('.quiz-option-btn').forEach(b => {
            const i = [...optionsList.children].indexOf(b);
            if (riddle.options[i] && riddle.options[i].correct) {
              b.style.background = 'linear-gradient(135deg, #86efac, #4ade80)';
              b.style.borderColor = '#22c55e';
            }
          });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('vn', false);
          window.app.showToast("Bé suy nghĩ kỹ thêm chút nữa nhé!", "error");
          setTimeout(() => this.generateRiddleQuiz(), 2000);
        }
      });
      optionsList.appendChild(btn);
    });
  }
}

window.vietnameseModule = new VietnameseModule();
