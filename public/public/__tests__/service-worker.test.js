describe('Service Worker', () => {
  let serviceWorker;
  let mockEvent;
  let mockCache;
  let mockFetch;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the cache API
    mockCache = {
      addAll: jest.fn(),
      match: jest.fn(),
      put: jest.fn(),
    };

    // Mock the fetch API
    mockFetch = jest.fn();

    // Mock the caches API
    global.caches = {
      open: jest.fn(() => Promise.resolve(mockCache)),
      match: jest.fn(),
      delete: jest.fn(),
    };

    // Mock the fetch event
    mockEvent = {
      request: new Request('https://example.com'),
      respondWith: jest.fn(),
      waitUntil: jest.fn(),
    };

    // Mock the service worker registration
    global.registration = {
      showNotification: jest.fn(),
    };

    // Mock the service worker
    serviceWorker = require('../service-worker');
  });

  it('installs the service worker and caches static assets', async () => {
    // Create an install event
    const installEvent = new Event('install');
    
    // Trigger the install event
    serviceWorker.self.dispatchEvent(installEvent);
    
    // Check if the static assets were cached
    expect(mockCache.addAll).toHaveBeenCalled();
  });

  it('activates the service worker and cleans up old caches', async () => {
    // Create an activate event
    const activateEvent = new Event('activate');
    
    // Trigger the activate event
    serviceWorker.self.dispatchEvent(activateEvent);
    
    // Check if old caches were cleaned up
    expect(global.caches.delete).toHaveBeenCalled();
  });

  it('handles fetch events for API requests', async () => {
    // Mock the fetch response
    const mockResponse = new Response('API Response');
    mockFetch.mockResolvedValueOnce(mockResponse);

    // Create a fetch event for an API request
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('https://api.example.com/data'),
    });

    // Trigger the fetch event
    serviceWorker.self.dispatchEvent(fetchEvent);

    // Check if the response was cached
    expect(mockCache.put).toHaveBeenCalled();
  });

  it('handles fetch events for static assets', async () => {
    // Mock the cache match
    const mockResponse = new Response('Static Asset');
    mockCache.match.mockResolvedValueOnce(mockResponse);

    // Create a fetch event for a static asset
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('https://example.com/static/asset.js'),
    });

    // Trigger the fetch event
    serviceWorker.self.dispatchEvent(fetchEvent);

    // Check if the cached response was returned
    expect(mockCache.match).toHaveBeenCalled();
  });

  it('handles fetch events for other requests', async () => {
    // Mock the fetch response
    const mockResponse = new Response('Other Response');
    mockFetch.mockResolvedValueOnce(mockResponse);

    // Create a fetch event for another request
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('https://example.com/other'),
    });

    // Trigger the fetch event
    serviceWorker.self.dispatchEvent(fetchEvent);

    // Check if the response was fetched
    expect(mockFetch).toHaveBeenCalled();
  });

  it('handles fetch events when offline', async () => {
    // Mock the cache match for offline page
    const mockResponse = new Response('Offline Page');
    mockCache.match.mockResolvedValueOnce(mockResponse);

    // Create a fetch event
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('https://example.com'),
    });

    // Mock fetch to reject (simulating offline)
    mockFetch.mockRejectedValueOnce(new Error('Offline'));

    // Trigger the fetch event
    serviceWorker.self.dispatchEvent(fetchEvent);

    // Check if the offline page was returned
    expect(mockCache.match).toHaveBeenCalledWith('offline.html');
  });

  it('handles background sync events', async () => {
    // Create a sync event
    const syncEvent = new SyncEvent('sync', {
      tag: 'sync-tag',
    });

    // Trigger the sync event
    serviceWorker.self.dispatchEvent(syncEvent);

    // Check if the sync event was handled
    expect(mockEvent.waitUntil).toHaveBeenCalled();
  });

  it('handles push notification events', async () => {
    // Create a push event
    const pushEvent = new PushEvent('push', {
      data: new TextEncoder().encode(JSON.stringify({
        title: 'Test Notification',
        body: 'Test Body',
      })),
    });

    // Trigger the push event
    serviceWorker.self.dispatchEvent(pushEvent);

    // Check if the notification was shown
    expect(global.registration.showNotification).toHaveBeenCalled();
  });

  it('handles notification click events', async () => {
    // Create a notification click event
    const notificationClickEvent = new NotificationEvent('notificationclick', {
      notification: {
        data: {
          url: 'https://example.com',
        },
      },
    });

    // Mock clients.openWindow
    global.clients = {
      openWindow: jest.fn(),
    };

    // Trigger the notification click event
    serviceWorker.self.dispatchEvent(notificationClickEvent);

    // Check if the window was opened
    expect(global.clients.openWindow).toHaveBeenCalledWith('https://example.com');
  });

  it('handles errors during fetch', async () => {
    // Mock the fetch to throw an error
    mockFetch.mockRejectedValueOnce(new Error('Fetch Error'));

    // Create a fetch event
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('https://example.com'),
    });

    // Trigger the fetch event
    serviceWorker.self.dispatchEvent(fetchEvent);

    // Check if the error was handled
    expect(mockCache.match).toHaveBeenCalledWith('offline.html');
  });

  it('handles errors during cache operations', async () => {
    // Mock the cache operations to throw errors
    mockCache.addAll.mockRejectedValueOnce(new Error('Cache Error'));
    mockCache.match.mockRejectedValueOnce(new Error('Cache Error'));
    mockCache.put.mockRejectedValueOnce(new Error('Cache Error'));

    // Create events
    const installEvent = new Event('install');
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('https://example.com'),
    });

    // Trigger the events
    serviceWorker.self.dispatchEvent(installEvent);
    serviceWorker.self.dispatchEvent(fetchEvent);

    // Check if the errors were handled
    expect(mockCache.addAll).toHaveBeenCalled();
    expect(mockCache.match).toHaveBeenCalled();
    expect(mockCache.put).toHaveBeenCalled();
  });
}); 