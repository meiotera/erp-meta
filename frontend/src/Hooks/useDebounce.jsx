import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 500) {
  const [debouncedVelue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedVelue;
}

//  hook customizado para atrasar a execução da busca.
