function isMobile() {
  let flag = false;
  const { userAgent, maxTouchPoints } = navigator;
  const mobileAgents = ['Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
  for (let i = 0; i < mobileAgents.length; i += 1) {
    if (userAgent.includes(mobileAgents[i])) {
      flag = true;
      break;
    }
  }
  // 这里是判断ipad的类型，ipados13以上的useragent判断不出来是ipad还是mac
  if (userAgent.toLowerCase().includes('macintosh') && maxTouchPoints && maxTouchPoints > 2) {
    flag = true;
  }
  return flag;
}

const flag = isMobile();

function useIsMobile () {
  return flag;
}

export default useIsMobile;
