# server-assets

This project was bootstrapped using [Remix](https://github.com/remix-run/remix) Express Server template with the `client` directory created based on [Create React App](https://github.com/facebook/create-react-app).

## How it works

```js
// remix.config.js
module.exports = {
  // Prefix public path with the basename 
  publicPath: "/basename/build/",
};

```

```js
// server/index.js

// Update all app handler with the basename
app.use('/basename', express.static("public", { maxAge: "1h" }));
app.use('/basename', express.static("public/build", { immutable: true, maxAge: "1y" }));
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
  app.use(proxy(process.env.CLIENT_HOST, {
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
```

```jsonc
// package.json
{
    scripts: {
        "dev": "concurrently \"npm:dev:*\"",
        "dev:remix": "remix watch",
        "dev:client": "cross-env PORT=4567 BROWSER=none npm start --prefix ./client",
        "dev:express": "cross-env CLIENT_HOST=http://localhost:4567 NODE_ENV=development node server/index.js",
    }
}
```