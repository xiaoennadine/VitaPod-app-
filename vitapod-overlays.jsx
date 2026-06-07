// VitaPod — All Overlay Screens
const { useState, useEffect } = React;

// Inject keyframes once
(function() {
  if (document.getElementById('vp-anim')) return;
  const s = document.createElement('style');
  s.id = 'vp-anim';
  s.textContent = `
    @keyframes vpSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes vpSlideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes vpPopIn { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes vpScanLine { 0%,100% { top: 8%; } 50% { top: 80%; } }
    @keyframes vpPulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  `;
  document.head.appendChild(s);
})();

// ── Shared sub-components ─────────────────────────────────────────────────────
function BackHeader({ title, onBack, rightEl }) {
  return (
    <div style={{ padding: 'max(50px, calc(env(safe-area-inset-top, 0px) + 8px)) 16px 14px', background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, flex: 1 }}>{title}</div>
        {rightEl}
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width: 44, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? C.emerald : C.border, position: 'relative', transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20,
        borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

// ── Product Detail Bottom Sheet ───────────────────────────────────────────────
function ProductDetailSheet({ product, cat, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [g0, g1] = CAT_GRAD[cat.id] || ['#C8C8C8', '#888'];

  function handleAdd() {
    setAdded(true);
    for (let i = 0; i < qty; i++) onAdd(product);
    setTimeout(() => { setAdded(false); onClose(); }, 700);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white',
        borderRadius: '24px 24px 0 0', overflow: 'hidden', animation: 'vpSlideUp 0.32s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        {/* Image area */}
        <div style={{ height: 210, background: `linear-gradient(145deg, ${g0}45 0%, ${g1}55 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 99, background: 'rgba(0,0,0,0.12)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 99, background: 'rgba(255,255,255,0.75)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          {product.img
            ? <img src={product.img} alt={product.name} style={{ maxHeight: '82%', maxWidth: '75%', objectFit: 'contain', filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.2))' }} />
            : <ProductSwatch catId={cat.id} size={110} radius={22} />
          }
        </div>
        {/* Content */}
        <div style={{ padding: '18px 20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: '-0.4px' }}>{product.name}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{product.flavor}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.forest, flexShrink: 0 }}>€{product.price.toFixed(2)}</div>
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
            Carefully crafted with real ingredients — perfect for on-the-go fuel that doesn't compromise on taste.
          </div>
          {/* Nutrition */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {[{ label: 'Protein', val: product.protein }, { label: 'Calories', val: `${product.kcal} kcal` }, { label: 'Sugar', val: 'Low' }].map(n => (
              <div key={n.label} style={{ flex: 1, background: C.bg, borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.forest }}>{n.val}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{n.label}</div>
              </div>
            ))}
          </div>
          {/* Qty + Add */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: C.bg, borderRadius: 12, flexShrink: 0 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ width: 28, textAlign: 'center', fontSize: 15, fontWeight: 700, color: C.dark }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            <button onClick={handleAdd} style={{
              flex: 1, padding: '14px 0', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: added ? C.emerald : C.forest, color: 'white',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit', transition: 'background 0.2s',
            }}>
              {added ? '✓ Added to cart!' : `Add to Cart — €${(product.price * qty).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cart Screen ───────────────────────────────────────────────────────────────
function CartScreen({ cart, onClose, onCheckout }) {
  const [localCart, setLocalCart] = useState({ ...cart });
  const openLocs = window.VP.locations.filter(l => l.status === 'open');
  const [selectedLoc, setSelectedLoc] = useState(openLocs[0] || window.VP.locations[0]);
  const [showLocPicker, setShowLocPicker] = useState(false);

  const localItems = [];
  for (const cat of window.VP.categories) {
    for (const p of cat.products) {
      if (localCart[p.id] > 0) localItems.push({ product: p, qty: localCart[p.id] });
    }
  }
  const subtotal = localItems.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const itemCount = localItems.reduce((s, { qty }) => s + qty, 0);

  function updateQty(id, delta) {
    setLocalCart(c => {
      const n = (c[id] || 0) + delta;
      if (n <= 0) { const { [id]: _, ...rest } = c; return rest; }
      return { ...c, [id]: n };
    });
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 110, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader
        title="Your Cart"
        onBack={() => onClose(localCart)}
        rightEl={itemCount > 0 && (
          <div style={{ background: C.emeraldLight, color: C.forest, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </div>
        )}
      />

      {localItems.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="1.4" strokeLinecap="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.muted }}>Your cart is empty</div>
          <button onClick={() => onClose(null)} style={{ background: C.forest, color: 'white', border: 'none', borderRadius: 99, padding: '11px 26px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}>Browse Menu</button>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {/* Items */}
            <div style={{ background: C.card, margin: '14px 16px 0', borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 12px ${C.shadow}` }}>
              {localItems.map(({ product, qty }, i) => (
                <div key={product.id} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < localItems.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{product.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{product.flavor}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', background: C.bg, borderRadius: 10 }}>
                    <button onClick={() => updateQty(product.id, -1)} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, width: 22, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => updateQty(product.id, 1)} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.forest, minWidth: 48, textAlign: 'right' }}>€{(product.price * qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            {/* Pricing */}
            <div style={{ background: C.card, margin: '12px 16px 0', borderRadius: 18, padding: '14px 16px', boxShadow: `0 2px 12px ${C.shadow}` }}>
              {[['Subtotal', `€${subtotal.toFixed(2)}`], ['Service fee', '€0.00']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>{k}</span>
                  <span style={{ fontSize: 13, color: C.dark }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>Total</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: C.forest }}>€{subtotal.toFixed(2)}</span>
              </div>
            </div>
            {/* Pickup */}
            <div style={{ background: C.card, margin: '12px 16px 0', borderRadius: 18, padding: '14px 16px', boxShadow: `0 2px 12px ${C.shadow}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 3 }}>Pick up at</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{selectedLoc.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{selectedLoc.distance} · Open now</div>
                </div>
                <button onClick={() => setShowLocPicker(true)} style={{ fontSize: 12, color: C.emerald, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Change</button>
              </div>
            </div>
          </div>
          {/* Checkout CTA */}
          <div style={{ padding: '12px 16px 26px', background: C.card, borderTop: `1px solid ${C.border}` }}>
            <button onClick={() => onCheckout(localCart, selectedLoc)} style={{
              width: '100%', padding: '17px 0', borderRadius: 99, border: 'none',
              background: C.forest, color: 'white', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Checkout & Pay →</button>
          </div>

          {/* Location picker sheet */}
          {showLocPicker && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
              <div onClick={() => setShowLocPicker(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.bg, borderRadius: '22px 22px 0 0', animation: 'vpSlideUp 0.28s ease', paddingBottom: 28 }}>
                <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.dark }}>Choose Pod</div>
                  <button onClick={() => setShowLocPicker(false)} style={{ border: 'none', background: C.border, borderRadius: 99, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.muted }}>✕</button>
                </div>
                {window.VP.locations.map((loc, i) => (
                  <div key={loc.id} onClick={() => { if (loc.status === 'open') { setSelectedLoc(loc); setShowLocPicker(false); } }}
                    style={{ padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: loc.status === 'open' ? 'pointer' : 'default', opacity: loc.status === 'open' ? 1 : 0.4, borderBottom: i < window.VP.locations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{loc.address} · {loc.distance}</div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: loc.status === 'open' ? C.emeraldLight : '#F0F0F0', color: loc.status === 'open' ? C.forest : C.muted }}>
                      {loc.status === 'open' ? '● Open' : '○ Closed'}
                    </div>
                    {selectedLoc.id === loc.id && (
                      <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8l4 4 8-8" stroke={C.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Payment Screen ────────────────────────────────────────────────────────────
function PaymentScreen({ cart, onClose, onOrderPlaced }) {
  const [payMethod, setPayMethod] = useState('applepay');
  const [placing, setPlacing] = useState(false);

  const items = [];
  for (const cat of window.VP.categories) {
    for (const p of cat.products) {
      if (cart[p.id] > 0) items.push({ product: p, qty: cart[p.id] });
    }
  }
  const total = items.reduce((s, { product, qty }) => s + product.price * qty, 0);

  function handlePlace() {
    setPlacing(true);
    // Increment stamp count and persist
    const newStamps = Math.min((window.VP.user.stamps || 0) + 1, 10);
    window.VP.user.stamps = newStamps;
    localStorage.setItem('vp_stamps', newStamps);
    setTimeout(onOrderPlaced, 1100);
  }

  const payOptions = [
    { id: 'applepay', label: 'Apple Pay',       sub: 'Touch ID or Face ID', icon: '🍎' },
    { id: 'card',     label: 'Visa •••• 4242',  sub: 'Expires 08/27',       icon: '💳' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 120, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader title="Payment" onBack={onClose} />
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 16px' }}>
        {/* Summary */}
        <div style={{ background: C.card, borderRadius: 18, padding: '14px 16px', marginBottom: 12, boxShadow: `0 2px 12px ${C.shadow}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>Order Summary</div>
          {items.map(({ product, qty }) => (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: C.dark }}>{product.name} × {qty}</span>
              <span style={{ fontSize: 13, color: C.dark }}>€{(product.price * qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.forest }}>€{total.toFixed(2)}</span>
          </div>
        </div>
        {/* Payment method */}
        <div style={{ background: C.card, borderRadius: 18, padding: '14px 16px', boxShadow: `0 2px 12px ${C.shadow}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>Payment Method</div>
          {payOptions.map((m, i) => (
            <div key={m.id} onClick={() => setPayMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i === 0 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 22, width: 32 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{m.label}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{m.sub}</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${payMethod === m.id ? C.emerald : C.border}`, background: payMethod === m.id ? C.emerald : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {payMethod === m.id && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 16px 26px', background: C.card, borderTop: `1px solid ${C.border}` }}>
        <button onClick={handlePlace} style={{
          width: '100%', padding: '17px 0', borderRadius: 99, border: 'none',
          background: placing ? C.emerald : C.forest, color: 'white',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.3s',
        }}>{placing ? '⏳ Processing…' : 'Place Order'}</button>
      </div>
    </div>
  );
}

// ── Order Confirmed Screen ────────────────────────────────────────────────────
function OrderConfirmedScreen({ onDone, onShowQR }) {
  const [view, setView] = useState('confirmed'); // 'confirmed' | 'track'
  const [trackStep, setTrackStep] = useState(0);
  const orderNum = 'VP-2847';
  const code = '2847';

  useEffect(() => {
    if (view !== 'track') return;
    const t1 = setTimeout(() => setTrackStep(1), 1400);
    const t2 = setTimeout(() => setTrackStep(2), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  if (view === 'track') {
    const steps = ['Confirmed', 'Preparing', 'Ready for pickup'];
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: C.bg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '54px 16px 12px', background: C.card, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.dark }}>Track Order</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>#{orderNum}</div>
        </div>
        <div style={{ flex: 1, padding: '24px 20px' }}>
          <div style={{ background: C.card, borderRadius: 20, padding: '22px 20px', boxShadow: `0 4px 20px ${C.shadow}`, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>Pickup code</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: C.forest, letterSpacing: 6 }}>{code}</div>
            </div>
            {steps.map((step, i) => {
              const done = i <= trackStep;
              const active = i === trackStep;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 99, background: done ? C.emerald : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.5s', boxShadow: active ? `0 0 0 5px ${C.emeraldLight}` : 'none', flexShrink: 0 }}>
                      {done && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    {i < steps.length - 1 && <div style={{ width: 2, height: 32, background: done && i < trackStep ? C.emerald : C.border, transition: 'background 0.6s', marginTop: 2 }} />}
                  </div>
                  <div style={{ paddingTop: 4, paddingBottom: i < steps.length - 1 ? 22 : 0 }}>
                    <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: done ? C.dark : C.muted }}>{step}</div>
                    {active && i < steps.length - 1 && <div style={{ fontSize: 11, color: C.emerald, marginTop: 2, animation: 'vpPulse 1.5s ease-in-out infinite' }}>In progress…</div>}
                    {active && i === steps.length - 1 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, lineHeight: 1.6 }}>Go to your Pod and scan the QR code — the machine will dispense your order.</div>
                        <button onClick={onShowQR} style={{ background: C.emerald, color: C.dark, border: 'none', borderRadius: 99, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/></svg>
                          Show my QR code →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ padding: '12px 20px 26px' }}>
          <button onClick={onDone} style={{ width: '100%', padding: '15px 0', borderRadius: 99, border: 'none', background: C.forest, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: '#1B3D2F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px' }}>
      <div style={{ width: 88, height: 88, borderRadius: 99, background: 'rgba(92,204,138,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, animation: 'vpPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ width: 60, height: 60, borderRadius: 99, background: '#5CCC8A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 28 28"><path d="M5 14l6 6 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: 'white', textAlign: 'center', letterSpacing: '-0.5px', marginBottom: 4 }}>Order Confirmed!</div>
      <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.5)', marginBottom: 30 }}>#{orderNum}</div>
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 32px', width: '100%', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'rgba(245,237,214,0.55)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Your pickup code</div>
        <div style={{ fontSize: 54, fontWeight: 800, color: '#5CCC8A', letterSpacing: 10, lineHeight: 1 }}>{code}</div>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.65)', textAlign: 'center', lineHeight: 1.65, marginBottom: 30 }}>
        Head to your Pod and enter the code on the machine touchscreen — or hold your phone up to the scanner.
      </div>
      <button onClick={() => { setTrackStep(0); setView('track'); }} style={{ width: '100%', padding: '16px 0', borderRadius: 99, border: 'none', background: '#5CCC8A', color: '#1B3D2F', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>Track my order</button>
      <button onClick={onDone} style={{ width: '100%', padding: '14px 0', borderRadius: 99, border: '1.5px solid rgba(245,237,214,0.25)', background: 'none', color: 'rgba(245,237,214,0.75)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Back to home</button>
    </div>
  );
}

// ── QR Scanner Screen ─────────────────────────────────────────────────────────
function QRScannerScreen({ onClose, onScan }) {
  const [torch, setTorch] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleTap() {
    if (scanning || success) return;
    setScanning(true);
    setTimeout(() => {
      setSuccess(true);
      setTimeout(onScan, 1000);
    }, 1600);
  }

  const corners = [
    { top: 0, left: 0, borderTop: 3, borderLeft: 3, borderRadius: '5px 0 0 0' },
    { top: 0, right: 0, borderTop: 3, borderRight: 3, borderRadius: '0 5px 0 0' },
    { bottom: 0, left: 0, borderBottom: 3, borderLeft: 3, borderRadius: '0 0 0 5px' },
    { bottom: 0, right: 0, borderBottom: 3, borderRight: 3, borderRadius: '0 0 5px 0' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Close */}
      <button onClick={onClose} style={{ position: 'absolute', top: 56, right: 20, width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

      <div style={{ color: 'white', fontSize: 15, fontWeight: 600, textAlign: 'center', marginBottom: 28, letterSpacing: '-0.2px' }}>
        Point at your VitaPod machine
      </div>

      {/* Scanner frame */}
      <div onClick={handleTap} style={{ width: 224, height: 224, position: 'relative', cursor: scanning ? 'default' : 'pointer' }}>
        {/* corner brackets */}
        {corners.map((c, i) => {
          const { borderTop, borderLeft, borderRight, borderBottom, borderRadius, ...pos } = c;
          return (
            <div key={i} style={{
              position: 'absolute', width: 28, height: 28,
              borderColor: success ? '#5CCC8A' : '#5CCC8A', borderStyle: 'solid',
              borderTopWidth: borderTop || 0, borderLeftWidth: borderLeft || 0,
              borderRightWidth: borderRight || 0, borderBottomWidth: borderBottom || 0,
              borderRadius, ...pos, transition: 'border-color 0.3s',
            }} />
          );
        })}
        {/* scan line */}
        {scanning && !success && (
          <div style={{ position: 'absolute', left: 12, right: 12, height: 2, background: `linear-gradient(90deg, transparent, ${C.emerald}, transparent)`, animation: 'vpScanLine 1.4s ease-in-out infinite' }} />
        )}
        {/* success overlay */}
        {success && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(92,204,138,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 99, background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'vpPopIn 0.35s ease' }}>
              <svg width="26" height="26" viewBox="0 0 26 26"><path d="M4 13l6 6 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </div>
          </div>
        )}
        {/* tap hint */}
        {!scanning && !success && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Tap to simulate scan</span>
          </div>
        )}
      </div>

      <div style={{ color: 'rgba(200,210,200,0.65)', fontSize: 13, textAlign: 'center', marginTop: 22, lineHeight: 1.55 }}>
        Scan the QR code to unlock your order
      </div>

      {/* Torch */}
      <button onClick={() => setTorch(t => !t)} style={{ position: 'absolute', bottom: 60, left: 32, width: 50, height: 50, borderRadius: 99, background: torch ? '#5CCC8A' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill={torch ? '#1B3D2F' : 'white'}>
          <path d="M9 2l2 6H7l5 14 2-8h4L9 2z"/>
        </svg>
      </button>
    </div>
  );
}

// ── Order Ready Screen ────────────────────────────────────────────────────────
function OrderReadyScreen({ onClose }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 160, background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 'max(50px, calc(env(safe-area-inset-top, 0px) + 8px)) 16px 14px', background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.dark }}>Order Ready</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, textAlign: 'center', marginBottom: 8 }}>Machine unlocked!</div>
        <div style={{ fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>Teriyaki Chicken Bowl is ready at Mitte Gym & Spa.</div>
        <div style={{ background: C.card, borderRadius: 20, padding: '22px 32px', boxShadow: `0 4px 24px ${C.shadow}`, width: '100%', textAlign: 'center', marginBottom: 26 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Your pickup code</div>
          <div style={{ fontSize: 54, fontWeight: 800, color: C.forest, letterSpacing: 8, lineHeight: 1 }}>2847</div>
        </div>
        <div style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 1.65 }}>
          Enter this code on the machine touchscreen or hold your phone up to the scanner.
        </div>
      </div>
      <div style={{ padding: '12px 24px 30px' }}>
        <button onClick={onClose} style={{ width: '100%', padding: '15px 0', borderRadius: 99, border: 'none', background: C.forest, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
      </div>
    </div>
  );
}

// ── Settings: Payment Methods ─────────────────────────────────────────────────
function PaymentMethodsScreen({ onBack }) {
  const [appleOn, setAppleOn] = useState(true);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader title="Payment Methods" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px' }}>
        {/* Apple Pay */}
        <div style={{ background: C.card, borderRadius: 18, padding: '14px 16px', marginBottom: 12, boxShadow: `0 2px 12px ${C.shadow}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🍎</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Apple Pay</div>
            <div style={{ fontSize: 11, color: C.muted }}>Tap to pay with Face ID</div>
          </div>
          <Toggle on={appleOn} onToggle={() => setAppleOn(v => !v)} />
        </div>
        {/* Cards */}
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 12px ${C.shadow}` }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 22 }}>💳</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Visa •••• 4242</div>
              <div style={{ fontSize: 11, color: C.muted }}>Expires 08/27</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: 99, background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </div>
          </div>
          <button style={{ width: '100%', padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>Add new card +</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Settings: Notifications ───────────────────────────────────────────────────
function NotificationsScreen({ onBack }) {
  const [notifs, setNotifs] = useState({ offers: true, orders: true, rewards: true, locations: false, digest: false });
  const items = [
    { key: 'offers',    label: 'Special Offers & Deals' },
    { key: 'orders',    label: 'Order Updates' },
    { key: 'rewards',   label: 'Rewards & Points' },
    { key: 'locations', label: 'New Pod Locations' },
    { key: 'digest',    label: 'Weekly Digest' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader title="Notifications" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px' }}>
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 12px ${C.shadow}` }}>
          {items.map((item, i) => (
            <div key={item.key} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 14, color: C.dark }}>{item.label}</span>
              <Toggle on={notifs[item.key]} onToggle={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Settings: Language ────────────────────────────────────────────────────────
function LanguageScreen({ onBack }) {
  const [lang, setLang] = useState('en');
  const langs = [{ id: 'en', label: 'English' }, { id: 'de', label: 'Deutsch' }];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader title="Language" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px' }}>
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 12px ${C.shadow}`, marginBottom: 14 }}>
          {langs.map((l, i) => (
            <div key={l.id} onClick={() => setLang(l.id)} style={{ padding: '15px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: i === 0 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 14, color: C.dark }}>{l.label}</span>
              <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${lang === l.id ? C.emerald : C.border}`, background: lang === l.id ? C.emerald : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lang === l.id && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted, textAlign: 'center' }}>More languages coming soon.</div>
      </div>
    </div>
  );
}

// ── Settings: Help & Support ──────────────────────────────────────────────────
function HelpSupportScreen({ onBack }) {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'How do I use a VitaPod machine?', a: 'Scan the QR code on the machine with the app, or type your pickup code on the touchscreen. Collect your item from the dispensing slot below.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 minutes of placing them. Tap your active order in the home screen and select "Cancel order".' },
    { q: 'What if the machine is out of stock?', a: "You'll receive a full refund automatically within 1–3 business days. We'll also send a notification so you can pick another location." },
    { q: 'How do Rewards points work?', a: 'You earn 1 point per €0.10 spent. Points accumulate towards your tier (Seed → Sprout → Bloom) and can be redeemed for free items.' },
    { q: 'How do I report a problem?', a: 'Use the Contact us button below. Our support team is available Mon–Fri, 8am–8pm CET and will respond within 24 hours.' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader title="Help & Support" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px' }}>
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 12px ${C.shadow}`, marginBottom: 14 }}>
          {faqs.map((faq, i) => (
            <div key={i}>
              <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, flex: 1, paddingRight: 10 }}>{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {open === i && (
                <div style={{ padding: '12px 16px 14px', background: '#FAFCFA', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
          {/* No border on last if not open */}
        </div>
        <a href="mailto:support@vitapod.com" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', padding: '15px 0', borderRadius: 99, border: 'none', background: C.forest, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Contact us
          </button>
        </a>
      </div>
    </div>
  );
}

// ── Settings: Privacy Policy ──────────────────────────────────────────────────
function PrivacyPolicyScreen({ onBack }) {
  const sections = [
    { title: '1. Information We Collect', body: 'We collect information you provide directly: name, email address, and payment details. We also collect usage data including orders, app interactions, and location data when you use the Pod finder.' },
    { title: '2. How We Use Your Data', body: 'Your data is used to process orders, personalise your experience, send relevant offers and notifications, and improve our services. We never sell your personal data to third parties.' },
    { title: '3. Data Sharing', body: 'We share data only with trusted service providers required to fulfil orders (payment processors, logistics partners) and as required by applicable law.' },
    { title: '4. Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@vitapod.com to exercise these rights.' },
    { title: '5. Cookies & Tracking', body: 'The VitaPod app uses analytics tools to understand how our service is used. No personally identifiable information is shared with analytics providers.' },
    { title: '6. Data Retention', body: 'We retain your data for as long as your account is active or as needed to provide services. You may request account deletion at any time.' },
    { title: '7. Contact', body: 'For privacy questions, contact our DPO at dpo@vitapod.com · VitaPod GmbH, Alexanderplatz 1, 10178 Berlin, Germany.' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideRight 0.25s ease' }}>
      <BackHeader title="Privacy Policy" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 20px 32px' }}>
        {sections.map(sec => (
          <div key={sec.title} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{sec.title}</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.75 }}>{sec.body}</div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: C.muted, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>Last updated: June 2026</div>
      </div>
    </div>
  );
}

// ── QR Block helper ───────────────────────────────────────────────────────────
function QRBlock({ value = '', size = 168 }) {
  const G = 25;
  const cell = Math.floor(size / G);
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = (((h << 5) + h) ^ value.charCodeAt(i)) >>> 0;

  const dark = [];
  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      const tlR = r < 7 && c < 7;
      const trR = r < 7 && c >= G - 7;
      const blR = r >= G - 7 && c < 7;
      let filled = false;
      if (tlR) {
        filled = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else if (trR) {
        const fc = c - (G - 7);
        filled = r === 0 || r === 6 || fc === 0 || fc === 6 || (r >= 2 && r <= 4 && fc >= 2 && fc <= 4);
      } else if (blR) {
        const fr = r - (G - 7);
        filled = fr === 0 || fr === 6 || c === 0 || c === 6 || (fr >= 2 && fr <= 4 && c >= 2 && c <= 4);
      } else {
        // alignment pattern at 18,18
        const inA = r >= 16 && r <= 20 && c >= 16 && c <= 20;
        if (inA) {
          const fr = r - 16, fc = c - 16;
          filled = fr === 0 || fr === 4 || fc === 0 || fc === 4 || (fr === 2 && fc === 2);
        } else {
          const seed = ((r * 31 + c) ^ h) >>> 0;
          filled = !!((((seed * 1664525 + 1013904223) >>> 0) >>> 16) & 1);
        }
      }
      if (filled) dark.push({ r, c });
    }
  }
  const W = cell * G;
  return (
    <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} style={{ display: 'block' }}>
      <rect width={W} height={W} fill="white" />
      {dark.map(({ r, c }) => (
        <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1B3D2F" />
      ))}
    </svg>
  );
}

// ── Loyalty QR Screen ─────────────────────────────────────────────────────────
function LoyaltyQRScreen({ onClose }) {
  const [tab, setTab] = useState('loyalty');
  const u = window.VP.user;

  const tabs = [
    { id: 'loyalty', label: 'My Loyalty QR' },
    { id: 'collect', label: 'Collect Order' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 150, background: C.bg, display: 'flex', flexDirection: 'column', animation: 'vpSlideUp 0.3s cubic-bezier(0.34,1.1,0.64,1)' }}>
      {/* Header */}
      <div style={{ padding: '54px 16px 0', background: C.card, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2.2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.dark }}>My QR</div>
        </div>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? C.forest : C.muted,
              borderBottom: tab === t.id ? `2.5px solid ${C.emerald}` : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Loyalty QR tab */}
      {tab === 'loyalty' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 28px', gap: 0 }}>
          <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 24, lineHeight: 1.65, maxWidth: 240 }}>
            Scan at any VitaPod machine before ordering to earn points.
          </div>
          {/* QR card */}
          <div style={{ background: 'white', borderRadius: 22, padding: 18, boxShadow: `0 6px 28px ${C.shadow}`, marginBottom: 24 }}>
            <QRBlock value={u.name + '-loyalty-vitapod'} size={172} />
          </div>
          {/* User info */}
          <div style={{ fontSize: 18, fontWeight: 800, color: C.dark, marginBottom: 4 }}>{u.name}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.forest, marginBottom: 10 }}>{u.points} pts</div>
          <TierBadge tier={u.tier} />
        </div>
      )}

      {/* Collect Order tab */}
      {tab === 'collect' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 28px', gap: 0 }}>
          <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 24, lineHeight: 1.65, maxWidth: 240 }}>
            Show this QR at the Pod to collect your pre-ordered items.
          </div>
          {/* QR card */}
          <div style={{ background: 'white', borderRadius: 22, padding: 18, boxShadow: `0 6px 28px ${C.shadow}`, marginBottom: 24 }}>
            <QRBlock value={'VP-2847-collect'} size={172} />
          </div>
          {/* Pickup code */}
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>Pickup code</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: C.forest, letterSpacing: 8, lineHeight: 1 }}>2847</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>Order #VP-2847 · Mitte Gym &amp; Spa</div>
        </div>
      )}
    </div>
  );
}

// ── Tier Info Modal ───────────────────────────────────────────────────────────
function TierModal({ onClose }) {
  const tiers = [
    { name: 'Seed',   emoji: '🌱', pts: '0–199 pts',  perks: ['Access to all VitaPod machines', 'Order tracking', 'Stamp card rewards'] },
    { name: 'Sprout', emoji: '🌿', pts: '200–499 pts', perks: ['5% discount on all orders', 'Early access to new products', 'Everything in Seed'] },
    { name: 'Bloom',  emoji: '🌸', pts: '500+ pts',    perks: ['Free item every month', 'Priority stock alerts', 'Exclusive seasonal items', 'Everything in Sprout'] },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.4)' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ background: C.bg, borderRadius: '22px 22px 0 0', paddingBottom: 28, position: 'relative', animation: 'vpSlideUp 0.3s ease' }}>
        <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.dark }}>Reward Tiers</div>
          <button onClick={onClose} style={{ border: 'none', background: C.border, borderRadius: 99, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.muted }}>✕</button>
        </div>
        {tiers.map(tier => (
          <div key={tier.name} style={{ margin: '0 16px 10px', background: C.card, borderRadius: 16, padding: '14px 16px', boxShadow: `0 2px 10px ${C.shadow}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{tier.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.dark }}>{tier.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{tier.pts}</div>
              </div>
            </div>
            {tier.perks.map(perk => (
              <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke={C.emerald} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                <span style={{ fontSize: 12, color: C.muted }}>{perk}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notification Panel ────────────────────────────────────────────────────────
function NotificationPanel({ onClose }) {
  const notifs = [
    {
      id: 'n1', icon: '🎉', title: 'Limited offer — ends today!',
      body: 'Buy 2 Bowls, get a Coffee free. Available at all pods until midnight.',
      time: '2 min ago', unread: true,
    },
    {
      id: 'n2', icon: '⭐', title: 'You\'re close to Sprout tier!',
      body: 'Just 85 more points and you\'ll unlock Sprout rewards.',
      time: '1 h ago', unread: true,
    },
    {
      id: 'n3', icon: '📦', title: 'New arrivals in your area',
      body: 'Matcha Protein Cake and Oat-Milk Chocolate just landed at Mitte Pod.',
      time: 'Yesterday', unread: false,
    },
    {
      id: 'n4', icon: '✅', title: 'Order collected',
      body: 'Your Teriyaki Chicken Bowl was collected at FitBase Berlin. Enjoy!',
      time: '2 days ago', unread: false,
    },
  ];

  const [read, setRead] = React.useState([]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: C.bg, borderRadius: '24px 24px 0 0',
        animation: 'vpSlideUp 0.3s cubic-bezier(0.34,1.1,0.64,1)',
        maxHeight: '80%', display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: C.border }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 14px', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.dark }}>Notifications</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Done</button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 16px 32px' }}>
          {notifs.map(n => {
            const isRead = read.includes(n.id);
            const unread = n.unread && !isRead;
            return (
              <div key={n.id} onClick={() => setRead(r => [...r, n.id])} style={{
                display: 'flex', gap: 12, padding: '13px 14px', borderRadius: 16, marginBottom: 8,
                background: unread ? C.emeraldLight : C.card,
                cursor: 'pointer', transition: 'background 0.2s',
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: unread ? C.emerald + '33' : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: unread ? 700 : 600, color: C.dark, lineHeight: 1.3 }}>{n.title}</div>
                    {unread && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.emerald, flexShrink: 0, marginTop: 3 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 4 }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: C.border, fontWeight: 600 }}>{n.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ProductDetailSheet, CartScreen, PaymentScreen, OrderConfirmedScreen,
  QRScannerScreen, OrderReadyScreen, LoyaltyQRScreen,
  PaymentMethodsScreen, NotificationsScreen, LanguageScreen, HelpSupportScreen, PrivacyPolicyScreen,
  TierModal, NotificationPanel,
});
