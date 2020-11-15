export default {
  log: (...args: unknown[]): void => (process.env.NEXT_PUBLIC_DEBUG ? console.log(...args) : undefined),
  warn: (...args: unknown[]): void => (process.env.NEXT_PUBLIC_DEBUG ? console.warn(...args) : undefined),
  error: (...args: unknown[]): void => (process.env.NEXT_PUBLIC_DEBUG ? console.error(...args) : undefined),
};
