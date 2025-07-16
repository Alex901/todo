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

const formatTime = (minutes) => {
    const units = [
        { label: 'Y', value: 525600 }, // 1 year = 525600 minutes
        { label: 'M', value: 43800 },  // 1 month = 43800 minutes (approx)
        { label: 'w', value: 10080 },  // 1 week = 10080 minutes
        { label: 'd', value: 1440 },   // 1 day = 1440 minutes
        { label: 'h', value: 60 },     // 1 hour = 60 minutes
        { label: 'min', value: 1 }     // 1 minute = 1 minute
    ];

    let remainingMinutes = minutes;
    const result = [];

    for (const unit of units) {
        const unitValue = Math.floor(remainingMinutes / unit.value);
        if (unitValue > 0) {
            result.push(`${unitValue}${unit.label}`);
            remainingMinutes %= unit.value;
        }
        if (result.length === 2) break; // Only return the two largest values
    }

    return result.join(' ');
};

const getDateConstraints = (tasksBeforeOptions = [], tasksAfterOptions = []) => {
    // console.trace("getDateConstraints called from:");

    // console.log("DEBUG calculating date constraints with tasksBeforeOptions: ", tasksBeforeOptions);
    // console.log("DEBUG calculating date constraints with tasksAfterOptions: ", tasksAfterOptions);
    const now = new Date();
    const currentDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16); // Current date/time in ISO format

    // Default minDate is the current date/time
    let minDate = currentDateTime;

    // If there are tasksAfterOptions, calculate the latest due date among them (considering estimatedTime and totalTimeSpent)
    if (tasksAfterOptions.length) {
        const latestAfterDate = new Date(
            Math.max(
                ...tasksAfterOptions.map(task => {
                    const dueDate = new Date(task.dueDate).getTime();
                    const estimatedTimeMs = (task.estimatedTime || 0) * 60 * 1000; // Convert minutes to milliseconds
                    const totalTimeSpentMs = task.totalTimeSpent || 0; // Already in milliseconds
                    return dueDate + estimatedTimeMs + totalTimeSpentMs;
                })
            )
        );
        minDate = latestAfterDate > now ? latestAfterDate.toISOString().slice(0, 16) : currentDateTime;
    }

    // Default maxDate is null (no restriction)
    let maxDate = null;

    // If there are tasksBeforeOptions, calculate the earliest due date among them (considering estimatedTime and totalTimeSpent)
    if (tasksBeforeOptions.length) {
        const earliestBeforeDate = new Date(
            Math.min(
                ...tasksBeforeOptions.map(task => {
                    const dueDate = new Date(task.dueDate).getTime();
                    const estimatedTimeMs = (task.estimatedTime || 0) * 60 * 1000; // Convert minutes to milliseconds
                    const totalTimeSpentMs = task.totalTimeSpent || 0; // Already in milliseconds
                    return dueDate - estimatedTimeMs - totalTimeSpentMs;
                })
            )
        );
        maxDate = earliestBeforeDate.toISOString().slice(0, 16);
    }

    console.log({ min: minDate, max: maxDate });

    return { min: minDate, max: maxDate };
};

export { normalizeDuration, normalizeTime, extractTimeFromDateString, formatTime, getDateConstraints };
