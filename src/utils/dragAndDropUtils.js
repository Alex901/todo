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

    if (tasks.length === 0) {
        newDueDate = new Date(date);
        newDueDate.setHours(18, 0, 0, 0); // Set to 18:00
    } else if (index === 0) {
        newDueDate = new Date(tasks[0].dueDate);
        newDueDate.setMinutes(newDueDate.getMinutes() - (droppedTask.estimatedTime || 30)); // Set before the next task
    } else if (index === tasks.length) {
        newDueDate = new Date(tasks[tasks.length - 1].dueDate);
        newDueDate.setMinutes(newDueDate.getMinutes() + (tasks[tasks.length - 1].estimatedTime || 30)); // Set after the last task
    } else {
        const prevTask = new Date(tasks[index - 1].dueDate);
        const nextTask = new Date(tasks[index].dueDate);
        const timeBetween = (nextTask - prevTask) / 2;
        newDueDate = new Date(prevTask.getTime() + timeBetween);
    }

    return newDueDate;
};