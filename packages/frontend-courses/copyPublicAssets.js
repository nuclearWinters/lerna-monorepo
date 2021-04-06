const fs = require("fs-extra");

function copyPublicFolder() {
  fs.copySync("./public", "./build", {
    dereference: true,
    filter: (file) => {
      return file !== "public/index.html" || file !== "./public";
    },
  });
}

copyPublicFolder();
