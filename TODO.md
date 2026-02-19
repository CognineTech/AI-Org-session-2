# Fix Head Matrix (Simplified) - Slide 9

## Steps

- [x] 1. Update `.heatmap-grid` CSS — remove `display:grid` and `grid-template-columns` (grid built dynamically in JS)
- [x] 2. Replace random heatmap JS block with deterministic 5×5 attention matrix
      - Define 5 representative tokens: "The", "Anml", "Str", "it", "Trd"
      - Define predefined 5×5 attention matrix (it-row derived from actual attentionWeights)
      - Add color interpolation: #1e293b (low) → #10b981 (high)
      - Build labeled 6×6 grid (1 label col/row + 5 data cols/rows)
      - Default highlight: "it" row (row index 3)
- [x] 3. Add `updateHeatmapHighlight(rowIdx)` function to dynamically highlight heatmap row on hover
- [x] 4. Update `handleHover(idx)` to call `updateHeatmapHighlight` with the mapped row index
- [ ] 5. Verify in browser — check labels, colors, and dynamic row highlighting
