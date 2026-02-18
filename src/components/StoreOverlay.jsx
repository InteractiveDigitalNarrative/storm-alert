import { useState, useCallback, useMemo } from 'react';
import './StoreOverlay.css';

const STORE_ITEMS = [
  // ── ESSENTIALS ──────────────────────────────────────────────
  { id: 'water',         name: 'Bottled Water',       emoji: '💧', category: 'essentials', quality: 'good', description: 'Several litres' },
  { id: 'batteries',     name: 'AA Batteries',         emoji: '🔋', category: 'essentials', quality: 'good', description: 'Pack of 8' },
  { id: 'candles',       name: 'Emergency Candles',    emoji: '🕯️', category: 'essentials', quality: 'good', description: 'Burns 8 hrs each' },
  { id: 'matches',       name: 'Waterproof Matches',   emoji: '🔥', category: 'essentials', quality: 'good', description: 'Strike anywhere' },
  { id: 'first_aid',     name: 'First Aid Kit',        emoji: '🩹', category: 'essentials', quality: 'good', description: 'Bandages, antiseptic' },
  { id: 'power_bank',    name: 'Power Bank',           emoji: '📱', category: 'essentials', quality: 'good', description: '20,000 mAh' },
  { id: 'blanket',       name: 'Emergency Blanket',    emoji: '🛏️', category: 'essentials', quality: 'good', description: 'Retains 90% body heat' },
  { id: 'hand_sanitizer',name: 'Hand Sanitizer',       emoji: '🧴', category: 'essentials', quality: 'good', description: 'No running water needed' },
  { id: 'radio_manual',  name: 'Hand-crank Radio',     emoji: '📻', category: 'essentials', quality: 'good', description: 'No batteries needed' },
  { id: 'whistle',       name: 'Emergency Whistle',    emoji: '🔔', category: 'essentials', quality: 'good', description: 'Signal for help' },
  { id: 'scented_candle',name: 'Scented Candle',       emoji: '🪔', category: 'essentials', quality: 'okay', description: 'Decorative candle', feedback: 'It gives some light, but melts faster than proper emergency candles.' },

  // ── FOOD & WATER ─────────────────────────────────────────────
  { id: 'canned',        name: 'Canned Food',          emoji: '🥫', category: 'food', quality: 'good', description: 'Meat, fish, veg' },
  { id: 'crackers',      name: 'Crackers & Biscuits',  emoji: '🍪', category: 'food', quality: 'good', description: 'Long shelf life' },
  { id: 'nuts',          name: 'Nuts & Dried Fruit',   emoji: '🥜', category: 'food', quality: 'good', description: 'High energy' },
  { id: 'energy_bars',   name: 'Energy Bars',          emoji: '🍫', category: 'food', quality: 'good', description: 'Ready to eat' },
  { id: 'chocolate',     name: 'Chocolate',            emoji: '🍫', category: 'food', quality: 'good', description: 'Quick energy boost' },
  { id: 'bread',         name: 'Long-life Bread',      emoji: '🍞', category: 'food', quality: 'good', description: "Won't go stale" },
  { id: 'honey_jam',     name: 'Honey & Jam',          emoji: '🍯', category: 'food', quality: 'good', description: 'Lasts indefinitely' },
  { id: 'peanut_butter', name: 'Peanut Butter',        emoji: '🥜', category: 'food', quality: 'good', description: 'High protein & calories' },
  { id: 'dried',         name: 'Dried Foods',          emoji: '🍝', category: 'food', quality: 'okay', description: 'Pasta, rice, oats', feedback: 'Pasta and rice need cooking — oats are fine as-is.' },
  { id: 'instant_noodles',name: 'Instant Noodles',     emoji: '🍜', category: 'food', quality: 'okay', description: 'Just add water', feedback: 'You\'ll need a heat source and water to prepare these.' },
  { id: 'frozen',        name: 'Frozen Meals',         emoji: '🧊', category: 'food', quality: 'bad',  description: 'Microwave meals', feedback: 'No power = no freezer. These will spoil within hours.' },
  { id: 'milk',          name: 'Fresh Milk',           emoji: '🥛', category: 'food', quality: 'bad',  description: '1 litre carton', feedback: 'Spoils fast without a fridge. Buy UHT milk instead.' },
  { id: 'fresh',         name: 'Fresh Vegetables',     emoji: '🥬', category: 'food', quality: 'bad',  description: 'Salad, tomatoes', feedback: 'Will wilt and rot without refrigeration.' },
  { id: 'yogurt',        name: 'Yogurt',               emoji: '🥣', category: 'food', quality: 'bad',  description: 'Dairy cups', feedback: 'Needs to stay cold — it won\'t last.' },
  { id: 'sushi',         name: 'Fresh Sushi',          emoji: '🍣', category: 'food', quality: 'bad',  description: 'Ready-made rolls', feedback: 'Raw fish spoils dangerously fast without refrigeration.' },
  { id: 'deli',          name: 'Deli Meats',           emoji: '🥩', category: 'food', quality: 'bad',  description: 'Sliced ham & turkey', feedback: 'Spoils in hours without refrigeration.' },
  { id: 'birthday_cake', name: 'Birthday Cake',        emoji: '🎂', category: 'food', quality: 'bad',  description: 'Cream frosted cake', feedback: 'Perishable, heavy, and not exactly survival food.' },

  // ── LUXURY & IMPULSE BUYS ─────────────────────────────────────
  { id: 'playing_cards', name: 'Playing Cards',        emoji: '🃏', category: 'luxury', quality: 'good', description: 'No power needed!' },
  { id: 'board_game',    name: 'Board Game',           emoji: '🎲', category: 'luxury', quality: 'okay', description: 'Pass the time', feedback: 'Fair enough — at least it doesn\'t need electricity.' },
  { id: 'book',          name: 'Paperback Book',       emoji: '📚', category: 'luxury', quality: 'okay', description: 'Something to read', feedback: 'Not a bad choice — books work in the dark with a candle.' },
  { id: 'cigarettes',    name: 'Cigarettes',           emoji: '🚬', category: 'luxury', quality: 'okay', description: 'Pack of 20', feedback: 'A fire hazard and health risk — the last thing you need right now.' },
  { id: 'alcohol',       name: 'Beer & Wine',          emoji: '🍺', category: 'luxury', quality: 'okay', description: 'Mixed selection', feedback: 'Alcohol impairs judgment exactly when you need it most. And it dehydrates you.' },
  { id: 'energy_drink',  name: 'Energy Drinks',        emoji: '🥤', category: 'luxury', quality: 'okay', description: 'Crate of cans', feedback: 'Loaded with sugar and caffeine — will spike and crash your energy.' },
  { id: 'video_games',   name: 'Video Games',          emoji: '🎮', category: 'luxury', quality: 'bad',  description: 'Console + games', feedback: 'No power, no gaming. This stays on the shelf.' },
  { id: 'tv',            name: 'New Television',       emoji: '📺', category: 'luxury', quality: 'bad',  description: '55-inch smart TV', feedback: 'You can\'t carry this, and there\'s no power anyway.' },
  { id: 'fashion',       name: 'Fashion Clothes',      emoji: '👗', category: 'luxury', quality: 'bad',  description: 'Seasonal collection', feedback: 'Style won\'t keep you warm when the heating dies.' },
  { id: 'perfume',       name: 'Luxury Perfume',       emoji: '💐', category: 'luxury', quality: 'bad',  description: 'Designer fragrance', feedback: 'Smelling great won\'t help you survive the storm.' },
  { id: 'espresso',      name: 'Espresso Machine',     emoji: '☕', category: 'luxury', quality: 'bad',  description: 'Premium coffee maker', feedback: 'Needs electricity and running water. Leave it.' },
  { id: 'flowers',       name: 'Fresh Flowers',        emoji: '🌹', category: 'luxury', quality: 'bad',  description: 'Bouquet of roses', feedback: 'These will wilt before the storm even hits.' },
  { id: 'sunglasses',    name: 'Designer Sunglasses',  emoji: '🕶️', category: 'luxury', quality: 'bad',  description: 'Limited edition', feedback: 'Hard to see the appeal when there\'s a storm coming.' },
  { id: 'gym_weights',   name: 'Dumbbells',            emoji: '🏋️', category: 'luxury', quality: 'bad',  description: 'Heavy iron set', feedback: 'Great in normal life — completely useless right now.' },
];

const CATEGORIES = [
  { id: 'essentials', label: 'Essentials', emoji: '🛡️', description: 'Critical supplies for the storm' },
  { id: 'food',       label: 'Food & Drink', emoji: '🍽️', description: 'Choose non-perishables that don\'t need refrigeration' },
  { id: 'luxury',     label: 'Luxury',     emoji: '🛍️', description: 'Is this really the time?' },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function StoreOverlay({ shopWater, shopFood, shopBatteries, shopWaterAmount, onClose }) {
  const [basket, setBasket] = useState([]);
  const [toast, setToast] = useState(null);
  const [shakingItem, setShakingItem] = useState(null);

  // Shuffle items once per store open — keeps order stable across re-renders
  const shuffledItems = useMemo(() => shuffle(STORE_ITEMS), []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleItemClick = useCallback((item) => {
    if (basket.includes(item.id)) return;

    if (item.quality === 'bad') {
      setShakingItem(item.id);
      showToast(item.feedback, 'bad');
      setTimeout(() => setShakingItem(null), 500);
      return;
    }

    if (item.quality === 'okay') {
      showToast(item.feedback, 'okay');
    }

    setBasket(prev => [...prev, item.id]);
  }, [basket, showToast]);

  const handleCheckout = () => onClose(basket);

  // Which items are available based on shop flags + category rules
  const isAvailable = (item) => {
    if (item.category === 'luxury') return true; // always stocked
    if (item.category === 'essentials') {
      if (item.id === 'water')    return shopWater;
      if (item.id === 'batteries') return shopBatteries;
      return true; // other essentials always available
    }
    if (item.category === 'food') return shopFood;
    return false;
  };

  const getDescription = (item) => {
    if (item.id === 'water') return shopWaterAmount ? `${shopWaterAmount}L` : item.description;
    return item.description;
  };

  return (
    <div className="store-overlay">
      <div className="store-container">

        {/* Header */}
        <div className="store-header">
          <span className="store-title">Emergency Shopping</span>
          <span className="store-subtitle">Grab what you need before the storm hits</span>
        </div>

        {/* Categorised shelves */}
        <div className="store-shelves">
          {CATEGORIES.map(cat => {
            const items = shuffledItems.filter(i => i.category === cat.id && isAvailable(i));
            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="store-category">
                <div className={`store-category-header store-category-${cat.id}`}>
                  <span className="store-category-emoji">{cat.emoji}</span>
                  <div>
                    <span className="store-category-name">{cat.label}</span>
                    <span className="store-category-desc">{cat.description}</span>
                  </div>
                </div>

                <div className="store-items-grid">
                  {items.map(item => {
                    const inBasket  = basket.includes(item.id);
                    const isShaking = shakingItem === item.id;

                    return (
                      <button
                        key={item.id}
                        className={[
                          'store-item',
                          `store-item-${item.quality}`,
                          inBasket  ? 'store-item-selected' : '',
                          isShaking ? 'store-item-shake'    : '',
                        ].join(' ')}
                        onClick={() => handleItemClick(item)}
                        disabled={inBasket}
                      >
                        <span className="store-item-emoji">{item.emoji}</span>
                        <span className="store-item-name">{item.name}</span>
                        <span className="store-item-desc">{getDescription(item)}</span>
                        {inBasket && <span className="store-item-check">&#10003;</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Basket */}
        <div className="store-basket">
          <span className="store-basket-label">🛒 Basket</span>
          <div className="store-basket-items">
            {basket.length === 0 && (
              <span className="store-basket-empty">Click items to add them</span>
            )}
            {basket.map(id => {
              const item = STORE_ITEMS.find(i => i.id === id);
              return (
                <span key={id} className="store-basket-chip">
                  {item.emoji} {item.name}
                </span>
              );
            })}
          </div>
        </div>

        <button className="store-checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>

      {toast && (
        <div className={`store-toast store-toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default StoreOverlay;
