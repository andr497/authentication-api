export const sanitizeStack = (stack?: string): string[] => {
    if (!stack) return [];

    return stack
        .split('\n')
        .map((line) => line.trim())
        .filter(
            (line) =>
                !line.includes('node_modules') &&
                !line.includes('internal/process'),
        )
        .map((line) => line.replace(process.cwd(), '.'));
};
