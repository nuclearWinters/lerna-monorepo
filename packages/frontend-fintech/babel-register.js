const resolver = require("./module-name-mapper.cjs");
require("@babel/register")({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [[
        resolver,
        {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            moduleNameMapper: {
                ".svg$": "<rootDir>/__mocks__/svg.js"
            }
        }
    ]
    ]
});