# Requirements Document

## Project Description (Input)
The "Reboot de 10 Segundos" mini-game is a short challenge in the world of "Projetor Simulator: Chamados da TI". The player must restore a frozen projector by pressing and holding the power button during the correct timing window, avoiding a premature release or a late release that triggers a failed system reboot. The challenge must feel tense and readable, with clear feedback and a fast reset cycle.

## Requirements

### Requirement 1: Challenge Setup and Objective
**Objective:** As a player, I want a clear and readable objective for the reboot challenge so that I understand what I must do in a few seconds.

#### Acceptance Criteria
1. When the mini-game starts, the system shall show a visible objective stating that the player must hold the button for the correct duration.
2. When the challenge is active, the system shall show a countdown or timing cues that help the player infer the right release moment.
3. While the challenge is running, the system shall provide immediate feedback for success or failure without requiring a full level restart.

### Requirement 2: Input Timing Logic
**Objective:** As a player, I want the button press to be timed precisely so that the challenge feels fair and skill-based.

#### Acceptance Criteria
1. When the player presses and holds the button, the system shall start measuring the hold duration from the first valid press.
2. When the player releases the button before the safe window, the system shall register a failed attempt and provide a concise failure message.
3. When the player releases the button after the safe window, the system shall register a failed attempt and communicate that the reboot exceeded the safe timing.
4. When the player releases the button inside the valid window, the system shall register success and complete the mini-game.

### Requirement 3: Immediate Feedback and Retry Flow
**Objective:** As a player, I want fast feedback and an instant retry path so that I can learn without losing momentum.

#### Acceptance Criteria
1. When a round ends, the system shall show whether the reboot succeeded or failed within 300 ms.
2. If the round fails, the system shall allow a retry without leaving the mini-game scene.
3. If the round succeeds, the system shall trigger the completion state and return control to the parent call flow.
4. The system shall keep the round duration short enough to support a 20-60 second mini-game loop.

### Requirement 4: Visual and Audio Cues
**Objective:** As a player, I want strong signals that distinguish the success window from the danger zone so that I can act without ambiguity.

#### Acceptance Criteria
1. When the timer enters the safe release area, the system shall visually highlight the correct window using contrast, motion, or color cues.
2. When the player is outside the safe window, the system shall communicate that the action is risky using either a warning indicator, sound, or both.
3. While the mini-game is active, the system shall support reduced-motion preferences without removing the essential gameplay information.

### Requirement 5: Integration with the Core Game Loop
**Objective:** As a game designer, I want the mini-game to integrate cleanly with the main gameplay loop so that it can be reused in different school-room scenarios.

#### Acceptance Criteria
1. The mini-game shall expose a standard success/failure result to the parent game flow.
2. The mini-game shall accept configuration for timing window length, reset behavior, and difficulty modifiers.
3. The mini-game shall expose a restart or retry action that does not break the parent mission state.
4. The system shall support the same event contract as the other minigames in the project, including clear outcome payloads.
