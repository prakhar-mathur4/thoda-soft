/* Thoda Soft theme — all client interactions, dependency-free. */
(function () {
  'use strict';

  const routes = window.routes || {};
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = '');

  /* ----------------------------------------------------------------------
   * Generic overlay controller (cart, mobile menu, search, quick view, etc.)
   * -------------------------------------------------------------------- */
  function makeOverlay({ root, overlay, panel, openCls, closeCls, ovOpen, ovClose, onOpen, onClose, lock = true }) {
    if (!root) return null;
    let open = false;
    const api = {
      get isOpen() { return open; },
      open() {
        if (open) return;
        open = true;
        root.classList.remove('pointer-events-none');
        root.setAttribute('aria-hidden', 'false');
        if (overlay) { ovClose.forEach((c) => overlay.classList.remove(c)); ovOpen.forEach((c) => overlay.classList.add(c)); }
        if (panel) { closeCls.forEach((c) => panel.classList.remove(c)); openCls.forEach((c) => panel.classList.add(c)); }
        if (lock) lockScroll();
        if (onOpen) onOpen();
      },
      close() {
        if (!open) return;
        open = false;
        root.classList.add('pointer-events-none');
        root.setAttribute('aria-hidden', 'true');
        if (overlay) { ovOpen.forEach((c) => overlay.classList.remove(c)); ovClose.forEach((c) => overlay.classList.add(c)); }
        if (panel) { openCls.forEach((c) => panel.classList.remove(c)); closeCls.forEach((c) => panel.classList.add(c)); }
        if (lock) unlockScroll();
        if (onClose) onClose();
      },
      toggle() { open ? api.close() : api.open(); },
    };
    return api;
  }

  /* ----------------------------------------------------------------------
   * Cart drawer + AJAX cart
   * -------------------------------------------------------------------- */
  const cart = makeOverlay({
    root: $('[data-cart-drawer]'),
    overlay: $('[data-cart-overlay]'),
    panel: $('[data-cart-panel]'),
    openCls: ['translate-x-0'], closeCls: ['translate-x-full'],
    ovOpen: ['opacity-100'], ovClose: ['opacity-0'],
    onOpen() { const p = $('[data-cart-panel]'); if (p) p.focus(); },
  });

  function updateCartCount(count) {
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }

  function renderDrawerFromSections(sections) {
    if (!sections || !sections['cart-drawer']) return;
    const contents = $('[data-cart-contents]');
    if (!contents) return;
    const doc = new DOMParser().parseFromString(sections['cart-drawer'], 'text/html');
    const inner = doc.querySelector('.shopify-section') || doc.body;
    contents.innerHTML = inner.innerHTML;
  }

  // Skeleton shown the instant the drawer opens, before the server responds.
  function showCartLoading() {
    const contents = $('[data-cart-contents]');
    if (!contents) return;
    const row =
      '<li class="flex gap-4 py-5">' +
        '<div class="h-24 w-20 flex-shrink-0 animate-pulse rounded-2xl bg-charcoal/10"></div>' +
        '<div class="flex flex-1 flex-col gap-2 py-1">' +
          '<div class="h-3.5 w-3/4 animate-pulse rounded bg-charcoal/10"></div>' +
          '<div class="h-3 w-1/3 animate-pulse rounded bg-charcoal/10"></div>' +
          '<div class="mt-auto h-3 w-1/4 animate-pulse rounded bg-charcoal/10"></div>' +
        '</div>' +
      '</li>';
    contents.innerHTML =
      '<div class="flex-1 overflow-y-auto"><ul class="divide-y divide-charcoal/10 px-6">' +
        row + row +
      '</ul></div>' +
      '<div class="border-t border-charcoal/10 px-6 py-5">' +
        '<div class="mb-4 flex items-center justify-between">' +
          '<div class="h-3 w-16 animate-pulse rounded bg-charcoal/10"></div>' +
          '<div class="h-5 w-20 animate-pulse rounded bg-charcoal/10"></div>' +
        '</div>' +
        '<div class="h-11 w-full animate-pulse rounded-full bg-charcoal/10"></div>' +
      '</div>';
  }

  async function cartAdd(items) {
    const res = await fetch(routes.cart_add_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items, sections: 'cart-drawer', sections_url: window.location.pathname }),
    });
    if (!res.ok) throw await res.json().catch(() => ({}));
    const data = await res.json();
    renderDrawerFromSections(data.sections);
    await refreshCartState();
    return data;
  }

  async function cartChange(id, quantity) {
    const res = await fetch(routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id, quantity, sections: 'cart-drawer', sections_url: window.location.pathname }),
    });
    const data = await res.json();
    renderDrawerFromSections(data.sections);
    updateCartCount(data.item_count);
    return data;
  }

  async function refreshCartState() {
    try {
      const r = await fetch(routes.cart_url + '.js');
      const c = await r.json();
      updateCartCount(c.item_count);
    } catch (e) { /* ignore */ }
  }

  /* Add-to-cart from product forms (product page + quick view) */
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-product-form]');
    if (!form) return;
    e.preventDefault();
    const idInput = $('[data-variant-id]', form);
    const btn = $('[data-add-to-cart]', form);
    const id = idInput && idInput.value;
    if (!id) return;
    const label = btn && $('[data-add-label]', btn);
    const prev = label && label.textContent;
    if (btn) btn.disabled = true;
    if (label) label.textContent = window.cartStrings ? window.cartStrings.added.replace('✓', '…') : 'Adding…';
    // Open the drawer immediately with a skeleton; real contents replace it.
    if (cart) { cart.open(); showCartLoading(); }
    cartAdd([{ id: Number(id), quantity: 1 }])
      .then(() => { if (label && window.cartStrings) label.textContent = window.cartStrings.added; })
      .catch(() => { if (label) label.textContent = 'Try again'; })
      .finally(() => { setTimeout(() => { if (btn) btn.disabled = false; if (label && prev) label.textContent = prev; }, 1400); });
  });

  /* Variant pickers (product page + quick view) — multi-option aware.
     Resolves the selected combination (e.g. Top Size + Bottom Size) to a variant
     and only enables Add to Cart once every option is chosen. */
  function resolveVariant(form) {
    const dataEl = $('[data-variant-data]', form);
    const idInput = $('[data-variant-id]', form);
    const btn = $('[data-add-to-cart]', form);
    const label = btn && $('[data-add-label]', btn);
    const scope = form.closest('[data-product-root], [data-quickview-product]') || document;
    const price = scope.querySelector('[data-product-price], [data-qv-price]');
    if (!dataEl) return;
    let variants = [];
    try { variants = JSON.parse(dataEl.textContent); } catch (err) { return; }

    const groups = $$('[data-option-group]', form);
    const selected = [];
    let complete = true;
    groups.forEach((g) => {
      const pos = Number(g.dataset.optionPosition) - 1;
      const active = $('[data-variant-option][aria-pressed="true"]', g);
      if (active) selected[pos] = active.dataset.optionValue;
      else complete = false;
    });

    const setAdd = (disabled, text) => {
      if (btn) btn.disabled = disabled;
      if (label && text != null) label.textContent = text;
    };

    if (!complete) {
      if (idInput) idInput.value = '';
      setAdd(true, form.dataset.selectLabel || 'Select Size');
      return;
    }
    const variant = variants.find((v) => v.options.every((o, i) => String(o) === String(selected[i])));
    if (!variant || !variant.available) {
      if (idInput) idInput.value = variant ? variant.id : '';
      if (variant && price && variant.price) price.textContent = variant.price;
      setAdd(true, 'Sold out');
      return;
    }
    if (idInput) idInput.value = variant.id;
    if (price && variant.price) price.textContent = variant.price;
    setAdd(false, window.cartStrings ? window.cartStrings.addToCart : 'Add to Cart');
  }

  document.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-variant-option]');
    if (!opt) return;
    const group = opt.closest('[data-option-group]');
    const form = opt.closest('[data-product-form]');
    if (!group || !form) return;
    $$('[data-variant-option]', group).forEach((b) => b.setAttribute('aria-pressed', 'false'));
    opt.setAttribute('aria-pressed', 'true');
    resolveVariant(form);
  });

  /* Product share — native share sheet when available, else a small menu */
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-share-toggle]');
    if (toggle) {
      e.preventDefault();
      const root = toggle.closest('[data-share]');
      if (!root) return;
      if (navigator.share) {
        navigator.share({ title: root.dataset.shareTitle, url: root.dataset.shareUrl }).catch(() => {});
        return;
      }
      const menu = $('[data-share-menu]', root);
      if (menu) {
        const willOpen = menu.hasAttribute('hidden');
        $$('[data-share-menu]').forEach((m) => m.setAttribute('hidden', ''));
        $$('[data-share-toggle]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
        if (willOpen) { menu.removeAttribute('hidden'); toggle.setAttribute('aria-expanded', 'true'); }
      }
      return;
    }
    const copy = e.target.closest('[data-share-copy]');
    if (copy) {
      e.preventDefault();
      const root = copy.closest('[data-share]');
      const label = $('[data-copy-label]', copy) || copy;
      const prev = label.textContent;
      const done = () => { label.textContent = 'Link copied!'; setTimeout(() => { label.textContent = prev; }, 1600); };
      if (navigator.clipboard && root) navigator.clipboard.writeText(root.dataset.shareUrl).then(done).catch(done);
      else done();
      return;
    }
    if (!e.target.closest('[data-share]')) {
      $$('[data-share-menu]').forEach((m) => m.setAttribute('hidden', ''));
      $$('[data-share-toggle]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
    }
  });

  /* Product-card quick-add + size pills */
  document.addEventListener('click', (e) => {
    const size = e.target.closest('[data-card-size]');
    if (size && size.dataset.available !== 'false') {
      const card = size.closest('[data-product-card]');
      $$('[data-card-size]', card).forEach((b) => b.setAttribute('aria-checked', 'false'));
      size.setAttribute('aria-checked', 'true');
      const add = $('[data-card-add]', card);
      if (add) {
        // A size is now chosen — enable adding and switch the label.
        add.dataset.variantId = size.dataset.variantId;
        add.textContent = window.cartStrings ? window.cartStrings.addToCart : 'Add to Cart';
      }
      return;
    }
    const add = e.target.closest('[data-card-add]');
    if (add) {
      e.preventDefault();
      const id = add.dataset.variantId;
      // Sized product with no size chosen → force selection via quick view
      // (prevents auto-adding the default size, which drives wrong-fit RTOs).
      if (!id) {
        const card = add.closest('[data-product-card]');
        const qv = card && card.querySelector('[data-quickview-open]');
        if (qv) qv.click();
        return;
      }
      add.disabled = true;
      if (cart) { cart.open(); showCartLoading(); }
      cartAdd([{ id: Number(id), quantity: 1 }])
        .catch(() => {})
        .finally(() => setTimeout(() => (add.disabled = false), 1200));
    }
  });

  /* Cart qty change / remove (drawer + cart page) */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-qty-change]');
    if (!btn) return;
    e.preventDefault();
    const onCartPage = !!btn.closest('[data-cart-page-form]');
    btn.disabled = true;
    cartChange(btn.dataset.line, Number(btn.dataset.qty))
      .then(() => { if (onCartPage) window.location.reload(); })
      .catch(() => {})
      .finally(() => (btn.disabled = false));
  });

  /* Cart / menu / search open + close triggers */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); cart && cart.open(); }
    if (e.target.closest('[data-cart-close]')) { e.preventDefault(); cart && cart.close(); }
  });
  const cartOverlay = $('[data-cart-overlay]');
  if (cartOverlay) cartOverlay.addEventListener('click', () => cart && cart.close());

  /* ----------------------------------------------------------------------
   * Mobile menu
   * -------------------------------------------------------------------- */
  const menu = makeOverlay({
    root: $('[data-mobile-menu]'),
    overlay: $('[data-mobile-menu-overlay]'),
    panel: $('[data-mobile-menu-panel]'),
    openCls: ['translate-x-0'], closeCls: ['-translate-x-full'],
    ovOpen: ['opacity-100'], ovClose: ['opacity-0'],
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-mobile-menu-open]')) { e.preventDefault(); menu && menu.open(); }
    if (e.target.closest('[data-mobile-menu-close]')) { e.preventDefault(); menu && menu.close(); }
  });
  const menuOverlay = $('[data-mobile-menu-overlay]');
  if (menuOverlay) menuOverlay.addEventListener('click', () => menu && menu.close());

  /* ----------------------------------------------------------------------
   * Search overlay + predictive search
   * -------------------------------------------------------------------- */
  const search = makeOverlay({
    root: $('[data-search-overlay]'),
    overlay: $('[data-search-overlay-bg]'),
    panel: $('[data-search-panel]'),
    openCls: ['translate-y-0', 'opacity-100'], closeCls: ['-translate-y-6', 'opacity-0'],
    ovOpen: ['opacity-100'], ovClose: ['opacity-0'],
    onOpen() { setTimeout(() => { const i = $('[data-predictive-input]'); if (i) i.focus(); }, 80); },
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search-open]')) { e.preventDefault(); menu && menu.close(); search && search.open(); }
    if (e.target.closest('[data-search-close]')) { e.preventDefault(); search && search.close(); }
    const suggest = e.target.closest('[data-search-suggest]');
    if (suggest) { const i = $('[data-predictive-input]'); if (i) { i.value = suggest.dataset.searchSuggest; i.dispatchEvent(new Event('input')); i.focus(); } }
    if (e.target.closest('[data-search-clear]')) { const i = $('[data-predictive-input]'); if (i) { i.value = ''; i.dispatchEvent(new Event('input')); i.focus(); } }
  });
  const searchBg = $('[data-search-overlay-bg]');
  if (searchBg) searchBg.addEventListener('click', () => search && search.close());

  const predInput = $('[data-predictive-input]');
  if (predInput) {
    let t, ctrl;
    predInput.addEventListener('input', () => {
      const q = predInput.value.trim();
      const results = $('[data-predictive-results]');
      const def = $('[data-search-default]');
      const clear = $('[data-search-clear]');
      if (clear) clear.classList.toggle('hidden', q.length === 0);
      clearTimeout(t);
      if (ctrl) ctrl.abort();
      if (q.length < 2) { if (results) results.innerHTML = ''; if (def) def.classList.remove('hidden'); return; }
      if (def) def.classList.add('hidden');
      t = setTimeout(async () => {
        ctrl = new AbortController();
        try {
          const url = routes.predictive_search_url + '?q=' + encodeURIComponent(q) + '&section_id=predictive-search&resources[type]=product&resources[limit]=6';
          const r = await fetch(url, { signal: ctrl.signal });
          const html = await r.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const inner = doc.querySelector('.shopify-section') || doc.body;
          if (results) results.innerHTML = inner.innerHTML;
        } catch (err) { /* aborted */ }
      }, 220);
    });
  }

  /* ----------------------------------------------------------------------
   * Quick view (lazy section render)
   * -------------------------------------------------------------------- */
  const quick = makeOverlay({
    root: $('[data-quickview]'),
    overlay: $('[data-quickview-overlay]'),
    panel: $('[data-quickview-dialog]'),
    openCls: ['translate-y-0', 'scale-100', 'opacity-100'], closeCls: ['translate-y-4', 'scale-[0.98]', 'opacity-0'],
    ovOpen: ['opacity-100'], ovClose: ['opacity-0'],
  });
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quickview-open]');
    if (trigger) {
      e.preventDefault();
      const handle = trigger.dataset.quickviewOpen;
      const content = $('[data-quickview-content]');
      if (content) content.innerHTML = '<div class="flex min-h-[320px] items-center justify-center"><span class="h-6 w-6 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal"></span></div>';
      quick && quick.open();
      fetch('/products/' + handle + '?section_id=quick-view')
        .then((r) => r.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const inner = doc.querySelector('.shopify-section') || doc.body;
          if (content) content.innerHTML = inner.innerHTML;
        })
        .catch(() => { if (content) content.innerHTML = '<p class="p-10 text-center text-sm text-charcoal-muted">Unable to load. Please try again.</p>'; });
    }
    if (e.target.closest('[data-quickview-close]')) { e.preventDefault(); quick && quick.close(); }
  });
  const qvOverlay = $('[data-quickview-overlay]');
  if (qvOverlay) qvOverlay.addEventListener('click', () => quick && quick.close());

  /* ----------------------------------------------------------------------
   * Size guide modal
   * -------------------------------------------------------------------- */
  const sizeGuide = makeOverlay({
    root: $('[data-size-guide]'),
    overlay: $('[data-size-guide-overlay]'),
    panel: $('[data-size-guide-dialog]'),
    openCls: ['translate-y-0', 'opacity-100'], closeCls: ['translate-y-4', 'opacity-0'],
    ovOpen: ['opacity-100'], ovClose: ['opacity-0'],
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-size-guide-open]')) { e.preventDefault(); sizeGuide && sizeGuide.open(); }
    if (e.target.closest('[data-size-guide-close]')) { e.preventDefault(); sizeGuide && sizeGuide.close(); }
  });
  const sgOverlay = $('[data-size-guide-overlay]');
  if (sgOverlay) sgOverlay.addEventListener('click', () => sizeGuide && sizeGuide.close());

  /* ----------------------------------------------------------------------
   * Chat widget
   * -------------------------------------------------------------------- */
  (function chat() {
    const root = $('[data-chat-widget]');
    if (!root) return;
    const panel = $('[data-chat-panel]', root);
    const toggle = $('[data-chat-toggle]', root);
    const iconOpen = $('[data-chat-icon-open]', root);
    const iconClose = $('[data-chat-icon-close]', root);
    const messages = $('[data-chat-messages]', root);
    const wa = root.dataset.whatsapp;
    let open = false;
    const setOpen = (v) => {
      open = v;
      panel.setAttribute('aria-hidden', String(!v));
      panel.classList.toggle('pointer-events-none', !v);
      panel.classList.toggle('opacity-0', !v);
      panel.classList.toggle('translate-y-3', !v);
      panel.classList.toggle('opacity-100', v);
      panel.classList.toggle('translate-y-0', v);
      if (iconOpen) iconOpen.classList.toggle('hidden', v);
      if (iconClose) iconClose.classList.toggle('hidden', !v);
      if (toggle) toggle.setAttribute('aria-expanded', String(v));
    };
    if (toggle) toggle.addEventListener('click', () => setOpen(!open));
    $$('[data-chat-close]', root).forEach((b) => b.addEventListener('click', () => setOpen(false)));
    const openWA = (ctx) => {
      if (!wa) return;
      const text = encodeURIComponent(ctx ? 'Hi Thoda Soft! I need help with: ' + ctx : 'Hi Thoda Soft! I have a question.');
      window.open('https://wa.me/' + wa + '?text=' + text, '_blank');
    };
    $$('[data-chat-whatsapp]', root).forEach((b) => b.addEventListener('click', () => openWA()));
    $$('[data-chat-topic]', root).forEach((b) => b.addEventListener('click', () => {
      const q = document.createElement('div'); q.className = 'flex justify-end';
      q.innerHTML = '<div class="max-w-[85%] rounded-2xl rounded-tr-sm bg-charcoal px-3.5 py-2.5 text-sm text-cream">' + b.textContent.trim() + '</div>';
      const a = document.createElement('div'); a.className = 'max-w-[85%]';
      a.innerHTML = '<div class="rounded-2xl rounded-tl-sm bg-blush/60 px-3.5 py-2.5 text-sm text-charcoal">' + b.dataset.answer + '</div>';
      messages.appendChild(q); messages.appendChild(a);
      messages.scrollTo({ top: messages.scrollHeight });
    }));
  })();

  /* ----------------------------------------------------------------------
   * Collection filters + sort
   * -------------------------------------------------------------------- */
  (function collectionTools() {
    const sort = $('[data-sort]');
    if (sort) sort.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sort.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
    const filtersForm = $('[data-filters-form]');
    if (filtersForm) {
      filtersForm.addEventListener('change', (e) => {
        if (window.innerWidth < 1024) return; // mobile applies via button
        filtersForm.requestSubmit ? filtersForm.requestSubmit() : filtersForm.submit();
      });
      filtersForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        new FormData(filtersForm).forEach((v, k) => {
          if (String(v).trim() !== '') params.append(k, v);
        });
        const qs = params.toString();
        window.location.href = window.location.pathname + (qs ? '?' + qs : '');
      });
    }
    const fRoot = $('[data-filters]');
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-filters-open]') && fRoot) { fRoot.classList.remove('hidden'); fRoot.classList.add('fixed', 'inset-0', 'z-[70]', 'overflow-y-auto', 'bg-cream', 'p-6'); lockScroll(); }
      if (e.target.closest('[data-filters-close]') && fRoot) { fRoot.classList.add('hidden'); fRoot.classList.remove('fixed', 'inset-0', 'z-[70]', 'overflow-y-auto', 'bg-cream', 'p-6'); unlockScroll(); }
    });
  })();

  /* ----------------------------------------------------------------------
   * Product carousel (mobile) pagination dots
   * -------------------------------------------------------------------- */
  $$('[data-carousel]').forEach((car) => {
    const track = $('[data-carousel-track]', car);
    const dotsWrap = $('[data-carousel-dots]', car);
    if (!track || !dotsWrap) return;
    const slides = Array.from(track.children);
    if (slides.length < 2) return;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to item ' + (i + 1));
      dot.className = 'h-1.5 rounded-full transition-all duration-300 ease-soft ' + (i === 0 ? 'w-5 bg-charcoal' : 'w-1.5 bg-charcoal/30');
      dot.addEventListener('click', () => {
        const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        track.scrollTo({ left: slides[i].offsetLeft - pad, behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);
    const update = () => {
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      let best = 0, bestDist = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft - pad - track.scrollLeft); if (d < bestDist) { bestDist = d; best = i; } });
      dots.forEach((d, i) => {
        d.classList.toggle('w-5', i === best); d.classList.toggle('bg-charcoal', i === best);
        d.classList.toggle('w-1.5', i !== best); d.classList.toggle('bg-charcoal/30', i !== best);
      });
    };
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  });

  /* ----------------------------------------------------------------------
   * Reveal-on-scroll (IntersectionObserver)
   * -------------------------------------------------------------------- */
  (function reveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.style.opacity = '1'); return; }
    els.forEach((el) => {
      const targets = el.hasAttribute('data-reveal-stagger') ? Array.from(el.children) : [el];
      targets.forEach((t) => { t.style.opacity = '0'; t.style.transform = 'translateY(24px)'; t.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)'; });
    });
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const targets = el.hasAttribute('data-reveal-stagger') ? Array.from(el.children) : [el];
        targets.forEach((t, i) => { setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'none'; }, i * 110); });
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    els.forEach((el) => io.observe(el));

    // Failsafe: never let the reveal animation leave content permanently hidden.
    // If anything goes wrong (observer never fires, JS hiccup), force everything
    // visible after 2.5s.
    setTimeout(() => {
      els.forEach((el) => {
        const targets = el.hasAttribute('data-reveal-stagger') ? Array.from(el.children) : [el];
        targets.forEach((t) => {
          if (getComputedStyle(t).opacity !== '1') { t.style.opacity = '1'; t.style.transform = 'none'; }
        });
      });
    }, 2500);
  })();

  /* ----------------------------------------------------------------------
   * Hero entrance + parallax + ambient glow (vanilla, no GSAP)
   * -------------------------------------------------------------------- */
  (function hero() {
    const el = $('[data-hero]');
    if (!el) return;
    const set = (sel, style) => $$(sel, el).forEach((n) => Object.assign(n.style, style));
    if (reduceMotion) return;

    // initial hidden states
    set('[data-anim="rule"]', { transform: 'scaleX(0)', transformOrigin: 'left center' });
    set('[data-anim="eyebrow"] > *', { transform: 'translateY(130%)', opacity: '0' });
    // Clip the headline masks ONLY while the line-reveal runs, then release so
    // descenders (e.g. the italic "f" in "softness") are never cut at rest.
    set('[data-line-mask]', { overflow: 'hidden' });
    set('[data-anim="line"]', { transform: 'translateY(115%)' });
    ['standfirst', 'cta', 'credit', 'scroll'].forEach((k) => set('[data-anim="' + k + '"]', { opacity: '0', transform: 'translateY(16px)' }));
    set('[data-anim="frame-primary"]', { clipPath: 'inset(100% 0% 0% 0%)' });
    set('[data-anim="frame-secondary"]', { clipPath: 'inset(0% 0% 100% 0%)', opacity: '0' });
    set('[data-anim="spine"]', { opacity: '0' });

    const ease = 'cubic-bezier(.22,1,.36,1)';
    const anim = (nodes, keyframes, opts) => nodes.forEach((n, i) => {
      try { n.animate(keyframes, Object.assign({ fill: 'forwards', easing: ease }, opts, { delay: (opts.delay || 0) + i * (opts.stagger || 0) })); } catch (e) {}
      // ensure final resting state
      keyframes[keyframes.length - 1] && Object.assign(n.style, finalize(keyframes[keyframes.length - 1]));
    });
    const finalize = (kf) => { const s = {}; Object.keys(kf).forEach((k) => { if (k !== 'offset') s[k] = kf[k]; }); return s; };

    requestAnimationFrame(() => {
      anim($$('[data-anim="rule"]', el), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900 });
      anim($$('[data-anim="eyebrow"] > *', el), [{ transform: 'translateY(130%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 600, delay: 250, stagger: 60 });
      anim($$('[data-anim="line"]', el), [{ transform: 'translateY(115%)' }, { transform: 'translateY(0)' }], { duration: 950, delay: 450, stagger: 100, easing: 'cubic-bezier(.16,1,.3,1)' });
      // Release the mask clip after the lines finish sliding in.
      setTimeout(() => set('[data-line-mask]', { overflow: 'visible' }), 1700);
      anim($$('[data-anim="standfirst"]', el), [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 700, delay: 900 });
      anim($$('[data-anim="cta"]', el), [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay: 1050, stagger: 100 });
      anim($$('[data-anim="frame-primary"]', el), [{ clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }], { duration: 1150, delay: 150 });
      anim($$('[data-anim="frame-secondary"]', el), [{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }], { duration: 1000, delay: 550 });
      anim($$('[data-anim="spine"]', el), [{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 900 });
    });

    // ambient glow drift
    $$('[data-glow]', el).forEach((node, i) => {
      try {
        node.animate(
          i % 2 === 0
            ? [{ transform: 'translate(0,0)' }, { transform: 'translate(8%, -6%)' }, { transform: 'translate(0,0)' }]
            : [{ transform: 'translate(0,0)' }, { transform: 'translate(-10%, 8%)' }, { transform: 'translate(0,0)' }],
          { duration: (9 + i * 2) * 1000, iterations: Infinity, easing: 'ease-in-out' }
        );
      } catch (e) {}
    });

    // scroll parallax
    const photo = $('[data-scroll-photo]', el);
    const text = $('[data-scroll-text]', el);
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
        if (photo) photo.style.transform = 'translateY(' + (-9 * progress) + '%)';
        if (text) text.style.transform = 'translateY(' + (6 * progress) + '%)';
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ----------------------------------------------------------------------
   * Mobile size sheet — pick a size from a product card, then add to cart
   * -------------------------------------------------------------------- */
  const sizeSheet = makeOverlay({
    root: $('[data-size-sheet]'),
    overlay: $('[data-size-sheet-overlay]'),
    panel: $('[data-size-sheet-panel]'),
    openCls: ['translate-y-0'], closeCls: ['translate-y-full'],
    ovOpen: ['opacity-100'], ovClose: ['opacity-0'],
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-mobile-add]');
    if (trigger) {
      e.preventDefault();
      const card = trigger.closest('[data-product-card]');
      if (!card || !sizeSheet) return;
      const title = $('[data-size-sheet-title]');
      const price = $('[data-size-sheet-price]');
      const options = $('[data-size-sheet-options]');
      if (title) title.textContent = card.dataset.productTitle || '';
      if (price) price.textContent = card.dataset.productPrice || '';
      if (options) {
        options.innerHTML = '';
        $$('[data-card-size]', card).forEach((s) => {
          const soldOut = s.dataset.available === 'false';
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = s.textContent.trim();
          b.dataset.sizeAdd = soldOut ? '' : s.dataset.variantId;
          b.disabled = soldOut;
          b.className =
            'flex h-12 w-12 items-center justify-center rounded-full border text-sm uppercase transition ' +
            (soldOut
              ? 'cursor-not-allowed border-charcoal/15 text-charcoal/30 line-through'
              : 'border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream active:scale-95');
          options.appendChild(b);
        });
      }
      sizeSheet.open();
      return;
    }
    if (e.target.closest('[data-size-sheet-close]')) { e.preventDefault(); sizeSheet && sizeSheet.close(); }
    const pick = e.target.closest('[data-size-add]');
    if (pick && pick.dataset.sizeAdd) {
      const id = pick.dataset.sizeAdd;
      sizeSheet && sizeSheet.close();
      cart && cart.open();
      showCartLoading();
      cartAdd([{ id: Number(id), quantity: 1 }]).catch(() => {});
    }
  });
  const sizeSheetOverlay = $('[data-size-sheet-overlay]');
  if (sizeSheetOverlay) sizeSheetOverlay.addEventListener('click', () => sizeSheet && sizeSheet.close());

  /* ----------------------------------------------------------------------
   * Lookbook — "Shop this Look" toggle (reveals the product cards)
   * -------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-shop-look]');
    if (!btn) return;
    const look = btn.closest('[data-look]');
    if (!look) return;
    const panel = look.querySelector('[data-look-products]');
    if (!panel) return;
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    btn.textContent = opening ? 'Hide' : 'Shop this Look';
    if (opening) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ----------------------------------------------------------------------
   * Subtle parallax for [data-parallax] (e.g. lookbook hero image)
   * -------------------------------------------------------------------- */
  (function parallax() {
    const els = $$('[data-parallax]');
    if (!els.length || reduceMotion) return;
    let ticking = false;
    const apply = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.15;
        const offset = (rect.top - vh / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }, { passive: true });
    apply();
  })();

  /* ----------------------------------------------------------------------
   * Size chart unit toggle (inches / centimetres)
   * -------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-size-unit]');
    if (!btn) return;
    const chart = btn.closest('[data-size-chart]');
    if (!chart) return;
    const unit = btn.dataset.sizeUnit;
    $$('[data-size-unit]', chart).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sizeUnit === unit)));
    $$('tbody[data-unit]', chart).forEach((tb) => { tb.hidden = tb.dataset.unit !== unit; });
  });

  /* ----------------------------------------------------------------------
   * Customer address book (edit toggle + delete confirm)
   * -------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const edit = e.target.closest('[data-address-edit]');
    if (edit) {
      e.preventDefault();
      const box = document.getElementById('edit-address-' + edit.dataset.addressEdit);
      if (box) box.classList.toggle('hidden');
    }
    const cancel = e.target.closest('[data-address-edit-cancel]');
    if (cancel) {
      e.preventDefault();
      const box = document.getElementById('edit-address-' + cancel.dataset.addressEditCancel);
      if (box) box.classList.add('hidden');
    }
    const del = e.target.closest('[data-address-delete]');
    if (del) {
      e.preventDefault();
      if (window.confirm(del.dataset.confirmMessage || 'Delete this address?')) {
        fetch(del.dataset.addressDelete, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: '_method=delete',
        }).then(() => window.location.reload());
      }
    }
  });

  /* ----------------------------------------------------------------------
   * Global Escape closes any open overlay
   * -------------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    [cart, menu, search, quick, sizeGuide, sizeSheet].forEach((o) => o && o.isOpen && o.close());
  });
})();
