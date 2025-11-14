describe('Offline Page', () => {
  let offlinePage;

  beforeEach(() => {
    // Load the offline page
    offlinePage = require('../offline.html');
  });

  it('has the correct HTML structure', () => {
    expect(offlinePage).toContain('<!DOCTYPE html>');
    expect(offlinePage).toContain('<html lang="en">');
    expect(offlinePage).toContain('<head>');
    expect(offlinePage).toContain('<body>');
  });

  it('has the correct meta tags', () => {
    expect(offlinePage).toContain('<meta charset="utf-8">');
    expect(offlinePage).toContain('<meta name="viewport" content="width=device-width, initial-scale=1">');
    expect(offlinePage).toContain('<meta name="theme-color" content="#000000">');
    expect(offlinePage).toContain('<meta name="description" content="You are currently offline. Browse your saved items and previously loaded content.">');
  });

  it('has the correct title', () => {
    expect(offlinePage).toContain('<title>Offline - Lace and Legacy</title>');
  });

  it('has the correct stylesheet link', () => {
    expect(offlinePage).toContain('<link rel="stylesheet" href="offline.css">');
  });

  it('has the correct offline message', () => {
    expect(offlinePage).toContain('You are currently offline');
    expect(offlinePage).toContain('Don\'t worry! You can still browse your saved items and previously loaded content.');
  });

  it('has the correct action buttons', () => {
    expect(offlinePage).toContain('Try Again');
    expect(offlinePage).toContain('Go Back');
  });

  it('has the correct quick tips', () => {
    expect(offlinePage).toContain('Quick Tips');
    expect(offlinePage).toContain('Check your internet connection');
    expect(offlinePage).toContain('Try refreshing the page');
    expect(offlinePage).toContain('Browse your saved items');
  });

  it('has the correct offline icon', () => {
    expect(offlinePage).toContain('<svg');
    expect(offlinePage).toContain('class="offline-icon"');
  });

  it('has the correct script for checking online status', () => {
    expect(offlinePage).toContain('<script>');
    expect(offlinePage).toContain('window.addEventListener(\'online\'');
    expect(offlinePage).toContain('window.location.reload()');
  });

  it('has the correct container classes', () => {
    expect(offlinePage).toContain('class="offline-container"');
    expect(offlinePage).toContain('class="offline-content"');
    expect(offlinePage).toContain('class="offline-actions"');
    expect(offlinePage).toContain('class="offline-tips"');
  });

  it('has the correct button classes', () => {
    expect(offlinePage).toContain('class="retry-button"');
    expect(offlinePage).toContain('class="back-button"');
  });

  it('has the correct list classes', () => {
    expect(offlinePage).toContain('class="tips-list"');
  });

  it('has the correct icon classes', () => {
    expect(offlinePage).toContain('class="tip-icon"');
  });

  it('has the correct heading classes', () => {
    expect(offlinePage).toContain('class="offline-title"');
    expect(offlinePage).toContain('class="offline-message"');
    expect(offlinePage).toContain('class="tips-title"');
  });

  it('has the correct button event handlers', () => {
    expect(offlinePage).toContain('onclick="window.location.reload()"');
    expect(offlinePage).toContain('onclick="window.history.back()"');
  });

  it('has the correct SVG attributes', () => {
    expect(offlinePage).toContain('width="64"');
    expect(offlinePage).toContain('height="64"');
    expect(offlinePage).toContain('viewBox="0 0 24 24"');
    expect(offlinePage).toContain('fill="none"');
    expect(offlinePage).toContain('stroke="currentColor"');
    expect(offlinePage).toContain('stroke-width="2"');
  });

  it('has the correct SVG paths', () => {
    expect(offlinePage).toContain('d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"');
    expect(offlinePage).toContain('d="M12 8v4"');
    expect(offlinePage).toContain('d="M12 16h.01"');
  });

  it('has the correct list item structure', () => {
    expect(offlinePage).toContain('<li class="tip-item">');
    expect(offlinePage).toContain('<span class="tip-icon">');
    expect(offlinePage).toContain('</span>');
    expect(offlinePage).toContain('</li>');
  });

  it('has the correct button structure', () => {
    expect(offlinePage).toContain('<button class="retry-button"');
    expect(offlinePage).toContain('<button class="back-button"');
  });

  it('has the correct content structure', () => {
    expect(offlinePage).toContain('<div class="offline-container">');
    expect(offlinePage).toContain('<div class="offline-content">');
    expect(offlinePage).toContain('<div class="offline-actions">');
    expect(offlinePage).toContain('<div class="offline-tips">');
  });

  it('has the correct meta description length', () => {
    const metaDescription = offlinePage.match(/<meta name="description" content="([^"]+)">/)[1];
    expect(metaDescription.length).toBeLessThanOrEqual(160);
  });

  it('has the correct viewport settings', () => {
    expect(offlinePage).toContain('width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
  });

  it('has the correct theme color', () => {
    expect(offlinePage).toContain('content="#000000"');
  });

  it('has the correct language attribute', () => {
    expect(offlinePage).toContain('lang="en"');
  });

  it('has the correct character encoding', () => {
    expect(offlinePage).toContain('charset="utf-8"');
  });
}); 