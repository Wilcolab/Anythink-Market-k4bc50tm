/**
 * Convert a value into camelCase.
 *
 * Rules & behavior
 * - Accepts a string, null, or undefined.
 *   - If `null` or `undefined` is provided, the function returns an empty string ("").
 *   - If a non-string (other than null/undefined) is provided, a TypeError is thrown.
 * - Input is trimmed of leading and trailing whitespace before processing.
 * - Word boundaries (delimiters) recognized and used to form words:
 *   - Spaces, tabs, hyphens (`-`), and underscores (`_`) are treated as delimiters.
 *   - Consecutive delimiters collapse into a single separator (no empty words).
 *   - Note: dots (`.`) are NOT treated as delimiters by this function.
 * - Output format:
 *   - The first word is entirely lowercase.
 *   - Each subsequent word has its first character uppercased and the rest lowercased.
 *   - Non-letter characters (digits, punctuation, symbols) are preserved in-place; only letter-case is changed.
 * - Single-token heuristics (when no delimiter is present):
 *   - If the token appears to already be camelCase (starts with a lowercase letter and contains an uppercase letter later),
 *     the original string is returned unchanged.
 *   - If the token is all uppercase (an acronym, e.g. "NASA"), the whole token is lowercased.
 *   - Otherwise, only the first character is lowercased and the remainder of the token is left as-is.
 *
 * Edge cases and examples
 * - Empty or whitespace-only input -> "".
 * - Examples:
 *     toCamelCase("hello world")        -> "helloWorld"
 *     toCamelCase("  multiple  words ") -> "multipleWords"
 *     toCamelCase("kebab-case")         -> "kebabCase"
 *     toCamelCase("SINGLE")             -> "single"
 *     toCamelCase("alreadyCamelCase")   -> "alreadyCamelCase"  // preserved as-is
 *     toCamelCase("FOOBar")             -> "fOOBar"            // single-token mixed case: only first char lowercased
 *     toCamelCase("$pecial-char_name")  -> "$pecialCharName"
 *     toCamelCase("dots.are.not.delimiters") -> "dots.are.not.delimiters" // dots are not delimiters here
 *
 * @function toCamelCase
 * @param {string|null|undefined} input - The value to convert. Null/undefined are treated as empty input.
 * @returns {string} A camelCased string. Returns an empty string for null/undefined/empty input.
 * @throws {TypeError} If `input` is not a string, null, or undefined.
 */

/**
 * Convert a value into dot.case (lowercase words separated by dots).
 *
 * Rules & behavior
 * - Accepts a string, null, or undefined.
 *   - If `null` or `undefined` is provided, the function returns an empty string ("").
 *   - If a non-string (other than null/undefined) is provided, a TypeError is thrown.
 * - Input is trimmed of leading and trailing whitespace before processing.
 * - Recognized delimiters (treated as word separators):
 *   - Whitespace (spaces, tabs, etc.), hyphens (`-`), underscores (`_`), and dots (`.`).
 *   - Consecutive delimiters collapse into a single separator (no empty words).
 * - CamelCase / PascalCase splitting:
 *   - Tokens are further split on camelCase boundaries so that transitions like:
 *       - lower-case -> UpperCase (e.g. "alreadyCamel" -> ["already","Camel"])
 *       - acronym -> normal word (e.g. "FOOBar" -> ["FOO","Bar"]) are handled.
 *   - Acronyms (consecutive uppercase letters) are preserved as a single token and then lowercased.
 * - Output format:
 *   - All resulting word tokens are lowercased and joined with a single dot (`.`).
 *   - Numbers and non-letter characters attached to tokens are preserved.
 *
 * Edge cases and examples
 * - Empty or whitespace-only input -> "".
 * - Examples:
 *     toDotCase("hello world")           -> "hello.world"
 *     toDotCase("  multiple  words ")    -> "multiple.spaces.between"
 *     toDotCase("kebab-case")            -> "kebab.case"
 *     toDotCase("snake_case_example")    -> "snake.case.example"
 *     toDotCase("alreadyCamelCase")      -> "already.camel.case"
 *     toDotCase("SINGLE")                -> "single"
 *     toDotCase("FOOBar")                -> "foo.bar"            // acronym then word
 *     toDotCase("NASA API")              -> "nasa.api"
 *     toDotCase("user_123-id")           -> "user.123.id"
 *     toDotCase("$pecial-char_name")     -> "$pecial.char.name"
 *     toDotCase("dots.are.not.delimiters") -> "dots.are.not.delimiters" // dots are normalized as separators
 *
 * Implementation notes
 * - Splitting on camelCase boundaries attempts to avoid breaking punctuation or digits that are attached to words.
 * - toDotCase is intended to provide a normalized, lowercase, dot-separated tokenization useful for keys,
 *   identifiers, or configuration names.
 *
 * @function toDotCase
 * @param {string|null|undefined} input - The value to convert. Null/undefined are treated as empty input.
 * @returns {string} A dot.case string (lowercase words joined with '.'). Returns an empty string for null/undefined/empty input.
 * @throws {TypeError} If `input` is not a string, null, or undefined.
 */
const assert = require('assert');

/**
 * Converts a string to camelCase.
 *
 * Rules:
 * - First word is entirely lowercase.
 * - Subsequent words have their first character uppercased and remaining characters lowercased.
 * - Delimiters treated as word separators: spaces, tabs, hyphens (-), underscores (_). Consecutive delimiters are collapsed.
 * - Null/undefined/empty-string return '' (graceful handling).
 * - Non-string (except null/undefined) throws TypeError.
 * - If input already appears to be camelCase (single token, starts with lowercase and contains an uppercase later),
 *   the original string is returned unchanged.
 * - All-caps single-token input (e.g. "NASA") is lowercased.
 * - Numbers and special characters are preserved. Capitalization rules affect letters only.
 *
 * @param {string|null|undefined} input - The value to convert to camelCase.
 * @returns {string} The camelCased string or '' for null/undefined/empty input.
 * @throws {TypeError} If input is not a string, null, or undefined.
 */
function toCamelCase(input) {
    // Gracefully handle null/undefined
    if (input === null || input === undefined) return '';

    if (typeof input !== 'string') {
        throw new TypeError('toCamelCase: input must be a string, null, or undefined');
    }

    const str = input.trim();
    if (str.length === 0) return '';

    // If there are no delimiters (space, tab, hyphen, underscore) handle single-token heuristics
    const delimiterRegex = /[\s\-_]/;
    if (!delimiterRegex.test(str)) {
        // If already camelCase (starts with lowercase and contains an uppercase later), return as-is
        if (/^[a-z][A-Za-z0-9]*$/.test(str) && /[A-Z]/.test(str)) {
            return str;
        }
        // If all-caps, lowercase whole string
        if (str === str.toUpperCase()) {
            return str.toLowerCase();
        }
        // Default: lowercase first character (leave rest as-is)
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    // Split on spaces, hyphens, underscores (including any whitespace), collapse consecutive delimiters
    const tokens = str.split(/[\s\-_]+/).filter(Boolean);
    if (tokens.length === 0) return '';

    // Helper: lowercase entire token for first word; for subsequent words capitalize first char and lowercase rest.
    const first = tokens[0].toLowerCase();

    const rest = tokens.slice(1).map(token => {
        // For each token, uppercase first char (if any) and lowercase remainder.
        // Non-letter first chars are preserved; toUpperCase/toLowerCase are safe on non-letters.
        return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    });

    return [first, ...rest].join('');
}

module.exports = { toCamelCase };

/* =========================
     Self-tests when run directly
     ========================= */

if (require.main === module) {

    const cases = [
        // Basic
        { in: 'hello world', out: 'helloWorld' },
        { in: 'Hello world', out: 'helloWorld' },
        { in: '  multiple   spaces  between ', out: 'multipleSpacesBetween' },

        // Delimiters
        { in: 'kebab-case-example', out: 'kebabCaseExample' },
        { in: 'snake_case_example', out: 'snakeCaseExample' },
        { in: 'mixed-CASE_and spaces', out: 'mixedCaseAndSpaces' },

        // Consecutive/leading/trailing delimiters
        { in: '--leading-delims', out: 'leadingDelims' },
        { in: 'trailing-delims__', out: 'trailingDelims' },
        { in: 'foo--bar__baz', out: 'fooBarBaz' },

        // Already camelCased or single token
        { in: 'alreadyCamelCase', out: 'alreadyCamelCase' },
        { in: 'simple', out: 'simple' },
        { in: 'SINGLE', out: 'single' }, // all caps -> lowercased single token

        // Mixed cases
        { in: 'NASA API', out: 'nasaApi' },
        { in: 'user_123-id', out: 'user123Id' },
        { in: '123start middle', out: '123startMiddle' },

        // Special chars preserved
        { in: '$pecial-char_name', out: '$pecialCharName' },
        { in: 'dots.are.not.delimiters', out: 'dots.are.not.delimiters' }, // no recognized delimiters -> first char lowered

        // Edge whitespace
        { in: '\tleading\tand\ttabs\t', out: 'leadingAndTabs' },

        // Empty/Null/Undefined handled gracefully
        { in: '', out: '' },
        { in: '   ', out: '' },
        { in: null, out: '' },
        { in: undefined, out: '' },
    ];

    for (const { in: input, out: expected } of cases) {
        const result = toCamelCase(input);
        assert.strictEqual(result, expected, `toCamelCase(${JSON.stringify(input)}) -> ${result} !== ${expected}`);
    }

    // Throwing behavior for non-strings
    assert.throws(() => toCamelCase(123), TypeError);
    assert.throws(() => toCamelCase({}), TypeError);
    assert.throws(() => toCamelCase([]), TypeError);

    // Some additional assertions for nuanced behavior
    assert.strictEqual(toCamelCase('FOOBar'), 'fOOBar'); // single token, mixed-case: only first char lowercased by design
    assert.strictEqual(toCamelCase('foo_bar-baz qux'), 'fooBarBazQux'); // combined delimiters

    console.log('All toCamelCase tests passed.');
}

/**
 * Converts a string to dot.case.
 *
 * Rules:
 * - Words are lowercase and separated by dots.
 * - Delimiters treated as word separators: spaces, tabs, hyphens (-), underscores (_), and dots (.).
 *   Consecutive delimiters are collapsed.
 * - Null/undefined/empty-string return '' (graceful handling).
 * - Non-string (except null/undefined) throws TypeError.
 * - CamelCase and PascalCase are split into words (e.g. "alreadyCamelCase" -> "already.camel.case").
 * - All-caps acronyms are preserved as one token then lowercased (e.g. "NASA API" -> "nasa.api").
 * - Numbers and special characters attached to words are preserved (e.g. "$pecial-char" -> "$pecial.char").
 *
 * @param {string|null|undefined} input
 * @returns {string}
 * @throws {TypeError}
 */
function toDotCase(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') {
        throw new TypeError('toDotCase: input must be a string, null, or undefined');
    }

    const str = input.trim();
    if (str.length === 0) return '';

    // Split on recognized delimiters (whitespace, hyphen, underscore, dot), collapse consecutive ones.
    const tokens = str.split(/[\s\-_\.]+/).filter(Boolean);
    if (tokens.length === 0) return '';

    // Split a token on camelCase boundaries without breaking punctuation attached to words.
    const splitCamel = (token) => {
        if (token.length === 0) return [];
        const parts = [];
        let buf = token[0];
        for (let i = 1; i < token.length; i++) {
            const ch = token[i];
            const prev = token[i - 1];
            const next = token[i + 1];

            const isUpper = ch >= 'A' && ch <= 'Z';
            const prevIsLower = prev >= 'a' && prev <= 'z';
            const prevIsUpper = prev >= 'A' && prev <= 'Z';
            const nextIsLower = next >= 'a' && next <= 'z';

            // Split when transitioning from lower/digit to upper, or when ending an acronym before a normal word.
            if (isUpper && (prevIsLower || (prevIsUpper && nextIsLower))) {
                parts.push(buf);
                buf = ch;
            } else {
                buf += ch;
            }
        }
        parts.push(buf);
        return parts;
    };

    const subParts = [];
    for (const token of tokens) {
        const parts = splitCamel(token);
        for (const p of parts) {
            // Lowercase letters only; toLowerCase is safe for non-letter characters.
            subParts.push(p.toLowerCase());
        }
    }

    return subParts.join('.');
}

module.exports.toDotCase = toDotCase;

if (require.main === module) {
    // Basic
    assert.strictEqual(toDotCase('hello world'), 'hello.world');
    assert.strictEqual(toDotCase('Hello world'), 'hello.world');
    assert.strictEqual(toDotCase('  multiple   spaces  between '), 'multiple.spaces.between');

    // Delimiters
    assert.strictEqual(toDotCase('kebab-case-example'), 'kebab.case.example');
    assert.strictEqual(toDotCase('snake_case_example'), 'snake.case.example');
    assert.strictEqual(toDotCase('mixed-CASE_and spaces'), 'mixed.case.and.spaces');

    // Consecutive/leading/trailing delimiters
    assert.strictEqual(toDotCase('--leading-delims'), 'leading.delims');
    assert.strictEqual(toDotCase('trailing-delims__'), 'trailing.delims');
    assert.strictEqual(toDotCase('foo--bar__baz'), 'foo.bar.baz');

    // CamelCase / single token
    assert.strictEqual(toDotCase('alreadyCamelCase'), 'already.camel.case');
    assert.strictEqual(toDotCase('simple'), 'simple');
    assert.strictEqual(toDotCase('SINGLE'), 'single'); // all caps -> lowercased single token
    assert.strictEqual(toDotCase('FOOBar'), 'foo.bar'); // acronym then word

    // Mixed cases
    assert.strictEqual(toDotCase('NASA API'), 'nasa.api');
    assert.strictEqual(toDotCase('user_123-id'), 'user.123.id');
    assert.strictEqual(toDotCase('123start middle'), '123start.middle');

    // Special chars preserved
    assert.strictEqual(toDotCase('$pecial-char_name'), '$pecial.char.name');
    assert.strictEqual(toDotCase('dots.are.not.delimiters'), 'dots.are.not.delimiters'); // dots are treated as delimiters -> normalized

    // Edge whitespace
    assert.strictEqual(toDotCase('\tleading\tand\ttabs\t'), 'leading.and.tabs');

    // Empty/Null/Undefined handled gracefully
    assert.strictEqual(toDotCase(''), '');
    assert.strictEqual(toDotCase('   '), '');
    assert.strictEqual(toDotCase(null), '');
    assert.strictEqual(toDotCase(undefined), '');

    // Throwing behavior for non-strings
    assert.throws(() => toDotCase(123), TypeError);
    assert.throws(() => toDotCase({}), TypeError);
    assert.throws(() => toDotCase([]), TypeError);

    console.log('All toDotCase tests passed.');
}

