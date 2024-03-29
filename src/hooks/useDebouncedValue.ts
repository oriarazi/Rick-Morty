import { useEffect, useState } from "react";

function useDebouncedValue(newValue: string, delay: number) {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setValue(newValue);
    }, delay);

    return () => clearTimeout(timerId);
  }, [delay, newValue]);

  return value;
}

export default useDebouncedValue;
