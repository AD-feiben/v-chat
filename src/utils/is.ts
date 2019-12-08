// eslint-disable-next-line
export const regLink = new RegExp('(http:\\/\\/|https:\\/\\/)((\\w|=|\\?|\\.|\\/|&|-)+)', 'g');

export const isLink = (str: string): boolean => {
  // eslint-disable-next-line
  return regLink.test(str);
};

export const isMobile = (): boolean => {
  const reg = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return reg.test(navigator.userAgent);
}