(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  document.documentElement.classList.add('js');

  /* Cabeçalho e menu */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = $('#burger');
  const menu = $('#menu');
  const setMenu = open => {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* Revelar ao rolar */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else $$('.reveal').forEach(el => el.classList.add('is-in'));

  /* Modal de demonstração (nenhuma mensagem é enviada) */
  const modal = $('#demo-modal');
  const msgEl = $('#demo-msg');
  let lastFocus = null;
  function openDemo(message) {
    lastFocus = document.activeElement;
    msgEl.textContent = message;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('.demo-modal__x', modal).focus();
  }
  function closeDemo() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastFocus?.focus();
  }
  $$('.demo-modal__x, .demo-modal__close', modal).forEach(b => b.addEventListener('click', closeDemo));
  modal.addEventListener('click', e => { if (e.target === modal) closeDemo(); });
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeDemo();
    if (e.key === 'Tab') {
      const f = $$('a[href], button', modal);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-wa]');
    if (t) openDemo(t.dataset.wa);
  });

  /* Acabamentos */
  const FINISHES = [
    { name: 'Carvalho natural', color: '#C48D57', grain: 1, desc: 'Claro e versátil, combina com quase todos os ambientes.' },
    { name: 'Freijó', color: '#A8733F', grain: 1, desc: 'Tom dourado com veios marcantes. Muito usado em salas e painéis.' },
    { name: 'Nogueira', color: '#6B4428', grain: 1, desc: 'Escura e elegante. Fica linda em home office e cabeceiras.' },
    { name: 'Laca off-white', color: '#EFE8DC', grain: 0, desc: 'Lisa e clara: deixa ambientes pequenos com sensação de mais espaço.' },
    { name: 'Verde musgo', color: '#6E7A57', grain: 0, desc: 'Cor que está em alta em cozinhas e lavanderias.' }
  ];
  const sw = $('#swatches');
  const stage = $('#finish-stage');
  const fName = $('#finish-name');
  const fDesc = $('#finish-desc');
  function pick(i, focus) {
    const f = FINISHES[i];
    $$('.swatch', sw).forEach((b, j) => { b.setAttribute('aria-checked', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    stage.style.setProperty('--wood', f.color);
    stage.style.setProperty('--grain', f.grain);
    fName.textContent = f.name;
    fDesc.textContent = f.desc;
    if (focus) $$('.swatch', sw)[i].focus();
  }
  FINISHES.forEach((f, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch' + (f.grain ? ' has-grain' : '');
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-label', f.name);
    b.style.setProperty('--c', f.color);
    b.innerHTML = `<span aria-hidden="true">${f.name.split(' ')[0]}</span>`;
    b.addEventListener('click', () => pick(i));
    sw.append(b);
  });
  sw.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const cur = $$('.swatch', sw).findIndex(b => b.getAttribute('aria-checked') === 'true');
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    pick((cur + dir + FINISHES.length) % FINISHES.length, true);
  });
  pick(0);

  /* Orçamento com prévia da mensagem */
  const form = $('#quote');
  const preview = $('#quote-preview');
  const err = $('#quote-err');
  function build() {
    const fd = new FormData(form);
    const rooms = fd.getAll('rooms');
    const v = k => String(fd.get(k) || '').trim();
    const lines = ['Olá! Quero um orçamento de móveis sob medida.'];
    lines.push('• Ambientes: ' + (rooms.length ? rooms.join(', ') : '—'));
    lines.push('• Nome: ' + (v('name') || '—'));
    if (v('city')) lines.push('• Local: ' + v('city'));
    if (v('size')) lines.push('• Medidas: ' + v('size'));
    lines.push('• Prazo: ' + v('when'));
    if (v('notes')) lines.push('• Detalhes: ' + v('notes'));
    return { text: lines.join('\n'), ok: rooms.length > 0 && !!v('name') };
  }
  const update = () => { preview.textContent = build().text; if (build().ok) err.hidden = true; };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const r = build();
    if (!r.ok) { err.hidden = false; return; }
    openDemo(r.text);
  });
  update();
})();
