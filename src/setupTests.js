// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
}

window.ResizeObserver = MockResizeObserver;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock requestAnimationFrame
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);
window.cancelAnimationFrame = jest.fn();

// Mock getComputedStyle
window.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(),
}));

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Mock performance
window.performance = {
  ...window.performance,
  now: jest.fn(),
};

// Mock URL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock FileReader
class MockFileReader {
  readAsDataURL() {
    setTimeout(() => {
      this.onload({ target: { result: 'data:text/plain;base64,dGVzdA==' } });
    }, 0);
  }
}

window.FileReader = MockFileReader;

// Mock Image
class MockImage {
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 0);
  }
}

window.Image = MockImage;

// Mock Audio
class MockAudio {
  constructor() {
    this.play = jest.fn();
    this.pause = jest.fn();
    this.load = jest.fn();
  }
}

window.Audio = MockAudio;

// Mock Notification
window.Notification = {
  permission: 'granted',
  requestPermission: jest.fn(() => Promise.resolve('granted')),
};

// Mock ServiceWorker
window.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
  ready: Promise.resolve(),
};

// Mock Permissions
window.navigator.permissions = {
  query: jest.fn(() => Promise.resolve({ state: 'granted' })),
};

// Mock Geolocation
window.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

// Mock Clipboard
window.navigator.clipboard = {
  writeText: jest.fn(() => Promise.resolve()),
  readText: jest.fn(() => Promise.resolve('')),
};

// Mock WebSocket
class MockWebSocket {
  constructor() {
    setTimeout(() => {
      this.onopen();
    }, 0);
  }

  send() {}
  close() {}
}

window.WebSocket = MockWebSocket;

// Mock IndexedDB
const indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

window.indexedDB = indexedDB;

// Mock requestIdleCallback
window.requestIdleCallback = jest.fn((callback) => setTimeout(callback, 0));
window.cancelIdleCallback = jest.fn();

// Mock IntersectionObserver
window.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
window.ResizeObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock MutationObserver
window.MutationObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};

// Mock PerformanceObserver
window.PerformanceObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};

// Mock ReportingObserver
window.ReportingObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};

// Mock Performance
window.performance = {
  ...window.performance,
  getEntriesByType: jest.fn(() => []),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

// Mock requestAnimationFrame
window.requestAnimationFrame = jest.fn((callback) => setTimeout(callback, 0));
window.cancelAnimationFrame = jest.fn();

// Mock getComputedStyle
window.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(),
}));

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Mock performance
window.performance = {
  ...window.performance,
  now: jest.fn(),
};

// Mock URL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock FileReader
class MockFileReader {
  readAsDataURL() {
    setTimeout(() => {
      this.onload({ target: { result: 'data:text/plain;base64,dGVzdA==' } });
    }, 0);
  }
}

window.FileReader = MockFileReader;

// Mock Image
class MockImage {
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 0);
  }
}

window.Image = MockImage;

// Mock Audio
class MockAudio {
  constructor() {
    this.play = jest.fn();
    this.pause = jest.fn();
    this.load = jest.fn();
  }
}

window.Audio = MockAudio;

// Mock Notification
window.Notification = {
  permission: 'granted',
  requestPermission: jest.fn(() => Promise.resolve('granted')),
};

// Mock ServiceWorker
window.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
  ready: Promise.resolve(),
};

// Mock Permissions
window.navigator.permissions = {
  query: jest.fn(() => Promise.resolve({ state: 'granted' })),
};

// Mock Geolocation
window.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

// Mock Clipboard
window.navigator.clipboard = {
  writeText: jest.fn(() => Promise.resolve()),
  readText: jest.fn(() => Promise.resolve('')),
};

// Mock WebSocket
class MockWebSocket {
  constructor() {
    setTimeout(() => {
      this.onopen();
    }, 0);
  }

  send() {}
  close() {}
}

window.WebSocket = MockWebSocket;

// Mock IndexedDB
const indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

window.indexedDB = indexedDB;

// Mock requestIdleCallback
window.requestIdleCallback = jest.fn((callback) => setTimeout(callback, 0));
window.cancelIdleCallback = jest.fn();
