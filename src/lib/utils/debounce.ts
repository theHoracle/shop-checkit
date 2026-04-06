export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  wait = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}
