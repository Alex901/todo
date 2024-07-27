import React from 'react';
import ReactModal from 'react-modal';
import './ExportListModal.css';
import { toast } from 'react-toastify';
import { TextField, InputAdornment, Tooltip, IconButton, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Select, MenuItem, InputLabel, FormGroup } from '@mui/material';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';
import { useUserContext } from '../../../../contexts/UserContext';
import { useTodoContext } from '../../../../contexts/todoContexts';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'; // import the jspdf-autotable plugin

const ExportListModal = ({ isOpen, onClose }) => {
    const { loggedInUser } = useUserContext();
    const { todoList } = useTodoContext();
    const [selectedList, setSelectedList] = React.useState(loggedInUser ? loggedInUser.activeList : '');
    const [customName, setCustomName] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState({

        created: true,
        completed: true,
        dueDate: true,
        owner: true,
        priority: false,
        duration: true,
        compareTime: false,
        steps: true,
        tags: true,
        deadline: false, 
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
        listToExport.sort((a, b) => new Date(a.completed) - new Date(b.completed));
        console.log("List to export: ", listToExport.length);
        const duration = getDuration(listToExport);
        console.log("Duration: ", duration, "hours");


        const doc = new jsPDF();
        doc.setFillColor(169, 169, 169);
        const projectName = customName ? customName : selectedList;
        doc.text('TaskForce', 10, 10);

        doc.autoTable({
            head: [['Email', 'Project', 'Tasks', 'Duration']],
            body: [
                [loggedInUser.email, projectName, listToExport.length, `${duration} hours`] // 
            ],
            startY: 30 // 
        });

        let currentYearMonth = null;
        let startY = 70; // start Y position for the first table
        let bodyData = []; // data for the current table
        listToExport.forEach((task, index) => {
            const completedDate = new Date(task.completed);
            const yearMonth = `${completedDate.getFullYear()}-${completedDate.getMonth()}`;
            if (yearMonth !== currentYearMonth) {
                // New month, create a new table for the previous month
                if (bodyData.length > 0) {
                    doc.autoTable({
                        head: [['Task Name', 'Started', 'completed', 'duration']],
                        body: bodyData,
                        startY: startY
                    });
                    startY += bodyData.length * 10 + 20; // update startY for the next table
                }
                // Start a new table for the new month
                currentYearMonth = yearMonth;
                doc.text(`${completedDate.toLocaleString('default', { month: 'long' })} ${completedDate.getFullYear()}`, 10, startY);
                startY += 10;
                bodyData = []; // reset bodyData for the new table
            }
            // Add the task to the current table
            let durationInMinutes = Math.round((new Date(task.completed) - new Date(task.started)) / 1000 / 60); // duration in minutes
            let durationHours = Math.floor(durationInMinutes / 60);
            let durationMinutes = durationInMinutes % 60;
            let duration = `${durationHours}h ${durationMinutes}m`;

            bodyData.push([
                task.task,
                new Date(task.started).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
                new Date(task.completed).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
                duration
            ]);
            // If it's the last task, create a table for the current month
            if (index === listToExport.length - 1) {
                doc.autoTable({
                    head: [['Task Name', 'Started', 'completed', 'duration']],
                    body: bodyData,
                    startY: startY
                });
            }
        });
        const date = new Date().toISOString().slice(0, 10); // gets the current date in the format YYYY-MM-DD
        const pdfName = `${projectName}-${date}.pdf`;

        doc.save(pdfName);
    };

    const getTodoListToExport = () => {
        const list = todoList.filter((entry) => entry.inList.includes(selectedList) && entry.isDone === selectedOptions.isDone);
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

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <FormGroup row>
                            {Object.keys(selectedOptions).map((option, index) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedOptions[option]}
                                            onChange={handleOptionChange}
                                            name={option}
                                        />
                                    }
                                    label={option}
                                    key={option}
                                    style={{ width: '30%' }}
                                />
                            ))}
                        </FormGroup>
                    </div>
                </div>



                <button className="export-button modal-button">Export</button>
            </form>
        </ReactModal>
    );
};

export default ExportListModal;