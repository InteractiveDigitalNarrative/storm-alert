import { useState } from 'react';
import './Demography.css';
import { useTranslation } from '../hooks/useTranslation';

const BASE_URL = import.meta.env.BASE_URL;

const LEVELS = ['fully', 'somewhat', 'not_at_all'];

// Post-game self-rating — shown BEFORE the ending screen so the scores there
// can't sway the answer. Only shown to players who agreed to share data.
// Same look as the start survey (reuses Demography.css).
function PostRating({ onDone }) {
  const { t } = useTranslation();
  const [level, setLevel] = useState('');

  return (
    <div
      className="demo-screen"
      style={{ backgroundImage: `url(${BASE_URL}Images/winter-storm.jpg)` }}
    >
      <div className="demo-overlay" />
      <div className="demo-vignette" />

      <div className="demo-card">
        <h1 className="demo-title">{t('postRating.title')}</h1>
        <p className="demo-subtitle">{t('postRating.subtitle')}</p>

        <div className="demo-field">
          <label className="demo-label">{t('postRating.question')}</label>
          <div className="demo-pills">
            {LEVELS.map((key) => (
              <button
                key={key}
                type="button"
                className={`demo-pill ${level === key ? 'is-active' : ''}`}
                onClick={() => setLevel(key)}
              >
                {t(`postRating.options.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-actions">
          <button className="demo-skip" type="button" onClick={() => onDone(null)}>
            {t('postRating.skip')}
          </button>
          <button
            className="demo-continue"
            type="button"
            onClick={() => onDone(level)}
            disabled={!level}
          >
            {t('postRating.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostRating;
