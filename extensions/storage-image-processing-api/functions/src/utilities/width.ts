import { Operation } from '../types';

export const utilityWidth = options => {
  const operation: Operation = {
    operation: 'resize',
    width: options[0],
  };

  return operation;
};
