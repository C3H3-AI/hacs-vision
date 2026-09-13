import { HacsVisionPanel } from './hacs-vision-panel.js';
import './views/browse.js';
import './views/updates.js';
import './views/management.js';
import './views/config-view.js';
import './views/integrations-list.js';
import './components/config-flow-dialog.js';

if (!customElements.get('hacs-vision-panel')) customElements.define('hacs-vision-panel', HacsVisionPanel);
