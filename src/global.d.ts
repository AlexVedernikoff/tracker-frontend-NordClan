declare module '*.scss';
declare module '*.jpg';

declare module 'env' {
  const result: Record<string,string>;
  export default result;
}
