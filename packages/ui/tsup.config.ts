import { defineConfig, type Options } from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  // entry: ['src/index.tsx'],
  entry: ['src/**/*.tsx', 'src/index.tsx'],
  format: ['esm'],
  // dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  external: ['react'],
  composite: false,
  ...options,
}))
