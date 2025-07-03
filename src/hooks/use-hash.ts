// from https://medium.com/@dodanieloluwadare/handling-hashes-in-react-next-js-applications-21aac1ed9a1b

import { useState, useEffect } from 'react';

export const useHash = (): string | undefined => {
    const [hash, setHash] = useState<string>();
    useEffect(() => {
        setHash(window.location.hash);

        const onHashChange = () => {
            setHash(window.location.hash);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);
    return hash;
};
