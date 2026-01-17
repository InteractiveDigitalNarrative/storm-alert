// Menu.jsx - Main menu component for 72 Hours game

// STEP 1: IMPORTS
// Import React and the useState hook (for managing state)
import React, { useState } from 'react';
// Import the CSS file for this component
import './Menu.css';

// STEP 2: COMPONENT FUNCTION
// This component receives 3 props from its parent:
// - onStartGame: function to call when user clicks "Start"
// - onContinueGame: function to call when user clicks "Continue"
// - hasSavedGame: boolean - true if there's a saved game
function Menu({ onStartGame, onContinueGame, hasSavedGame }) {

  // STEP 3: STATE
  // Create a state variable to track if About modal is visible
  // showAbout = current value (starts as false = hidden)
  // setShowAbout = function to update the value
  const [showAbout, setShowAbout] = useState(false);

  // STEP 4: EVENT HANDLERS
  // These functions run when user clicks buttons

  // When user clicks "Start Mission"
  const handleStartClick = () => {
    onStartGame(); // Call the function passed from parent (App.jsx)
  };

  // When user clicks "Continue"
  const handleContinueClick = () => {
    onContinueGame(); // Call the function passed from parent
  };

  // When user clicks "About"
  const handleAboutClick = () => {
    setShowAbout(true); // Update state - modal becomes visible
  };

  // When user closes the About modal
  const handleCloseAbout = () => {
    setShowAbout(false); // Update state - modal becomes hidden
  };

  // STEP 5: RETURN JSX (What the component displays)
  return (
    <>
      {/* Fragment <> </> lets us return multiple elements without adding extra div */}

      {/* MAIN MENU CONTAINER */}
      <div className="menu-container">
        <div className="menu-content">

          {/* HEADER SECTION */}
          <div className="menu-header">
            <div className="emergency-badge">EMERGENCY PROTOCOL</div>
            <h1 className="menu-title">72 HOURS</h1>
            <p className="menu-subtitle">Disaster Management Simulation</p>
          </div>

          {/* BUTTONS SECTION */}
          <div className="menu-buttons">

            {/* START BUTTON - Always visible */}
            <button onClick={handleStartClick} className="menu-btn primary">
              <span className="btn-icon">▶</span>
              <span className="btn-text">START MISSION</span>
            </button>

            {/* CONTINUE BUTTON - Only show if hasSavedGame is true */}
            {hasSavedGame && (
              <button onClick={handleContinueClick} className="menu-btn secondary">
                <span className="btn-icon">↻</span>
                <span className="btn-text">CONTINUE</span>
              </button>
            )}

            {/* ABOUT BUTTON - Always visible */}
            <button onClick={handleAboutClick} className="menu-btn secondary">
              <span className="btn-icon">ℹ</span>
              <span className="btn-text">ABOUT</span>
            </button>
          </div>

          {/* FOOTER SECTION */}
          <div className="menu-footer">
            <p className="tagline">Every decision counts. Time is running out.</p>
          </div>
        </div>

        {/* Background overlay */}
        <div className="menu-overlay"></div>
      </div>

      {/* ABOUT MODAL - Only shows when showAbout is true */}
      {showAbout && (
        <div className="modal">
          <div className="modal-content">
            {/* Close button (X) */}
            <span className="close-modal" onClick={handleCloseAbout}>&times;</span>

            <h2>About 72 Hours</h2>
            <p>
              In the critical first 72 hours after a disaster strikes, every decision matters.
              As an emergency response coordinator, you must manage resources, make tough choices,
              and save as many lives as possible.
            </p>
            <p>
              Navigate complex scenarios, balance competing needs, and experience the challenges
              of real disaster management.
            </p>

            {/* Got It button */}
            <button className="menu-btn primary" onClick={handleCloseAbout}>
              GOT IT
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// STEP 4: EXPORT
// Make this component available to import in other files
export default Menu;
