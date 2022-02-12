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
    if (!process.env.CLIENT_ORIGIN) {
        throw new Error('process.env.CLIENT_ORIGIN is missing');
    }

    return proxyRequest(request, process.env.CLIENT_ORIGIN)  
};