export const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined') return ''
  return (process?.env ?? {})[key] ?? ''
}
