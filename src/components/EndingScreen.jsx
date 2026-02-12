import './EndingScreen.css';

const ENDING_CONFIG = {
  good:    { color: '#4caf50', label: 'WELL PREPARED',       summary: 'You were ready for the crisis and knew exactly who to call.' },
  partial: { color: '#6495ed', label: 'PARTIALLY PREPARED',  summary: 'Help arrived, but the right number would have been faster.' },
  delayed: { color: '#ff9933', label: 'UNDERPREPARED',       summary: 'Help was delayed — calling 112 for a non-emergency tied up resources.' },
  bad:     { color: '#e74c3c', label: 'UNPREPARED',          summary: 'Without the right number, help came too late. Grandmother was lucky.' },
};

const CATEGORIES = [
  { key: 'prep_water',      icon: '💧', label: 'Water' },
  { key: 'prep_food',       icon: '🍞', label: 'Food' },
  { key: 'prep_heat',       icon: '🔥', label: 'Heat' },
  { key: 'prep_light',      icon: '🔦', label: 'Light' },
  { key: 'prep_info',       icon: '📻', label: 'Info' },
  { key: 'prep_medication', icon: '💊', label: 'Medication' },
];

const CATEGORY_RESULTS = {
  prep_water: {
    0: { consequence: 'Taps were dead — barely any water left', feedback: 'Store 3L per person per day before the power goes out' },
    1: { consequence: 'Limited water — had to ration carefully', feedback: 'Fill all available containers: bottles, pots, bathtub' },
    2: { consequence: 'Plenty of water stored and ready', feedback: null },
  },
  prep_food: {
    0: { consequence: 'Fridge warming, almost nothing to eat', feedback: 'Stock canned goods, nuts, and energy bars — no fridge or stove needed' },
    1: { consequence: 'Some pantry food, but not much variety', feedback: 'Add shelf-stable items: cans, crackers, dried fruit, energy bars' },
    2: { consequence: 'Emergency food supplies ready to eat', feedback: null },
  },
  prep_heat: {
    0: { consequence: 'House temperature dropped dangerously', feedback: 'Seal windows, prepare a wood stove, layer clothing before a storm' },
    1: { consequence: 'Blankets helped, but still cold by dawn', feedback: 'A wood stove is your best backup when central heating fails' },
    2: { consequence: 'Wood stove kept the house warm all night', feedback: null },
  },
  prep_light: {
    0: { consequence: 'Phone drained fast as your only light', feedback: 'Keep a flashlight in a known spot — save your phone for calls' },
    1: { consequence: 'Flashlight worked but batteries were weak', feedback: 'Always keep fresh batteries next to your flashlight' },
    2: { consequence: 'Bright flashlight ready, candles as backup', feedback: null },
  },
  prep_info: {
    0: { consequence: 'No radio — phone died with no updates', feedback: 'A battery radio is your lifeline when internet and power are down' },
    1: { consequence: 'Radio signal weak, caught only fragments', feedback: 'Fresh batteries make the difference between static and a clear signal' },
    2: { consequence: 'Clear radio signal — knew help was coming', feedback: null },
  },
  prep_medication: {
    0: { consequence: 'Scrambled to find pills, unsure of dosage', feedback: 'Keep a 7-day supply of prescription meds counted and organized' },
    1: { consequence: 'Found pills but hard to read labels in dark', feedback: 'Organize pills by day so anyone can administer them — even in the dark' },
    2: { consequence: 'Pills organized by day, grandmother self-served', feedback: null },
  },
};

const EMERGENCY_NUMBERS = [
  { number: '112',  desc: 'Life-threatening emergencies', correct: false },
  { number: '1220', desc: 'Family doctor / health advice', correct: true },
  { number: '1247', desc: 'Rescue coordination',          correct: false },
  { number: '1343', desc: 'Power outage reporting',       correct: false },
];

function EndingScreen({ gameVars, endingType, onPlayAgain }) {
  const config = ENDING_CONFIG[endingType] || ENDING_CONFIG.bad;
  const totalPrep = gameVars.total_prep || 0;
  const dialedNumber = gameVars.dialed_number || '';

  // Generate dynamic takeaways based on what wasn't prepared
  const takeaways = [];
  for (const cat of CATEGORIES) {
    const level = gameVars[cat.key] || 0;
    const result = CATEGORY_RESULTS[cat.key]?.[level];
    if (result?.feedback) {
      takeaways.push(result.feedback);
    }
  }
  if (takeaways.length === 0) {
    takeaways.push('You were well prepared — share this knowledge with family and neighbors.');
  }
  takeaways.push('Visit olevalmis.ee for Estonia\'s official preparedness guide.');

  // Prep level dots
  const renderDots = (level) => (
    <span className="prep-dots">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`dot ${i < level ? 'filled' : ''}`} />
      ))}
    </span>
  );

  // Border color per level
  const levelColor = (level) => {
    if (level === 0) return '#e74c3c';
    if (level === 1) return '#ff9933';
    return '#4caf50';
  };

  return (
    <div className="ending-overlay">
      <div className="ending-screen">

        {/* Header Badge */}
        <div className="ending-badge" style={{ borderColor: config.color }}>
          <h2 style={{ color: config.color }}>{config.label}</h2>
          <p className="ending-summary">{config.summary}</p>
        </div>

        {/* Preparation Report Card */}
        <h3 className="section-title">Preparation Report</h3>
        <div className="report-grid">
          {CATEGORIES.map((cat) => {
            const level = gameVars[cat.key] || 0;
            const result = CATEGORY_RESULTS[cat.key]?.[level] || {};
            return (
              <div
                key={cat.key}
                className="report-card"
                style={{ borderColor: levelColor(level) }}
              >
                <div className="card-header">
                  <span className="card-icon">{cat.icon}</span>
                  <span className="card-label">{cat.label}</span>
                  {renderDots(level)}
                </div>
                <p className="card-consequence">{result.consequence}</p>
                {result.feedback && (
                  <p className="card-feedback">{result.feedback}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Numbers Reference */}
        <h3 className="section-title">Emergency Numbers</h3>
        <div className="numbers-box">
          {EMERGENCY_NUMBERS.map((entry) => (
            <div
              key={entry.number}
              className={`number-row ${dialedNumber === entry.number ? 'dialed' : ''} ${entry.correct ? 'correct-number' : ''}`}
            >
              <span className="num">{entry.number}</span>
              <span className="num-desc">{entry.desc}</span>
              {dialedNumber === entry.number && (
                <span className="num-tag">
                  {entry.correct ? '✓ You called this' : '✗ You called this'}
                </span>
              )}
              {entry.correct && dialedNumber !== entry.number && (
                <span className="num-tag best">Best choice</span>
              )}
            </div>
          ))}
          <p className="numbers-hint">Did you write these down during the broadcast?</p>
        </div>

        {/* Key Takeaways */}
        <h3 className="section-title">Key Takeaways</h3>
        <ul className="takeaways">
          {takeaways.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>

        {/* Score */}
        <div className="prep-score">
          <span className="score-number">{totalPrep}</span>
          <span className="score-label">/ 12 preparedness score</span>
        </div>

        {/* Play Again */}
        <button className="play-again-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default EndingScreen;
