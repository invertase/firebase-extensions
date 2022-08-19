import { Operation } from '../types';

const utilMapping = {
  w: 'width',
  h: 'height',
};

export const utilityHeight = (utilities: string[]) => {
  const options = {};

  for (const utility of utilities) {
    const [op, opValue] = utility.split('_');
    options[utilMapping[op]] = parseInt(opValue);
  }

  const operation: Operation = {
    operation: 'resize',
    options,
  };

  return operation;
};
