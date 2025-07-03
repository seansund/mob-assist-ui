import {IncomingHttpHeaders} from "http";
import {NextApiRequest, NextApiResponse} from "next";
import {parse} from 'url';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

const getBackendHost = () => {
    return backendUrl;
}

export const proxy = async (req: NextApiRequest, res: NextApiResponse, targetPath?: string): Promise<NextApiResponse> => {
    const incomingUrl = parse(req.url || '', true);

    const backendHost = getBackendHost()
    const backendPath = targetPath || incomingUrl.pathname;

    const backendUrl = `${backendHost}${backendPath}${toQueryString(req.query)}`;

    console.log(`Proxying ${incomingUrl.pathname}${toQueryString(req.query)} to: ${backendUrl}`);

    return fetch(
        backendUrl,
        {
            method: req.method,
            headers: mapHeaders(req.headers),
            body: req.body,
        })
        .then(async response => {
            const data = await response.text();

            res.setHeaders(response.headers);
            res.status(response.status).send(data);
            return res;
        })
}

const mapHeaders = (headers: IncomingHttpHeaders): Headers => {
    return Object.keys(headers).reduce((result: Headers, key: string) => {
        result.append(key, headers[key] as string);
        return result;
    }, new Headers);
}

type Query = Partial<{
    [key: string]: string | string[];
}>

const toQueryString = (query: Query = {}): string => {
    return Object.keys(query)
        .reduce((result: string, key: string) => {
            const value = query[key];

            const newValue = Array.isArray(value)
                ? `${key}=${value.join(',')}`
                : `${key}=${value}`;

            if (result.length > 0) {
                result = `${result}&${newValue}`
            } else {
                result = `?${newValue}`
            }

            return result;
        }, '');
}