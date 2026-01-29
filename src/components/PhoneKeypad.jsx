// PhoneKeypad.jsx - Phone dialing component for emergency calls

import { useState } from 'react';
import './PhoneKeypad.css';

function PhoneKeypad({ onCall, onCancel, scenario }) {
  const [dialedNumber, setDialedNumber] = useState('');

  const handleDigitPress = (digit) => {
    if (dialedNumber.length < 6) {
      setDialedNumber(prev => prev + digit);
    }
  };

  const handleClear = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setDialedNumber('');
  };

  const handleCall = () => {
    if (dialedNumber.length > 0) {
      onCall(dialedNumber, scenario);
    }
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="phone-keypad-overlay">
      <div className="phone-keypad">
        <div className="phone-header">
          <span className="phone-title">Emergency Call</span>
          <button className="phone-cancel" onClick={onCancel}>✕</button>
        </div>

        <div className="phone-display">
          <span className="dialed-number">{dialedNumber || 'Enter number'}</span>
        </div>

        <div className="keypad-grid">
          {digits.map((digit) => (
            <button
              key={digit}
              className="keypad-digit"
              onClick={() => handleDigitPress(digit)}
            >
              {digit}
            </button>
          ))}
        </div>

        <div className="phone-actions">
          <button
            className="action-btn clear-btn"
            onClick={handleClear}
            onDoubleClick={handleClearAll}
            title="Click to delete, double-click to clear all"
          >
            ⌫
          </button>
          <button
            className="action-btn call-btn"
            onClick={handleCall}
            disabled={dialedNumber.length === 0}
          >
            📞 Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhoneKeypad;
