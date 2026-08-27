/* ==================================================================
   SCRIPT.JS — samostatná stránka: iba Memory Game (pexeso)
   ------------------------------------------------------------------
   Presne tá istá logika ako v hlavnom portfóliu, vrátane tvojich
   už vyplnených URL adries obrázkov (cover obrázok + 10 fotiek).
   ================================================================== */
(function () {
  /* 👉 Cover obrázok — spoločná "predná strana" pre všetky karty */
  const memCoverImage = 'https://res.cloudinary.com/xbffrklb/image/upload/v1787814858/IMG_8590.jpg';

  /* 👉 10 fotiek pre pexeso — každá sa v hre objaví 2×.
     Nahraď ktorýkoľvek reťazec inou URL adresou, ak chceš zmeniť fotku. */
  const memoryImages = [
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832120/PEXESO10.webp',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832118/PEXESO9.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832116/PEXESO8.webp',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832114/PEXESO7.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832113/PEXESO6.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832110/PEXESO5.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832108/PEXESO4.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832106/PEXESO3.jpg',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832104/PEXESO2.webp',
    'https://res.cloudinary.com/xbffrklb/image/upload/v1787832102/PEXESO1.jpg'
  ];

  const grid = document.getElementById('memory-grid');
  /* Nastaví cover obrázok raz pre celú mriežku — CSS ho použije
     na každej "prednej strane" karty cez premennú --mem-cover-img */
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

    /* Ku každému obrázku si popri zamiešaní necháme aj jeho poradové
       číslo (1–10), aby fallback placeholder vedel zobraziť "IMG 3" atď. */
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
