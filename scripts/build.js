const { spawnSync } = require("node:child_process");

process.env.MPKOUTPUT = "ResourcePlannerWidget.mpk";

const result = spawnSync("pluggable-widgets-tools", ["build:web"], {
    env: process.env,
    shell: true,
    stdio: "inherit"
});

process.exit(result.status ?? 1);
