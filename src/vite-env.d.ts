/// <reference types="vite/client" />

declare const CONNECT_API_URL: string;

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
