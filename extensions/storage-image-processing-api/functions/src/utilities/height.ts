import { Operation } from '../types';

export const utilityHeight = options => {
  const operation: Operation = {
    operation: 'resize',
    height: options[0],
  };

  return operation;
};
