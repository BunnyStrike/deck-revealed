export const getEnvVar = (key: string): string => {
  // declare const process: any
  // @ts-ignore
  // process?.env ??
  return (import.meta.env ?? {})[key] ?? ''
}
