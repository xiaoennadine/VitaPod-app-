// VitaPod — product catalog, locations, user data
window.VP = {
  categories: [
    { id: 'protein-coffee', name: 'Protein Coffee', short: 'Coffee', products: [
        { id: 'pc1', name: 'Classic Coffee',   flavor: 'Single-Origin Pea Protein', price: 3.50, kcal: 150, protein: '25g', tag: 'bestseller', img: 'img/coffee-classic.png',  dietary: ['vegan','glutenFree','highProtein'] },
        { id: 'pc2', name: 'Black Coffee',     flavor: 'Zero Sugar · Pea Protein',  price: 3.50, kcal: 120, protein: '25g', tag: null,         img: 'img/coffee-black.png',    dietary: ['vegan','glutenFree','highProtein'] },
        { id: 'pc3', name: 'Caramel Coffee',   flavor: 'Salted Caramel',            price: 3.50, kcal: 180, protein: '22g', tag: 'new',        img: 'img/coffee-caramel.png',  dietary: ['vegan','glutenFree','highProtein'] },
        { id: 'pc4', name: 'Hazelnut Coffee',  flavor: 'Hazelnut',                  price: 3.50, kcal: 170, protein: '22g', tag: null,         img: 'img/coffee-hazelnut.png', dietary: ['vegan','glutenFree','highProtein'] },
    ]},
    { id: 'protein-shakes', name: 'Protein Shakes', short: 'Shakes', products: [
        { id: 'ps1', name: 'Chocolate Shake',  flavor: 'Chocolate · 30g Plant Protein', price: 3.50, kcal: 220, protein: '30g', tag: 'bestseller', img: 'img/shake-chocolate.png',  dietary: ['vegan','glutenFree','highProtein'] },
        { id: 'ps2', name: 'Strawberry Shake', flavor: 'Strawberry · 30g Plant Protein',price: 3.50, kcal: 190, protein: '30g', tag: null,         img: 'img/shake-strawberry.png', dietary: ['vegan','glutenFree','highProtein'] },
        { id: 'ps3', name: 'Vanilla Shake',    flavor: 'Vanilla · 30g Plant Protein',   price: 3.50, kcal: 200, protein: '30g', tag: null,         img: 'img/shake-vanilla.png',    dietary: ['vegan','glutenFree','highProtein'] },
    ]},
    { id: 'macro-mocktails', name: 'Macro Mocktails', short: 'Mocktails', products: [
        { id: 'mm1', name: 'Berry Hibiscus', flavor: 'Vegan · Natural Flavors', price: 3.50, kcal: 80,  protein: '5g', tag: 'vegan', img: 'img/mocktail-berry.png',   dietary: ['vegan','glutenFree'] },
        { id: 'mm2', name: 'Matcha Mint',    flavor: 'Vegan · Natural Flavors', price: 3.50, kcal: 70,  protein: '4g', tag: 'vegan', img: 'img/mocktail-matcha.png',  dietary: ['vegan','glutenFree'] },
        { id: 'mm3', name: 'Citrus Ginger',  flavor: 'Vegan · Natural Flavors', price: 3.50, kcal: 65,  protein: '4g', tag: 'vegan', img: 'img/mocktail-citrus.png',  dietary: ['vegan','glutenFree'] },
    ]},
    { id: 'rice-bowls', name: 'Rice Bowls', short: 'Bowls', products: [
        { id: 'rb1', name: 'Teriyaki Chicken',   flavor: 'Japanese-style',   price: 7.50, kcal: 480, protein: '38g', tag: 'bestseller', img: 'img/bowl-teriyaki.png', dietary: ['glutenFree','highProtein'] },
        { id: 'rb2', name: 'Salmon Poke Bowl',   flavor: 'Marinated Salmon', price: 7.50, kcal: 350, protein: '42g', tag: null,         img: 'img/bowl-salmon.png',   dietary: ['glutenFree','highProtein'] },
        { id: 'rb3', name: 'Garden Veggie Bowl', flavor: 'Miso Glaze',       price: 7.50, kcal: 160, protein: '14g', tag: 'vegan',      img: 'img/bowl-veggie.png',   dietary: ['vegan','glutenFree'] },
        { id: 'rb4', name: 'Korean BBQ Beef',    flavor: 'Korean-style',     price: 7.50, kcal: 460, protein: '40g', tag: 'new',        img: 'img/bowl-korean.png',   dietary: ['glutenFree','highProtein'] },
    ]},
    { id: 'tapas', name: 'Tapas', short: 'Tapas', products: [
        { id: 't1', name: 'Mediterranean Tapas', flavor: 'Olives · Hummus · Pesto', price: 7.50, kcal: 320, protein: '12g', tag: null,    img: 'img/tapas-mediterranean.png', dietary: ['vegan','glutenFree'] },
        { id: 't2', name: 'Charcuterie Tapas',   flavor: 'Cheese · Ham · Crackers', price: 7.50, kcal: 380, protein: '18g', tag: null,    img: 'img/tapas-charcuterie.png',   dietary: [] },
        { id: 't3', name: 'Asian Bites',         flavor: 'Edamame · Crackers',      price: 7.50, kcal: 290, protein: '14g', tag: 'vegan', img: 'img/tapas-asian.png',         dietary: ['vegan'] },
    ]},
    { id: 'baked-goods', name: 'Baked Goods', short: 'Baked', products: [
        { id: 'bg1', name: 'Protein Muffin',   flavor: 'Blueberry · 110g',       price: 5.50, kcal: 220, protein: '15g', tag: null,  img: 'img/baked-muffin.png',    dietary: [] },
        { id: 'bg2', name: 'Protein Cookie',   flavor: 'Double Choc Chip · 80g', price: 5.50, kcal: 180, protein: '10g', tag: null,  img: 'img/baked-cookie.png',    dietary: [] },
        { id: 'bg3', name: 'Almond Croissant', flavor: 'Individually Wrapped',   price: 5.50, kcal: 310, protein: '8g',  tag: 'new', img: 'img/baked-croissant.png', dietary: [] },
    ]},
    { id: 'cakes', name: 'Cakes', short: 'Cakes', products: [
        { id: 'ca1', name: 'Carrot & Walnut Cake', flavor: 'Cream Cheese Frosting', price: 5.50, kcal: 280, protein: '6g', tag: 'bestseller', img: 'img/cake-carrot.png',    dietary: [] },
        { id: 'ca2', name: 'Dark Chocolate Cake',  flavor: 'Chocolate Frosting',    price: 5.50, kcal: 310, protein: '5g', tag: null,         img: 'img/cake-chocolate.png', dietary: [] },
        { id: 'ca3', name: 'Lemon Yogurt Cake',    flavor: 'Cream Frosting',        price: 5.50, kcal: 260, protein: '5g', tag: 'new',        img: 'img/cake-lemon.png',     dietary: [] },
    ]},
    { id: 'chocolate', name: 'Real Food Chocolate', short: 'Choc', products: [
        { id: 'ch1', name: 'Dark 70% Cacao',      flavor: 'Dark · 60g',            price: 5.50, kcal: 180, protein: '4g', tag: 'vegan', img: 'img/choc-dark.png',     dietary: ['vegan','glutenFree'] },
        { id: 'ch2', name: 'Oat Milk Chocolate',  flavor: 'Dairy-Free · 60g',      price: 5.50, kcal: 200, protein: '3g', tag: 'vegan', img: 'img/choc-oatmilk.png',  dietary: ['vegan','glutenFree'] },
        { id: 'ch3', name: 'Espresso & Sea Salt', flavor: 'Dark Chocolate · 60g',  price: 5.50, kcal: 190, protein: '4g', tag: 'new',   img: 'img/choc-espresso.png', dietary: ['vegan','glutenFree'] },
    ]},
  ],

  locations: [
    { id: 'l1', name: 'Mitte Gym & Spa',    distance: '0.3 km', status: 'open',   address: 'Alexanderplatz 5',  type: 'gym',       x: 198, y: 128 },
    { id: 'l2', name: 'TU Berlin Campus',   distance: '0.7 km', status: 'open',   address: 'Str. des 17. Juni', type: 'uni',       x: 118, y: 178 },
    { id: 'l3', name: 'WeWork Kreuzberg',   distance: '1.2 km', status: 'open',   address: 'Moritzplatz 2',     type: 'cowork',    x: 258, y: 218 },
    { id: 'l4', name: 'Berlin Hbf Level 2', distance: '1.8 km', status: 'open',   address: 'Europaplatz 1',     type: 'transport', x:  88, y: 118 },
    { id: 'l5', name: 'FU Berlin Mensa',    distance: '3.1 km', status: 'closed', address: 'Boltzmannstr. 1',   type: 'uni',       x: 308, y: 278 },
    { id: 'l6', name: 'East Side Fitness',  distance: '4.2 km', status: 'open',   address: 'Mühlenstraße 50',   type: 'gym',       x: 318, y: 158 },
  ],

  user: {
    name: 'Nadine',
    tier: 'Sprout',
    tierNext: 'Bloom',
    points: 340,
    pointsGoal: 500,
    stamps: 7,
    stampsGoal: 10,
    prefs: { vegan: false, glutenFree: false, highProtein: false },
  },

  activity: [
    { id: 'a1', item: 'Carrot & Walnut Cake', pts: 15, date: 'Today, 11:30',    cat: 'cakes' },
    { id: 'a2', item: 'Classic Coffee',        pts: 10, date: 'Yesterday, 8:15', cat: 'protein-coffee' },
    { id: 'a3', item: 'Teriyaki Chicken',      pts: 25, date: 'Mon, 13:00',      cat: 'rice-bowls' },
  ],

  orders: [
    { id: 'o1', items: 'Carrot Cake · Classic Coffee',     total: '€9.00', date: 'Today',     loc: 'Mitte Gym & Spa' },
    { id: 'o2', items: 'Teriyaki Chicken Bowl',             total: '€7.50', date: 'Yesterday', loc: 'TU Berlin Campus' },
    { id: 'o3', items: 'Chocolate Shake · Protein Cookie', total: '€9.00', date: 'Monday',    loc: 'WeWork Kreuzberg' },
  ],

  featured: ['pc1', 'rb1', 'ca1', 'ps1', 'mm1'],
};

// Standalone-bundle support + localStorage persistence
(function () {
  function asset(p) { return (window.__resources && window.__resources[p]) || p; }
  window.vpAsset = asset;
  window.VP.categories.forEach(function (c) {
    c.products.forEach(function (p) { if (p.img) p.img = asset(p.img); });
  });

  // Persist stamps across sessions; reset to 0 for new users (after logout)
  var savedStamps = localStorage.getItem('vp_stamps');
  if (savedStamps !== null) window.VP.user.stamps = parseInt(savedStamps, 10);
  // else keep the demo value (7) so it looks populated on first load
})();
