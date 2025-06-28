export const detectBrowser = () => {
  if (typeof window === 'undefined') return { isChromeMobile: false, isSafari: false, isIOS: false, isMobile: false, needsPDFJS: false };
  
  const _userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(_userAgent);
  const isChrome = /chrome/.test(_userAgent) && !/edge|edg/.test(_userAgent);
  const isSafari = /safari/.test(_userAgent) && !/chrome/.test(_userAgent);
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(_userAgent) || window.innerWidth < 768;
  
  return {
    isChromeMobile: isChrome && isMobile,
    isSafari,
    isIOS,
    isMobile,
    // Only use PDF.js for mobile Chrome and iOS browsers
    needsPDFJS: (isChrome && isMobile) || isIOS
  };
};

export const shouldUsePDFJS = () => {
  const { needsPDFJS } = detectBrowser();
  return needsPDFJS;
};