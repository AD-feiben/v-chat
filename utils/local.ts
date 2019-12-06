
export const setLocal = (key: string, val: any) => {
  window.localStorage.setItem(key, val);
};

export const getLocal = (key: string) => {
  return window.localStorage.getItem(key);
}

