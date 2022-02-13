# server-proxy

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

// Fallback to client through proxy
app.use(proxy(process.env.CLIENT_HOST, {
  filter: req => req.method == 'GET',
}));
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