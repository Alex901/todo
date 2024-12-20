/**
 * Converts a duration in milliseconds to a human-readable format.
 * @param {number} durationMs - The duration in milliseconds.
 * @returns {string} The formatted duration string.
 */
const normalizeDuration = (durationMs) => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    let result = '';
    if (days > 0) {
        result += `${days}d `;
    }
    if (hours > 0 || days > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        result += `${minutes}m `;
    }
    result += `${seconds}s`;

    return result.trim();
};

const normalizeTime = (minutes) => {
    if (minutes >= 1440) {
        const days = Math.round(minutes / 1440);
        return `${days}d`;
    } else if (minutes >= 60) {
        const hours = Math.round(minutes / 60);
        return `${hours}h`;
    } else {
        return `${Math.round(minutes)}m`;
    }
};

const extractTimeFromDateString = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

export { normalizeDuration, normalizeTime, extractTimeFromDateString };
