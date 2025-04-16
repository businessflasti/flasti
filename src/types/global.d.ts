interface Window {
  checkoutElements?: {
    init: (type: string, options: { offer: string }) => {
      mount: (selector: string) => void;
    };
  };
}
