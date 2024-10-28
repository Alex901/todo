const generateOptions = (interval, todaysDate, earliestDate, latestDate) => {
    const options = [];
    const today = new Date(todaysDate);
    const earliest = new Date(earliestDate);
    const latest = new Date(latestDate);
    latest.setHours(23, 59, 59, 999);

    // console.log('DEBUG-- generate options: today', today);  
    // console.log('DEBUG-- generate options: latest', latest);

    // console.log('earliest', earliest);

    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const formatDateToISOString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    if (interval === 'day') {
        let currentDate = new Date(earliest);
        while (currentDate <= latest) {
            const startOfDay = new Date(currentDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);
            // console.log('DEBUG-- generate options: startOfDay', startOfDay);
            // console.log('DEBUG-- generate options: endOfDay', endOfDay);
            options.push({
                label: currentDate.toDateString() === today.toDateString() ? 'Today' : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: {
                    start: startOfDay.toISOString(),
                    end: endOfDay.toISOString(),
                },
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else if (interval === 'week') {
        const dayOfWeek = today.getDay();
        const diffToSunday = 7 - dayOfWeek;
        latest.setDate(today.getDate() + diffToSunday);
        latest.setHours(23, 59, 59, 999);

        let currentDate = new Date(earliest);
        // console.log('DEBUG -- latest', latest);
        while (currentDate <= latest) {
            const startOfWeek = new Date(currentDate);
            const dayOfWeek = startOfWeek.getDay();
            const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
            startOfWeek.setDate(currentDate.getDate() + diffToMonday);
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            // console.log('DEBUG-- generate options: startOfWeek', startOfWeek);
            // console.log('DEBUG-- generate options: endOfWeek', endOfWeek);
            options.push({
                label: startOfWeek <= today && today <= endOfWeek ? 'This Week' : `Week ${getWeekNumber(startOfWeek)}`,
                value: {
                    start: startOfWeek.toISOString(),
                    end: endOfWeek.toISOString(),
                },
            });
            currentDate.setDate(currentDate.getDate() + 7);
        }
    } else if (interval === 'month') {
        let currentDate = new Date(latest);
        let currentMonthIncluded = false;
        const earliestMonth = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
        
        while (currentDate >= earliestMonth) {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            // console.log('DEBUG-- generate options: startOfMonth', startOfMonth);
            // console.log('DEBUG-- generate options: endOfMonth', endOfMonth);
            options.push({
                label: startOfMonth.toLocaleString('default', { month: 'long' }),
                value: {
                    start: formatDateToISOString(startOfMonth),
                    end: formatDateToISOString(endOfMonth),
                },
            });
            if (startOfMonth.getMonth() === today.getMonth() && startOfMonth.getFullYear() === today.getFullYear()) {
                currentMonthIncluded = true;
            }
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        // Ensure the current month is included
        if (!currentMonthIncluded) {
            const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            startOfCurrentMonth.setHours(0, 0, 0, 0);
            const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfCurrentMonth.setHours(23, 59, 59, 999);
            options.push({
                label: startOfCurrentMonth.toLocaleString('default', { month: 'long' }),
                value: {
                    start: formatDateToISOString(startOfCurrentMonth),
                    end: formatDateToISOString(endOfCurrentMonth),
                },
            });
        }
        options.reverse();
    }
    
    return options;
};

export default generateOptions;