import { css } from 'lit';

/**
 * Shared CSS styles for HACS Vision views.
 * Uses a function to prevent terser from tree-shaking the CSS assignment
 * in IIFE bundle format.
 */
export function getCommonStyles() {
  return css`
  /* ===== CSS Variables for Theming ===== */
  :host {
    --success-color: #4caf50;
    --error-color: #f44336;
    --warning-color: #ff9800;
    /* Typography scale — single source of truth */
    --fs-xs: 10px;
    --fs-sm: 11px;
    --fs-md: 12px;
    --fs-body: 13px;
    --fs-lg: 14px;
    --fs-xl: 16px;
    --fs-2xl: 20px;
  }

  /* ===== Loading ===== */
  .loading {
    text-align: center; padding: 60px 20px;
    color: var(--secondary-text-color, #727272);
  }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--divider-color, #e0e0e0);
    border-top-color: var(--primary-color, #03a9f4);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }
  .spinner-sm {
    width: 20px; height: 20px;
    border: 2px solid var(--divider-color, #e0e0e0);
    border-top-color: var(--primary-color, #03a9f4);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 8px;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* ===== Empty ===== */
  .empty {
    text-align: center; padding: 60px 20px;
    color: var(--secondary-text-color, #727272);
  }
  .empty svg { width: 60px; height: 60px; margin-bottom: 16px; opacity: 0.3; }

  /* ===== Info Bar ===== */
  .info-bar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px; padding: 8px 14px;
    background: var(--secondary-background-color, #f0f0f0);
    border-radius: 8px;
    font-size: 13px; color: var(--secondary-text-color, #727272);
  }
  .info-bar .count { font-weight: 600; color: var(--primary-text-color, #212121); }

  /* ===== Buttons ===== */
  .btn {
    padding: 6px 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    cursor: pointer; font-size: 12px;
    transition: all 0.2s; white-space: nowrap;
    touch-action: manipulation;
  }
  .btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
  .btn.primary { background: var(--primary-color, #03a9f4); border-color: var(--primary-color, #03a9f4); color: #fff; }
  .btn.primary:hover { opacity: 0.9; }
  .btn.danger { color: #f44336; border-color: #f44336; }
  .btn.danger:hover { background: #f44336; color: #fff; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ===== Search ===== */
  .search { flex: 1; min-width: 120px; position: relative; }
  .search input {
    width: 100%; box-sizing: border-box; padding: 10px 36px 10px 40px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 10px; font-size: 14px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    outline: none; transition: border-color 0.2s;
  }
  .search input:focus { border-color: var(--primary-color, #03a9f4); }
  .search input::placeholder { color: var(--secondary-text-color, #727272); }
  .search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    width: 16px; height: 16px; color: var(--secondary-text-color, #727272);
  }
  .search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 20px; border-radius: 50%; border: none;
    background: var(--divider-color, #e0e0e0);
    color: var(--secondary-text-color, #727272);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 12px; transition: all 0.2s;
  }
  .search-clear:hover { background: var(--primary-color, #03a9f4); color: #fff; }

  /* ===== Controls ===== */
  .controls {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px; flex-wrap: wrap;
  }

  /* ===== Grid ===== */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 14px;
  }

  /* ===== Responsive ===== */
  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; gap: 10px; }
    .controls { gap: 4px; flex-wrap: wrap; }
    .search { min-width: 0; flex-basis: 120px; flex-grow: 2; }
    .search input { padding: 7px 10px 7px 30px; font-size: 13px; border-radius: 8px; }
    .search-icon { width: 14px; height: 14px; left: 8px; }
    .btn { min-height: 44px; display: flex; align-items: center; justify-content: center; }
  }

  @media (max-width: 480px) {
    .grid { grid-template-columns: 1fr; gap: 8px; }
    .controls { flex-wrap: wrap; gap: 4px; }
    .info-bar { flex-wrap: wrap; gap: 4px; font-size: 12px; }
  }

  /* ===== Skeleton Loading ===== */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }
  .skeleton-card {
    border-radius: 14px; overflow: hidden;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #e0e0e0);
  }
  .skeleton-card-img {
    height: 100px;
    background: var(--secondary-background-color, #f0f0f0);
  }
  .skeleton-card-body {
    padding: 16px;
  }
  .skeleton-line {
    height: 14px; border-radius: 6px; margin-bottom: 12px;
    background: linear-gradient(90deg,
      var(--secondary-background-color, #eee) 25%,
      var(--divider-color, #ddd) 50%,
      var(--secondary-background-color, #eee) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .skeleton-line:last-child { width: 60%; }
  .skeleton-line.wide { width: 100%; }
  .skeleton-line.medium { width: 75%; }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ===== Small inline checkbox (controls bar) ===== */
  .checkbox-sm {
    width: 16px; height: 16px; border-radius: 3px;
    border: 2px solid var(--secondary-text-color); cursor: pointer;
    flex-shrink: 0; transition: all 0.2s; background: transparent;
    -webkit-appearance: none; appearance: none; touch-action: manipulation;
    margin: 0; box-sizing: border-box;
  }
  .checkbox-sm:checked {
    background: var(--primary-color); border-color: var(--primary-color);
  }
  .checkbox-sm:checked::after {
    content: '✓'; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px; font-weight: 700; line-height: 1;
  }
  /* Inline label wrapping checkbox-sm */
  .sel-all-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--secondary-text-color);
    cursor: pointer; flex-shrink: 0; white-space: nowrap; min-height: 36px;
  }
`;
}
