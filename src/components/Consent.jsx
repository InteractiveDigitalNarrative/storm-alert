import { useState } from 'react';
import './Consent.css';
import { useTranslation } from '../hooks/useTranslation';
import { setConsent } from '../lib/data';
import { DATA_CONFIG } from '../lib/data/config';

const BASE_URL = import.meta.env.BASE_URL;

// Consent screen — shown after language select, before the survey. Yes and No
// are equally prominent (no nudging); either way the game stays fully playable.
function Consent({ onDone }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const answer = async (given) => {
    if (busy) return;
    setBusy(true);
    try {
      await setConsent(given);
    } finally {
      onDone(given);
    }
  };

  const list = (key) => (
    <ul className="consent-list">
      {(t(key) || []).map((item) => <li key={item}>{item}</li>)}
    </ul>
  );

  return (
    <div
      className="consent-screen"
      style={{ backgroundImage: `url(${BASE_URL}Images/winter-storm.jpg)` }}
    >
      <div className="consent-overlay" />
      <div className="consent-vignette" />

      <div className="consent-card">
        <h1 className="consent-title">{t('consent.title')}</h1>
        <p className="consent-intro">{t('consent.intro')}</p>

        <div className="consent-section">
          <h2 className="consent-label">{t('consent.collectLabel')}</h2>
          {list('consent.collect')}
        </div>

        <div className="consent-section">
          <h2 className="consent-label">{t('consent.neverLabel')}</h2>
          {list('consent.never')}
        </div>

        <details className="consent-more">
          <summary>{t('consent.moreLabel')}</summary>
          {list('consent.more')}
        </details>

        {DATA_CONFIG.privacyNoticeUrl && (
          <a
            className="consent-link"
            href={DATA_CONFIG.privacyNoticeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('consent.fullNotice')}
          </a>
        )}

        <p className="consent-note">{t('consent.optional')}</p>

        <div className="consent-actions">
          <button
            className="consent-btn"
            type="button"
            onClick={() => answer(false)}
            disabled={busy}
          >
            {t('consent.no')}
          </button>
          <button
            className="consent-btn"
            type="button"
            onClick={() => answer(true)}
            disabled={busy}
          >
            {t('consent.yes')}
          </button>
        </div>

        <p className="consent-version">{DATA_CONFIG.consentVersion}</p>
      </div>
    </div>
  );
}

export default Consent;
