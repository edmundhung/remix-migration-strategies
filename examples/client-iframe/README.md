# client-iframe

This project was bootstrapped using [Create React App](https://github.com/facebook/create-react-app) with the `server` directory created based on [Remix App server](https://github.com/remix-run/remix) template.
 
## How it works

```js
// src/index.js
<BrowserRouter>
    <Switch>
        <Route path="/basename"  render={() => <RemixIFrame />} />
        <Route render={() => <App />} />
    </Switch>
</BrowserRouter>
```

```ts
// src/RemixIframe.js
export default function RemixIframe() {
    const style = {
        height: '100vh',
        display: 'block',
        width: '100%',
        border: 'none',
    };    

    return <iframe title="remix" style={style} src={process.env.REACT_APP_SERVER_HOST} />;
}
```

```jsonc
// package.json
{
    scripts: {
        "dev": "concurrently \"npm:dev:*\"",
        "dev:client": "REACT_APP_SERVER_HOST=http://localhost:4567 npm start",
        "dev:remix": "cross-env PORT=4567 npm run dev --prefix ./server",
    }
}
```