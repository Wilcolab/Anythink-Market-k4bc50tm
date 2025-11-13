function toCamelCase(str) {
    return str
        .split(/[-_ ]+/) // Split by hyphens, underscores, or spaces
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase(); // First word to lowercase
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter of subsequent words
        })
        .join(''); // Join the words back together
}

// Example usage:
console.log(toCamelCase('hello-world')); // Output: helloWorld
console.log(toCamelCase('make_this_camel_case')); // Output: makeThisCamelCase
console.log(toCamelCase('convert to camel case')); // Output: convertToCamelCase