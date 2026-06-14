/**
 * Shared constants for HACS Vision
 */

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
  return CATEGORY_COLORS[category] || '#03a9f4';
}
