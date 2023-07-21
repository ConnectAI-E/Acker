export const numberFormatter = (numValue: number): string => {
  const units: string[] = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
  let unitIndex = 0;
  let num = numValue || 0;
  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex += 1;
  }
  let formattedNum = num.toFixed(2);
  if (/\.00$|(\.[1-9]0)$/.test(formattedNum)) {
    formattedNum = formattedNum.slice(0, -3);
  }
  return formattedNum + units[unitIndex];
};

export const randomArrayFormatter = <T>(array: T[], length: number): T[] => {
  if (length > array.length) {
    return array;
  }

  const shuffled = JSON.parse(JSON.stringify(array || [])).sort(() => 0.5 - Math.random());

  return shuffled.slice(0, length);
};
