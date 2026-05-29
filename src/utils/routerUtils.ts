// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generatePath = (path: string, dictionaries: Record<string, any>) => {
    return Object.entries(dictionaries).reduce((prev, [key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return prev.split(`:${key}`).join(value);
    }, path);
};
