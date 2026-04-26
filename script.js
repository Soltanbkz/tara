  // =====================
  // TELEGRAM CONFIG
  // =====================
  const TG_TOKEN = "8747566836:AAFXRK-QuGEIMjXiL5cjRJg1kyomKyI5vxg";
  const TG_CHAT_ID = "1985244006";

  async function sendTelegram(text) {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text, parse_mode: "HTML" })
    });
    return res.ok;
  }

  // =====================
  // POPUP
  // =====================
  function openPopup() {
    document.getElementById('popupOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('popupFormView').style.display = 'block';
    document.getElementById('popupSuccessView').style.display = 'none';
    document.getElementById('p-name').value = '';
    document.getElementById('p-phone').value = '';
    document.getElementById('popup-error').style.display = 'none';
  }

  function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function closePopupOnOverlay(e) {
    if (e.target === document.getElementById('popupOverlay')) closePopup();
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
  });

  async function sendPopupToTelegram() {
    const name  = document.getElementById('p-name').value.trim();
    const phone = document.getElementById('p-phone').value.trim();
    const errBox = document.getElementById('popup-error');

    if (!name || !phone) {
      errBox.textContent = 'Пожалуйста, заполните имя и номер телефона.';
      errBox.style.display = 'block';
      return;
    }
    if (!validatePhone(phone)) {
      errBox.textContent = 'Введите корректный номер телефона (11 цифр), например: +7 777 005 15 51';
      errBox.style.display = 'block';
      return;
    }
    errBox.style.display = 'none';

    const text = `📩 <b>Новая заявка с сайта (быстрая форма)</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Телефон:</b> ${phone}`;

    const ok = await sendTelegram(text);
    if (ok) {
      document.getElementById('popupFormView').style.display = 'none';
      document.getElementById('popupSuccessView').style.display = 'block';
      setTimeout(closePopup, 3000);
    } else {
      errBox.textContent = 'Ошибка отправки. Попробуйте позвонить нам напрямую.';
      errBox.style.display = 'block';
    }
  }

  // =====================
  // FULL FORM (Telegram)
  // =====================
  async function sendFullFormToTelegram() {
    const name    = document.getElementById('f-name').value.trim();
    const phone   = document.getElementById('f-phone').value.trim();
    const product = document.getElementById('f-product').value;
    const qty     = document.getElementById('f-qty').value.trim();
    const city    = document.getElementById('f-city').value.trim();
    const comment = document.getElementById('f-comment').value.trim();
    const errBox  = document.getElementById('form-error');
    const sucBox  = document.getElementById('form-success');

    if (!name || !phone) {
      errBox.textContent = 'Пожалуйста, заполните имя и номер телефона.';
      errBox.style.display = 'block';
      sucBox.style.display = 'none';
      return;
    }
    if (!validatePhone(phone)) {
      errBox.textContent = 'Введите корректный номер телефона (11 цифр), например: +7 777 005 15 51';
      errBox.style.display = 'block';
      sucBox.style.display = 'none';
      return;
    }
    errBox.style.display = 'none';

    let text = `📩 <b>Новая заявка с сайта (полная форма)</b>\n\n`;
    text += `👤 <b>Имя:</b> ${name}\n`;
    text += `📞 <b>Телефон:</b> ${phone}\n`;
    if (product) text += `🧴 <b>Товар:</b> ${product}\n`;
    if (qty)     text += `📦 <b>Количество:</b> ${qty} шт.\n`;
    if (city)    text += `🚚 <b>Город:</b> ${city}\n`;
    if (comment) text += `💬 <b>Комментарий:</b> ${comment}\n`;

    const ok = await sendTelegram(text);
    if (ok) {
      sucBox.style.display = 'block';
      errBox.style.display = 'none';
      document.getElementById('f-name').value = '';
      document.getElementById('f-phone').value = '';
      document.getElementById('f-product').value = '';
      document.getElementById('f-qty').value = '';
      document.getElementById('f-city').value = '';
      document.getElementById('f-comment').value = '';
    } else {
      errBox.textContent = 'Ошибка отправки. Позвоните нам: +7 777 005 15 51';
      errBox.style.display = 'block';
    }
  }

  // =====================
  // PHONE VALIDATION
  // =====================
  function validatePhone(phone) {
    // Strip all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Accept 10 digits (starting with 7xx) or 11 digits starting with 7 or 8
    return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))
        || digits.length === 10 && digits.startsWith('7');
  }

  // Auto-format phone input as user types: +7 (777) 005-15-51
  function setupPhoneInput(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', function() {
      let val = this.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (!val.startsWith('7') && val.length > 0) val = '7' + val;
      val = val.slice(0, 11);
      let formatted = '';
      if (val.length > 0)  formatted = '+7';
      if (val.length > 1)  formatted += ' (' + val.slice(1, 4);
      if (val.length >= 4) formatted += ')';
      if (val.length > 4)  formatted += ' ' + val.slice(4, 7);
      if (val.length > 7)  formatted += '-' + val.slice(7, 9);
      if (val.length > 9)  formatted += '-' + val.slice(9, 11);
      this.value = formatted;
    });
  }
  setupPhoneInput('p-phone');
  setupPhoneInput('f-phone');

  // =====================
  // CATALOGUE: show only first 3 rows, rest hidden
  // =====================
  let catalogueExpanded = false;
  const ROWS_VISIBLE = 3; // how many rows to show initially

  function initCatalogue() {
    updateCatalogueVisibility();
  }

  function updateCatalogueVisibility() {
    const grid = document.getElementById('productGrid');
    const cols = getGridColumns(grid);
    const limit = cols * ROWS_VISIBLE;

    const allCards = Array.from(grid.querySelectorAll('.product-card:not(.hidden)'));
    const total = allCards.length;

    allCards.forEach((card, i) => {
      if (!catalogueExpanded && i >= limit) {
        card.classList.add('catalogue-hidden');
      } else {
        card.classList.remove('catalogue-hidden');
      }
    });

    const wrap = document.getElementById('showMoreWrap');
    const hint = document.getElementById('showMoreHint');
    if (total <= limit) {
      wrap.style.display = 'none';
    } else {
      wrap.style.display = 'block';
      document.getElementById('showMoreBtn').innerHTML = catalogueExpanded
        ? '<span>▲</span> Свернуть каталог'
        : '<span>▼</span> Показать все товары';
      hint.textContent = catalogueExpanded
        ? 'Показан весь каталог'
        : `Показано ${limit} из ${total} товаров`;
    }
  }

  function getGridColumns(grid) {
    const gridStyle = window.getComputedStyle(grid);
    const cols = gridStyle.gridTemplateColumns.split(' ').length;
    return cols || 4;
  }

  function toggleShowMore() {
    catalogueExpanded = !catalogueExpanded;
    updateCatalogueVisibility();
    if (!catalogueExpanded) {
      document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.addEventListener('resize', () => {
    if (!catalogueExpanded) updateCatalogueVisibility();
  });

  // =====================
  // SCROLL ANIMATIONS
  // =====================
  const cards = document.querySelectorAll('.product-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => io.observe(c));

  const backBtn = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  });

  function toggleMenu() {
    document.getElementById('mobileNav').classList.toggle('open');
  }

  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  function filterCat(cat, btn) {
    catalogueExpanded = false;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.product-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
    updateCatalogueVisibility();
  }

  // Init on load
  initCatalogue();

  /* ============================================
   CUSTOM CURSOR — добавьте в конец script.js
   ============================================ */

(function () {
  // Создаём DOM элементы курсора
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isHovering = false;
  let isClicking = false;
  let raf;

  // Отслеживаем позицию мыши
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Hover на интерактивных элементах
  const hoverTargets = 'a, button, .btn-primary, .btn-secondary, .btn-add, .filter-tab, .faq-question, .product-card, input, select, textarea, .contact-item, .hero-bottle-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      isHovering = true;
      ring.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      isHovering = false;
      ring.classList.remove('is-hovering');
      dot.classList.remove('is-hovering');
    }
  });

  // Клик эффект
  document.addEventListener('mousedown', () => {
    ring.classList.add('is-clicking');
    dot.classList.add('is-clicking');
  });
  document.addEventListener('mouseup', () => {
    ring.classList.remove('is-clicking');
    dot.classList.remove('is-clicking');
  });

  // Плавное следование кольца
  function animateRing() {
    const speed = 0.12;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Скрываем при выходе мыши
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();