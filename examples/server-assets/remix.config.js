/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/basename/build/",
  serverBuildDirectory: "server/build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"]
};
