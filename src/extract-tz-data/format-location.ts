export function formatLocation(location: string): string {
    const displayName = location
        .replace('/', ' - ')
        .replace('_', ' ');
    return displayName
}
