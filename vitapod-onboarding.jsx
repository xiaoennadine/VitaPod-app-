// VitaPod — Onboarding Flow (Welcome + 3 spotlight feature tours + Name + Prefs)
const { useState, useEffect } = React;

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [animating, setAnimating] = useState(false);

  // Sync safe-area bg with current step
  useEffect(() => {
    const color = step === 0 ? '#1B3D2F' : '#F9FAF4';
    if (window.setSaBg) window.setSaBg(color);
    return () => { if (window.setSaBg) window.setSaBg('#F9FAF4'); };
  }, [step]);

  function advance() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 180);
  }
  function back() {
    if (animating || step === 0) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 180);
  }
  function togglePref(id) {
    if (id === 'everything') {
      setSelectedPrefs(p => p.includes('everything') ? [] : ['everything']);
    } else {
      setSelectedPrefs(p => {
        const without = p.filter(x => x !== 'everything');
        return without.includes(id) ? without.filter(x => x !== id) : [...without, id];
      });
    }
  }

  const fade = {
    opacity: animating ? 0 : 1,
    transform: animating ? 'translateY(10px)' : 'translateY(0)',
    transition: 'opacity 0.18s ease, transform 0.18s ease',
  };

  const prefCards = [
    { id: 'highProtein', label: 'High-Protein', emoji: '💪' },
    { id: 'vegan',       label: 'Vegan',        emoji: '🌱' },
    { id: 'glutenFree',  label: 'Gluten-Free',  emoji: '🌾' },
    { id: 'everything',  label: 'Everything',   emoji: '⚡' },
  ];

  function BackBtn() {
    return (
      <button onClick={back} style={{ position: 'absolute', top: 'max(52px, calc(env(safe-area-inset-top, 0px) + 12px))', left: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 8, zIndex: 10 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F231D" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>
    );
  }

  function PillBtn({ label, onClick, disabled, light }) {
    return (
      <button onClick={onClick} disabled={disabled} style={{
        width: '100%', padding: '17px 0', borderRadius: 99, border: 'none',
        cursor: disabled ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif',
        background: disabled ? '#E4EBE6' : light ? '#F5EDD6' : '#1B3D2F',
        color: disabled ? '#7A8C82' : light ? '#1B3D2F' : 'white',
        fontSize: 16, fontWeight: 700, transition: 'all 0.2s', flexShrink: 0,
      }}>{label}</button>
    );
  }

  /* ── Mini app screen mockups ──────────────────────────────────────── */

  // Shared mini nav bar
  function MiniNav({ active }) {
    const tabs = [
      { id: 'home', label: 'Home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
      { id: 'menu', label: 'Menu', icon: 'M4 6h16M4 12h16M4 18h16' },
      { id: 'pods', label: 'Pods', icon: 'M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z' },
      { id: 'loyalty', label: 'Loyalty', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
      { id: 'profile', label: 'Me', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
    ];
    return (
      <div style={{ display: 'flex', borderTop: '1px solid #E8EDE8', background: 'rgba(249,250,244,0.95)', padding: '6px 0 8px' }}>
        {tabs.map(t => (
          <div key={t.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={active === t.id ? '#1B3D2F' : 'none'} stroke={active === t.id ? '#1B3D2F' : '#B0BDB6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon}/>
            </svg>
            <span style={{ fontSize: 8, color: active === t.id ? '#1B3D2F' : '#B0BDB6', fontWeight: active === t.id ? 700 : 500 }}>{t.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Menu mockup using REAL product data from window.VP
  function MenuMockup({ highlighted }) {
    const asset = window.vpAsset || (x => x);
    // Pick 4 featured products across categories
    const items = [
      { ...window.VP.categories.find(c=>c.id==='rice-bowls').products[0],     color: '#E8F4EC' }, // Teriyaki
      { ...window.VP.categories.find(c=>c.id==='protein-coffee').products[0], color: '#EAF0F8' }, // Classic Coffee
      { ...window.VP.categories.find(c=>c.id==='protein-shakes').products[0], color: '#F4EAF0' }, // Choc Shake
      { ...window.VP.categories.find(c=>c.id==='baked-goods').products[2],    color: '#F4F0E8' }, // Almond Croissant
    ];
    const cats = ['All', 'Coffee', 'Bowls', 'Shakes'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F9FAF4', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 10px 6px', background: '#1B3D2F' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'white', marginBottom: 6 }}>Menu</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {cats.map((c, i) => (
              <div key={c} style={{ padding: '3px 7px', borderRadius: 99, background: i === 0 ? '#5CCC8A' : 'rgba(255,255,255,0.15)', fontSize: 7, color: 'white', fontWeight: 600 }}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, overflow: 'hidden', alignContent: 'start' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: item.color, borderRadius: 8, padding: '7px 7px 8px',
              border: highlighted && i === 0 ? '2px solid #5CCC8A' : '2px solid transparent',
              boxShadow: highlighted && i === 0 ? '0 0 0 3px rgba(92,204,138,0.3)' : 'none',
              transition: 'all 0.3s', display: 'flex', flexDirection: 'column', height: 'fit-content',
            }}>
              <img src={asset(item.img)} alt={item.name} style={{ width: 36, height: 36, objectFit: 'contain', marginBottom: 4, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
              <div style={{ fontSize: 8, fontWeight: 700, color: '#0F231D', marginBottom: 1, lineHeight: 1.2 }}>{item.name}</div>
              <div style={{ fontSize: 7, color: '#7A8C82' }}>{item.kcal} kcal</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#1B3D2F', marginTop: 'auto', paddingTop: 3 }}>€{item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <MiniNav active="menu" />
      </div>
    );
  }

  // Screen 2: Find Pod / Map
  function PodsMockup({ highlighted }) {
    const locs = [
      { x: 30, y: 38, active: true, name: 'FitBase' },
      { x: 60, y: 55, active: false, name: 'Mitte' },
      { x: 75, y: 28, active: false, name: 'Nord' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F9FAF4', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 10px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0F231D' }}>Find a Pod</div>
        </div>
        <div style={{ flex: 1, position: 'relative', background: '#EBF0E6', margin: '0 8px', borderRadius: 8, overflow: 'hidden' }}>
          {/* Map grid lines */}
          {[20,40,60,80].map(y => <div key={y} style={{ position:'absolute', top:`${y}%`, left:0, right:0, height:1, background:'rgba(255,255,255,0.4)' }}/>)}
          {[25,50,75].map(x => <div key={x} style={{ position:'absolute', left:`${x}%`, top:0, bottom:0, width:1, background:'rgba(255,255,255,0.4)' }}/>)}
          {/* Pins */}
          {locs.map((loc, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%,-100%)',
            }}>
              <div style={{
                width: loc.active ? 20 : 14, height: loc.active ? 20 : 14, borderRadius: 99,
                background: loc.active ? '#1B3D2F' : '#7A8C82',
                border: highlighted && loc.active ? '3px solid #5CCC8A' : '2px solid white',
                boxShadow: highlighted && loc.active ? '0 0 0 4px rgba(92,204,138,0.4)' : '0 2px 6px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
              }}>
                {loc.active && <div style={{ width: 5, height: 5, borderRadius: 99, background: '#5CCC8A' }} />}
              </div>
              {highlighted && loc.active && (
                <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', background: '#1B3D2F', color: 'white', fontSize: 6, fontWeight: 700, padding: '2px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                  {loc.name} Pod · Open
                </div>
              )}
            </div>
          ))}
          {/* You marker */}
          <div style={{ position:'absolute', left:'48%', top:'52%', transform:'translate(-50%,-50%)' }}>
            <div style={{ width:10, height:10, borderRadius:99, background:'#2A6FDB', border:'2px solid white', boxShadow:'0 0 0 4px rgba(42,111,219,0.25)' }}/>
          </div>
        </div>
        <div style={{ padding: '6px 8px 4px' }}>
          <div style={{ background: 'white', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: '#5CCC8A' }} />
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#0F231D' }}>FitBase Berlin · 0.3 km</div>
              <div style={{ fontSize: 7, color: '#7A8C82' }}>24 items · All vending bays open</div>
            </div>
          </div>
        </div>
        <MiniNav active="pods" />
      </div>
    );
  }

  // Screen 3: Loyalty
  function LoyaltyMockup({ highlighted }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F9FAF4', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 10px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0F231D' }}>Rewards</div>
        </div>
        <div style={{ flex: 1, padding: '0 8px 6px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Loyalty card */}
          <div style={{
            background: 'linear-gradient(135deg, #1B3D2F 60%, #2E6B4F)',
            borderRadius: 10, padding: '10px 12px',
            border: highlighted ? '2px solid #5CCC8A' : '2px solid transparent',
            boxShadow: highlighted ? '0 0 0 3px rgba(92,204,138,0.35)' : 'none',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>SEED TIER · 415 pts</div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i <= 4 ? '#5CCC8A' : 'rgba(255,255,255,0.2)' }}/>
              ))}
            </div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)' }}>85 pts to Sprout tier</div>
          </div>
          {/* Stamp card — matches real design with photo stamps */}
          <div style={{ background: '#FDFAF6', borderRadius: 10, padding: '8px 10px', border: '1px solid #EDE9DF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: '#0F231D' }}>Stamp Card</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#1B3D2F' }}>7<span style={{ fontSize: 7, color: '#7A8C82', fontWeight: 400 }}>/10</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5, maxWidth: 220, margin: '0 auto' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => {
                const imgs = ['img/cake-carrot.png','img/coffee-classic.png','img/bowl-teriyaki.png','img/shake-chocolate.png','img/baked-cookie.png','img/shake-vanilla.png','img/mocktail-berry.png'];
                const asset = window.vpAsset || (x=>x);
                const filled = i <= 7;
                return (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: '50%',
                      overflow: 'hidden',
                      border: filled ? '2px solid #5CCC8A' : '1.5px dashed #D8E3DC',
                      background: filled ? 'white' : '#F9FAF4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {filled && imgs[i-1]
                        ? <img src={asset(imgs[i-1])} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: 7, fontWeight: 600, color: '#D8E3DC' }}>{i}</span>
                      }
                    </div>
                    {filled && imgs[i-1] && (
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#5CCC8A', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="5" height="5" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8, height: 3, background: '#E4EBE6', borderRadius: 99 }}>
              <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg,#5CCC8A,#1B3D2F)', borderRadius: 99 }} />
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, background: '#EAF5EE', borderRadius: 7, padding: '5px 7px' }}>
              <img src={(window.vpAsset || (x=>x))('img/cake-carrot.png')} style={{ width: 22, height: 22, objectFit: 'contain' }} />
              <div>
                <div style={{ fontSize: 7, color: '#1B3D2F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Free reward</div>
                <div style={{ fontSize: 8, fontWeight: 800, color: '#0F231D' }}>Carrot & Walnut Cake</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 8, fontWeight: 700, color: '#7A8C82' }}>3 to go</div>
            </div>
          </div>
          {/* Rewards */}
          <div style={{ background: 'white', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: '#0F231D', marginBottom: 4 }}>Rewards</div>
            {[{ label: 'Free Coffee', pts: 200 }, { label: 'Free Bowl', pts: 500 }].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ fontSize: 8, color: '#0F231D' }}>{r.label}</div>
                <div style={{ fontSize: 7, fontWeight: 700, color: '#5CCC8A' }}>{r.pts} pts</div>
              </div>
            ))}
          </div>
        </div>
        <MiniNav active="loyalty" />
      </div>
    );
  }

  const featureSlides = [
    {
      title: 'Browse the Menu',
      desc: 'Tap the Menu tab to explore protein coffees, rice bowls, shakes and baked goods — filtered to match your diet preferences.',
      highlight: 'menu tab',
      screen: (h) => <MenuMockup highlighted={h} />,
      callout: { text: 'Tap to browse & order', arrow: 'bottom' },
    },
    {
      title: 'Find a Pod Near You',
      desc: 'Tap "Pods" to see live availability at vending machines near you — at gyms, campuses, and transit hubs.',
      highlight: 'pods tab',
      screen: (h) => <PodsMockup highlighted={h} />,
      callout: { text: 'Nearest pod shown first', arrow: 'bottom' },
    },
    {
      title: 'Earn as You Eat',
      desc: 'Every purchase earns stamps and points. Level up from Seed to Bloom and unlock free items on the Rewards tab.',
      highlight: 'loyalty card',
      screen: (h) => <LoyaltyMockup highlighted={h} />,
      callout: { text: 'Points add up fast!', arrow: 'top' },
    },
  ];

  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setPulse(true), 400);
    return () => clearTimeout(id);
  }, [step]);
  useEffect(() => { setPulse(false); }, [step]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', background: step === 0 ? '#1B3D2F' : '#F9FAF4' }}>

      {/* ── STEP 0: Welcome ───────────────────────────────────────────────── */}
      {step === 0 && (
        <div style={{
          ...fade, position: 'fixed', inset: 0, background: '#1B3D2F',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'max(88px, calc(env(safe-area-inset-top, 44px) + 44px))',
          paddingBottom: 'max(48px, calc(env(safe-area-inset-bottom, 0px) + 28px))',
          paddingLeft: 32, paddingRight: 32,
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <img src={(window.vpAsset || (x=>x))("img/vitapod-logo-clean.png")} alt="VitaPod" style={{ width: 240, objectFit: 'contain' }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: '#F5EDD6', textAlign: 'center', letterSpacing: '-0.3px', lineHeight: 1.25 }}>Crave it. Grab it.</div>
            <div style={{ fontSize: 14, color: 'rgba(245,237,214,0.5)', textAlign: 'center', lineHeight: 1.65 }}>Real food. Conveniently packaged.</div>
          </div>
          {/* Button + explicit dark-green bottom spacer so iOS home indicator stays dark */}
          <div style={{ width: '100%', paddingBottom: 0 }}>
            <div style={{ width: '100%' }}>
            <PillBtn label="Get Started →" onClick={advance} light />
          </div>
          {/* Dark green fill past the home indicator */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 'calc(env(safe-area-inset-bottom, 0px) + 40px)', background: '#1B3D2F', zIndex: -1 }} />
            <div style={{ height: 'max(40px, calc(env(safe-area-inset-bottom, 34px) + 12px))', background: '#1B3D2F' }} />
          </div>
        </div>
      )}

      {/* ── STEPS 1–3: Spotlight feature tour ───────────────────────────── */}
      {step >= 1 && step <= 3 && (() => {
        const f = featureSlides[step - 1];
        return (
          <div style={{ ...fade, position: 'fixed', inset: 0, background: '#F9FAF4', display: 'flex', flexDirection: 'column' }}>
            <BackBtn />

            {/* Header area */}
            <div style={{
              paddingTop: 'max(60px, calc(env(safe-area-inset-top, 0px) + 16px))',
              padding: `max(60px, calc(env(safe-area-inset-top, 0px) + 16px)) 24px 14px`,
            }}>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 16, paddingLeft: 28 }}>
                {featureSlides.map((_, i) => (
                  <div key={i} style={{ width: i === step - 1 ? 20 : 6, height: 6, borderRadius: 99, background: i === step - 1 ? '#1B3D2F' : '#E4EBE6', transition: 'all 0.25s' }} />
                ))}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F231D', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#7A8C82', lineHeight: 1.65 }}>{f.desc}</div>
            </div>

            {/* App screen mockup */}
            <div style={{ flex: 1, padding: '8px 20px', display: 'flex', alignItems: 'stretch', minHeight: 0 }}>
              <div style={{
                flex: 1, borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid #E4EBE6',
              }}>
                {f.screen(pulse)}
              </div>
            </div>

            {/* Bottom button + cream spacer */}
            <div style={{ padding: '10px 24px 0', background: '#F9FAF4' }}>
              <PillBtn label={step === 3 ? 'Continue →' : 'Next →'} onClick={advance} />
              <div style={{ height: 'max(32px, calc(env(safe-area-inset-bottom, 34px) + 8px))', background: '#F9FAF4' }} />
            </div>
          </div>
        );
      })()}

      {/* ── STEP 4: Name ─────────────────────────────────────────────────── */}
      {step === 4 && (
        <div style={{
          ...fade, position: 'fixed', inset: 0, background: '#F9FAF4',
          display: 'flex', flexDirection: 'column',
          paddingTop: 'max(80px, calc(env(safe-area-inset-top, 0px) + 36px))',
          paddingLeft: 28, paddingRight: 28,
          paddingBottom: 0,
          justifyContent: 'space-between',
        }}>
          <BackBtn />
          <div style={{ flex: 1, paddingTop: 20 }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: '#0F231D', letterSpacing: '-0.6px', marginBottom: 8 }}>What's your name?</div>
            <div style={{ fontSize: 14, color: '#7A8C82', marginBottom: 32, lineHeight: 1.55 }}>So we can make this feel personal 👋</div>
            <input
              autoFocus value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && advance()}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: '2px solid #E4EBE6', fontSize: 16, fontFamily: 'DM Sans, sans-serif', color: '#0F231D', outline: 'none', background: 'white', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#5CCC8A')}
              onBlur={e => (e.target.style.borderColor = '#E4EBE6')}
            />
          </div>
          <PillBtn label="Continue →" onClick={advance} disabled={!name.trim()} />
          <div style={{ height: 'max(32px, calc(env(safe-area-inset-bottom, 34px) + 8px))', background: '#F9FAF4' }} />
        </div>
      )}

      {/* ── STEP 5: Preferences ──────────────────────────────────────────── */}
      {step === 5 && (
        <div style={{
          ...fade, position: 'fixed', inset: 0, background: '#F9FAF4',
          display: 'flex', flexDirection: 'column',
          paddingTop: 'max(80px, calc(env(safe-area-inset-top, 0px) + 36px))',
          paddingLeft: 28, paddingRight: 28,
          paddingBottom: 0,
          justifyContent: 'space-between',
        }}>
          <BackBtn />
          <div style={{ flex: 1, paddingTop: 20 }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: '#0F231D', letterSpacing: '-0.6px', marginBottom: 8 }}>What are you into?</div>
            <div style={{ fontSize: 14, color: '#7A8C82', marginBottom: 26, lineHeight: 1.55 }}>We'll tailor your menu. Pick all that apply.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {prefCards.map(pref => {
                const sel = selectedPrefs.includes(pref.id);
                return (
                  <button key={pref.id} onClick={() => togglePref(pref.id)} style={{
                    padding: '20px 12px', borderRadius: 18, cursor: 'pointer',
                    border: `2px solid ${sel ? '#5CCC8A' : '#E4EBE6'}`,
                    background: sel ? 'rgba(92,204,138,0.09)' : 'white',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.18s', position: 'relative',
                  }}>
                    {sel && (
                      <div style={{ position: 'absolute', top: 9, right: 9, width: 18, height: 18, borderRadius: 99, background: '#5CCC8A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="9" height="9" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      </div>
                    )}
                    <span style={{ fontSize: 30 }}>{pref.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: sel ? '#1B3D2F' : '#0F231D' }}>{pref.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <PillBtn label="Let's go →" onClick={() => onComplete(name.trim() || 'Friend', selectedPrefs)} />
            <div style={{ height: 'max(32px, calc(env(safe-area-inset-bottom, 34px) + 8px))', background: '#F9FAF4' }} />
          </div>
        </div>
      )}

    </div>
  );
}

Object.assign(window, { OnboardingFlow });
