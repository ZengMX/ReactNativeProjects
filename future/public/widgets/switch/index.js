/**
 * Created by ywu on 15/6/1.
 */
export {
  setTheme,
  getTheme,
  theme,
} from './theme';

import * as mdl from './mdl';
import * as MKColor from './MKColor';
export { mdl, MKColor };

// Shortcuts, and also compatibility for legacy native components like MKButton
export {
  Switch as MKSwitch,
} from './mdl';
