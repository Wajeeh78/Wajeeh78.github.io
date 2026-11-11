/// <reference types="vite/client" />

// Allow TypeScript to resolve plain CSS side-effect imports
declare module '*.css' {
  const stylesheet: string
  export default stylesheet
}
