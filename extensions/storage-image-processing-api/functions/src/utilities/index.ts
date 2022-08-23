import { utilityHeight } from './height';
import { utilityWidth } from './width';
import { utilityFlatten } from './flatten';
import { utilityConvolve } from './convolve';

export * from './height';

export const utilities = {
  h: utilityHeight,
  w: utilityWidth,
  flatten: utilityFlatten,
  co: utilityConvolve,
};
