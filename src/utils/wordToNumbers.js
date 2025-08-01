/**
 * Converts numerically typed words into numbers for multiple languages.
 * Handles compound numbers like "fiftyfive" or "hundrafemtio".
 * @param {string} word - The word to convert (e.g., "one", "ett", "fiftyfive").
 * @param {string} language - The language code (e.g., "en", "sv").
 * @returns {number} - The numeric value, or NaN if the word is invalid.
 */
const wordToNumbers = (word, language = 'en') => {
    const numberMap = {
        en: {
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
            ten: 10,
            eleven: 11,
            twelve: 12,
            thirteen: 13,
            fourteen: 14,
            fifteen: 15,
            sixteen: 16,
            seventeen: 17,
            eighteen: 18,
            nineteen: 19,
            twenty: 20,
            thirty: 30,
            forty: 40,
            fifty: 50,
            sixty: 60,
            seventy: 70,
            eighty: 80,
            ninety: 90,
            hundred: 100,
            thousand: 1000,
        },
        sv: {
            ett: 1,
            två: 2,
            tre: 3,
            fyra: 4,
            fem: 5,
            sex: 6,
            sju: 7,
            åtta: 8,
            nio: 9,
            tio: 10,
            elva: 11,
            tolv: 12,
            tretton: 13,
            fjorton: 14,
            femton: 15,
            sexton: 16,
            sjutton: 17,
            arton: 18,
            nitton: 19,
            tjugo: 20,
            trettio: 30,
            fyrtio: 40,
            femtio: 50,
            sextio: 60,
            sjuttio: 70,
            åttio: 80,
            nittio: 90,
            hundra: 100,
            tusen: 1000,
        },
    };

    const words = word.toLowerCase().split(/[\s-]+/); // Split by spaces or hyphens
    let total = 0;
    let current = 0;

    for (const w of words) {
        // Check if the word is a compound number (e.g., "fiftyfive")
        const compoundMatch = w.match(/(fifty|forty|thirty|twenty|hundred|tusen|hundra|nittio|sjuttio|sextio|femtio|fyrtio|trettio|tjugo)(one|two|three|four|five|six|seven|eight|nine)?/);
        if (compoundMatch) {
            const base = numberMap[language][compoundMatch[1]] || 0;
            const suffix = numberMap[language][compoundMatch[2]] || 0;
            current += base + suffix;
        } else if (numberMap[language][w]) {
            current += numberMap[language][w];
        } else if (w === 'hundred' || w === 'hundra') {
            current *= 100;
        } else if (w === 'thousand' || w === 'tusen') {
            current *= 1000;
            total += current;
            current = 0;
        } else {
            return NaN; // Invalid word
        }
    }

    console.log(`DEBUG W2N - Converted word "${word}" to number: ${total + current}`);
    console.log(`DEBUG W2N - Language used: ${language}`);

    return total + current;
};

export default wordToNumbers;