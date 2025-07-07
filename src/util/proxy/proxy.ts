import {IncomingHttpHeaders} from "http";
import {NextApiRequest, NextApiResponse} from "next";
import {parse} from 'url';
import getRawBody from 'raw-body';

const backendUrl = process.env.BACKEND_URL ?? 'http://mob-assist-api:3001';

const getBackendHost = () => {
    return backendUrl;
}

export const proxy = async (req: NextApiRequest, res: NextApiResponse, targetPath?: string): Promise<NextApiResponse> => {
    const incomingUrl = parse(req.url ?? '', true);

    const incomingPath = incomingUrl.pathname ?? '/';

    const backendHost = getBackendHost();
    const backendPath = targetPath ?? incomingPath;

    const backendUrl = `${backendHost}${backendPath}${toQueryString(req.query)}`;

    return fetch(
        backendUrl,
        {
            method: req.method,
            headers: mapHeaders(req.headers),
            body: await getRawBody(req),
        })
        .then(async response => {
            const data = await response.text();

            res.setHeaders(response.headers);
            res.status(response.status).send(data);
            return res;
        })
}

const mapHeaders = (headers: IncomingHttpHeaders = {}, contentLength?: number): Headers => {
    const result = Object.keys(headers).reduce((partialResult: Headers, key: string) => {
        if (key === 'content-length') {
            return partialResult;
        }

        partialResult.append(key, headers[key] as string);
        return partialResult;
    }, new Headers);

    if (contentLength) {
        result.append('Content-Length', contentLength.toString());
    }

    return result;
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