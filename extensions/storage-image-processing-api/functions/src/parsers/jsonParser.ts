import { AssertionError } from 'assert';
import { Operation } from '../types';

export function JSONParser(operationsString, next) {
  if (!operationsString || !operationsString.length) {
    return next(
      new AssertionError({
        message: `An 'operations' query parameter - a json array of operations to perform - converted to a json string and url encoded.`,
      }),
    );
  }
  let operations: Operation[] = null;
  try {
    operations = JSON.parse(decodeURIComponent(operationsString));
  } catch (e) {
    return next(
      new AssertionError({
        message: `Invalid operations JSON string. ${e.message}`,
      }),
    );
  }

  return operations;
}
