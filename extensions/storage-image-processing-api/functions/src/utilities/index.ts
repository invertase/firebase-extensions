import { utilityHeight } from './height';
import { utilityWidth } from './width';
import { utilityFlatten } from './flatten';

export * from './height';

export const utilities = {
  h: utilityHeight,
  w: utilityWidth,
  flatten: utilityFlatten,
};
