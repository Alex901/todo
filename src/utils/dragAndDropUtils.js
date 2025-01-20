export const deadlineFinder = (droppedTask, destination) => {
    const droppableId = destination.droppableId.replace('calendar-day:', '');
    const match = droppableId.match(/^(.*?):(\[.*\])$/);
    if (!match) {
        throw new Error('Invalid droppableId format');
    }

    const date = match[1];
    const tasksString = match[2];
    const tasks = JSON.parse(tasksString);
    const index = destination.index;

    let newDueDate;
    let movedWithinDay = false;

    const setDateToSameDay = (date, time) => {
        const newDate = new Date(date);
        newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
        return newDate;
    };

    if (tasks.length === 0) {
        newDueDate = new Date(date);
        newDueDate.setHours(18, 0, 0, 0); // Set to 18:00
    } else if (index === 0) {
        newDueDate = setDateToSameDay(date, new Date(tasks[0].dueDate));
        newDueDate.setMinutes(newDueDate.getMinutes() - (droppedTask.estimatedTime || 30)); // Set before the next task
    } else if (index === tasks.length) {
        newDueDate = setDateToSameDay(date, new Date(tasks[tasks.length - 1].dueDate));
        newDueDate.setMinutes(newDueDate.getMinutes() + (tasks[tasks.length - 1].estimatedTime || 30)); // Set after the last task
    } else {
        const prevTask = new Date(tasks[index - 1].dueDate);
        const nextTask = new Date(tasks[index].dueDate);
        const timeBetween = (nextTask - prevTask) / 2;
        newDueDate = new Date(prevTask.getTime() + timeBetween);

        // Ensure the new due date is on the same day
        newDueDate = setDateToSameDay(date, newDueDate);

        // Check if the new due date is valid
        if (newDueDate <= prevTask || newDueDate >= nextTask) {
            movedWithinDay = true;
            // Find a valid time slot within the same day
            for (let i = 0; i < tasks.length - 1; i++) {
                const currentTask = new Date(tasks[i].dueDate);
                const nextTask = new Date(tasks[i + 1].dueDate);
                const timeBetween = (nextTask - currentTask) / 2;
                const potentialDueDate = new Date(currentTask.getTime() + timeBetween);

                if (potentialDueDate > currentTask && potentialDueDate < nextTask) {
                    newDueDate = setDateToSameDay(date, potentialDueDate);
                    break;
                }
            }
        }
    }

    return { newDueDate, movedWithinDay };
};