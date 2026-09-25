# Implementation Plan

- [ ] 1. Define the mini-game contract and base React scaffold
  - Create the folder and base files for the reboot challenge.
  - Expose a stable result contract so the parent mission can handle success or failure consistently.
  - _Requirements: 1, 5_

- [ ] 1.1 Create the reboot component skeleton
  - Add `src/minigames/reboot/RebootGame.js` and `rebootConfig.js` with basic exports and default configuration.
  - Confirm the component renders in the app without breaking the existing React shell.
  - _Requirements: 1, 5_

- [ ] 1.2 Add the initial UI shell and challenge instructions
  - Render the objective message, button area, and status text.
  - Add the empty state for idle and an explicit prompt to hold the button.
  - _Requirements: 1, 4_

- [ ] 2. Implement the timing loop and rule evaluation
  - Track the hold duration from the first valid press.
  - Evaluate early release, late release, and success inside the safe window.
  - _Requirements: 2, 3_

- [ ] 2.1 Add press, hold, and release event tracking
  - Store `pressStart`, current duration, and latest attempt state.
  - Trigger a failure immediately when the release occurs outside the safe timing zone.
  - _Requirements: 2, 3_

- [ ] 2.2 Add the safe-window calculation and state transitions
  - Define the exact success window from the config and compare it against the measured duration.
  - Switch the component from `active` to `success` or `failure` according to the result.
  - _Requirements: 2, 3_

- [ ] 2.3 Add retry and result payload behavior
  - Return an object containing `success`, `holdDurationMs`, `reason`, and `attemptNumber`.
  - Reset the challenge state cleanly so another attempt can begin without leaving the mini-game scene.
  - _Requirements: 3, 5_

- [ ] 3. Add the visual cues, warnings, and accessibility layer
  - Show a meter, safe window band, and a danger indication while the player is holding the button.
  - Use color, text, or motion to make success/failure obvious without requiring perfect color reading.
  - Respect reduced-motion preferences and readable contrast.
  - _Requirements: 1, 4_

- [ ] 3.1 Implement the styling for the power button and challenge panel
  - Add CSS for the panel, meter, status badge, and button state changes.
  - Keep the layout compact and readable for a 20-60 second challenge.
  - _Requirements: 1, 4_

- [ ] 4. Add focused automated tests for the rules
  - Cover success inside the safe window, early release, and late release.
  - Verify the retry flow and the result payload contract.
  - _Requirements: 2, 3, 5_

- [ ] 4.1 Run the mini-game test suite and collect evidence
  - Execute only the relevant test command for the reboot component.
  - Confirm the pass result and capture the output for the spec evidence trail.
  - _Requirements: 1, 2, 3, 4_
