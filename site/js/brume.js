/* La brume du fond, les dos de livres de la bibliothèque et le faisceau qui suit la souris. */
(function () {
  var moinsDeMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Brume : un bruit doux calculé en petit, étiré par le navigateur ---------- */
  var toile = document.getElementById('brume');
  var ctx = toile.getContext('2d');
  var L = 120, H = 68;
  toile.width = L;
  toile.height = H;
  var image = ctx.createImageData(L, H);

  var TAILLE = 64;
  var hasard = new Float32Array(TAILLE * TAILLE);
  for (var i = 0; i < hasard.length; i++) hasard[i] = Math.random();

  function lisse(t) { return t * t * (3 - 2 * t); }
  function bruit(x, y) {
    var x0 = Math.floor(x), y0 = Math.floor(y);
    var fx = lisse(x - x0), fy = lisse(y - y0);
    var a = ((x0 % TAILLE) + TAILLE) % TAILLE, b = ((y0 % TAILLE) + TAILLE) % TAILLE;
    var a1 = (a + 1) % TAILLE, b1 = (b + 1) % TAILLE;
    var h = hasard[b * TAILLE + a], d = hasard[b * TAILLE + a1];
    var j = hasard[b1 * TAILLE + a], k = hasard[b1 * TAILLE + a1];
    return (h + (d - h) * fx) * (1 - fy) + (j + (k - j) * fx) * fy;
  }
  function nappe(x, y) {
    return bruit(x, y) * 0.55 + bruit(x * 2.1 + 7, y * 2.1 + 3) * 0.3 + bruit(x * 4.3 + 11, y * 4.3 + 5) * 0.15;
  }

  /* Du plus sombre au plus clair : assez clair pour que les couvertures noires ressortent. */
  var SOMBRE = [62, 73, 70], CLAIR = [112, 126, 121];
  var teinte = [0, 0, 0], cible = [0, 0, 0], force = 0, forceCible = 0;

  function peindre(t) {
    var p = 0, f = force * 0.18;
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < L; x++) {
        var n = nappe(x * 0.032 + t * 0.016, y * 0.052 - t * 0.011);
        n = Math.min(1, Math.max(0, (n - 0.28) / 0.44));
        for (var c = 0; c < 3; c++) {
          var v = SOMBRE[c] + (CLAIR[c] - SOMBRE[c]) * n;
          image.data[p++] = v + (teinte[c] - v) * f * n;
        }
        image.data[p++] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  var dernier = 0;
  function boucle(ms) {
    requestAnimationFrame(boucle);
    if (document.hidden || ms - dernier < 50) return; // 20 images par seconde suffisent pour une brume
    dernier = ms;
    force += (forceCible - force) * 0.08;
    for (var c = 0; c < 3; c++) teinte[c] += (cible[c] - teinte[c]) * 0.12;
    peindre(ms / 1000);
  }
  peindre(0);
  if (!moinsDeMouvement) requestAnimationFrame(boucle);

  /* ---------- Lumière du livre survolé ---------- */
  var racine = document.documentElement;
  function eclairer(rgb) {
    if (!rgb) { forceCible = 0; return; }
    var v = rgb.split(',').map(Number);
    cible = v;
    forceCible = 1;
    racine.style.setProperty('--light-rgb', rgb);
    if (moinsDeMouvement) { teinte = v.slice(); force = 1; peindre(0); }
  }
  window.lumiere = eclairer;

  document.querySelectorAll('.book').forEach(function (livre) {
    var fiche = livre.closest('.fiche');
    var allumer = function () { eclairer(fiche.dataset.rgb); };
    var eteindre = function () { eclairer(null); };
    livre.addEventListener('pointerenter', allumer);
    livre.addEventListener('focus', allumer);
    livre.addEventListener('pointerleave', eteindre);
    livre.addEventListener('blur', eteindre);
  });

  /* ---------- Les dos de livres du fond : toujours les mêmes d'une visite à l'autre ---------- */
  var COULEURS = ['#66736E', '#75675A', '#5A6670', '#75544E', '#847E70', '#4F5D57', '#615A53', '#6E7A66', '#54606A'];
  document.querySelectorAll('.casier__fond').forEach(function (fond, numero) {
    var graine = 89 + numero * 34;
    function tirage() { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; }
    var largeur = 0;
    while (largeur < 2600) {
      var dos = document.createElement('span');
      var l = 13 + Math.round(tirage() * 21);
      dos.className = 'dos';
      dos.style.setProperty('--l', l + 'px');
      dos.style.setProperty('--h', (58 + Math.round(tirage() * 34)) + '%');
      dos.style.setProperty('--c', COULEURS[Math.floor(tirage() * COULEURS.length)]);
      dos.style.setProperty('--f', tirage() > 0.45 ? '1px' : '0');
      dos.style.setProperty('--t', (tirage() > 0.9 ? 1.6 : 0) + 'deg');
      fond.appendChild(dos);
      largeur += l + 1;
    }
  });

  /* ---------- Faisceau ---------- */
  var biblio = document.querySelector('.bibliotheque');
  if (!biblio) return;
  var attente = false, posX = 0, posY = 0;
  biblio.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    posX = e.clientX;
    posY = e.clientY;
    if (attente) return;
    attente = true;
    requestAnimationFrame(function () {
      attente = false;
      var r = biblio.getBoundingClientRect();
      biblio.style.setProperty('--bx', (posX - r.left) + 'px');
      biblio.style.setProperty('--by', (posY - r.top) + 'px');
    });
  });
})();
