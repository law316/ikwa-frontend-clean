describe('Web App Manifest', () => {
  let manifest;

  beforeEach(() => {
    // Load the manifest
    manifest = require('../manifest.json');
  });

  it('has the correct name and short name', () => {
    expect(manifest.name).toBe('Lace and Legacy - Vintage Fashion');
    expect(manifest.short_name).toBe('Lace and Legacy');
  });

  it('has the correct description', () => {
    expect(manifest.description).toBe('Discover authentic vintage fashion from the 70s, 80s, and 90s');
  });

  it('has the correct start URL', () => {
    expect(manifest.start_url).toBe('.');
  });

  it('has the correct display mode', () => {
    expect(manifest.display).toBe('standalone');
  });

  it('has the correct theme and background colors', () => {
    expect(manifest.theme_color).toBe('#000000');
    expect(manifest.background_color).toBe('#ffffff');
  });

  it('has the correct orientation', () => {
    expect(manifest.orientation).toBe('portrait');
  });

  it('has the correct categories', () => {
    expect(manifest.categories).toEqual(['fashion', 'shopping', 'vintage']);
  });

  it('has the correct icons with all required sizes', () => {
    const requiredSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    manifest.icons.forEach(icon => {
      expect(requiredSizes).toContain(icon.sizes.split('x')[0]);
      expect(icon.type).toBe('image/png');
      expect(icon.src).toMatch(/^\/icons\/icon-\d+x\d+\.png$/);
    });
  });

  it('has the correct screenshots', () => {
    expect(manifest.screenshots).toHaveLength(3);
    
    manifest.screenshots.forEach(screenshot => {
      expect(screenshot.type).toBe('image/png');
      expect(screenshot.src).toMatch(/^\/screenshots\/screenshot-\d+\.png$/);
      expect(screenshot.sizes).toMatch(/^\d+x\d+$/);
      expect(screenshot.form_factor).toBe('narrow');
    });
  });

  it('has the correct shortcuts', () => {
    expect(manifest.shortcuts).toHaveLength(2);
    
    const shortcuts = manifest.shortcuts;
    
    // Check New Arrivals shortcut
    expect(shortcuts[0].name).toBe('New Arrivals');
    expect(shortcuts[0].url).toBe('/catalog/new-arrivals');
    expect(shortcuts[0].description).toBe('Browse our latest vintage finds');
    expect(shortcuts[0].icons).toHaveLength(1);
    expect(shortcuts[0].icons[0].src).toBe('/icons/new-arrivals.png');
    expect(shortcuts[0].icons[0].sizes).toBe('96x96');
    
    // Check My Wishlist shortcut
    expect(shortcuts[1].name).toBe('My Wishlist');
    expect(shortcuts[1].url).toBe('/account/wishlist');
    expect(shortcuts[1].description).toBe('View your saved items');
    expect(shortcuts[1].icons).toHaveLength(1);
    expect(shortcuts[1].icons[0].src).toBe('/icons/wishlist.png');
    expect(shortcuts[1].icons[0].sizes).toBe('96x96');
  });

  it('has the correct share target configuration', () => {
    expect(manifest.share_target).toBeDefined();
    expect(manifest.share_target.action).toBe('/share-target');
    expect(manifest.share_target.method).toBe('POST');
    expect(manifest.share_target.enctype).toBe('multipart/form-data');
    expect(manifest.share_target.params).toBeDefined();
    
    const params = manifest.share_target.params;
    expect(params.title).toBe('title');
    expect(params.text).toBe('text');
    expect(params.url).toBe('url');
  });

  it('has valid icon paths', () => {
    manifest.icons.forEach(icon => {
      expect(icon.src).toMatch(/^\/icons\/icon-\d+x\d+\.png$/);
    });
  });

  it('has valid screenshot paths', () => {
    manifest.screenshots.forEach(screenshot => {
      expect(screenshot.src).toMatch(/^\/screenshots\/screenshot-\d+\.png$/);
    });
  });

  it('has valid shortcut icon paths', () => {
    manifest.shortcuts.forEach(shortcut => {
      shortcut.icons.forEach(icon => {
        expect(icon.src).toMatch(/^\/icons\/[a-z-]+\.png$/);
      });
    });
  });

  it('has valid screenshot sizes', () => {
    manifest.screenshots.forEach(screenshot => {
      const [width, height] = screenshot.sizes.split('x').map(Number);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(width).toBeLessThanOrEqual(1920);
      expect(height).toBeLessThanOrEqual(1080);
    });
  });

  it('has valid icon sizes', () => {
    manifest.icons.forEach(icon => {
      const [width, height] = icon.sizes.split('x').map(Number);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(width).toBeLessThanOrEqual(512);
      expect(height).toBeLessThanOrEqual(512);
    });
  });

  it('has valid shortcut icon sizes', () => {
    manifest.shortcuts.forEach(shortcut => {
      shortcut.icons.forEach(icon => {
        const [width, height] = icon.sizes.split('x').map(Number);
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
        expect(width).toBeLessThanOrEqual(96);
        expect(height).toBeLessThanOrEqual(96);
      });
    });
  });

  it('has valid theme color format', () => {
    expect(manifest.theme_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has valid background color format', () => {
    expect(manifest.background_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has valid start URL format', () => {
    expect(manifest.start_url).toMatch(/^[./].*$/);
  });

  it('has valid shortcut URLs', () => {
    manifest.shortcuts.forEach(shortcut => {
      expect(shortcut.url).toMatch(/^\/[a-z-]+(\/[a-z-]+)*$/);
    });
  });

  it('has valid share target action URL', () => {
    expect(manifest.share_target.action).toMatch(/^\/[a-z-]+$/);
  });
}); 