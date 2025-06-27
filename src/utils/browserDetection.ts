export const detectBrowser = () => {
  if (typeof window === 'undefined') return { isChromeMobile: false, isSafari: false, isIOS: false, isMobile: false, needsPDFJS: false };
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent) || window.innerWidth < 768;
  
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