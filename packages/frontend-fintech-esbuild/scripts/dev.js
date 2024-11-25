const esbuild = require("esbuild");
const customPlugin = require("./customPlugin");
const svgr = require("esbuild-plugin-svgr");

async function buildJs() {
  console.log("✅ Starting development server");
  esbuild.context({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outdir: "public/dist",
    splitting: true,
    format: "esm",
    loader: {
      ".png": "file"
    },
    plugins: [
      customPlugin({ dev: true }),
      svgr(),
    ],
    define: {
      'process.env.AUTH_API': '""',
      'process.env.FINTECH_API': '""'
    }
  }).then(async (ctx) => {
    const { host, port } = await ctx.serve({ servedir: 'public', port: 8000, fallback: 'public/index.html' })
    console.log(`Serving at http://${host}:${port}`)
    await ctx.watch()
  })
}

buildJs()

