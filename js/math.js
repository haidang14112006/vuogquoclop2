/* ===================================================
   MATH KINGDOM (MÔN TOÁN LỚP 2) LOGIC
   Covers: Phép cộng/trừ, Bảng cửu chương 2 & 5, Đồng hồ, Hình học & Đo lường, Toán Đố
   =================================================== */

class MathModule {
  constructor() {
    this.currentSubTab = 'calc'; // calc, table, clock, shapes, wordproblem
    this.currentProblem = null;
    this.currentClockTarget = { hours: 8, minutes: 30 };
    this.calcDifficulty = '100';
    this.init();
  }

  init() {
    this.setupSubNav();
    this.generateCalcProblem();
    this.renderTimesTable(2);
    this.generateClockQuiz();
    this.generateShapeQuiz();
    this.generateWordProblem();
  }

  setupSubNav() {
    const subNavBtns = document.querySelectorAll('#math-tab .sub-nav-btn[data-sub]');
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
    document.querySelectorAll('.math-sub-content').forEach(el => {
      el.style.display = 'none';
    });
    const activeSection = document.getElementById(`math-sub-${subId}`);
    if (activeSection) {
      activeSection.style.display = 'block';
    }

    if (subId === 'calc' && !this.currentProblem) {
      this.generateCalcProblem();
    } else if (subId === 'clock') {
      this.renderClock(this.currentClockTarget.hours, this.currentClockTarget.minutes);
    } else if (subId === 'wordproblem') {
      this.generateWordProblem();
    }
  }

  // --- 1. PHÉP TÍNH CỘNG TRỪ (CÓ NHỚ LỚP 2) ---
  generateCalcProblem(difficulty) {
    if (difficulty) this.calcDifficulty = difficulty;
    let num1, num2, op, result;
    const isAddition = Math.random() > 0.5;

    if (this.calcDifficulty === '20') {
      if (isAddition) {
        num1 = Math.floor(Math.random() * 10) + 6;
        num2 = Math.floor(Math.random() * 9) + 4;
        op = '+';
        result = num1 + num2;
      } else {
        result = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * 8) + 3;
        num1 = result + num2;
        op = '-';
      }
    } else if (this.calcDifficulty === '100') {
      if (isAddition) {
        num1 = Math.floor(Math.random() * 50) + 15;
        num2 = Math.floor(Math.random() * 35) + 12;
        op = '+';
        result = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 60) + 35;
        num2 = Math.floor(Math.random() * 25) + 10;
        op = '-';
        result = num1 - num2;
      }
    } else {
      // 1000
      num1 = Math.floor(Math.random() * 400) + 120;
      num2 = Math.floor(Math.random() * 300) + 100;
      op = isAddition ? '+' : '-';
      if (!isAddition && num1 < num2) {
        let tmp = num1; num1 = num2; num2 = tmp;
      }
      result = isAddition ? num1 + num2 : num1 - num2;
    }

    // Generate 4 multiple choices (1 correct, 3 distractors)
    let options = [result];
    while (options.length < 4) {
      let offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      let candidate = result + offset;
      if (candidate > 0 && !options.includes(candidate)) {
        options.push(candidate);
      }
    }
    options.sort(() => Math.random() - 0.5);

    this.currentProblem = { num1, num2, op, result, options };
    this.renderCalcUI();
  }

  renderCalcUI() {
    const num1El = document.getElementById('calc-num1');
    const num2El = document.getElementById('calc-num2');
    const opEl = document.getElementById('calc-op');
    const optionsGrid = document.getElementById('calc-options-grid');
    const countersEl = document.getElementById('calc-counters');

    if (!num1El) return;

    num1El.textContent = this.currentProblem.num1;
    num2El.textContent = this.currentProblem.num2;
    opEl.textContent = this.currentProblem.op;

    // Visual items for smaller numbers
    countersEl.innerHTML = '';
    if (this.currentProblem.num1 <= 20 && this.currentProblem.num2 <= 20) {
      const emojis = ['🍎', '⭐', '🍬', '🎈', '🍪', '🌸', '🦋'];
      const chosen = emojis[Math.floor(Math.random() * emojis.length)];
      countersEl.innerHTML = `<span style="font-size: 0.95rem; color: #64748b; width:100%; display:block; margin-bottom:4px;">Hình minh họa:</span>` +
        `<div style="display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap;">` +
        `<div>${chosen.repeat(this.currentProblem.num1)}</div>` +
        `<strong style="color:#e11d48; font-size:1.5rem;">${this.currentProblem.op}</strong>` +
        `<div>${chosen.repeat(this.currentProblem.num2)}</div>` +
        `</div>`;
    }

    // Render option buttons
    optionsGrid.innerHTML = '';
    this.currentProblem.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'math-btn-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.handleCalcAnswer(btn, opt));
      optionsGrid.appendChild(btn);
    });
  }

  handleCalcAnswer(btn, selectedValue) {
    const isCorrect = selectedValue === this.currentProblem.result;
    // Disable all buttons during feedback
    const allBtns = document.querySelectorAll('#calc-options-grid .math-btn-opt');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (isCorrect) {
      btn.classList.add('correct');
      window.soundEngine.playCorrect();
      window.storageManager.addStars(1);
      window.storageManager.recordProgress('math', true);
      window.app.triggerConfetti();
      window.app.showToast("Bé tính chính xác! +1 ⭐", "success");
      setTimeout(() => {
        this.generateCalcProblem();
      }, 1200);
    } else {
      btn.classList.add('wrong');
      window.soundEngine.playWrong();
      window.storageManager.recordProgress('math', false);
      // Show correct answer hint
      allBtns.forEach(b => {
        if (parseInt(b.textContent) === this.currentProblem.result) {
          b.classList.add('correct');
        }
      });
      window.app.showToast("Bé thử tính lại nhé! Đáp án đúng đã được tô xanh. Cố lên!", "error");
      setTimeout(() => {
        this.generateCalcProblem();
      }, 1800);
    }
  }

  // --- 2. BẢNG CỬU CHƯƠNG 2 & 5 (NHÂN VÀ CHIA) ---
  renderTimesTable(multiplier) {
    const container = document.getElementById('times-table-list');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const item = document.createElement('div');
      item.className = 'table-item';
      item.innerHTML = `<strong>${multiplier} × ${i}</strong> = <span style="color:#e11d48; font-weight:700;">${multiplier * i}</span>`;
      item.addEventListener('click', () => {
        item.classList.add('table-item-flash');
        setTimeout(() => item.classList.remove('table-item-flash'), 500);
        window.soundEngine.playClick();
        window.soundEngine.speak(`${multiplier} nhân ${i} bằng ${multiplier * i}`);
      });
      container.appendChild(item);
    }

    // Render division table
    const divContainer = document.getElementById('division-table-list');
    if (divContainer) {
      divContainer.innerHTML = '';
      for (let i = 1; i <= 10; i++) {
        const prod = multiplier * i;
        const item = document.createElement('div');
        item.className = 'table-item';
        item.innerHTML = `<strong>${prod} : ${multiplier}</strong> = <span style="color:#2563eb; font-weight:700;">${i}</span>`;
        item.addEventListener('click', () => {
          item.classList.add('table-item-flash');
          setTimeout(() => item.classList.remove('table-item-flash'), 500);
          window.soundEngine.playClick();
          window.soundEngine.speak(`${prod} chia ${multiplier} bằng ${i}`);
        });
        divContainer.appendChild(item);
      }
    }

    // Setup practice quiz
    this.setupTimesTableQuiz(multiplier);
  }

  setupTimesTableQuiz(multiplier) {
    const quizContainer = document.getElementById('times-table-quiz');
    if (!quizContainer) return;
    this.generateTimesQuiz(multiplier);
  }

  generateTimesQuiz(multiplier) {
    const quizContainer = document.getElementById('times-table-quiz');
    if (!quizContainer) return;

    const i = Math.floor(Math.random() * 10) + 1;
    const result = multiplier * i;
    const isMultiply = Math.random() > 0.5;

    let question, answer;
    if (isMultiply) {
      question = `${multiplier} × ${i} = ?`;
      answer = result;
    } else {
      question = `${result} : ${multiplier} = ?`;
      answer = i;
    }

    let options = [answer];
    while (options.length < 4) {
      let rand = Math.floor(Math.random() * 10) + 1;
      if (!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);

    quizContainer.innerHTML = `
      <div style="background:#fff5f5; border-radius:16px; padding:16px; text-align:center; margin-top:20px; border:2px solid #fecdd3;">
        <div style="font-family:var(--font-heading); font-size:2rem; color:#9f1239; margin-bottom:12px;">${question}</div>
        <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px;">
          ${options.map(opt => `<button class="math-btn-opt times-quiz-btn" data-val="${opt}" data-correct="${opt === answer}" style="font-size:1.5rem;">${opt}</button>`).join('')}
        </div>
      </div>
    `;

    quizContainer.querySelectorAll('.times-quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        quizContainer.querySelectorAll('.times-quiz-btn').forEach(b => b.style.pointerEvents = 'none');
        if (isCorrect) {
          btn.classList.add('correct');
          window.soundEngine.playCorrect();
          window.storageManager.addStars(1);
          window.storageManager.recordProgress('math', true);
          window.app.showToast(`Chính xác! ${question.replace('?', answer)} +1 ⭐`, 'success');
          setTimeout(() => this.generateTimesQuiz(multiplier), 1200);
        } else {
          btn.classList.add('wrong');
          quizContainer.querySelectorAll('.times-quiz-btn').forEach(b => {
            if (b.getAttribute('data-correct') === 'true') b.classList.add('correct');
          });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('math', false);
          window.app.showToast('Chưa đúng! Hãy xem lại bảng nhân nhé!', 'error');
          setTimeout(() => this.generateTimesQuiz(multiplier), 1800);
        }
      });
    });
  }

  // --- 3. ĐỒNG HỒ THÔNG MINH ---
  generateClockQuiz() {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutesList = [0, 15, 30, 45];
    const minutes = minutesList[Math.floor(Math.random() * minutesList.length)];

    this.currentClockTarget = { hours, minutes };
    this.renderClock(hours, minutes);
    this.renderClockOptions(hours, minutes);
  }

  renderClock(h, m) {
    const hourHand = document.getElementById('clock-hour-hand');
    const minuteHand = document.getElementById('clock-minute-hand');
    const digitalDisplay = document.getElementById('clock-digital-display');
    if (!hourHand || !minuteHand) return;

    const hourDeg = (h % 12) * 30 + m * 0.5;
    const minDeg = m * 6;

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minDeg}deg)`;

    if (digitalDisplay) {
      const hStr = h.toString().padStart(2, '0');
      const mStr = m.toString().padStart(2, '0');
      digitalDisplay.textContent = `${hStr}:${mStr}`;
    }
  }

  renderClockOptions(h, m) {
    const optionsGrid = document.getElementById('clock-options-grid');
    if (!optionsGrid) return;

    let correctText = `${h} giờ ${m === 0 ? 'đúng' : (m === 30 ? 'rưỡi (30 phút)' : m + ' phút')}`;
    let options = [correctText];

    while (options.length < 4) {
      let randH = Math.floor(Math.random() * 12) + 1;
      let randM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      let distractorText = `${randH} giờ ${randM === 0 ? 'đúng' : (randM === 30 ? 'rưỡi (30 phút)' : randM + ' phút')}`;
      if (!options.includes(distractorText)) {
        options.push(distractorText);
      }
    }
    options.sort(() => Math.random() - 0.5);

    optionsGrid.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'math-btn-opt';
      btn.style.fontSize = '1.15rem';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        const allBtns = optionsGrid.querySelectorAll('.math-btn-opt');
        allBtns.forEach(b => b.style.pointerEvents = 'none');
        if (opt === correctText) {
          btn.classList.add('correct');
          window.soundEngine.playCorrect();
          window.storageManager.addStars(1);
          window.storageManager.recordProgress('math', true);
          window.soundEngine.speak(correctText);
          window.app.showToast("Bé xem giờ rất giỏi! +1 ⭐", "success");
          setTimeout(() => this.generateClockQuiz(), 1400);
        } else {
          btn.classList.add('wrong');
          allBtns.forEach(b => { if (b.textContent === correctText) b.classList.add('correct'); });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('math', false);
          window.app.showToast("Chưa đúng rồi, bé hãy nhìn kỹ kim ngắn và kim dài nhé!", "error");
          setTimeout(() => this.generateClockQuiz(), 1800);
        }
      });
      optionsGrid.appendChild(btn);
    });
  }

  // --- 4. HÌNH HỌC VÀ ĐO LƯỜNG ---
  generateShapeQuiz() {
    const shapeQuestions = [
      {
        question: "Hình nào dưới đây là HÌNH TỨ GIÁC (có 4 cạnh)?",
        options: [
          { name: "Hình Chữ Nhật", icon: "🟦", correct: true },
          { name: "Hình Tam Giác", icon: "🔺", correct: false },
          { name: "Hình Tròn", icon: "🔴", correct: false },
          { name: "Khối Cầu", icon: "⚽", correct: false }
        ]
      },
      {
        question: "Vật nào dưới đây có dạng KHỐI TRỤ?",
        options: [
          { name: "Lon nước ngọt", icon: "🥤", correct: true },
          { name: "Quả bóng đá", icon: "⚽", correct: false },
          { name: "Hộp bánh vuông", icon: "📦", correct: false },
          { name: "Chiếc nón lá", icon: "👒", correct: false }
        ]
      },
      {
        question: "Đơn vị nào dùng để đo KHỐI LƯỢNG (cân nặng)?",
        options: [
          { name: "Ki-lô-gam (kg)", icon: "⚖️", correct: true },
          { name: "Xăng-ti-mét (cm)", icon: "📏", correct: false },
          { name: "Lít (l)", icon: "🥛", correct: false },
          { name: "Mét (m)", icon: "📐", correct: false }
        ]
      },
      {
        question: "Đổi đơn vị: 1 mét (1m) bằng bao nhiêu xăng-ti-mét (cm)?",
        options: [
          { name: "100 cm", icon: "💯", correct: true },
          { name: "10 cm", icon: "🔟", correct: false },
          { name: "50 cm", icon: "📏", correct: false },
          { name: "1000 cm", icon: "🌟", correct: false }
        ]
      },
      {
        question: "Hình nào dưới đây là HÌNH TAM GIÁC (có 3 cạnh)?",
        options: [
          { name: "Biển báo tam giác", icon: "⚠️", correct: true },
          { name: "Mặt trăng tròn", icon: "🌕", correct: false },
          { name: "Tờ giấy vuông", icon: "📄", correct: false },
          { name: "Bánh xe tròn", icon: "🎡", correct: false }
        ]
      },
      {
        question: "Đơn vị nào dùng để đo DUNG TÍCH (chất lỏng)?",
        options: [
          { name: "Lít (l)", icon: "🥛", correct: true },
          { name: "Ki-lô-gam (kg)", icon: "⚖️", correct: false },
          { name: "Mét (m)", icon: "📐", correct: false },
          { name: "Giờ (h)", icon: "⏰", correct: false }
        ]
      },
      {
        question: "Một hình chữ nhật có mấy góc vuông?",
        options: [
          { name: "4 góc vuông", icon: "4️⃣", correct: true },
          { name: "2 góc vuông", icon: "2️⃣", correct: false },
          { name: "3 góc vuông", icon: "3️⃣", correct: false },
          { name: "Không có góc vuông", icon: "0️⃣", correct: false }
        ]
      },
      {
        question: "Chu vi hình vuông cạnh 5cm là bao nhiêu?",
        options: [
          { name: "20 cm", icon: "✅", correct: true },
          { name: "10 cm", icon: "❌", correct: false },
          { name: "25 cm", icon: "❌", correct: false },
          { name: "15 cm", icon: "❌", correct: false }
        ]
      }
    ];

    const currentQ = shapeQuestions[Math.floor(Math.random() * shapeQuestions.length)];
    const qTitleEl = document.getElementById('shape-question-title');
    const gridEl = document.getElementById('shape-options-grid');
    if (!qTitleEl || !gridEl) return;

    qTitleEl.textContent = currentQ.question;
    gridEl.innerHTML = '';

    currentQ.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'shape-item';
      card.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 8px;">${opt.icon}</div>
        <span>${opt.name}</span>
      `;
      card.addEventListener('click', () => {
        gridEl.querySelectorAll('.shape-item').forEach(c => c.style.pointerEvents = 'none');
        if (opt.correct) {
          card.style.background = '#86efac';
          card.style.borderColor = '#22c55e';
          window.soundEngine.playCorrect();
          window.storageManager.addStars(1);
          window.storageManager.recordProgress('math', true);
          window.app.showToast("Chính xác tuyệt vời! +1 ⭐", "success");
          setTimeout(() => this.generateShapeQuiz(), 1200);
        } else {
          card.style.background = '#fca5a5';
          card.style.borderColor = '#ef4444';
          // Show correct answer
          gridEl.querySelectorAll('.shape-item').forEach((c, idx) => {
            if (currentQ.options[idx].correct) {
              c.style.background = '#86efac';
              c.style.borderColor = '#22c55e';
            }
          });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('math', false);
          window.app.showToast("Bé hãy quan sát kỹ lại nhé!", "error");
          setTimeout(() => this.generateShapeQuiz(), 1800);
        }
      });
      gridEl.appendChild(card);
    });
  }

  // --- 5. TOÁN CÓ LỜI VĂN ---
  generateWordProblem() {
    const problems = [
      {
        story: "🍎 Bà mua 24 quả táo. Bà cho hàng xóm 9 quả táo. Hỏi bà còn lại bao nhiêu quả táo?",
        hint: "Số táo còn lại = số táo mua - số táo cho đi",
        answer: 15,
        unit: "quả táo"
      },
      {
        story: "🎈 Cô giáo có 36 quả bóng bay. Cô chia đều cho 4 tổ. Mỗi tổ được bao nhiêu quả bóng?",
        hint: "Số bóng mỗi tổ = số bóng ÷ số tổ",
        answer: 9,
        unit: "quả bóng"
      },
      {
        story: "📚 Tuấn đọc sách 3 ngày liên tiếp. Ngày đầu đọc 15 trang, ngày hai đọc 12 trang, ngày ba đọc 18 trang. Hỏi Tuấn đọc tất cả bao nhiêu trang sách?",
        hint: "Tổng số trang = trang ngày 1 + trang ngày 2 + trang ngày 3",
        answer: 45,
        unit: "trang"
      },
      {
        story: "🐟 Ao cá nhà bác Tư có 48 con cá. Bác bán đi 1 nửa số cá. Hỏi ao còn lại bao nhiêu con cá?",
        hint: "Số cá còn lại = số cá ban đầu ÷ 2",
        answer: 24,
        unit: "con cá"
      },
      {
        story: "🍬 Mẹ mua 5 gói kẹo, mỗi gói có 8 cái kẹo. Hỏi mẹ mua tất cả bao nhiêu cái kẹo?",
        hint: "Tổng số kẹo = số gói × số kẹo mỗi gói",
        answer: 40,
        unit: "cái kẹo"
      },
      {
        story: "🚌 Xe buýt có 42 hành khách. Ở bến A có 13 người xuống, 7 người lên. Hỏi xe buýt hiện có bao nhiêu hành khách?",
        hint: "Số hành khách = 42 - 13 + 7",
        answer: 36,
        unit: "hành khách"
      },
      {
        story: "🌻 Vườn hoa có 5 hàng hoa, mỗi hàng có 10 bông. Hỏi vườn có tất cả bao nhiêu bông hoa?",
        hint: "Số bông hoa = số hàng × số bông mỗi hàng",
        answer: 50,
        unit: "bông hoa"
      },
      {
        story: "💰 Nam có 75 xu. Nam mua một cái bút chì hết 28 xu và một quyển vở hết 35 xu. Hỏi Nam còn lại bao nhiêu xu?",
        hint: "Số xu còn = 75 - 28 - 35",
        answer: 12,
        unit: "xu"
      }
    ];

    const prob = problems[Math.floor(Math.random() * problems.length)];
    const storyEl = document.getElementById('wordproblem-story');
    const hintEl = document.getElementById('wordproblem-hint');
    const optionsEl = document.getElementById('wordproblem-options');
    const qNumEl = document.getElementById('wordproblem-question-num');

    if (!storyEl) return;

    storyEl.textContent = prob.story;
    if (hintEl) hintEl.textContent = `💡 Gợi ý: ${prob.hint}`;

    // Generate answer options
    let options = [prob.answer];
    while (options.length < 4) {
      let offset = (Math.floor(Math.random() * 8) + 2) * (Math.random() > 0.5 ? 1 : -1);
      let candidate = prob.answer + offset;
      if (candidate > 0 && !options.includes(candidate)) options.push(candidate);
    }
    options.sort(() => Math.random() - 0.5);

    optionsEl.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'math-btn-opt';
      btn.innerHTML = `<span style="font-size:1.5rem;">${opt}</span><br><small style="font-size:0.8rem;">${prob.unit}</small>`;
      btn.addEventListener('click', () => {
        optionsEl.querySelectorAll('.math-btn-opt').forEach(b => b.style.pointerEvents = 'none');
        if (opt === prob.answer) {
          btn.classList.add('correct');
          window.soundEngine.playCorrect();
          window.storageManager.addStars(2);
          window.storageManager.recordProgress('math', true);
          window.app.triggerConfetti();
          window.app.showToast(`Bé giải toán giỏi lắm! Đáp án đúng: ${prob.answer} ${prob.unit}. +2 ⭐`, 'success');
          setTimeout(() => this.generateWordProblem(), 1800);
        } else {
          btn.classList.add('wrong');
          optionsEl.querySelectorAll('.math-btn-opt').forEach(b => {
            const val = parseInt(b.querySelector('span').textContent);
            if (val === prob.answer) b.classList.add('correct');
          });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('math', false);
          window.app.showToast("Chưa đúng, hãy đọc lại đề bài và tính kỹ hơn nhé!", 'error');
          setTimeout(() => this.generateWordProblem(), 2000);
        }
      });
      optionsEl.appendChild(btn);
    });
  }
}

window.mathModule = new MathModule();
