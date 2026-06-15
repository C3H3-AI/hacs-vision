/**
 * Shared constants for HACS Vision
 */

/**
 * Generate a deterministic HSL color from a string (domain/category name)
 * Falls back to a predefined color if the category is in the static map.
 */
function hashStringToHSL(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 48%)`;
}

export const CATEGORY_COLORS = {
  integration: '#1565c0',
  plugin: '#7b1fa2',
  theme: '#2e7d32',
  appdaemon: '#e65100',
  netdaemon: '#00838f',
  python_script: '#f9a825',
  template: '#6a1b9a',
  dashboard: '#f57f17',
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || hashStringToHSL(category || 'default');
}
