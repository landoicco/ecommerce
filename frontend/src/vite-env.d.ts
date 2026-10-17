/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Default UI locale of the deployment, inlined at build time (e.g. "es-MX")
  readonly VITE_DEFAULT_LOCALE?: string;
}
