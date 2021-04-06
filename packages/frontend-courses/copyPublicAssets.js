const fs = require("fs-extra");

function copyPublicFolder() {
  fs.copySync("./public", "./build", {
    dereference: true,
    filter: (file) => {
      //console.log(file, !(file === "public/index.html"));
      return !(file === "public/index.html");
    },
  });
}

copyPublicFolder();
