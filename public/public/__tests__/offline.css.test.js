describe('Offline Page Styles', () => {
  let offlineStyles;

  beforeEach(() => {
    // Load the offline styles
    offlineStyles = require('../offline.css');
  });

  it('has the correct body styles', () => {
    expect(offlineStyles).toContain('body {');
    expect(offlineStyles).toContain('display: flex');
    expect(offlineStyles).toContain('min-height: 100vh');
    expect(offlineStyles).toContain('background-color: #FFFBEB');
    expect(offlineStyles).toContain('font-family: \'Courier New\', monospace');
  });

  it('has the correct container styles', () => {
    expect(offlineStyles).toContain('.offline-container {');
    expect(offlineStyles).toContain('max-width: 600px');
    expect(offlineStyles).toContain('padding: 1rem');
  });

  it('has the correct content styles', () => {
    expect(offlineStyles).toContain('.offline-content {');
    expect(offlineStyles).toContain('background-color: white');
    expect(offlineStyles).toContain('border: 2px solid #B45309');
    expect(offlineStyles).toContain('border-radius: 0.5rem');
    expect(offlineStyles).toContain('box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)');
  });

  it('has the correct icon styles', () => {
    expect(offlineStyles).toContain('.offline-icon {');
    expect(offlineStyles).toContain('color: #B45309');
    expect(offlineStyles).toContain('animation: pulse 2s infinite');
  });

  it('has the correct title styles', () => {
    expect(offlineStyles).toContain('.offline-title {');
    expect(offlineStyles).toContain('font-size: 1.5rem');
    expect(offlineStyles).toContain('font-weight: bold');
    expect(offlineStyles).toContain('color: #B45309');
  });

  it('has the correct message styles', () => {
    expect(offlineStyles).toContain('.offline-message {');
    expect(offlineStyles).toContain('color: #4B5563');
    expect(offlineStyles).toContain('margin: 1rem 0');
  });

  it('has the correct actions styles', () => {
    expect(offlineStyles).toContain('.offline-actions {');
    expect(offlineStyles).toContain('display: flex');
    expect(offlineStyles).toContain('gap: 1rem');
    expect(offlineStyles).toContain('margin: 1.5rem 0');
  });

  it('has the correct button styles', () => {
    expect(offlineStyles).toContain('.retry-button {');
    expect(offlineStyles).toContain('background-color: #B45309');
    expect(offlineStyles).toContain('color: white');
    expect(offlineStyles).toContain('padding: 0.5rem 1rem');
    expect(offlineStyles).toContain('border-radius: 0.25rem');
    expect(offlineStyles).toContain('border: none');
    expect(offlineStyles).toContain('cursor: pointer');
    expect(offlineStyles).toContain('transition: background-color 0.2s');
  });

  it('has the correct back button styles', () => {
    expect(offlineStyles).toContain('.back-button {');
    expect(offlineStyles).toContain('background-color: transparent');
    expect(offlineStyles).toContain('color: #B45309');
    expect(offlineStyles).toContain('border: 2px solid #B45309');
  });

  it('has the correct tips styles', () => {
    expect(offlineStyles).toContain('.offline-tips {');
    expect(offlineStyles).toContain('margin-top: 2rem');
    expect(offlineStyles).toContain('padding-top: 1.5rem');
    expect(offlineStyles).toContain('border-top: 1px solid #E5E7EB');
  });

  it('has the correct tips title styles', () => {
    expect(offlineStyles).toContain('.tips-title {');
    expect(offlineStyles).toContain('font-size: 1.25rem');
    expect(offlineStyles).toContain('font-weight: bold');
    expect(offlineStyles).toContain('color: #B45309');
    expect(offlineStyles).toContain('margin-bottom: 1rem');
  });

  it('has the correct tips list styles', () => {
    expect(offlineStyles).toContain('.tips-list {');
    expect(offlineStyles).toContain('list-style: none');
    expect(offlineStyles).toContain('padding: 0');
    expect(offlineStyles).toContain('margin: 0');
  });

  it('has the correct tip item styles', () => {
    expect(offlineStyles).toContain('.tip-item {');
    expect(offlineStyles).toContain('display: flex');
    expect(offlineStyles).toContain('align-items: center');
    expect(offlineStyles).toContain('gap: 0.5rem');
    expect(offlineStyles).toContain('margin-bottom: 0.75rem');
    expect(offlineStyles).toContain('color: #4B5563');
  });

  it('has the correct tip icon styles', () => {
    expect(offlineStyles).toContain('.tip-icon {');
    expect(offlineStyles).toContain('color: #B45309');
  });

  it('has the correct hover styles for buttons', () => {
    expect(offlineStyles).toContain('.retry-button:hover {');
    expect(offlineStyles).toContain('background-color: #92400E');
    expect(offlineStyles).toContain('.back-button:hover {');
    expect(offlineStyles).toContain('background-color: #FEF3C7');
  });

  it('has the correct focus styles for buttons', () => {
    expect(offlineStyles).toContain('.retry-button:focus {');
    expect(offlineStyles).toContain('outline: none');
    expect(offlineStyles).toContain('box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.3)');
    expect(offlineStyles).toContain('.back-button:focus {');
    expect(offlineStyles).toContain('outline: none');
    expect(offlineStyles).toContain('box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.3)');
  });

  it('has the correct active styles for buttons', () => {
    expect(offlineStyles).toContain('.retry-button:active {');
    expect(offlineStyles).toContain('transform: translateY(1px)');
    expect(offlineStyles).toContain('.back-button:active {');
    expect(offlineStyles).toContain('transform: translateY(1px)');
  });

  it('has the correct disabled styles for buttons', () => {
    expect(offlineStyles).toContain('.retry-button:disabled {');
    expect(offlineStyles).toContain('opacity: 0.5');
    expect(offlineStyles).toContain('cursor: not-allowed');
    expect(offlineStyles).toContain('.back-button:disabled {');
    expect(offlineStyles).toContain('opacity: 0.5');
    expect(offlineStyles).toContain('cursor: not-allowed');
  });

  it('has the correct animation keyframes', () => {
    expect(offlineStyles).toContain('@keyframes pulse {');
    expect(offlineStyles).toContain('0% {');
    expect(offlineStyles).toContain('transform: scale(1)');
    expect(offlineStyles).toContain('50% {');
    expect(offlineStyles).toContain('transform: scale(1.1)');
    expect(offlineStyles).toContain('100% {');
    expect(offlineStyles).toContain('transform: scale(1)');
  });

  it('has the correct media queries', () => {
    expect(offlineStyles).toContain('@media (max-width: 640px) {');
    expect(offlineStyles).toContain('.offline-container {');
    expect(offlineStyles).toContain('padding: 0.5rem');
    expect(offlineStyles).toContain('.offline-title {');
    expect(offlineStyles).toContain('font-size: 1.25rem');
    expect(offlineStyles).toContain('.offline-message {');
    expect(offlineStyles).toContain('font-size: 0.875rem');
    expect(offlineStyles).toContain('.offline-actions {');
    expect(offlineStyles).toContain('flex-direction: column');
    expect(offlineStyles).toContain('.retry-button, .back-button {');
    expect(offlineStyles).toContain('width: 100%');
  });

  it('has the correct print styles', () => {
    expect(offlineStyles).toContain('@media print {');
    expect(offlineStyles).toContain('body {');
    expect(offlineStyles).toContain('background-color: white');
    expect(offlineStyles).toContain('.offline-content {');
    expect(offlineStyles).toContain('box-shadow: none');
    expect(offlineStyles).toContain('.offline-actions {');
    expect(offlineStyles).toContain('display: none');
  });

  it('has the correct dark mode styles', () => {
    expect(offlineStyles).toContain('@media (prefers-color-scheme: dark) {');
    expect(offlineStyles).toContain('body {');
    expect(offlineStyles).toContain('background-color: #1F2937');
    expect(offlineStyles).toContain('.offline-content {');
    expect(offlineStyles).toContain('background-color: #374151');
    expect(offlineStyles).toContain('.offline-message {');
    expect(offlineStyles).toContain('color: #D1D5DB');
    expect(offlineStyles).toContain('.tip-item {');
    expect(offlineStyles).toContain('color: #D1D5DB');
  });

  it('has the correct reduced motion styles', () => {
    expect(offlineStyles).toContain('@media (prefers-reduced-motion: reduce) {');
    expect(offlineStyles).toContain('.offline-icon {');
    expect(offlineStyles).toContain('animation: none');
    expect(offlineStyles).toContain('.retry-button, .back-button {');
    expect(offlineStyles).toContain('transition: none');
  });

  it('has the correct high contrast styles', () => {
    expect(offlineStyles).toContain('@media (forced-colors: active) {');
    expect(offlineStyles).toContain('.offline-content {');
    expect(offlineStyles).toContain('border: 2px solid CanvasText');
    expect(offlineStyles).toContain('.retry-button {');
    expect(offlineStyles).toContain('border: 2px solid CanvasText');
    expect(offlineStyles).toContain('.back-button {');
    expect(offlineStyles).toContain('border: 2px solid CanvasText');
  });
}); 