export function formatNumber(amount: string | number, precision = 4, min = 0): string {
    return Number(amount).toLocaleString('en-US', {
        maximumFractionDigits: precision,
        minimumFractionDigits: min
    });
}

export function capitalizeFirstLetter(str: string): string {
    const first = str[0].toUpperCase();
    const rest = str.slice(1);

    return first + rest;
}