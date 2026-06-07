// VitaPod — shared UI components
const { useState, useEffect, useRef } = React;

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:           '#F9FAF4',
  dark:         '#0F231D',
  forest:       '#1B3D2F',
  emerald:      '#5CCC8A',
  emeraldLight: '#E8F8EF',
  muted:        '#7A8C82',
  card:         '#FFFFFF',
  border:       '#E4EBE6',
  shadow:       'rgba(15,35,29,0.07)',
};

// Category gradient pairs [light, dark]
const CAT_GRAD = {
  'protein-coffee':  ['#E8C89A', '#B8762A'],
  'protein-shakes':  ['#C4B4E8', '#7B5BAA'],
  'macro-mocktails': ['#F4B8A8', '#D46A5A'],
  'rice-bowls':      ['#A8CCAA', '#4A8A62'],
  'tapas':           ['#EAC4A0', '#C47840'],
  'baked-goods':     ['#ECD4A0', '#C4A040'],
  'cakes':           ['#EAB4CC', '#C47090'],
  'chocolate':       ['#BEA898', '#7A4830'],
};

// ── Logo ──────────────────────────────────────────────────────────────────────
// Shared pill icon SVG — 3D capsule with top shadow indent
function PillMark({ width = 26, height = 14 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 22" fill="none">
      {/* True ellipse body — not a rectangle */}
      <ellipse cx="20" cy="11" rx="20" ry="11" fill="#5CCC8A"/>
      {/* Darker top shadow — the concave indent seen from above */}
      <ellipse cx="20" cy="5" rx="17" ry="8.5" fill="rgba(6,40,18,0.30)"/>
      {/* White concave arc — the 3D rim detail */}
      <path d="M9 9 Q20 14 31 9" stroke="rgba(255,255,255,0.58)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function VitaPodLogo({ size = 24 }) {
  const h = Math.round(size * 1.6);
  return (
    <div style={{ background: '#1B3D2F', borderRadius: 8, padding: '4px 10px', display: 'inline-flex', alignItems: 'center' }}>
      <img
        src={(window.vpAsset || (x=>x))("vitapod-logo.png")}
        alt="VitaPod"
        style={{ height: h, width: 'auto', display: 'block' }}
      />
    </div>
  );
}

// ── Product visual placeholder ────────────────────────────────────────────────
function ProductSwatch({ catId, size = 80, radius = 18 }) {
  const [g0, g1] = CAT_GRAD[catId] || ['#C8C8C8', '#888'];
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(145deg, ${g0} 0%, ${g1} 100%)`,
    }}>
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: '35%', height: '28%', borderRadius: '50%',
        background: 'rgba(255,255,255,0.28)',
      }} />
    </div>
  );
}

// ── Card — featured (home carousel) ──────────────────────────────────────────
function FeaturedCard({ product, cat, onAdd, onTap }) {
  const [g0, g1] = CAT_GRAD[cat.id] || ['#C8C8C8', '#888'];
  const [added, setAdded] = useState(false);
  const handle = () => { setAdded(true); onAdd?.(product); setTimeout(() => setAdded(false), 1200); };
  return (
    <div onClick={() => onTap?.(product, cat)} style={{
      width: 180, flexShrink: 0, borderRadius: 20, overflow: 'hidden',
      background: C.card, boxShadow: `0 4px 20px ${C.shadow}`, cursor: 'pointer',
    }}>
      <div style={{
        height: 140, background: `linear-gradient(145deg, ${g0}30 0%, ${g1}40 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        padding: 10,
      }}>
        {product.img && <img src={product.img} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />}
        <div style={{
          position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 600,
          background: 'rgba(255,255,255,0.85)', borderRadius: 99, padding: '2px 8px',
          color: C.muted, letterSpacing: '0.3px',
        }}>{cat.short}</div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{product.name}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{product.flavor}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.forest }}>€{product.price.toFixed(2)}</span>
          <button onClick={(e) => { e.stopPropagation(); handle(); }} style={{
            background: added ? C.emerald : C.dark, color: 'white', border: 'none',
            borderRadius: 99, fontSize: 11, fontWeight: 600,
            padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}>
            {added ? '✓ Added' : 'Grab it →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card — product grid ───────────────────────────────────────────────────────
function ProductCard({ product, cat, onAdd, onTap }) {
  const [g0, g1] = CAT_GRAD[cat.id] || ['#C8C8C8', '#888'];
  const [added, setAdded] = useState(false);
  const handle = () => { setAdded(true); onAdd?.(product); setTimeout(() => setAdded(false), 1000); };
  const tagColors = {
    bestseller: { bg: '#FFF3D4', color: '#B87A00' },
    new:        { bg: C.emeraldLight, color: C.forest },
    vegan:      { bg: '#E8F4F8', color: '#2A6A88' },
  };
  const tc = product.tag ? tagColors[product.tag] : null;
  return (
    <div onClick={() => onTap?.(product, cat)} style={{ background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: `0 2px 12px ${C.shadow}`, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <div style={{
        height: 140, background: `linear-gradient(145deg, ${g0}28 0%, ${g1}35 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        padding: 8,
      }}>
        {product.img && <img src={product.img} alt={product.name} style={{ height: 108, width: 108, objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.12))' }} />}
        {tc && (
          <div style={{
            position: 'absolute', top: 7, right: 7,
            background: tc.bg, color: tc.color,
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, letterSpacing: '0.4px', textTransform: 'uppercase',
          }}>{product.tag === 'bestseller' ? '★ Best' : product.tag}</div>
        )}
      </div>
      <div style={{ padding: '10px 11px 11px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, lineHeight: 1.25 }}>{product.name}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{product.flavor}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: C.forest }}>€{product.price.toFixed(2)}</span>
          <button onClick={(e) => { e.stopPropagation(); handle(); }} style={{
            background: added ? C.emerald : C.dark, color: 'white', border: 'none',
            width: 26, height: 26, borderRadius: 99, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s',
            fontFamily: 'inherit',
          }}>
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Category chip ─────────────────────────────────────────────────────────────
function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 15px', borderRadius: 99, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
      background: active ? C.dark : C.card, color: active ? 'white' : C.muted,
      fontSize: 12, fontWeight: active ? 600 : 400,
      boxShadow: active ? 'none' : `0 1px 4px ${C.shadow}`,
      transition: 'all 0.15s', fontFamily: 'inherit',
    }}>{label}</button>
  );
}

// ── Bottom tab bar ────────────────────────────────────────────────────────────
const TAB_ICONS = {
  home: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z" fill={a ? C.forest : 'none'} stroke={a ? C.forest : C.muted} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 22V14h6v8" stroke={a ? 'white' : C.muted} strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  ),
  menu: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill={a ? C.forest : 'none'} stroke={a ? C.forest : C.muted} strokeWidth="1.7"/>
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill={a ? C.emerald : 'none'} stroke={a ? C.emerald : C.muted} strokeWidth="1.7"/>
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill={a ? C.emerald : 'none'} stroke={a ? C.emerald : C.muted} strokeWidth="1.7"/>
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill={a ? C.forest : 'none'} stroke={a ? C.forest : C.muted} strokeWidth="1.7"/>
    </svg>
  ),
  map: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" fill={a ? C.forest : 'none'} stroke={a ? C.forest : C.muted} strokeWidth="1.8"/>
      <circle cx="12" cy="8" r="2.2" fill={a ? C.emerald : C.muted}/>
    </svg>
  ),
  rewards: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.7 5.74 6.3.92-4.56 4.44 1.08 6.28L12 16.26 6.48 19.38l1.08-6.28L3 8.66l6.3-.92z" fill={a ? C.forest : 'none'} stroke={a ? C.forest : C.muted} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  profile: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7.5" r="3.8" fill={a ? C.forest : 'none'} stroke={a ? C.forest : C.muted} strokeWidth="1.8"/>
      <path d="M3 21c0-4.418 4.03-7.5 9-7.5s9 3.082 9 7.5" stroke={a ? C.forest : C.muted} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

function TabBar({ active, onChange, cartCount }) {
  const tabs = [
    { id: 'home',    label: 'Home' },
    { id: 'menu',    label: 'Menu' },
    { id: 'map',     label: 'Pods' },
    { id: 'rewards', label: 'Loyalty' },
    { id: 'profile', label: 'Me' },
  ];
  return (
    <div style={{ flexShrink: 0, background: 'rgba(249,250,244,0.97)' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        borderTop: `1px solid ${C.border}`,
      }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          padding: '10px 0 4px', border: 'none', background: 'none', cursor: 'pointer',
          position: 'relative',
        }}>
          {TAB_ICONS[tab.id](active === tab.id)}
          {tab.id === 'menu' && cartCount > 0 && (
            <div style={{
              position: 'absolute', top: 7, right: '50%', transform: 'translateX(8px)',
              background: '#E84040', color: 'white', fontSize: 8, fontWeight: 700,
              width: 14, height: 14, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</div>
          )}
          <span style={{ fontSize: 9.5, fontWeight: active === tab.id ? 600 : 400, color: active === tab.id ? C.forest : C.muted }}>
            {tab.label}
          </span>
        </button>
      ))}
      </div>
      {/* Spacer fills home-indicator zone so iOS infers cream bottom color */}
      <div style={{ height: 'max(20px, env(safe-area-inset-bottom, 34px))', background: 'rgba(249,250,244,0.97)' }} />
    </div>
  );
}

// ── Circular progress ─────────────────────────────────────────────────────────
function RingProgress({ value, max, size = 148 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={size * 0.065}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.emerald} strokeWidth={size * 0.065}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}/>
    </svg>
  );
}

// ── Stamp card ────────────────────────────────────────────────────────────────
function StampRow({ filled, total = 10, stampItems = [], stampImages = [], reward = 'Carrot & Walnut Cake', rewardImg = '' }) {
  const [active, setActive] = useState(null);
  const asset = window.vpAsset || (x => x);

  useEffect(() => {
    if (!document.getElementById('stamp-kf')) {
      const s = document.createElement('style');
      s.id = 'stamp-kf';
      s.textContent = `
        @keyframes stampIn{0%{transform:scale(0) rotate(-18deg);opacity:0}65%{transform:scale(1.12) rotate(3deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        @keyframes tipIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `;
      document.head.appendChild(s);
    }
  }, []);

  const label = active !== null ? stampItems[active] : null;
  const pct = Math.round((filled / total) * 100);

  return (
    <div>
      {/* 5 × 2 photo stamp grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, maxWidth: 340, margin: '0 auto', position: 'relative' }}>
        {Array.from({ length: total }).map((_, i) => {
          const isFilled = i < filled;
          const isActive = active === i;
          const img = stampImages[i] ? asset(stampImages[i]) : null;
          const isLast = i === total - 1;

          return (
            <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Tooltip */}
              {isActive && label && (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
                  transform: 'translateX(-50%)',
                  background: C.forest, color: 'white', fontSize: 10, fontWeight: 700,
                  padding: '5px 10px', borderRadius: 8, whiteSpace: 'nowrap',
                  animation: 'tipIn 0.15s ease', zIndex: 30,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)', pointerEvents: 'none',
                }}>
                  {label}
                  <div style={{ position: 'absolute', bottom: -4, left: '50%', width: 8, height: 8, background: C.forest, transform: 'translateX(-50%) rotate(45deg)', borderRadius: 1 }} />
                </div>
              )}

              {/* Stamp circle */}
              <div
                onClick={() => isFilled ? setActive(active === i ? null : i) : null}
                style={{
                  width: '100%', aspectRatio: '1', borderRadius: '50%',
                  overflow: 'hidden',
                  border: isFilled
                    ? isLast ? '2.5px solid #FFD060' : `2.5px solid ${C.emerald}`
                    : `1.5px dashed ${C.border}`,
                  cursor: isFilled ? 'pointer' : 'default',
                  transform: isActive ? 'scale(1.14)' : 'scale(1)',
                  boxShadow: isActive
                    ? `0 0 0 4px ${C.emerald}44, 0 6px 20px rgba(0,0,0,0.18)`
                    : isFilled ? '0 2px 10px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                  animation: isFilled ? `stampIn 0.38s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.045}s both` : 'none',
                  position: 'relative',
                  background: isFilled ? 'white' : C.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isFilled && img
                  ? <img src={img} alt={stampItems[i] || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : isFilled
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2.8" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    : <span style={{ fontSize: 11, fontWeight: 700, color: C.border }}>{i + 1}</span>
                }
              </div>

              {/* Green checkmark badge on photo stamps */}
              {isFilled && img && (
                <div style={{
                  position: 'absolute', bottom: 1, right: '10%',
                  width: 16, height: 16, borderRadius: '50%',
                  background: isLast ? '#C47800' : C.emerald,
                  border: '1.5px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <svg width="8" height="8" viewBox="0 0 10 10">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 16, maxWidth: 340, margin: '16px auto 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{filled} of {total} stamps</span>
          <span style={{ fontSize: 10, color: C.forest, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${C.emerald}, ${C.forest})`,
            transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
      </div>

      {/* Reward preview */}
      <div style={{
        marginTop: 14, maxWidth: 340, margin: '14px auto 0',
        background: C.emeraldLight, borderRadius: 14,
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        overflow: 'hidden',
      }}>
        {rewardImg && (
          <img src={asset(rewardImg)} alt={reward} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: C.forest, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 2 }}>Free reward</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reward}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: filled >= total ? C.emerald : C.muted, flexShrink: 0 }}>
          {filled >= total ? '🎉 Claim' : `${total - filled} to go`}
        </div>
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 10 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{title}</span>
      {action && <button onClick={onAction} style={{ fontSize: 12, color: C.emerald, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{action}</button>}
    </div>
  );
}

// ── Tier badge ────────────────────────────────────────────────────────────────
function TierBadge({ tier }) {
  const colors = { Seed: ['#A8C8A8', '#4A8A62'], Sprout: [C.emerald, C.forest], Bloom: ['#FFD060', '#C47800'] };
  const [bg, fg] = colors[tier] || [C.border, C.muted];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: bg + '28', border: `1px solid ${bg}`, borderRadius: 99,
      padding: '3px 10px', color: fg, fontSize: 11, fontWeight: 700,
    }}>
      <span>🌱</span>{tier}
    </div>
  );
}

Object.assign(window, {
  C, CAT_GRAD,
  VitaPodLogo, ProductSwatch, FeaturedCard, ProductCard,
  Chip, TabBar, RingProgress, StampRow, SectionHead, TierBadge,
});
