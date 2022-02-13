const path = require("path");
const express = require("express");
const proxy = require('express-http-proxy');
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

const app = express();
app.use(compression());

// You may want to be more aggressive with this caching
app.use('/basename', express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use('/basename', express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "/basename",
  MODE === "production"
    ? createRequestHandler({ build: require("./build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("./build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

if (process.env.NODE_ENV === 'development') {
  // On development, we continue using the server-proxy approach
  // As this allows reusing the dev server from create-react-app
  app.use(proxy(process.env.CLIENT_ORIGIN, {
    filter: req => req.method == 'GET',
  }));
} else {
  const CLIENT_INDEX = path.join(process.cwd(), 'client/build/index.html');

  // Serve assets from client build directly
  app.use(express.static("client/build", { maxAge: "1h" }));

  // Fallback to index.html if no match
  app.use(function (req, res, next) {
    res.status(200).sendFile(CLIENT_INDEX);
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
