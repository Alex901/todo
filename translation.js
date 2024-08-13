import fs from 'fs';
import path from 'path';
import * as acorn from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import { fileURLToPath } from 'url';

const translationFiles = [
    'src/locales/en/translation.json', //Eng
    'src/locales/sv/translation.json' //Swe
];

let translations = {};

function loadTranslations() {
    translationFiles.forEach((file) => {
        const data = fs.readFileSync(file, 'utf8');
        translations[file] = JSON.parse(data);
    });
}

function saveTranslations() {
    translationFiles.forEach(file => {
        fs.writeFileSync(file, JSON.stringify(translations[file], null, 4), 'utf-8');
    });
}

function extractStrings(code) {
    const strings = [];
    console.log("Code being parsed:", code); // Log the code being parsed
    try {
        const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'module' });

        walkSimple(ast, {
            Literal(node) {
                if (typeof node.value === 'string') {
                    strings.push(node.value);
                }
            }
        });
    } catch (error) {
        console.error("Error parsing code:", error);
    }

    return strings;
}

function filterDisplayStrings(strings) {
    const nonDisplayPatterns = [
        /if\s*\(/,
        /console\.log/,
        /toast\./,
        /error/,
        /catch\s*\(/,
        /throw\s+/,
        /new\s+Error/
    ];

    return strings.filter(str => {
        return !nonDisplayPatterns.some(pattern => pattern.test(str));
    });
}

function generateKey(string) {
    return string.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
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

function createKeyValuePairs(strings) {
    const keyValuePairs = {};
    strings.forEach(str => {
        const key = generateKey(str);
        keyValuePairs[key] = str;
    });
    return keyValuePairs;
}

function processFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const strings = extractStrings(code);
    console.log("Strings: ", strings);
    const displayStrings = filterDisplayStrings(strings);
    console.log("Display Strings: ", displayStrings);
    const keyValuePairs = createKeyValuePairs(displayStrings);
    console.log("Key Value Pairs: ", keyValuePairs);

    /* let modifiedCode = replaceStringsWithKeys(code, keyValuePairs);
    modifiedCode = addImportStatement(modifiedCode); */
    // fs.writeFileSync(filePath, modifiedCode, 'utf-8');
    console.log(`Processed ${filePath}`);

    /* for (const [key, value] of Object.entries(keyValuePairs)) {
        translationFiles.forEach(file => {
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

function main() {
    const args = process.argv.slice(2);
    const inputPath = args[0];
    if (!inputPath) {
        console.error('Please provide a file or directory path.');
        process.exit(1);
    }

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

main();