interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  __onFCMToken?: (token: string) => void;
}
