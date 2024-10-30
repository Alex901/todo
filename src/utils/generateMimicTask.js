export const generateMimicTask = (task, startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const repeatUntilDate = task.repeatUntil ? new Date(task.repeatUntil) : new Date(endDate);
    endDate.setHours(23, 59, 59, 999);

    console.log('DEBUG -- generateMimicTask -- task', task);


    while (currentDate <= endDate && currentDate <= repeatUntilDate) {
        if (task.repeatInterval === 'daily') {
            dates.push(new Date(currentDate));
        } else if (task.repeatInterval === 'weekly') {
            if (task.repeatDays.includes(currentDate.toLocaleString('default', { weekday: 'long' }))) {
                dates.push(new Date(currentDate));
            }
        } else if (task.repeatInterval === 'monthly') {
            if (task.repeatMonthlyOption === 'start' && currentDate.getDate() === 1) {
                dates.push(new Date(currentDate));
            } else if (task.repeatMonthlyOption === 'end' && currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) {
                dates.push(new Date(currentDate));
            }
        } else if (task.repeatInterval === 'yearly') {
            if (task.repeatYearlyOption === 'start' && currentDate.getMonth() === 0 && currentDate.getDate() === 1) {
                dates.push(new Date(currentDate));
            } else if (task.repeatYearlyOption === 'end' && currentDate.getMonth() === 11 && currentDate.getDate() === 31) {
                dates.push(new Date(currentDate));
            }
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.map(date => ({
        _id: `${task._id}-${date.getTime()}`, // Combine task._id with the timestamp of the date
        task: task.task,
        repeatable: true,
        repeatDay: date,
        completed: task.repeatableCompleted.find(completion => new Date(completion.completionTime).toDateString() === date.toDateString())?.completionTime,
        repeatableEmoji: task.repeatableEmoji,
        inListNew: task.inListNew,
    }));
};