// VitaPod — all 5 screen components (updated)
const { useState, useRef, useEffect } = React;

// ── helpers ───────────────────────────────────────────────────────────────────
function ScrollBox({ children, style = {} }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      ...style,
    }}>
      {children}
    </div>
  );
}

function HScroll({ children, px = 16 }) {
  return (
    <div style={{
      display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'visible',
      paddingLeft: px, paddingRight: px, paddingBottom: 4,
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }}>
      {children}
    </div>
  );
}

function ScreenWrap({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, overflow: 'hidden', position: 'relative' }}>
      {children}
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ onTabChange, onAdd, onOpenScanner, onProductTap, prefs = {}, onNotifTap }) {
  const data = window.VP;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  function passesFilter(product) {
    const d = product.dietary || [];
    if (prefs.vegan       && !d.includes('vegan'))       return false;
    if (prefs.glutenFree  && !d.includes('glutenFree'))  return false;
    if (prefs.highProtein && !d.includes('highProtein')) return false;
    return true;
  }

  const featured = data.featured.map(fid => {
    for (const cat of data.categories) {
      const p = cat.products.find(p => p.id === fid);
      if (p) return { product: p, cat };
    }
    return null;
  }).filter(Boolean).filter(({ product }) => passesFilter(product));

  const quickCats = [
    { id: 'protein-coffee', label: 'Coffee', emoji: '☕' },
    { id: 'rice-bowls',     label: 'Bowls',  emoji: '🍚' },
    { id: 'protein-shakes', label: 'Shakes', emoji: '🥤' },
    { id: 'cakes',          label: 'Treats', emoji: '🍰' },
  ];

  return (
    <ScreenWrap>
      {/* sticky header */}
      <div style={{ padding: 'max(54px, calc(env(safe-area-inset-top, 0px) + 10px)) 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <VitaPodLogo size={22} />
          <div style={{ display: 'flex', gap: 8 }}>
            {/* QR scan button */}
            <button onClick={onOpenScanner} style={{ border: 'none', background: C.emeraldLight, borderRadius: 99, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.forest} strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3"/>
                <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill={C.forest} stroke="none"/>
              </svg>
            </button>
            {/* Bell */}
            <button onClick={onNotifTap} style={{ border: 'none', background: C.emeraldLight, borderRadius: 99, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.forest} strokeWidth="2" strokeLinecap="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ScrollBox style={{ paddingBottom: 16 }}>
        {/* greeting */}
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, letterSpacing: '-0.5px' }}>
            {greeting}, {data.user.name} 👋
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={C.emerald}><path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z"/></svg>
            Berlin, DE · 5 Pods nearby
          </div>
        </div>

        {/* promo banner */}
        <div style={{ margin: '16px 16px 0', background: C.forest, borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ color: C.emerald, fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Limited offer</div>
            <div style={{ color: 'white', fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>Buy 2 Bowls,<br/>get a Coffee free</div>
            <button onClick={() => onTabChange('menu')} style={{
              marginTop: 12, background: C.emerald, color: C.dark, border: 'none',
              borderRadius: 99, padding: '7px 16px', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Shop now →</button>
          </div>
          <div style={{ flexShrink: 0, width: 72, height: 72 }}>
            <img src={(window.vpAsset || (x=>x))("img/bowl-teriyaki.png")} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} />
          </div>
        </div>

        {/* featured carousel */}
        <div style={{ marginTop: 22 }}>
          <SectionHead title="Featured" action="See all" onAction={() => onTabChange('menu')} />
          <HScroll>
            {featured.map(({ product, cat }) => (
              <FeaturedCard key={product.id} product={product} cat={cat} onAdd={onAdd} onTap={onProductTap} />
            ))}
          </HScroll>
        </div>

        {/* quick category tiles */}
        <div style={{ marginTop: 22 }}>
          <SectionHead title="Browse" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px' }}>
            {quickCats.map(qc => {
              const [g0, g1] = CAT_GRAD[qc.id] || ['#ccc', '#999'];
              return (
                <button key={qc.id} onClick={() => onTabChange('menu')} style={{
                  background: `linear-gradient(135deg, ${g0}55, ${g1}88)`,
                  border: 'none', borderRadius: 16, padding: '16px 14px',
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <span style={{ fontSize: 26 }}>{qc.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{qc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* nearby pods */}
        <div style={{ margin: '22px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>Nearest Pod</span>
            <button onClick={() => onTabChange('map')} style={{ fontSize: 12, color: C.emerald, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>See map →</button>
          </div>
          {window.VP.locations.slice(0, 2).map(loc => (
            <div key={loc.id} style={{ background: C.card, borderRadius: 14, padding: '12px 14px', boxShadow: `0 2px 10px ${C.shadow}`, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{loc.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{loc.address}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.emerald }}>{loc.distance}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Open</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollBox>
    </ScreenWrap>
  );
}

// ── Menu Screen ───────────────────────────────────────────────────────────────
function MenuScreen({ onAdd, cartCount, onOpenCart, onProductTap, prefs = {} }) {
  const [activeCat, setActiveCat] = useState('all');
  const cats = window.VP.categories;

  const anyFilter = prefs.vegan || prefs.glutenFree || prefs.highProtein;
  const activeFilterLabels = [
    prefs.vegan && 'Vegan',
    prefs.glutenFree && 'Gluten-Free',
    prefs.highProtein && 'High-Protein',
  ].filter(Boolean);

  function filterProducts(products) {
    return products.filter(p => {
      const d = p.dietary || [];
      if (prefs.vegan       && !d.includes('vegan'))       return false;
      if (prefs.glutenFree  && !d.includes('glutenFree'))  return false;
      if (prefs.highProtein && !d.includes('highProtein')) return false;
      return true;
    });
  }

  const filteredCats = cats.map(cat => ({ ...cat, products: filterProducts(cat.products) }));
  const visibleCats  = filteredCats.filter(c => c.products.length > 0);
  const displayCats  = activeCat === 'all' ? visibleCats : visibleCats.filter(c => c.id === activeCat);

  return (
    <ScreenWrap>
      {/* sticky top */}
      <div style={{ padding: 'max(54px, calc(env(safe-area-inset-top, 0px) + 10px)) 16px 8px', flexShrink: 0, background: C.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: '-0.4px' }}>Menu</div>
          {/* Cart button — always visible */}
          <button onClick={onOpenCart} style={{
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none',
            background: cartCount > 0 ? C.emeraldLight : C.card,
            borderRadius: 99, padding: '7px 14px',
            boxShadow: cartCount > 0 ? 'none' : `0 1px 5px ${C.shadow}`,
            transition: 'all 0.2s', position: 'relative',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.forest} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0
              ? <span style={{ fontSize: 12, fontWeight: 700, color: C.forest }}>{cartCount} in cart</span>
              : <span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>Cart</span>
            }
          </button>
        </div>
        {/* search bar */}
        <div style={{ background: C.card, borderRadius: 12, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 1px 6px ${C.shadow}`, marginBottom: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span style={{ fontSize: 13, color: C.muted }}>Search products…</span>
        </div>
        {/* category filter pills */}
        <HScroll px={0}>
          <Chip label="All" active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
          {cats.map(c => <Chip key={c.id} label={c.short} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} />)}
        </HScroll>
        {/* active diet filter banner */}
        {anyFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '6px 10px', background: C.emeraldLight, borderRadius: 10, fontSize: 11, color: C.forest, fontWeight: 600 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.forest} strokeWidth="2.5" strokeLinecap="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
            {activeFilterLabels.join(' · ')}
          </div>
        )}
      </div>

      <ScrollBox style={{ paddingBottom: 16 }}>
        {displayCats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🥗</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>No items match your filters</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Adjust your dietary preferences in Profile to see more items.</div>
          </div>
        )}
        {displayCats.map(cat => (
          <div key={cat.id} style={{ marginTop: 18 }}>
            <SectionHead title={cat.name} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px' }}>
              {cat.products.map(p => <ProductCard key={p.id} product={p} cat={cat} onAdd={onAdd} onTap={onProductTap} />)}
            </div>
          </div>
        ))}
      </ScrollBox>
    </ScreenWrap>
  );
}

// ── Map Screen ────────────────────────────────────────────────────────────────
function MapScreen() {
  const [view, setView] = useState('map');
  const [locationGranted, setLocationGranted] = useState(() => localStorage.getItem('vp_location') === 'true');
  const [locationLoading, setLocationLoading] = useState(false);
  const locs = window.VP.locations;

  function grantAndShow() {
    localStorage.setItem('vp_location', 'true');
    setLocationGranted(true);
    setLocationLoading(false);
  }

  function requestLocation() {
    setLocationLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => grantAndShow(),
        () => grantAndShow(),
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      grantAndShow();
    }
  }

  if (!locationGranted) {
    return (
      <ScreenWrap>
        <div style={{ padding: 'max(54px, calc(env(safe-area-inset-top, 0px) + 10px)) 16px 10px', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: '-0.4px' }}>Find a Pod</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px 60px', gap: 22 }}>
          <div style={{ width: 80, height: 80, borderRadius: 99, background: C.emeraldLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" fill={C.emerald}/>
              <circle cx="12" cy="8" r="2.5" fill="white"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, marginBottom: 10, letterSpacing: '-0.4px' }}>Enable Location</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
              Allow VitaPod to access your location to find the nearest Pod and see live availability.
            </div>
          </div>
          <button onClick={requestLocation} disabled={locationLoading} style={{
            width: '100%', padding: '16px 0', borderRadius: 99, border: 'none',
            background: locationLoading ? C.emerald + '99' : C.forest, color: 'white', fontSize: 15, fontWeight: 700,
            cursor: locationLoading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
          }}>{locationLoading ? 'Locating…' : 'Allow Location Access'}</button>
          <button onClick={grantAndShow} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 13, fontFamily: 'inherit' }}>Not now</button>
        </div>
      </ScreenWrap>
    );
  }

  return (
    <ScreenWrap>
      <div style={{ padding: 'max(54px, calc(env(safe-area-inset-top, 0px) + 10px)) 16px 10px', flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: '-0.4px', marginBottom: 12 }}>Find a Pod</div>
        <div style={{ display: 'flex', background: C.card, borderRadius: 10, padding: 3, boxShadow: `0 1px 6px ${C.shadow}`, width: 'fit-content' }}>
          {['map', 'list'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: view === v ? C.dark : 'transparent', color: view === v ? 'white' : C.muted,
              fontSize: 12, fontWeight: 600, transition: 'all 0.15s', textTransform: 'capitalize',
            }}>{v === 'map' ? '🗺 Map' : '≡ List'}</button>
          ))}
        </div>
      </div>

      {view === 'map' ? (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 390 580" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            <rect width="390" height="580" fill="#EAF0E8"/>
            {[0,55,110,165,220,275,330,385].map(x => <line key={x} x1={x} y1="0" x2={x} y2="580" stroke="#D8E2D6" strokeWidth="18"/>)}
            {[0,60,120,180,240,300,360,420,480,540].map(y => <line key={y} x1="0" y1={y} x2="390" y2={y} stroke="#D8E2D6" strokeWidth="18"/>)}
            {[[8,8,38,38],[63,8,38,38],[118,8,38,38],[173,8,38,38],[228,8,38,38],[283,8,38,38],[338,8,44,38],
              [8,63,38,48],[63,63,48,48],[118,63,38,48],[173,63,48,48],[228,63,38,48],[283,63,48,48],
              [8,123,38,48],[63,123,48,38],[173,123,38,48],[228,123,48,38],[283,123,38,48],[338,123,44,48],
              [8,183,38,38],[63,183,48,38],[118,183,38,48],[173,183,48,38],[283,183,48,48],[338,183,44,38],
              [8,243,38,48],[63,243,48,38],[173,243,38,48],[228,243,38,38],[283,243,48,38],
              [8,303,38,38],[63,303,48,48],[118,303,38,38],[173,303,48,48],[283,303,38,38],[338,303,44,48],
              [8,363,38,38],[63,363,48,38],[118,363,38,38],[173,363,48,38],[228,363,38,48],[283,363,48,38],
              [8,423,38,38],[63,423,48,38],[118,423,38,48],[228,423,38,38],[283,423,48,48],[338,423,44,38],
            ].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#DDEADB" opacity="0.9"/>)}
            <rect x="118" y="183" width="55" height="48" rx="6" fill="#B8D8B8" opacity="0.8"/>
            <text x="145" y="212" textAnchor="middle" fontSize="8" fill="#4A8A62" fontWeight="600">Park</text>
            <path d="M 0 490 Q 80 470 180 490 Q 280 510 390 490" stroke="#A8CCE8" strokeWidth="22" fill="none" opacity="0.7"/>
            <text x="110" y="76" fontSize="7" fill="#8FA88A" fontWeight="500" transform="rotate(-45 110 76)">Unter den Linden</text>
            <text x="200" y="200" fontSize="7" fill="#8FA88A" fontWeight="500">Karl-Marx-Allee</text>
            <circle cx="200" cy="290" r="14" fill="#4A90D9" opacity="0.18"/>
            <circle cx="200" cy="290" r="7" fill="#4A90D9"/>
            <circle cx="200" cy="290" r="3" fill="white"/>
            {locs.map(loc => (
              <g key={loc.id} transform={`translate(${loc.x}, ${loc.y})`}>
                <ellipse cx="0" cy="4" rx="9" ry="4" fill="rgba(92,204,138,0.25)"/>
                <path d="M0,-22 C-9,-22 -9,-10 0,-4 C9,-10 9,-22 0,-22Z" fill={loc.status === 'open' ? C.emerald : '#B0B8B0'}/>
                <circle cx="0" cy="-15" r="3.5" fill="white" opacity="0.9"/>
              </g>
            ))}
            <text x="194" y="574" textAnchor="middle" fontSize="8" fill="#8FA88A" opacity="0.7">VitaPod · Berlin</text>
          </svg>
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: C.dark, color: 'white', borderRadius: 99, padding: '10px 20px', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.emerald }}>●</span> 5 Pods open nearby
          </div>
        </div>
      ) : (
        <ScrollBox style={{ paddingBottom: 16 }}>
          {locs.map(loc => {
            const typeEmoji = { gym: '🏋️', uni: '🎓', cowork: '💻', transport: '🚉' };
            return (
              <div key={loc.id} style={{ margin: '0 16px 10px', background: C.card, borderRadius: 16, padding: '14px 16px', boxShadow: `0 2px 10px ${C.shadow}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 14 }}>{typeEmoji[loc.type] || '📍'}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{loc.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginLeft: 20 }}>{loc.address}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{loc.distance}</div>
                    <div style={{ display: 'inline-block', borderRadius: 99, padding: '2px 9px', fontSize: 10, fontWeight: 700, background: loc.status === 'open' ? C.emeraldLight : '#F4F4F4', color: loc.status === 'open' ? C.forest : C.muted }}>{loc.status === 'open' ? '● Open' : '○ Closed'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollBox>
      )}
    </ScreenWrap>
  );
}

// ── Rewards Screen ────────────────────────────────────────────────────────────
function RewardsScreen() {
  const u = window.VP.user;
  const [showTierModal, setShowTierModal] = useState(false);

  // Map activity items to stamps (most recent = stamp 1)
  const stampItemLabels = [
    'Carrot & Walnut Cake', 'Classic Coffee', 'Teriyaki Chicken',
    'Chocolate Shake', 'Protein Cookie', 'Vanilla Shake', 'Berry Hibiscus',
  ].slice(0, u.stamps);

  const stampItemImages = [
    'img/cake-carrot.png', 'img/coffee-classic.png', 'img/bowl-teriyaki.png',
    'img/shake-chocolate.png', 'img/baked-cookie.png', 'img/shake-vanilla.png',
    'img/mocktail-berry.png',
  ].slice(0, u.stamps);

  const tiers = [
    { name: 'Seed',   min: 0,   max: 200,  emoji: '🌱' },
    { name: 'Sprout', min: 200, max: 500,  emoji: '🌿' },
    { name: 'Bloom',  min: 500, max: 1000, emoji: '🌸' },
  ];

  return (
    <ScreenWrap>
      <div style={{ padding: 'max(54px, calc(env(safe-area-inset-top, 0px) + 10px)) 16px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: '-0.4px' }}>Rewards</div>
          <TierBadge tier={u.tier} />
        </div>
      </div>

      <ScrollBox style={{ paddingBottom: 24 }}>
        {/* points ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 10px', position: 'relative' }}>
          <div style={{ position: 'relative', width: 148, height: 148 }}>
            <RingProgress value={u.points} max={u.pointsGoal} size={148} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.dark, lineHeight: 1 }}>{u.points}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 3, textAlign: 'center', lineHeight: 1.4 }}>pts<br/>earned</div>
            </div>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: C.muted }}>
              <span style={{ fontWeight: 700, color: C.forest }}>{u.pointsGoal - u.points} pts</span> to {u.tierNext}
            </div>
          </div>
        </div>

        {/* tier ladder — tappable */}
        <div style={{ margin: '10px 16px 0', background: C.card, borderRadius: 18, padding: '14px 16px', boxShadow: `0 2px 12px ${C.shadow}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>Your Journey</div>
            <button onClick={() => setShowTierModal(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 4, color: C.emerald, fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
              What's this? ›
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {tiers.map((tier, i) => {
              const isActive = tier.name === u.tier;
              const isDone = tiers.findIndex(t => t.name === u.tier) > i;
              return (
                <React.Fragment key={tier.name}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, background: isActive ? C.emerald : isDone ? C.forest : C.border,
                      boxShadow: isActive ? `0 0 0 4px ${C.emeraldLight}` : 'none',
                    }}>{tier.emoji}</div>
                    <div style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? C.forest : C.muted }}>{tier.name}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>{tier.min}+ pts</div>
                  </div>
                  {i < tiers.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: isDone ? C.emerald : C.border, marginBottom: 22 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* stamp card */}
        <div style={{ margin: '14px 16px 0', background: '#FDFAF6', borderRadius: 20, padding: '18px 16px', boxShadow: `0 2px 16px ${C.shadow}`, border: `1px solid #EDE9DF` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.dark }}>Stamp Card</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Tap a stamp · 10 = 1 free item</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.forest }}>{u.stamps}<span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>/10</span></div>
          </div>
          <StampRow
            filled={u.stamps}
            stampItems={stampItemLabels}
            stampImages={stampItemImages}
            reward="Carrot & Walnut Cake"
            rewardImg="img/cake-carrot.png"
          />
        </div>

        {/* recent activity */}
        <div style={{ margin: '18px 16px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 10 }}>Recent Activity</div>
          {window.VP.activity.map(act => {
            const [g0, g1] = CAT_GRAD[act.cat] || ['#ccc', '#999'];
            return (
              <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 14, padding: '12px 14px', marginBottom: 8, boxShadow: `0 1px 6px ${C.shadow}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(145deg, ${g0}, ${g1})`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{act.item}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{act.date}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.emerald }}>+{act.pts}</div>
              </div>
            );
          })}
        </div>
      </ScrollBox>

      {/* Tier modal (inside ScreenWrap for correct z-index) */}
      {showTierModal && <TierModal onClose={() => setShowTierModal(false)} />}
    </ScreenWrap>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────
function ProfileScreen({ onNavigate, prefs = {}, onPrefsChange }) {
  const u = window.VP.user;
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(u.name || '');
  const [savedMsg, setSavedMsg] = useState(false);

  function saveName() {
    const n = editName.trim() || u.name;
    u.name = n;
    localStorage.setItem('vp_user_name', n);
    setEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  const togglePref = (key) => onPrefsChange && onPrefsChange({ ...prefs, [key]: !prefs[key] });

  const prefList = [
    { key: 'vegan',       label: 'Vegan',       desc: 'Only plant-based items' },
    { key: 'glutenFree',  label: 'Gluten-Free',  desc: 'Hide gluten items' },
    { key: 'highProtein', label: 'High-Protein', desc: '20g+ protein per item' },
  ];

  const settingsLinks = [
    { label: 'Payment methods', key: 'payment' },
    { label: 'Notifications',   key: 'notifications' },
    { label: 'Language',        key: 'language' },
    { label: 'Help & Support',  key: 'help' },
    { label: 'Privacy Policy',  key: 'privacy' },
  ];

  return (
    <ScreenWrap>
      <ScrollBox style={{ paddingBottom: 24 }}>
        {/* avatar header */}
        <div style={{ padding: 'max(60px, calc(env(safe-area-inset-top, 0px) + 16px)) 16px 20px', background: C.card, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 99, background: `linear-gradient(145deg, ${C.emerald}, ${C.forest})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{(u.name || 'N')[0].toUpperCase()}</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.dark }}>{u.name}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{u.name.toLowerCase()}@email.com</div>
            <div style={{ marginTop: 6 }}><TierBadge tier={u.tier} /></div>
          </div>
          <button onClick={() => { setEditName(u.name); setEditing(true); }} style={{ marginLeft: 'auto', border: `1.5px solid ${C.border}`, background: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: C.forest, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
        </div>

        {/* stats row */}
        <div style={{ display: 'flex', background: C.card, borderBottom: `1px solid ${C.border}` }}>
          {[{ label: 'Points', val: u.points }, { label: 'Stamps', val: `${u.stamps}/10` }, { label: 'Orders', val: window.VP.orders.length }].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 0', textAlign: 'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.forest }}>{s.val}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* dietary prefs */}
        <div style={{ margin: '18px 16px 0', background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 10px ${C.shadow}` }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>Dietary Preferences</div>
          </div>
          {prefList.map((pref, i) => (
            <div key={pref.key} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < prefList.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{pref.label}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{pref.desc}</div>
              </div>
              <button onClick={() => togglePref(pref.key)} style={{
                width: 44, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: prefs[pref.key] ? C.emerald : C.border, position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}>
                <div style={{ position: 'absolute', top: 3, left: prefs[pref.key] ? 21 : 3, width: 20, height: 20, borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
              </button>
            </div>
          ))}
        </div>

        {/* order history */}
        <div style={{ margin: '18px 16px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 10 }}>Recent Orders</div>
          {window.VP.orders.map(ord => (
            <div key={ord.id} style={{ background: C.card, borderRadius: 14, padding: '12px 14px', marginBottom: 8, boxShadow: `0 1px 6px ${C.shadow}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{ord.items}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{ord.date} · {ord.loc}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.forest, flexShrink: 0 }}>{ord.total}</div>
              </div>
            </div>
          ))}
        </div>

        {/* settings links — all tappable */}
        <div style={{ margin: '18px 16px 0', background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: `0 2px 10px ${C.shadow}` }}>
          {settingsLinks.map((s, i) => (
            <div key={s.label} onClick={() => onNavigate && onNavigate(s.key)} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: i < settingsLinks.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: 13, color: C.dark }}>{s.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          ))}
        </div>

        {savedMsg && (
          <div style={{ margin: '12px 16px 0', background: C.emeraldLight, borderRadius: 12, padding: '10px 14px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: C.forest }}>✓ Profile updated</div>
        )}

        <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
          <button onClick={() => {
            localStorage.removeItem('vp_onboarded');
            localStorage.removeItem('vp_user_name');
            localStorage.removeItem('vp_prefs');
            localStorage.removeItem('vp_location');
            localStorage.removeItem('vp_stamps');
            window.location.reload();
          }} style={{ fontSize: 12, color: '#E84040', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Log out</button>
        </div>

        {/* Edit name sheet */}
        {editing && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
            <div onClick={() => setEditing(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.bg, borderRadius: '24px 24px 0 0', padding: '24px 20px 40px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: C.border, margin: '0 auto 20px' }} />
              <div style={{ fontSize: 17, fontWeight: 800, color: C.dark, marginBottom: 18 }}>Edit Profile</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Name</div>
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `2px solid ${C.border}`, fontSize: 15, fontFamily: 'DM Sans, sans-serif', color: C.dark, outline: 'none', background: 'white', boxSizing: 'border-box', marginBottom: 20 }}
                onFocus={e => (e.target.style.borderColor = C.emerald)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
              <button onClick={saveName} style={{ width: '100%', padding: '16px 0', borderRadius: 99, border: 'none', background: C.forest, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
            </div>
          </div>
        )}
      </ScrollBox>
    </ScreenWrap>
  );
}

Object.assign(window, { HomeScreen, MenuScreen, MapScreen, RewardsScreen, ProfileScreen });
