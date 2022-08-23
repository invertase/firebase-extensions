import { Operation } from '../types';

const utilMapping = {
  w: 'width',
  h: 'height',
  k: 'kernel',
};

export const utilityConvolve = (utilities: string[]) => {
  const options = {};

  for (const utility of utilities) {
    const [op, opValue] = utility.split('_');
    if (op && opValue) {
      options[utilMapping[op]] = opValue;
    }
  }

  const operation: Operation = {
    operation: 'convolve',
    ...options,
  };

  return operation;
};
