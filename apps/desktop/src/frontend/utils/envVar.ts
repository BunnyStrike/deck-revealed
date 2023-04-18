export const getEnvVar = (key: string): string => {
  // declare const process: any
  // @ts-ignore
  return (process.env ?? import.meta.env ?? {})[key] ?? ''
}
