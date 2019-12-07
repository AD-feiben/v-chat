
export const setLocal = (key: string, val: any) => {
  let value: any = val;
  if (typeof val === 'object') {
    value = JSON.stringify(val);
  }
  window.localStorage.setItem(key, value);
};

export const getLocal = (key: string): string | Object => {
  let str = window.localStorage.getItem(key) || '';
  let data = ''
  try {
    data = JSON.parse(str);
  } catch (error) {
    data = str;
  }
  return data;
}

