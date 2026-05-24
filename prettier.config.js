const base = require("@platform/pluggable-widgets-tools/configs/prettier.base.json");

module.exports = {
    ...base,
    plugins: [require.resolve("@prettier/plugin-xml")],
};
