
export const mapScopesToRoles = (scopes: string[] = []): string[] => {
    return scopes
        .map(s => {
            switch(s) {
                case 'edit': return 'editor';
                case 'super_edit': return 'admin';
                default: return undefined;
            }
        })
        .reduce(
            (result: string[], r?: string) => {
                if (!r) return result;

                if (!result.includes(r)) result.push(r);

                return result
            },
            ['default']
        )
}

export const assignUserRole = (roles: string[] = []): string => {
    return roles.includes('admin') ? 'admin' : roles.includes('editor') ? 'editor' : 'default';
}
