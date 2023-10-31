import React from 'react';
import NumberFormat from 'react-number-format';

/**
 * range()
 *
 * Returns an array of numbers between a start number and an end number incremented
 * sequentially by a fixed number(step), beginning with either the start number or
 * the end number depending on which is greater.
 *
 * @param {number} start (Required: The start number.)
 * @param {number} end (Required: The end number. If end is less than start,
 *  then the range begins with end instead of start and decrements instead of increment.)
 * @param {number} step (Optional: The fixed increment or decrement step. Defaults to 1.)
 *
 * @return {array} (An array containing the range numbers.)
 *
 * @throws {TypeError} (If any of start, end and step is not a finite number.)
 * @throws {Error} (If step is not a positive number.)
 */
export function rangeArray (start, end, step = 1) {
  // Test that the first 3 arguments are finite numbers.
  // Using Array.prototype.every() and Number.isFinite().
  const allNumbers = [start, end, step].every(Number.isFinite);

  // Throw an error if any of the first 3 arguments is not a finite number.
  if (!allNumbers) {
    throw new TypeError('range() expects only finite numbers as arguments.');
  }

  // Ensure the step is always a positive number.
  if (step <= 0) {
    throw new Error('step must be a number greater than 0.');
  }

  // When the start number is greater than the end number,
  // modify the step for decrementing instead of incrementing.
  if (start > end) {
    step = -step;
  }

  // Determine the length of the array to be returned.
  // The length is incremented by 1 after Math.floor().
  // This ensures that the end number is listed if it falls within the range.
  const length = Math.floor(Math.abs((end - start) / step)) + 1;

  // Fill up a new array with the range numbers
  // using Array.from() with a mapping function.
  // Finally, return the new array.
  return Array.from(Array(length), (x, index) => start + index * step);
}

export function randomBackgroundColor () {
  const x = Math.floor(Math.random() * 200);
  const y = Math.floor(Math.random() * 200);
  const z = Math.floor(Math.random() * 200);
  return 'rgb(' + x + ',' + y + ',' + z + ')';
}

export function getAllyCode (alliance, isBold = true) {
  return alliance && alliance.code !== 'no-ally' ? (isBold ?
    <b>{alliance.code}</b> : alliance.code) : <i>-</i>;
}

export function text_truncate (str, length = 100, ending = '...') {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

/**
 * We simple extract the keys from our object, make sure that they match, and then check if the values of those keys match as well.
 *
 * @param first
 * @param second
 * @returns {boolean}
 */
export function areTheseObjectsEqual (first, second) {
  const al = Object.getOwnPropertyNames(first);
  const bl = Object.getOwnPropertyNames(second);

  // Check if the two list of keys are the same
  // length. If they are not, we know the objects
  // are not equal.
  if (al.length !== bl.length) return false;

  // Check that all keys from both objects match
  // are present on both objects.
  const hasAllKeys = al.every(value => !!bl.find(v => v === value));

  // If not all the keys match, we know the
  // objects are not equal.
  if (!hasAllKeys) return false;

  // We can now check that the value of each
  // key matches its corresponding key in the
  // other object.
  for (const key of al) if (first[key] !== second[key]) return false;

  // If the object hasn't return yet, at this
  // point we know that the objects are the
  // same
  return true;
}

export function getNumberFormat (value, type = 'text') {
  return <NumberFormat
    value={value}
    displayType={type}
    thousandSeparator="."
    decimalSeparator=","
  />;
}

export const getRightDirection = (value) => {
  if (value > 0) {
    return <i>(+{getNumberFormat(value)})</i>;
  } else if (value < 0) {
    return <i>({getNumberFormat(value)})</i>;
  } else {
    return <i>(0)</i>;
  }
};