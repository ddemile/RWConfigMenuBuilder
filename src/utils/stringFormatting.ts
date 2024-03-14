export function toCamelCase(input: string) {
    const normalizedInput = input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');

    return normalizedInput
}

export function toPascalCase(input: string) {
    const normalizedInput = input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, _index) => word.toUpperCase()).replace(/\s+/g, '');

    return normalizedInput
}