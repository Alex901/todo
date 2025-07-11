import React from 'react';
import ReactModal from 'react-modal';
import './ExportListModal.css';
import { toast } from 'react-toastify';
import { TextField, InputAdornment, Tooltip, IconButton, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Select, MenuItem, InputLabel, FormGroup, Chip } from '@mui/material';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';
import { useUserContext } from '../../../../contexts/UserContext';
import { useTodoContext } from '../../../../contexts/todoContexts';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'; // import the jspdf-autotable plugin
import { normalizeDuration } from '../../../../utils/timeUtils';


const ExportListModal = ({ isOpen, onClose }) => {
    const { loggedInUser } = useUserContext();
    const { todoList } = useTodoContext();
    const [selectedList, setSelectedList] = React.useState(loggedInUser ? loggedInUser.activeList : '');
    const [customName, setCustomName] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState({
        "Include Completed tasks only": true,
        "Include only tasks with Deadline": true,
        "Include repeatable tasks": false,
        Created: true,
        Priority: false,
        Difficulty: false,
        Duration: true,
        "Estimated Time": false,
        steps: true,
        tags: false,
        "Completed on Time?": false,
        started: false,
        completed: false,
        duration: true
    });

    const handleOptionChange = (event) => {
        setSelectedOptions({ ...selectedOptions, [event.target.name]: event.target.checked });
        console.log(selectedOptions);
    };

    React.useEffect(() => {
        if (loggedInUser) {
            setSelectedList(loggedInUser.activeList);
        }
    }, [loggedInUser]);

    const handleExport = (event) => {
        event.preventDefault();
        const listToExport = getTodoListToExport();
        console.log("List to export: ", listToExport);
        listToExport.sort((a, b) => new Date(a.completed) - new Date(b.completed));
        console.log("List to export: ", listToExport.length);
        const duration = getDuration(listToExport);
        console.log("Duration: ", duration, "hours");

        const doc = new jsPDF();
        doc.setFillColor(169, 169, 169);
        const projectName = customName ? customName : selectedList;
        const title = 'HabitForge Activity Report';
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(title);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(title, textX, 10);

        // Add project summary
        doc.autoTable({
            head: [['Email', 'Project', 'Tasks', 'Duration']],
            body: [
                [loggedInUser.email, projectName, listToExport.length, `${duration} hours`]
            ],
            startY: 30
        });

        // Function to generate headers based on selected options
        const generateHeaders = (isCompleted) => {
            const headers = ['Task Name'];
            if (selectedOptions.Created) headers.push('Created');
            if (selectedOptions.started) headers.push('Started');
            if (isCompleted && selectedOptions.completed) headers.push('Completed');
            if (selectedOptions.Priority) headers.push('Priority');
            if (selectedOptions.Difficulty) headers.push('Difficulty');
            if (selectedOptions["Estimated Time"]) headers.push('Estimated Time');
            if (isCompleted && selectedOptions.duration) headers.push('Duration');
            return headers;
        };

        // Function to generate body data based on selected options
        const generateBodyData = (task, isCompleted) => {
            const rowData = [task.task];
            if (selectedOptions.Created) rowData.push(new Date(task.createdAt).toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: 'numeric' }));
            if (selectedOptions.started) rowData.push(new Date(task.started).toLocaleDateString('default', { month: 'short', day: 'numeric' }));
            if (isCompleted && selectedOptions.completed) rowData.push(task.completed ? new Date(task.completed).toLocaleDateString('default', { month: 'short', day: 'numeric' }) : '');
            if (selectedOptions.Priority) rowData.push(task.priority);
            if (selectedOptions.Difficulty) rowData.push(task.difficulty);
            if (selectedOptions["Estimated Time"]) rowData.push(task.estimatedTime ? `${task.estimatedTime} minutes` : 'no estimated time');
            if (isCompleted && selectedOptions.duration) rowData.push(task.completed ? normalizeDuration(new Date(task.completed) - new Date(task.started)) : '');
            return rowData;
        };

        // Function to check if a new page is needed
        const checkNewPage = (doc, startY) => {
            const pageHeight = doc.internal.pageSize.getHeight();
            if (startY > pageHeight - 20) {
                doc.addPage();
                return 20; // Reset startY to the top of the new page
            }
            return startY;
        };

        // Handle completed tasks
        let currentYearMonth = null;
        let startY = 70;
        let bodyData = [];
        const completedTasksTitle = 'Completed Tasks';
        const completedTasksTextWidth = doc.getTextWidth(completedTasksTitle);
        const completedTasksTextX = (pageWidth - completedTasksTextWidth) / 2;
        doc.text(completedTasksTitle, completedTasksTextX, startY);
        startY += 10;
        listToExport.forEach((task, index) => {
            if ((!task.repeatable || task.repeatable === false) && task.isDone) {
                const completedDate = new Date(task.completed);
                const yearMonth = `${completedDate.getFullYear()}-${completedDate.getMonth()}`;
                if (yearMonth !== currentYearMonth) {
                    if (bodyData.length > 0) {
                        doc.autoTable({
                            head: [generateHeaders(true)],
                            body: bodyData,
                            startY: startY,
                            styles: { halign: 'center' },
                            columnStyles: { 0: { halign: 'left' } } // Left align the first column (Task Name)
                        });
                        startY = doc.autoTable.previous.finalY + 20; // Update startY to the end of the previous table with extra space
                    }
                    currentYearMonth = yearMonth;
                    startY = checkNewPage(doc, startY);
                    doc.text(`${completedDate.toLocaleString('default', { month: 'long' })} ${completedDate.getFullYear()}`, 10, startY);
                    startY += 10;
                    bodyData = [];
                }
                bodyData.push(generateBodyData(task, true));
                if (selectedOptions.steps && task.steps.length > 0) {
                    task.steps.forEach(step => {
                        bodyData.push([`  - ${step.taskName}`]);
                    });
                }
                if (selectedOptions.tags && task.tags.length > 0) {
                    const tags = task.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag.label}
                            style={{
                                backgroundColor: tag.color,
                                color: tag.textColor,
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                            }}
                        />
                    ));
                    bodyData.push([`  Tags: ${tags.map(tag => tag.props.label).join(', ')}`]);
                }
                if (index === listToExport.length - 1) {
                    doc.autoTable({
                        head: [generateHeaders(true)],
                        body: bodyData,
                        startY: startY,
                        styles: { halign: 'center' },
                        columnStyles: { 0: { halign: 'left' } } // Left align the first column (Task Name)
                    });
                    startY = doc.autoTable.previous.finalY + 10; // Update startY to the end of the previous table
                }
            }

        });


        // Handle uncompleted tasks if "Include Completed tasks only" is false
        if (!selectedOptions["Include Completed tasks only"]) {
            startY += 20;
            const uncompletedTasksTitle = 'Prepared Tasks';
            const uncompletedTasksTextWidth = doc.getTextWidth(uncompletedTasksTitle);
            const uncompletedTasksTextX = (pageWidth - uncompletedTasksTextWidth) / 2;
            doc.text(uncompletedTasksTitle, uncompletedTasksTextX, startY);
            startY += 10;
            bodyData = [];
            listToExport.forEach((task) => {
                if ((!task.repeatable || task.repeatable === false) && !task.isDone) {
                    console.log("Task:", task);
                    bodyData.push(generateBodyData(task, false));
                    if (selectedOptions.steps && task.steps.length > 0) {
                        task.steps.forEach(step => {
                            bodyData.push([`  - ${step.taskName}`]);
                        });
                    }
                    if (selectedOptions.tags && task.tags.length > 0) {
                        const tags = task.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.label}
                                style={{
                                    backgroundColor: tag.color,
                                    color: tag.textColor,
                                    border: '1px solid rgba(0, 0, 0, 0.23)',
                                }}
                            />
                        ));
                        bodyData.push([`  Tags: ${tags.map(tag => tag.props.label).join(', ')}`]);
                    }
                }
            });

            if (bodyData.length > 0) {
                doc.autoTable({
                    head: [generateHeaders(false)],
                    body: bodyData,
                    startY: startY,
                    styles: { halign: 'center' },
                    columnStyles: { 0: { halign: 'left' } } // Left align the first column (Task Name)
                });
                startY = doc.autoTable.previous.finalY + 10; // Update startY to the end of the previous table
                checkNewPage(doc, startY);
            }

            console.log("Uncompleted tasks bodyData:", bodyData);
        }

        // Handle repeatable tasks
        const repeatableTasks = listToExport.filter(task => task.repeatable);
        if (repeatableTasks.length > 0) {
            startY += 20;
            const repeatableTasksTitle = 'Repeatable Tasks';
            const repeatableTasksTextWidth = doc.getTextWidth(repeatableTasksTitle);
            const repeatableTasksTextX = (pageWidth - repeatableTasksTextWidth) / 2;
            doc.text(repeatableTasksTitle, repeatableTasksTextX, startY);
            startY += 10;
            const repeatableBodyData = repeatableTasks.map((task) => {
                const repeatableCompleted = task.repeatableCompleted || [];
                const repeatCount = repeatableCompleted.length;
                const fastestCompletion = Math.min(...repeatableCompleted.map(rc => rc.duration));
                const slowestCompletion = Math.max(...repeatableCompleted.map(rc => rc.duration));
                const repeatStreak = task.repeatStreak || 0;

                return [
                    task.task,
                    repeatCount,
                    normalizeDuration(fastestCompletion),
                    normalizeDuration(slowestCompletion),
                    repeatStreak
                ];
            });

            doc.autoTable({
                head: [['Task Name', 'Repeat Count', 'Fastest Completion', 'Slowest Completion', 'Longest Streak']],
                body: repeatableBodyData,
                startY: startY,
                styles: { halign: 'center' },
                columnStyles: { 0: { halign: 'left' } } // Left align the first column (Task Name)
            });
            startY = doc.autoTable.previous.finalY + 10; // Update startY to the end of the previous table
        }

        // Add total time spent on project
        startY += 20;
        doc.text(`Total Time Spent on Project: ${duration} hours`, 10, startY);

        const date = new Date().toISOString().slice(0, 10);
        const pdfName = `${projectName}-${date}.pdf`;

        doc.save(pdfName);
    };


    const getTodoListToExport = () => {
        const list = todoList.filter((entry) => {
            const inSelectedList = entry.inListNew.some(list => list.listName === selectedList);

            // Handle repeatable tasks separately
            if (entry.repeatable) {
                return inSelectedList && selectedOptions["Include repeatable tasks"];
            }

            const includeCompleted = selectedOptions["Include Completed tasks only"] ? entry.isDone : true;
            const includeWithDeadline = selectedOptions["Include only tasks with Deadline"] ? entry.dueDate : true;

            return inSelectedList && includeCompleted && includeWithDeadline;
        });
        return list;
    };

    const getDuration = (list) => {
        let duration = 0;
        list.forEach((entry) => {
            if (entry.completed && entry.started) {
                const started = new Date(entry.started);
                const completed = new Date(entry.completed);
                const taskDurationHours = (completed - started) / (1000 * 60 * 60); // duration in hours
                duration += taskDurationHours;
            }
            if (entry.repeatable && entry.repeatableCompleted) {
                entry.repeatableCompleted.forEach((repeat) => {
                    const taskDurationHours = repeat.duration / (1000 * 60 * 60); // duration in hours
                    duration += taskDurationHours;
                });
            }
        });
        return Math.round(duration);
    };

    const handleListChange = (event) => {
        setSelectedList(event.target.value);
    };

    return (

        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel='Export list'
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >

            <div className='modalTitle' style={{ textAlign: 'center', marginBottom: '15px' }}> <h3 className="title" style={{ marginBottom: '30px' }}> Export list </h3></div>

            <form className="export-list-form" onSubmit={handleExport}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="select-list-label">Select List</InputLabel>
                    <Select
                        labelId="select-list-label"
                        id="select-list"
                        value={selectedList}
                        onChange={handleListChange}
                        label="Select List"
                        size='small'
                    >
                        {loggedInUser && loggedInUser.listNames && loggedInUser.listNames.map((list) => (
                            <MenuItem key={list._id} value={list.name}>{list.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Custom name(optional)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    id="outlined-basic"
                    type='text'
                    placeholder='Enter list name'
                    autoFocus
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="If no name is given, the list name will be used">
                                    <IconButton>
                                        <Icon className="information-icon" path={mdiInformation} size={1.2} />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />

                <div className="export-options" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h5>Settings</h5>

                    <div className="checkbox-container" >
                        <div className="checkbox-container">
                            <FormGroup row>
                                {Object.keys(selectedOptions).map((option, index) => (
                                    <div className="checkbox-wrapper" key={option}>
                                        <div className="checkbox-part">
                                            <Checkbox
                                                checked={selectedOptions[option]}
                                                onChange={handleOptionChange}
                                                name={option}
                                            />
                                        </div>
                                        <div className="text-part">
                                            <label>{option}</label>
                                        </div>
                                    </div>
                                ))}
                            </FormGroup>
                        </div>
                    </div>
                </div>



                <button className="export-button modal-button">Export</button>
            </form>
        </ReactModal>
    );
};

export default ExportListModal;