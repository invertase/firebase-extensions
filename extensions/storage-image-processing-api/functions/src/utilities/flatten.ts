import { Operation } from '../types';

const utilMapping = {
  bg: 'background',
};

export const utilityFlatten = (utilities: string[]) => {
  const options = {};

  for (const utility of utilities) {
    const [op, opValue] = utility.split('_');
    if (op && opValue) {
      options[utilMapping[op]] = opValue;
    }
  }

  const operation: Operation = {
    operation: 'flatten',
    options,
  };

  return operation;
};
