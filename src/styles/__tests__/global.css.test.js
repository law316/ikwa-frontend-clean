describe('Global Styles', () => {
  let globalStyles;

  beforeEach(() => {
    // Load the global styles
    globalStyles = require('../global.css');
  });

  it('has the correct CSS variables', () => {
    expect(globalStyles).toContain(':root {');
    expect(globalStyles).toContain('--color-primary: var(--color-black)');
    expect(globalStyles).toContain('--color-secondary: var(--color-white)');
    expect(globalStyles).toContain('--color-background: var(--color-white)');
    expect(globalStyles).toContain('--color-text: var(--color-black)');
    expect(globalStyles).toContain('--color-shadow: rgba(0, 0, 0, 0.1)');
    expect(globalStyles).toContain('--color-accent: #333333');
    expect(globalStyles).toContain('background-color: #F5F5F5');
  });

  it('has the correct base styles', () => {
    expect(globalStyles).toContain('* {');
    expect(globalStyles).toContain('margin: 0');
    expect(globalStyles).toContain('padding: 0');
    expect(globalStyles).toContain('box-sizing: border-box');
  });

  it('has the correct body styles', () => {
    expect(globalStyles).toContain('body {');
    expect(globalStyles).toContain('font-family: \'Courier New\', monospace');
    expect(globalStyles).toContain('background-color: var(--color-background)');
    expect(globalStyles).toContain('color: var(--color-text)');
    expect(globalStyles).toContain('line-height: 1.5');
  });

  it('has the correct vintage button styles', () => {
    expect(globalStyles).toContain('.vintage-button {');
    expect(globalStyles).toContain('background-color: var(--color-primary)');
    expect(globalStyles).toContain('color: white');
    expect(globalStyles).toContain('padding: 0.5rem 1rem');
    expect(globalStyles).toContain('border: 2px solid var(--color-primary)');
    expect(globalStyles).toContain('border-radius: 0.25rem');
    expect(globalStyles).toContain('font-family: \'Courier New\', monospace');
    expect(globalStyles).toContain('cursor: pointer');
    expect(globalStyles).toContain('transition: all 0.2s');
  });

  it('has the correct vintage card styles', () => {
    expect(globalStyles).toContain('.vintage-card {');
    expect(globalStyles).toContain('background-color: white');
    expect(globalStyles).toContain('border: 2px solid var(--color-primary)');
    expect(globalStyles).toContain('border-radius: 0.5rem');
    expect(globalStyles).toContain('padding: 1rem');
    expect(globalStyles).toContain('box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)');
  });

  it('has the correct vintage input styles', () => {
    expect(globalStyles).toContain('.vintage-input {');
    expect(globalStyles).toContain('border: 2px solid var(--color-primary)');
    expect(globalStyles).toContain('border-radius: 0.25rem');
    expect(globalStyles).toContain('padding: 0.5rem');
    expect(globalStyles).toContain('font-family: \'Courier New\', monospace');
    expect(globalStyles).toContain('width: 100%');
  });

  it('has the correct vintage select styles', () => {
    expect(globalStyles).toContain('.vintage-select {');
    expect(globalStyles).toContain('border: 2px solid var(--color-primary)');
    expect(globalStyles).toContain('border-radius: 0.25rem');
    expect(globalStyles).toContain('padding: 0.5rem');
    expect(globalStyles).toContain('font-family: \'Courier New\', monospace');
    expect(globalStyles).toContain('width: 100%');
    expect(globalStyles).toContain('appearance: none');
  });

  it('has the correct vintage badge styles', () => {
    expect(globalStyles).toContain('.vintage-badge {');
    expect(globalStyles).toContain('background-color: var(--color-accent)');
    expect(globalStyles).toContain('color: white');
    expect(globalStyles).toContain('padding: 0.25rem 0.5rem');
    expect(globalStyles).toContain('border-radius: 9999px');
    expect(globalStyles).toContain('font-size: 0.875rem');
    expect(globalStyles).toContain('font-weight: bold');
  });

  it('has the correct vintage link styles', () => {
    expect(globalStyles).toContain('.vintage-link {');
    expect(globalStyles).toContain('color: var(--color-primary)');
    expect(globalStyles).toContain('text-decoration: none');
    expect(globalStyles).toContain('border-bottom: 2px solid var(--color-primary)');
    expect(globalStyles).toContain('transition: all 0.2s');
  });

  it('has the correct vintage alert styles', () => {
    expect(globalStyles).toContain('.vintage-alert {');
    expect(globalStyles).toContain('border: 2px solid var(--color-primary)');
    expect(globalStyles).toContain('border-radius: 0.25rem');
    expect(globalStyles).toContain('padding: 1rem');
    expect(globalStyles).toContain('margin: 1rem 0');
    expect(globalStyles).toContain('background-color: #FEF3C7');
  });

  it('has the correct hover styles for buttons', () => {
    expect(globalStyles).toContain('.vintage-button:hover {');
    expect(globalStyles).toContain('background-color: var(--color-secondary)');
    expect(globalStyles).toContain('border-color: var(--color-secondary)');
    expect(globalStyles).toContain('transform: translateY(-1px)');
  });

  it('has the correct hover styles for links', () => {
    expect(globalStyles).toContain('.vintage-link:hover {');
    expect(globalStyles).toContain('color: var(--color-secondary)');
    expect(globalStyles).toContain('border-color: var(--color-secondary)');
  });

  it('has the correct focus styles for inputs', () => {
    expect(globalStyles).toContain('.vintage-input:focus {');
    expect(globalStyles).toContain('outline: none');
    expect(globalStyles).toContain('border-color: var(--color-accent)');
    expect(globalStyles).toContain('box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3)');
  });

  it('has the correct focus styles for selects', () => {
    expect(globalStyles).toContain('.vintage-select:focus {');
    expect(globalStyles).toContain('outline: none');
    expect(globalStyles).toContain('border-color: var(--color-accent)');
    expect(globalStyles).toContain('box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3)');
  });

  it('has the correct disabled styles for buttons', () => {
    expect(globalStyles).toContain('.vintage-button:disabled {');
    expect(globalStyles).toContain('opacity: 0.5');
    expect(globalStyles).toContain('cursor: not-allowed');
  });

  it('has the correct disabled styles for inputs', () => {
    expect(globalStyles).toContain('.vintage-input:disabled {');
    expect(globalStyles).toContain('opacity: 0.5');
    expect(globalStyles).toContain('cursor: not-allowed');
    expect(globalStyles).toContain('background-color: #F3F4F6');
  });

  it('has the correct disabled styles for selects', () => {
    expect(globalStyles).toContain('.vintage-select:disabled {');
    expect(globalStyles).toContain('opacity: 0.5');
    expect(globalStyles).toContain('cursor: not-allowed');
    expect(globalStyles).toContain('background-color: #F3F4F6');
  });

  it('has the correct media queries', () => {
    expect(globalStyles).toContain('@media (max-width: 640px) {');
    expect(globalStyles).toContain('.vintage-card {');
    expect(globalStyles).toContain('padding: 0.75rem');
    expect(globalStyles).toContain('.vintage-button {');
    expect(globalStyles).toContain('width: 100%');
  });

  it('has the correct print styles', () => {
    expect(globalStyles).toContain('@media print {');
    expect(globalStyles).toContain('body {');
    expect(globalStyles).toContain('background-color: white');
    expect(globalStyles).toContain('.vintage-card {');
    expect(globalStyles).toContain('box-shadow: none');
    expect(globalStyles).toContain('.vintage-button {');
    expect(globalStyles).toContain('display: none');
  });

  it('has the correct dark mode styles', () => {
    expect(globalStyles).toContain('@media (prefers-color-scheme: dark) {');
    expect(globalStyles).toContain(':root {');
    expect(globalStyles).toContain('--color-background: #1F2937');
    expect(globalStyles).toContain('--color-text: #F9FAFB');
    expect(globalStyles).toContain('.vintage-card {');
    expect(globalStyles).toContain('background-color: #374151');
  });

  it('has the correct reduced motion styles', () => {
    expect(globalStyles).toContain('@media (prefers-reduced-motion: reduce) {');
    expect(globalStyles).toContain('.vintage-button {');
    expect(globalStyles).toContain('transition: none');
    expect(globalStyles).toContain('.vintage-link {');
    expect(globalStyles).toContain('transition: none');
  });

  it('has the correct high contrast styles', () => {
    expect(globalStyles).toContain('@media (forced-colors: active) {');
    expect(globalStyles).toContain('.vintage-card {');
    expect(globalStyles).toContain('border: 2px solid CanvasText');
    expect(globalStyles).toContain('.vintage-button {');
    expect(globalStyles).toContain('border: 2px solid CanvasText');
    expect(globalStyles).toContain('.vintage-input {');
    expect(globalStyles).toContain('border: 2px solid CanvasText');
    expect(globalStyles).toContain('.vintage-select {');
    expect(globalStyles).toContain('border: 2px solid CanvasText');
  });
}); 