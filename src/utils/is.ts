import store from '@/store';

// eslint-disable-next-line
export const regLink = new RegExp('(http:\\/\\/|https:\\/\\/)((\\w|=|\\?|\\.|\\/|&|-)+)', 'g');
export const regAt = /(@\S+)/g;
export const atNameList: string[] = [`@${store.getters.nickName}`, '@All', '@all', '@所有人'];

export const isLink = (str: string): boolean => {
  // eslint-disable-next-line
  return regLink.test(str);
};

export const isMobile = (): boolean => {
  const reg = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return reg.test(navigator.userAgent);
}

export const isAtMe = (msg: string): boolean => {
  msg.match(regAt);
  return atNameList.includes(RegExp.$1);
}