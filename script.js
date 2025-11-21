let tasks = !localStorage.tasks ? [] : JSON.parse(localStorage.getItem('tasks'));
let addToList = document.querySelector(".addToList button")
let task = document.querySelector("#task")
let date_from = document.querySelector("#dateFrom")
let date_to = document.querySelector("#dateTo")
let subject = document.querySelector("#subjects")
let created_subject = document.querySelector("#newSubject")
let add_subject = document.querySelector(".newSubject")
let tasks_block = document.querySelector(".tasksList")
let box_update = document.querySelector('#box_update')
let draggedIndex = 0;
let draggedTask = null;

addToList.addEventListener("click", ()=>{
    let errors = false;

    if (task.value == "" || task.value.length < 3 || task.value.length > 50) {
        task.classList.add('invalid')
        errors = true
    } 
    else {
        task.classList.remove('invalid')
    }

    if (date_from.value == "" || date_to.value == "" || (date_to.value - date_from.value < 0)) {
        if (date_from.value == "") date_from.classList.add('invalid')
        if (date_to.value == "") date_to.classList.add('invalid')
        errors = true
    } 
    else if (new Date(date_from.value) > new Date(date_to.value)) {
        date_from.classList.add('invalid')
        date_to.classList.add('invalid')
        errors = true
    }
    else {
        date_from.classList.remove('invalid')
        date_to.classList.remove('invalid')
    }

    let taskSubjectValue;
    if (created_subject.value !== "") {
        taskSubjectValue = created_subject.value
    } 
    else {
        taskSubjectValue = subject.value
    }

    if (errors == true) return

    let newTaskValue = task.value
    let newTask = {
        "name" : newTaskValue,
        "status": 'planned',
        "dateFrom": date_from.value,
        "dateTo": date_to.value,
        "taskSubject": taskSubjectValue 
    }
    tasks.push(newTask)
    updateLocalStorage()
    showAllTasks()
    updateStats()

    task.value = ''
    date_from.value = ''
    date_to.value = ''
    created_subject.value = ''

    task.classList.remove('invalid')
    date_from.classList.remove('invalid') 
    date_to.classList.remove('invalid')
})

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const setDraggedIndex = (index) => {
    draggedIndex = index;
    console.log('drag = ' + index);
}

const showTask = (taskItem, index) => {
    return `<div class="task" draggable="true" ondragstart="setDraggedIndex(${index})" ondragend="setDraggedIndex(${index})">
        <div class="namePlusdatePlusSubject ${taskItem.status === 'done' ? 'done' : ''}">
            <p>${taskItem.name}</p>
            <p>From ${taskItem.dateFrom ? taskItem.dateFrom : 'No date'}</p>
            <p>To ${taskItem.dateTo ? taskItem.dateTo : 'No date'}</p>     
            <p>Subject: ${taskItem.taskSubject ? taskItem.taskSubject : 'No subject'}</p>
        </div>

        <div class="checkAndBut">
            <div class="buttons">
                <div>
                    <button class='task_button' data-index='${index}' data-action='delete'>delete</button>
                </div>
                <div>
                    <button class='task_button' data-index='${index}' data-action='update'>update</button>
                </div>
            </div>
        </div>
    </div>`
}

const showAllTasks = () => {
    
    document.querySelector('.planned').innerHTML = '';
    document.querySelector('.in-progress').innerHTML = '';
    document.querySelector('.done').innerHTML = '';
    
    tasks.forEach((item, index) => {
        const column = document.querySelector(`.${item.status}`);
        if (column) {
            column.innerHTML += showTask(item, index);
        }
    });
}

document.addEventListener('dragover', function(event) {
    event.preventDefault();
});

document.addEventListener('drop', function(event) {
    event.preventDefault();
    console.log('Drop to: ', event.target);
    
    let column = null;
    
    if (event.target.classList.contains('planned') || 
        event.target.classList.contains('in-progress') || 
        event.target.classList.contains('done')) {
        column = event.target;
    }
    else if (event.target.closest('.planned')) {
        column = document.querySelector('.planned');
    }
    else if (event.target.closest('.in-progress')) {
        column = document.querySelector('.in-progress');
    }
    else if (event.target.closest('.done')) {
        column = document.querySelector('.done');
    }
    else if (event.target.closest('.column')) {
        const columnElement = event.target.closest('.column');
        if (columnElement.querySelector('.planned')) {
            column = columnElement.querySelector('.planned');
        } else if (columnElement.querySelector('.in-progress')) {
            column = columnElement.querySelector('.in-progress');
        } else if (columnElement.querySelector('.done')) {
            column = columnElement.querySelector('.done');
        }
    }
    
    console.log('Found:', column);
    
    if (column) {
        console.log('Task ', draggedIndex, 'to ', column.className);
        
        let newStatus = 'planned';
        if (column.classList.contains('in-progress')) {
            newStatus = 'in-progress';
        } else if (column.classList.contains('done')) {
            newStatus = 'done';
        }
        
        if (tasks[draggedIndex].status !== newStatus) {
            tasks[draggedIndex].status = newStatus;
            updateLocalStorage();
            showAllTasks();
            updateStats();
            console.log('Status now:', newStatus);
        }
    }
});

document.addEventListener('dragstart', function(event) {
    event.target.classList.add('selected');
});

document.addEventListener('dragend', function(event) {
    event.target.classList.remove('selected');
});

const delTask = (index) => {
    tasks.splice(index, 1)
    if (box_update.classList.contains('open')) closeForm()
    showAllTasks()
    updateStats()
    updateLocalStorage();
}

const deleteAllTasks = () => {
    if (tasks.length == 0) {
        return;
    }
    
    else {
        tasks = [];
        showAllTasks();
        updateStats();
        updateLocalStorage();
    }
}

const updateTask = (index) => {
    box_update.classList.remove('close')
    box_update.classList.add('open')
    box_update.innerHTML = 
    `<span>Current Task</span>
    <input type="text" id="newValue" value="${tasks[index].name}">
    
    <div id="from">
        <span>From Date</span>
        <input type="date" id="newDateFrom" value="${tasks[index].dateFrom || ''}">
    </div>

    <div id="to">
        <span>To Date</span>
        <input type="date" id="newDateTo" value="${tasks[index].dateTo || ''}">
    </div>
    
    <div id="selectSubAndCreateSub">
        <div id="subject">
            <span>Select The Subject</span>
            <select id="newSubjectSelect">
                <option value="Study" ${tasks[index].taskSubject === 'Study' ? 'selected' : ''}>Study</option>
                <option value="Work" ${tasks[index].taskSubject === 'Work' ? 'selected' : ''}>Work</option>
                <option value="Home" ${tasks[index].taskSubject === 'Home' ? 'selected' : ''}>Home</option>
            </select>
        </div>
        <span>OR</span>
        <div id="addSubject">
            <span>Type A New Subject</span>
            <div><input type="text" id="newSubjectInput" placeholder="New subject"></div>
        </div>
    </div>
    
    <div>
        <button id="update_button">update</button>
        <button onclick="closeForm()">cancel</button>
    </div>`

    const update_button = document.querySelector('#update_button')
    update_button.addEventListener('click', ()=> {
        const newValueInput = document.querySelector('#newValue')
        const newDateFromInput = document.querySelector('#newDateFrom')
        const newDateToInput = document.querySelector('#newDateTo')
        const newSubjectSelect = document.querySelector('#newSubjectSelect')
        const newSubjectInput = document.querySelector('#newSubjectInput')
        
        let taskSubjectValue;
        if (newSubjectInput.value !== "") {
            taskSubjectValue = newSubjectInput.value
        } 
        else {
            taskSubjectValue = newSubjectSelect.value
        }

        let errors = false;

        if (newValueInput.value == "") {
            newValueInput.classList.add('invalid')
            errors = true
        } 
        else {
            newValueInput.classList.remove('invalid')
        }

        if (newDateFromInput.value == "" || newDateToInput.value == "") {
            if (newDateFromInput.value == "") newDateFromInput.classList.add('invalid')
            if (newDateToInput.value == "") newDateToInput.classList.add('invalid')
            errors = true
        } 
        else if (new Date(newDateFromInput.value) > new Date(newDateToInput.value)) {
            newDateFromInput.classList.add('invalid')
            newDateToInput.classList.add('invalid')
            errors = true
        }
        else {
            newDateFromInput.classList.remove('invalid')
            newDateToInput.classList.remove('invalid')
        }

        if (errors == true) return
        
        setValueTask(index, newValueInput.value, newDateFromInput.value, newDateToInput.value, taskSubjectValue)
    })
}

const updateStats = () => {
    const totalTasks = tasks.length;
    const plannedTasks = tasks.filter(task => task.status === 'planned').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const doneTasks = tasks.filter(task => task.status === 'done').length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('plannedTasks').textContent = plannedTasks;
    document.getElementById('inProgressTasks').textContent = inProgressTasks;
    document.getElementById('doneTasks').textContent = doneTasks;
}

const closeForm = () => {
    box_update.classList.add('close')
    box_update.classList.remove('open')
    box_update.innerHTML = ''
}

const setValueTask = (index, newValue, newDateFrom, newDateTo, newSubject) => {
    let newTasks = [
        ...tasks.slice(0,index),
        {
            "name": newValue,
            "status": tasks[index].status,
            "dateFrom": newDateFrom,
            "dateTo": newDateTo,
            "taskSubject": newSubject
        },
        ...tasks.slice(index+1)
    ]
    tasks = newTasks
    
    updateLocalStorage();
    closeForm()
    showAllTasks()
    updateStats()
}

const changeTheme = (theme) => {
    document.body.classList.remove('light-theme', 'dark-theme', 'green-theme');
    document.body.classList.add(theme + '-theme');
}

const deleteAllBtn = document.getElementById('deleteAllTasks');
if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', function() {
        console.log('Delete All clicked');
        deleteAllTasks();
    });
} else {
    console.error('Delete All Tasks button not found!');
}

const themeSelector = document.getElementById('themeSelector');
if (themeSelector) {
    themeSelector.addEventListener('change', function() {
        changeTheme(this.value);
    });
}

showAllTasks();
updateStats();