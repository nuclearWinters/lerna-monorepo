declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: React.FC<React.SVGProps<SVGSVGElement>>;
  export default value;
}

declare var process: {
  env: {
    AUTH_API: string | null;
    FINTECH_API: string | null;
  };
};
