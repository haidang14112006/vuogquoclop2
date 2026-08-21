/* ===================================================
   ENGLISH FUN ZONE (TIẾNG ANH LỚP 2) LOGIC
   Flashcards, English Speech, Listen-and-Pick, Spelling Game, Number/Body themes
   =================================================== */

const ENGLISH_DATA = {
  animals: [
    { word: "Cat", phonetic: "/kæt/", meaning: "Con mèo", emoji: "🐱" },
    { word: "Dog", phonetic: "/dɒɡ/", meaning: "Con chó", emoji: "🐶" },
    { word: "Bird", phonetic: "/bɜːd/", meaning: "Con chim", emoji: "🐦" },
    { word: "Fish", phonetic: "/fɪʃ/", meaning: "Con cá", emoji: "🐟" },
    { word: "Duck", phonetic: "/dʌk/", meaning: "Con vịt", emoji: "🦆" },
    { word: "Elephant", phonetic: "/ˈelɪfənt/", meaning: "Con voi", emoji: "🐘" },
    { word: "Monkey", phonetic: "/ˈmʌŋki/", meaning: "Con khỉ", emoji: "🐵" },
    { word: "Rabbit", phonetic: "/ˈræbɪt/", meaning: "Con thỏ", emoji: "🐰" },
    { word: "Tiger", phonetic: "/ˈtaɪɡər/", meaning: "Con hổ", emoji: "🐯" },
    { word: "Butterfly", phonetic: "/ˈbʌtəflaɪ/", meaning: "Con bướm", emoji: "🦋" }
  ],
  colors: [
    { word: "Red", phonetic: "/red/", meaning: "Màu đỏ", emoji: "🔴" },
    { word: "Blue", phonetic: "/bluː/", meaning: "Màu xanh dương", emoji: "🔵" },
    { word: "Yellow", phonetic: "/ˈjeləʊ/", meaning: "Màu vàng", emoji: "🟡" },
    { word: "Green", phonetic: "/ɡriːn/", meaning: "Màu xanh lá", emoji: "🟢" },
    { word: "Orange", phonetic: "/ˈɒrɪndʒ/", meaning: "Màu cam", emoji: "🟠" },
    { word: "Purple", phonetic: "/ˈpɜːpl/", meaning: "Màu tím", emoji: "🟣" },
    { word: "Pink", phonetic: "/pɪŋk/", meaning: "Màu hồng", emoji: "🌸" },
    { word: "White", phonetic: "/waɪt/", meaning: "Màu trắng", emoji: "⬜" },
    { word: "Black", phonetic: "/blæk/", meaning: "Màu đen", emoji: "⬛" }
  ],
  school: [
    { word: "Book", phonetic: "/bʊk/", meaning: "Quyển sách", emoji: "📚" },
    { word: "Pencil", phonetic: "/ˈpensl/", meaning: "Bút chì", emoji: "✏️" },
    { word: "Ruler", phonetic: "/ˈruːlə/", meaning: "Cây thước kẻ", emoji: "📏" },
    { word: "School bag", phonetic: "/skuːl bæɡ/", meaning: "Cặp sách", emoji: "🎒" },
    { word: "Eraser", phonetic: "/ɪˈreɪzə/", meaning: "Cục tẩy", emoji: "🧼" },
    { word: "Crayon", phonetic: "/ˈkreɪən/", meaning: "Bút sáp màu", emoji: "🖍️" },
    { word: "Scissors", phonetic: "/ˈsɪzəz/", meaning: "Cái kéo", emoji: "✂️" },
    { word: "Glue", phonetic: "/ɡluː/", meaning: "Keo dán", emoji: "🗑️" }
  ],
  fruits: [
    { word: "Apple", phonetic: "/ˈæpl/", meaning: "Quả táo", emoji: "🍎" },
    { word: "Banana", phonetic: "/bəˈnɑːnə/", meaning: "Quả chuối", emoji: "🍌" },
    { word: "Orange", phonetic: "/ˈɒrɪndʒ/", meaning: "Quả cam", emoji: "🍊" },
    { word: "Watermelon", phonetic: "/ˈwɔːtəmelən/", meaning: "Quả dưa hấu", emoji: "🍉" },
    { word: "Strawberry", phonetic: "/ˈstrɔːbəri/", meaning: "Quả dâu tây", emoji: "🍓" },
    { word: "Mango", phonetic: "/ˈmæŋɡəʊ/", meaning: "Quả xoài", emoji: "🥭" },
    { word: "Grape", phonetic: "/ɡreɪp/", meaning: "Quả nho", emoji: "🍇" }
  ],
  numbers: [
    { word: "One", phonetic: "/wʌn/", meaning: "Số một (1)", emoji: "1️⃣" },
    { word: "Two", phonetic: "/tuː/", meaning: "Số hai (2)", emoji: "2️⃣" },
    { word: "Three", phonetic: "/θriː/", meaning: "Số ba (3)", emoji: "3️⃣" },
    { word: "Four", phonetic: "/fɔː/", meaning: "Số bốn (4)", emoji: "4️⃣" },
    { word: "Five", phonetic: "/faɪv/", meaning: "Số năm (5)", emoji: "5️⃣" },
    { word: "Six", phonetic: "/sɪks/", meaning: "Số sáu (6)", emoji: "6️⃣" },
    { word: "Seven", phonetic: "/ˈsevn/", meaning: "Số bảy (7)", emoji: "7️⃣" },
    { word: "Eight", phonetic: "/eɪt/", meaning: "Số tám (8)", emoji: "8️⃣" },
    { word: "Nine", phonetic: "/naɪn/", meaning: "Số chín (9)", emoji: "9️⃣" },
    { word: "Ten", phonetic: "/ten/", meaning: "Số mười (10)", emoji: "🔟" }
  ],
  body: [
    { word: "Head", phonetic: "/hed/", meaning: "Cái đầu", emoji: "🧠" },
    { word: "Eyes", phonetic: "/aɪz/", meaning: "Đôi mắt", emoji: "👀" },
    { word: "Nose", phonetic: "/nəʊz/", meaning: "Cái mũi", emoji: "👃" },
    { word: "Mouth", phonetic: "/maʊθ/", meaning: "Cái miệng", emoji: "👄" },
    { word: "Ear", phonetic: "/ɪər/", meaning: "Cái tai", emoji: "👂" },
    { word: "Hand", phonetic: "/hænd/", meaning: "Bàn tay", emoji: "✋" },
    { word: "Foot", phonetic: "/fʊt/", meaning: "Bàn chân", emoji: "🦶" },
    { word: "Heart", phonetic: "/hɑːt/", meaning: "Trái tim", emoji: "❤️" }
  ]
};

class EnglishModule {
  constructor() {
    this.currentTheme = 'animals';
    this.currentListenTarget = null;
    this.currentSpellingTarget = null;
    this.spellingAttempts = 0;
    this.init();
  }

  init() {
    this.setupThemeSelector();
    this.renderFlashcards(this.currentTheme);
    this.setupListenGame();
    this.setupSpellingGame();
  }

  setupThemeSelector() {
    const themeBtns = document.querySelectorAll('.eng-theme-selector .theme-pill-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTheme = btn.getAttribute('data-theme');
        this.renderFlashcards(this.currentTheme);
        window.soundEngine.playClick();
      });
    });
  }

  renderFlashcards(theme) {
    const grid = document.getElementById('english-flashcards-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const items = ENGLISH_DATA[theme] || ENGLISH_DATA.animals;

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'flashcard';
      card.innerHTML = `
        <div class="card-speaker-icon">🔊</div>
        <div class="card-emoji">${item.emoji}</div>
        <div class="card-en-word">${item.word}</div>
        <div class="card-phonetic">${item.phonetic}</div>
        <div class="card-vi-meaning">${item.meaning}</div>
      `;

      card.addEventListener('click', () => {
        card.classList.add('card-speaking');
        setTimeout(() => card.classList.remove('card-speaking'), 600);
        window.soundEngine.playClick();
        window.soundEngine.speak(item.word, 'en-US');
        window.storageManager.recordProgress('eng', true);
      });

      grid.appendChild(card);
    });
  }

  // --- LISTEN & GUESS GAME ---
  setupListenGame() {
    this.generateListenQuestion();
    const playAudioBtn = document.getElementById('listen-play-audio-btn');
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', () => {
        if (this.currentListenTarget) {
          playAudioBtn.classList.add('pulsing');
          setTimeout(() => playAudioBtn.classList.remove('pulsing'), 600);
          window.soundEngine.speak(this.currentListenTarget.word, 'en-US');
        }
      });
    }
  }

  generateListenQuestion() {
    const allWords = [
      ...ENGLISH_DATA.animals,
      ...ENGLISH_DATA.colors,
      ...ENGLISH_DATA.school,
      ...ENGLISH_DATA.fruits
    ];

    this.currentListenTarget = allWords[Math.floor(Math.random() * allWords.length)];

    let options = [this.currentListenTarget];
    while (options.length < 4) {
      let rand = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.some(o => o.word === rand.word)) {
        options.push(rand);
      }
    }
    options.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('listen-options-grid');
    if (!grid) return;

    grid.innerHTML = '';
    options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'listen-option-card';
      card.innerHTML = `
        <span class="emoji">${opt.emoji}</span>
        <span class="text">${opt.word}</span>
        <span style="font-size:0.9rem; color:#64748b;">${opt.meaning}</span>
      `;

      card.addEventListener('click', () => {
        grid.querySelectorAll('.listen-option-card').forEach(c => c.style.pointerEvents = 'none');
        if (opt.word === this.currentListenTarget.word) {
          card.style.background = 'linear-gradient(135deg, #86efac, #4ade80)';
          card.style.borderColor = '#22c55e';
          card.style.transform = 'scale(1.1)';
          window.soundEngine.playCorrect();
          window.soundEngine.speak(opt.word, 'en-US');
          window.storageManager.addStars(1);
          window.storageManager.recordProgress('eng', true);
          window.app.showToast(`Bé nghe chuẩn quá! "${opt.word}" = ${opt.meaning} +1 ⭐`, "success");
          setTimeout(() => this.generateListenQuestion(), 1500);
        } else {
          card.style.background = '#fca5a5';
          card.style.borderColor = '#ef4444';
          grid.querySelectorAll('.listen-option-card').forEach(c => {
            // find correct
            const wordEl = c.querySelector('.text');
            if (wordEl && wordEl.textContent === this.currentListenTarget.word) {
              c.style.background = 'linear-gradient(135deg, #86efac, #4ade80)';
              c.style.borderColor = '#22c55e';
            }
          });
          window.soundEngine.playWrong();
          window.storageManager.recordProgress('eng', false);
          window.app.showToast("Chưa chính xác, bấm loa để nghe lại nhé!", "error");
          setTimeout(() => this.generateListenQuestion(), 1800);
        }
      });

      grid.appendChild(card);
    });

    setTimeout(() => {
      if (this.currentListenTarget) {
        window.soundEngine.speak(this.currentListenTarget.word, 'en-US');
      }
    }, 400);
  }

  // --- SPELLING GAME (FILL IN MISSING LETTERS) ---
  setupSpellingGame() {
    this.generateSpellingChallenge();
    const nextBtn = document.getElementById('eng-spelling-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.generateSpellingChallenge());
    }
  }

  generateSpellingChallenge() {
    const allThemes = ['animals', 'colors', 'school', 'fruits'];
    const theme = allThemes[Math.floor(Math.random() * allThemes.length)];
    const items = ENGLISH_DATA[theme];
    this.currentSpellingTarget = items[Math.floor(Math.random() * items.length)];
    this.spellingAttempts = 0;

    const word = this.currentSpellingTarget.word.toUpperCase();
    // Choose a random position to hide
    const hideCount = Math.max(1, Math.floor(word.length * 0.4));
    const positions = [];
    while (positions.length < hideCount) {
      const pos = Math.floor(Math.random() * word.length);
      if (!positions.includes(pos) && word[pos] !== ' ') positions.push(pos);
    }

    const container = document.getElementById('eng-spelling-container');
    const hintEl = document.getElementById('eng-spelling-hint');
    if (!container) return;

    if (hintEl) hintEl.textContent = `${this.currentSpellingTarget.emoji} ${this.currentSpellingTarget.meaning}`;

    container.innerHTML = '';
    const wordRow = document.createElement('div');
    wordRow.className = 'spelling-word-row';

    const inputs = [];
    for (let i = 0; i < word.length; i++) {
      if (word[i] === ' ') {
        const space = document.createElement('div');
        space.style.width = '16px';
        wordRow.appendChild(space);
      } else if (positions.includes(i)) {
        const input = document.createElement('input');
        input.className = 'spelling-letter-input';
        input.maxLength = 1;
        input.dataset.correct = word[i];
        input.dataset.index = i;
        input.setAttribute('autocomplete', 'off');
        input.addEventListener('input', (e) => {
          e.target.value = e.target.value.toUpperCase();
          if (e.target.value.length === 1) {
            // Move to next input
            const nextInput = inputs[inputs.indexOf(e.target) + 1];
            if (nextInput) nextInput.focus();
          }
          this.checkSpellingAnswer(inputs, word.replace(/ /g, ''));
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && e.target.value === '') {
            const prevInput = inputs[inputs.indexOf(e.target) - 1];
            if (prevInput) { prevInput.value = ''; prevInput.focus(); }
          }
        });
        wordRow.appendChild(input);
        inputs.push(input);
      } else {
        const letterBox = document.createElement('div');
        letterBox.className = 'spelling-letter-fixed';
        letterBox.textContent = word[i];
        wordRow.appendChild(letterBox);
      }
    }

    container.appendChild(wordRow);

    // Add letter hint buttons
    const allLetters = [...new Set(word.replace(/ /g, '').split(''))].sort();
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => !allLetters.includes(l));
    const shufflePool = [...allLetters, ...extraLetters.slice(0, 4)].sort(() => Math.random() - 0.5).slice(0, 8);

    const btnRow = document.createElement('div');
    btnRow.className = 'spelling-hint-btns';
    shufflePool.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'spelling-hint-btn';
      btn.textContent = letter;
      btn.addEventListener('click', () => {
        const emptyInput = inputs.find(inp => inp.value === '');
        if (emptyInput) {
          emptyInput.value = letter;
          emptyInput.dispatchEvent(new Event('input'));
        }
      });
      btnRow.appendChild(btn);
    });
    container.appendChild(btnRow);

    if (inputs.length > 0) setTimeout(() => inputs[0].focus(), 100);
  }

  checkSpellingAnswer(inputs, correctWord) {
    const userAnswer = inputs.map(inp => inp.value).join('');
    const correctAnswer = inputs.map(inp => inp.dataset.correct).join('');

    if (userAnswer.length === inputs.length) {
      this.spellingAttempts++;
      if (userAnswer === correctAnswer) {
        inputs.forEach(inp => inp.classList.add('correct-input'));
        window.soundEngine.playCorrect();
        window.storageManager.addStars(2);
        window.storageManager.recordProgress('eng', true);
        window.app.showToast(`🎉 Chính xác! "${this.currentSpellingTarget.word}" +2 ⭐`, 'success');
        window.soundEngine.speak(this.currentSpellingTarget.word, 'en-US');
        setTimeout(() => this.generateSpellingChallenge(), 1800);
      } else {
        inputs.forEach(inp => {
          if (inp.value !== inp.dataset.correct) inp.classList.add('wrong-input');
          else inp.classList.add('correct-input');
        });
        window.soundEngine.playWrong();
        window.storageManager.recordProgress('eng', false);
        window.app.showToast(`Chưa đúng! Hãy thử lại nhé!`, 'error');
        setTimeout(() => {
          inputs.forEach(inp => {
            inp.classList.remove('wrong-input', 'correct-input');
            inp.value = '';
          });
          if (inputs[0]) inputs[0].focus();
        }, 800);
      }
    }
  }
}

window.englishModule = new EnglishModule();
