import {QueryClient} from "@tanstack/react-query";

let _queryClient: QueryClient;
export const getQueryClient = () => {
    if (_queryClient) return _queryClient;

    return _queryClient = new QueryClient();
};
