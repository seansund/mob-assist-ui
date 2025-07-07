import {proxy} from "@/util";
import {NextApiRequest, NextApiResponse} from "next";

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    await proxy(req, res, '/graphql');
}
