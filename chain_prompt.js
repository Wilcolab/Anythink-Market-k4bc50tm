/**
 * Converts a string to kebab-case format
 * 
 * @param {string|null|undefined} str - The input string to convert
 * @returns {string} The kebab-case formatted string, or empty string if input is null/undefined
 * @throws {TypeError} If input is not a string, null, or undefined
 * 
 * @example
 * toKebabCase('helloWorld') // 'hello-world'
 * toKebabCase('hello_world') // 'hello-world'
 * toKebabCase('hello-world') // 'hello-world'
 * toKebabCase('HelloWorld') // 'hello-world'
 * toKebabCase('hello.world') // 'hello-world'
 */
function toKebabCase(str) {
    if (str === null || str === undefined) {
        return '';
    }

    if (typeof str !== 'string') {
        throw new TypeError(`Expected string, received ${typeof str}`);
    }

    return str
        // Insert hyphens before uppercase letters in camelCase
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // Replace multiple delimiters with single hyphen
        .replace(/[\s_.\-]+/g, '-')
        // Convert to lowercase
        .toLowerCase()
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
}

module.exports = toKebabCase;

// Self-test section
if (require.main === module) {
    const testCases = [
        ['helloWorld', 'hello-world'],
        ['HelloWorld', 'hello-world'],
        ['hello_world', 'hello-world'],
        ['hello-world', 'hello-world'],
        ['hello.world', 'hello-world'],
        ['hello world', 'hello-world'],
        ['HELLO_WORLD', 'hello-world'],
        ['hello__world', 'hello-world'],
        ['hello--world', 'hello-world'],
        ['hello...world', 'hello-world'],
        ['hello', 'hello'],
        ['', ''],
        [null, ''],
        [undefined, ''],
        ['helloWorldTest', 'hello-world-test'],
        ['-helloWorld-', 'hello-world'],
    ];

    console.log('Running toKebabCase tests...\n');
    let passed = 0;
    let failed = 0;

    testCases.forEach(([input, expected]) => {
        try {
            const result = toKebabCase(input);
            const success = result === expected;
            const status = success ? '✓' : '✗';
            console.log(`${status} toKebabCase(${JSON.stringify(input)}) => "${result}" (expected "${expected}")`);
            success ? passed++ : failed++;
        } catch (error) {
            console.log(`✗ toKebabCase(${JSON.stringify(input)}) threw: ${error.message}`);
            failed++;
        }
    });

    console.log(`\nTests passed: ${passed}/${passed + failed}`);
    process.exit(failed > 0 ? 1 : 0);
}