const fs = require("fs-extra");

function copyPublicFolder() {
  fs.copySync("./public", "./build", {
    dereference: true,
    filter: (file) => {
      return !file.includes("index.html");
    },
  });

  const html = fs.readFileSync("./build/index.html", "utf8");
  const cssName = fs.readdirSync("./build/static/css")[0];
  const newHtml = html.replace(
    "</title>",
    `</title><link rel="stylesheet" href="/static/css/${cssName}">`
  );

  fs.writeFileSync("./build/index.html", newHtml);
}

copyPublicFolder();
