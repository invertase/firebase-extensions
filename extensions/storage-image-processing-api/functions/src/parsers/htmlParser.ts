import { AssertionError } from 'assert';
import { Operation } from '../types';

import { utilities } from '../utilities';

const extractOperationValues = (opOptions: string) => {
  const allOptions = opOptions.split(',');
  const options = {} as Record<string, any>;

  for (const option of allOptions) {
    /** Split on first instance of underscore */
    const [op, opValue] = option.split(/_(.*)/s);

    options[op] = opValue;
  }
  return options;
};

export function HTMLParser(operationsString: string, next): Operation[] {
  let operations: Operation[] = [];

  /** Extract any url options */
  const urlRegex = /((http|https|gs)?:\/\/[^ ]*)/;
  const url = operationsString.match(urlRegex);
  const source = url ? url[1] : null;

  if (source) {
    operationsString = operationsString.replace(source, '');
  }

  /** Get full list of options */
  try {
    for (var operation of operationsString.split('/')) {
      /** Skip if no operation found */
      if (!operation) continue;

      const [op, opOptions] = operation.split(':');

      console.log('Checking >>>>>>>>', op, opOptions);

      /** Single based boolean value */
      if (!opOptions) {
        operations.push({
          operation: op,
        });
        continue;
      }

      /** Add if a utility function */
      const utilty = utilities[op];

      /** Add op, if exists */
      if (utilty) {
        const operation = utilty(opOptions.split(','));
        operations.push(operation);
        continue;
      }

      const options = extractOperationValues(opOptions);

      operations.push({
        operation: op,
        ...options,
      });
    }
  } catch (e) {
    return next(
      new AssertionError({
        message: `Invalid operations JSON string. ${e.message}`,
      }),
    );
  }

  /** Add a default input create operation if none provided */
  if (operations.filter($ => $.operation === 'input').length === 0) {
    operations.splice(0, 0, {
      operation: 'input',
      type: 'create',
      width: 12,
      height: 12,
    });
  }

  /** Add a default output operation if none provided */
  if (operations.filter($ => $.operation === 'output').length === 0) {
    operations.push({
      operation: 'output',
      format: 'jpg',
    });
  }

  if (source) {
    for (const op in operations) {
      const { operation, ...options } = operations[op];
      if (operation === 'input') {
        if (options.type === 'url') {
          operations[op].url = source;
        }
      }
    }
  }

  return operations;
}
