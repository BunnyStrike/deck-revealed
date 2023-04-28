export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
// let process: any
// export const getEnvVar = (key: string): string => {
//   // declare const process: any
//   // @ts-ignore
//   const env = process?.env ?? import.meta?.env ?? {}
//   console.log(env)
//   return env[`NEXT_PUBLIC_${key}`] ?? env[`VITE_${key}`] ?? ''
// }
