const path = require("path");

module.exports = env => {
    return {
        mode: env.dev ? "development" : "production",
        entry: {
            "signpad": "./src/signpad.ts"
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name]" + (env.dev ? "" : "min") + ".js",
            library: {
                name: "SignPad",
                type: "umd"
            }
        },
        devtool: false,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["babel-loader", "ts-loader"],
                    exclude: [path.resolve(__dirname, "node_modules")]
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".js"]
        }
    };
};