import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const translationFilePaths = [
    'src/locales/en/translation.json', // Eng
    'src/locales/sv/translation.json' // Swe
];
let translations = {};

function loadTranslations() {
    translations = {};

    translationFilePaths.forEach((file) => {
        const data = fs.readFileSync(file, 'utf8');
        translations[file] = JSON.parse(data);
    });

    return translations;
}

function saveTranslations() {
    translationFilePaths.forEach(file => {
        fs.writeFileSync(file, JSON.stringify(translations[file], null, 4), 'utf-8');
    });
}

function extractStrings(code, filename) {
    const strings = new Set();
    console.log("Code being parsed:", code); // Log the code being parsed

    // Regular expression to match strings within "", '', or ``
    const regex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;

    // Regular expression to match lines that contain only HTML tags with no text content or a single character between them
    const emptyHtmlTags = /^(\s*<[^>]+>\s*[^<]?\s*)+$/;

    // Regular expression to match the pattern {t("...")}
    const translationPattern = /\{t\(["'`].*?["'`]\)\}/;

    // Regular expression to match HTML tags
    const htmlTagPattern = /<[^>]*>/g;

    // Regular expression to match a single character between HTML tags
    const singleCharBetweenTags = /<[^>]*>[^<]<[^>]*>/g;

    // Regular expression to match className attributes
    const classNamePattern = /className=['"][^'"]*['"]/g;

    // Split the code into lines
    const lines = code.split('\n');

    // Iterate over each line
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        // Check if the line starts with 'import', contains 'from' followed by a space or quotes, contains only HTML tags with no text content or a single character between them, or matches the translation pattern
        if (!trimmedLine.startsWith('import') && !/\bfrom\s+['"]/.test(trimmedLine) && !emptyHtmlTags.test(trimmedLine) && !translationPattern.test(trimmedLine)) {
            let match;
            // Extract all strings within "", '', or `` that are not part of HTML tags, do not have a single character between HTML tags, and are not preceded by className
            while ((match = regex.exec(line)) !== null) {
                if (!htmlTagPattern.test(match[0]) && !singleCharBetweenTags.test(line) && !classNamePattern.test(line)) {
                    strings.add(match[0].slice(1, -1)); // Remove the quotes
                }
            }
            // Extract strings between >< if any
            const tagContentRegex = />([^<]+)</g;
            while ((match = tagContentRegex.exec(line)) !== null) {
                if (match[1].trim().length > 1) {
                    strings.add(match[1].trim());
                }
            }
        }
    });

    // Write the strings to strings.txt with a comment indicating the source file
    const outputDir = path.join(__dirname, 'TranslationOutput');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, 'strings.txt');
    const comment = `// Strings extracted from ${filename}\n`;
    fs.appendFileSync(outputPath, comment, 'utf-8');

    return Array.from(strings);
}

function filterDisplayStrings(strings) {
    const nonDisplayPatterns = [
        /if\s*\(/,
        /console\.log/,
        /console\.error/,
        /toast\./,
        /error/,
        /catch\s*\(/,
        /throw\s+/,
        /new\s+Error/
    ];

    return strings.filter(str => {
        const startsWithCapital = /^[A-Z]/.test(str);
        const matchesNonDisplayPattern = nonDisplayPatterns.some(pattern => pattern.test(str));
        const startsWithDebug = /^DEBUG/.test(str);
        const containsValidCharacters = /^[A-Za-z0-9\s.,!?'"-]+$/.test(str);

        return startsWithCapital && !matchesNonDisplayPattern && !startsWithDebug && containsValidCharacters;
    });
}

function createKeyValuePairs(strings) {
    if (!Array.isArray(strings)) {
        throw new TypeError('Expected an array of strings');
    }

    const keyValuePairs = {};
    const existingKeys = new Set();

    // Collect existing keys from all translation files
    Object.values(translations).forEach(translation => {
        Object.keys(translation).forEach(key => existingKeys.add(key));
    });

    strings.forEach(str => {
        let key = generateShortKey(str);
        let originalKey = key;
        let counter = 1;

        // Ensure the key is unique by appending a number if necessary
        while (existingKeys.has(key)) {
            key = `${originalKey}_${counter}`;
            counter++;
        }

        keyValuePairs[key] = str;
        existingKeys.add(key); // Add the new key to the set of existing keys
    });

    return keyValuePairs;
}

function generateShortKey(str) {
    // Generate a short, descriptive key from the string
    // This is a simple example, you can customize it as needed
    let key = str
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric characters with underscores
        .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores

    // Limit the length to 20 characters
    if (key.length > 20) {
        key = key.substring(0, 20);
        // Remove trailing underscores and incomplete words
        key = key.replace(/_+$/, ''); // Remove trailing underscores
        key = key.replace(/_[^_]*$/, ''); // Remove incomplete last word
    }

    return key;
}

function replaceStringsWithKeys(code, keyValuePairs) {
    let modifiedCode = code;
    for (const [key, value] of Object.entries(keyValuePairs)) {
        const regex = new RegExp(`(["'\`])${value}\\1`, 'g');
        modifiedCode = modifiedCode.replace(regex, `{t("${key}")}`);
    }
    return modifiedCode;
}

function addImportStatement(code) {
    const importStatement = `const { t, i18n } = useTranslation();\n`;
    if (!code.includes(importStatement)) {
        return importStatement + code;
    }
    return code;
}

function processFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const strings = extractStrings(code, path.basename(filePath));
    console.log("Strings: ", strings);
    const displayStrings = filterDisplayStrings(strings);
    console.log("Display Strings: ", displayStrings);
    const keyValuePairs = createKeyValuePairs(displayStrings);
    console.log("Key Value Pairs: ", keyValuePairs);

    const outputDir = path.join(__dirname, 'TranslationOutput');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const baseName = path.basename(filePath);

    // Write strings to file
    
    fs.appendFileSync(path.join(outputDir, 'strings.txt'), JSON.stringify(strings, null, 2) + '\n', 'utf-8');

    // Append display strings to file
    fs.appendFileSync(path.join(outputDir, 'display.txt'), `// ${baseName}\n`, 'utf-8');
    fs.appendFileSync(path.join(outputDir, 'display.txt'), JSON.stringify(displayStrings, null, 2) + '\n', 'utf-8');
    
    // Append key-value pairs to file
    fs.appendFileSync(path.join(outputDir, 'keyValuePairs.txt'), `// ${baseName}\n`, 'utf-8');
    fs.appendFileSync(path.join(outputDir, 'keyValuePairs.txt'), JSON.stringify(keyValuePairs, null, 2) + '\n', 'utf-8');

    /* let modifiedCode = replaceStringsWithKeys(code, keyValuePairs);
    modifiedCode = addImportStatement(modifiedCode); */
    // fs.writeFileSync(filePath, modifiedCode, 'utf-8');
    console.log(`Processed ${filePath}`);

    /* for (const [key, value] of Object.entries(keyValuePairs)) {
        translationFilePaths.forEach(file => {
            translations[file][key] = value; // Add the same value for simplicity
        });
    }
    saveTranslations(); */
}

function processDirectory(directoryPath) {
    fs.readdirSync(directoryPath).forEach(file => {
        const fullPath = path.join(directoryPath, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    });
}

function emptyFilesIfNotEmpty(files) {
    files.forEach(file => {
        if (fs.existsSync(file) && fs.statSync(file).size > 0) {
            fs.truncateSync(file, 0);
        }
    });
}

function main() {
    const args = process.argv.slice(2);
    const inputPath = args[0];
    if (!inputPath) {
        console.error('Please provide a file or directory path.');
        process.exit(1);
    }
    //Empty files
    const outputDir = path.join(__dirname, 'TranslationOutput');
    const filesToEmpty = [
        path.join(outputDir, 'strings.txt'),
        path.join(outputDir, 'display.txt'),
        path.join(outputDir, 'keyValuePairs.txt')
    ];
    emptyFilesIfNotEmpty(filesToEmpty);

    loadTranslations();

    const fullPath = path.resolve(inputPath);
    if (fs.lstatSync(fullPath).isDirectory()) {
        processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
        processFile(fullPath);
    } else {
        console.error('Please provide a valid .jsx file or directory path.');
        process.exit(1);
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main();
console.log(translations);