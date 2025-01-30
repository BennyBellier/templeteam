import { useState, useEffect } from 'react'
import { type RegisterFormStore } from './registerFormStore'

type StoreSelector<T> = (state: RegisterFormStore) => T;

const useStore = <T>(store: (callback: StoreSelector<T>) => T, selector: StoreSelector<T>) => {
  const result = store(selector);
  const [data, setData] = useState<T>(result);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;