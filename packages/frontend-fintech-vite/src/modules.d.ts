declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.svg?react" {
  const value: React.FC<React.SVGProps<SVGSVGElement>>;
  export default value;
}