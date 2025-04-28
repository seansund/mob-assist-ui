import {QueryClient} from "@tanstack/react-query";

let _queryClient: QueryClient;
export const getQueryClient = () => {
    if (_queryClient) return _queryClient;

    console.log('Creating query client')
    return _queryClient = new QueryClient();
};
