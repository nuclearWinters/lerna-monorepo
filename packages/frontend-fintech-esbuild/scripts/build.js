const esbuild = require("esbuild");
const customPlugin = require("./customPlugin");
const svgr = require("esbuild-plugin-svgr")
const stylexPlugin = require("@stylexjs/esbuild-plugin")

if (require.main === module) {
  build(process.argv.slice(2));
}

async function build(args) {
  await Promise.all([
    buildJs()
      .then(() => {
        console.log("✅ Build JS complete");
      })
      .catch((err) => {
        console.log(err)
        console.error("💣 Error building JS");
        if (args.includes("--debug")) {
          console.log("----------------------------------------------------");
          console.error(err);
        }
      }),
  ]);

  console.log("🎉 Build complete");
}

async function buildJs() {
  esbuild.build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outdir: "public/dist",
    splitting: true,
    format: "esm",
    plugins: [
      stylexPlugin.default({
        dev: false,
        generatedCSSFileName: 'public/dist/out.css',
      }),
      customPlugin({ dev: false }),
      svgr(),
    ],
    loader: {
      ".png": "file"
    }
  });
}

module.exports = build;
