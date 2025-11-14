// Lightweight client-side monitoring utilities
// Provides logInfo, logWarn, logError with structured payloads.

const MAX_BUFFER = 100;
const buffer = [];

function push(event) {
  try {
    buffer.push({ ...event, ts: Date.now() });
    if (buffer.length > MAX_BUFFER) buffer.shift();
  } catch (_) {}
}

export function logInfo(message, data = {}) {
  const evt = { level: 'info', message, data };
  push(evt);
  try { console.info('[monitor]', message, data); } catch (_) {}
}

export function logWarn(message, data = {}) {
  const evt = { level: 'warn', message, data };
  push(evt);
  try { console.warn('[monitor]', message, data); } catch (_) {}
}

export function logError(message, data = {}) {
  const evt = { level: 'error', message, data };
  push(evt);
  try { console.error('[monitor]', message, data); } catch (_) {}
}

export function getBuffer() {
  return buffer.slice();
}