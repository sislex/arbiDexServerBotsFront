/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL?: string;
  readonly VITE_CONFIG_PANEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
