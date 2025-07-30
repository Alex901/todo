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

    // Regular expression to match strings within "", '', or `` (including multi-line strings)
    const regex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;

    // Regular expression to match content between HTML tags
    const tagContentRegex = />([^<]+)</g;

    // Split the code into lines
    const lines = code.split('\n');

    lines.forEach((line) => {
        let match;

        // Extract all strings within "", '', or `` (including multi-line strings)
        while ((match = regex.exec(line)) !== null) {
            strings.add(match[0].slice(1, -1)); // Remove the quotes
        }

        // Extract strings between HTML tags
        while ((match = tagContentRegex.exec(line)) !== null) {
            const content = match[1].trim();
            if (content.length > 1) {
                strings.add(content);
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

        // Skip the string if the key already exists
        if (existingKeys.has(key)) {
            return;
        }

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

    // Sort keyValuePairs by the length of their values in descending order
    const sortedKeyValuePairs = Object.entries(keyValuePairs).sort((a, b) => b[1].length - a[1].length);

    for (const [key, value] of sortedKeyValuePairs) {
        console.log(`Processing key: "${key}", value: "${value}"`);
        
        // Escape special characters in the value
        const escapedValue = escapeRegExp(value);
        // Create a regex to match the value case-insensitively
        const regex = new RegExp(escapedValue, 'gi');
        console.log(`Regex: ${regex}`);
        const matches = modifiedCode.match(regex);
        if (matches) {
            modifiedCode = modifiedCode.replace(regex, key);
        } else {
            console.error(`\x1b[31mError: No match found for value "${value}"\x1b[0m`);
        }
    }
    return modifiedCode;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addImportStatement(code, baseName) {
    const importStatement = `const { t, i18n } = useTranslation();\n`;
    const useTranslationStatement = `const { t } = useTranslation();`;

    // Add import statement if it doesn't exist
    if (!code.includes(importStatement)) {
        code = importStatement + code;
    }

    // Check if useTranslation statement already exists
    if (code.includes(useTranslationStatement)) {
        return code;
    }

    // Extract component name from base name
    const componentName = baseName.replace('.jsx', '');

    // Split the code into lines
    const lines = code.split('\n');

    // Find the line that starts with 'const ComponentName'
    const componentNameIndex = lines.findIndex(line => line.trim().startsWith(`const ${componentName}`));

    if (componentNameIndex !== -1) {
        // Find the first empty line after 'const ComponentName'
        let insertIndex = componentNameIndex + 1;
        while (insertIndex < lines.length && lines[insertIndex].trim() !== '') {
            insertIndex++;
        }

        // Insert the useTranslation statement
        lines.splice(insertIndex, 0, useTranslationStatement);
    }

    return lines.join('\n');
}

function processFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const strings = extractStrings(code, path.basename(filePath));
    const displayStrings = filterDisplayStrings(strings);
    const keyValuePairs = createKeyValuePairs(displayStrings);

    const outputDir = path.join(__dirname, 'TranslationOutput');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const baseName = path.basename(filePath);

    // Write strings to file

    fs.appendFileSync(path.join(outputDir, 'strings.txt'), JSON.stringify(strings, null, 2) + '\n', 'utf-8');

    fs.appendFileSync(path.join(outputDir, 'display.txt'), `// ${baseName}\n`, 'utf-8');
    fs.appendFileSync(path.join(outputDir, 'display.txt'), JSON.stringify(displayStrings, null, 2) + '\n', 'utf-8');

    fs.appendFileSync(path.join(outputDir, 'keyValuePairs.txt'), `// ${baseName}\n`, 'utf-8');
    fs.appendFileSync(path.join(outputDir, 'keyValuePairs.txt'), JSON.stringify(keyValuePairs, null, 2) + '\n', 'utf-8');

    let modifiedCode = replaceStringsWithKeys(code, keyValuePairs);
    modifiedCode = addImportStatement(modifiedCode, baseName);
    //console.log(`DEBUG -- ${baseName} modified code\n${modifiedCode}`);
   // console.log("\n", translations);
    // fs.writeFileSync(filePath, modifiedCode, 'utf-8');
    console.log(`\x1b[34mProcessed ${filePath}\x1b[0m`);

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
//console.log(translations);