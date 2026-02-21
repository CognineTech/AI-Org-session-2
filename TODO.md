# Training Process Slide - Next Word Prediction Enhancement

## Steps

- [x] Read and understand current implementation of `deep-learning-slide-10-training-process.html`
- [x] Plan the animation flow (Option B: all words typed one after another)
- [x] Get user confirmation
- [x] Implement cycling word-typing animation:
  - [x] Keep "The sky is" as base text (never erased)
  - [x] After chips appear, apply phase 0 (blue=45% top) → type " blue" char by char
  - [x] Pause → backspace erase " blue" → apply phase 1 (clear=52% top) → type " clear"
  - [x] Pause → backspace erase " clear" → apply phase 2 (cloudy=50% top) → type " cloudy"
  - [x] Loop back to phase 0
  - [x] Cursor stays visible throughout
- [x] Implementation complete
