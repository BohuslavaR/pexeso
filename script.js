/* ==================================================================
   SCRIPT.JS — Memory Game (pexeso)
   ------------------------------------------------------------------
   ================================================================== */
(function () {
  
  const memCoverImage = 'https://res.cloudinary.com/xbffrklb/image/upload/v1787835312/KAR00543_copy.jpg';

  const memoryImages = [
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835050/KAR00179-Enhanced-NR_copy.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835048/KAR00072-Enhanced-NR_copy.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835045/IMG_9980.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835040/IMG_3752.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835036/107_2.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835031/29.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835038/BA2024_244.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835027/0EF530F8-488A-4138-822B-B6D6CC28D569.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787834983/0C019E9F-25B6-40F1-A807-02B0028B836D.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787835055/KAR00388-Enhanced-NR_copy_-_k%C3%B3pia.jpg'
  ];

  const grid = document.getElementById('memory-grid');
  
  grid.style.setProperty('--mem-cover-img', 'url(' + memCoverImage + ')');

  const movesEl = document.getElementById('game-moves');
  const pairsEl = document.getElementById('game-pairs');
  const winEl = document.getElementById('game-win');
  let cards = [], flipped = [], moves = 0, matched = 0, lock = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function build() {
    grid.innerHTML = '';
    flipped = []; moves = 0; matched = 0; lock = false;
    movesEl.textContent = 'Moves: 0';
    pairsEl.textContent = 'Pairs: 0 / ' + memoryImages.length;
    winEl.textContent = '';

    
    const deck = memoryImages.map((url, idx) => ({ url, slot: idx + 1 }));
    cards = shuffle([...deck, ...deck]);

    cards.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.key = item.url + '|' + item.slot;
      card.dataset.index = i;
      card.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-face mem-front"></div>
          <div class="mem-face mem-back">
            <span class="img-slot mem-img-slot">
              <img src="${item.url}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <span class="img-fallback">IMG ${item.slot}</span>
            </span>
          </div>
        </div>`;
      card.addEventListener('click', () => flipCard(card));
      grid.appendChild(card);
    });
  }

  function flipCard(card) {
    if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if (flipped.length === 2) {
      moves++; movesEl.textContent = 'Moves: ' + moves;
      lock = true;
      const [a, b] = flipped;
      if (a.dataset.key === b.dataset.key) {
        a.classList.add('matched'); b.classList.add('matched');
        matched++;
        pairsEl.textContent = 'Pairs: ' + matched + ' / ' + memoryImages.length;
        flipped = []; lock = false;
        if (matched === memoryImages.length) {
          winEl.textContent = `🎉 Solved in ${moves} moves!`;
        }
      } else {
        setTimeout(() => {
          a.classList.remove('flipped'); b.classList.remove('flipped');
          flipped = []; lock = false;
        }, 700);
      }
    }
  }

  document.getElementById('game-reset').addEventListener('click', build);
  build();
})();
