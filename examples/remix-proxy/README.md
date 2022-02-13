# remix-proxy

This project was bootstrapped using [Remix App server](https://github.com/remix-run/remix) with the `client` directory created based on [Create React App](https://github.com/facebook/create-react-app).

## How it works

```tsx
// $.tsx
import { LoaderFunction } from "remix";

/**
 * Proxy request based on the provided origin
 */
async function proxyRequest(request: Request, origin: string): Promise<Response> {
    let url = new URL(request.url);
    let destination = url.toString().replace(url.origin, origin);
    let response = await fetch(destination, request);
    let headers = new Headers(Array.from(response.headers.entries()).filter(([key, value]) => ['content-type'].includes(key)));

    return new Response(response.body, {
        status: response.status,
        headers,
    });
}

export let loader: LoaderFunction = async ({ request }) => {
    if (!process.env.CLIENT_HOST) {
        throw new Error('process.env.CLIENT_HOST is missing');
    }

    return proxyRequest(request, process.env.CLIENT_HOST)  
};
```

```jsonc
// package.json
{
    scripts: {
        "dev": "concurrently \"npm:dev:*\"",
        "dev:remix": "cross-env CLIENT_HOST=http://localhost:4567 remix dev",
        "dev:client": "cross-env PORT=4567 BROWSER=none npm start --prefix ./client",
    }
}
```