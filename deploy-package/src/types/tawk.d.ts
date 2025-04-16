// Definición de tipos para Tawk.to
interface TawkAPI {
  onLoad?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  toggle?: () => void;
  popup?: () => void;
  hideWidget?: () => void;
  showWidget?: () => void;
  toggleVisibility?: () => void;
  endChat?: () => void;
  setAttributes?: (attributes: Record<string, any>, callback?: () => void) => void;
  addEvent?: (event: string, metadata?: Record<string, any>, callback?: () => void) => void;
  addTags?: (tags: string[], callback?: () => void) => void;
  removeTags?: (tags: string[], callback?: () => void) => void;
  customize?: (options: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    [key: string]: any;
  }) => void;
}

interface Window {
  Tawk_API?: TawkAPI;
  Tawk_LoadStart?: Date;
}
