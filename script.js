let addToList = document.querySelector(".addToList button")
let task = document.querySelector("#task")
let date_from = document.querySelector("#dateFrom")
let date_to = document.querySelector("#dateTo")
let subject = document.querySelector("#subjects")
let created_subject = document.querySelector("#newSubject")
let add_subject = document.querySelector(".newSubject")
let tasks_block = document.querySelector(".tasksList")
let box_update = document.querySelector('#box_update')

addToList.addEventListener("click", ()=>{
    let errors = false;

    if (task.value == "") {
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

    // if (errors == true) return

    let newTaskValue = task.value
    let newTask = {
        "name" : newTaskValue,
        // "isDone": false,
        "status": 'planned',
        "dateFrom": date_from.value,
        "dateTo": date_to.value,
        "taskSubject": taskSubjectValue 
    }
    tasks.push(newTask)
    showAllTasks()

    task.value = ''
    date_from.value = ''
    date_to.value = ''
    created_subject.value = ''
})


let tasks = []

const showTask = (taskItem, index) => {
    return `<div class="task">
        <div class="namePlusdatePlusSubject ${taskItem.status === 'done' ? 'done' : ''}">
            <p>${taskItem.name}</p>
            <p>From ${taskItem.dateFrom ? taskItem.dateFrom : 'No date'}</p>
            <p>To ${taskItem.dateTo ? taskItem.dateTo : 'No date'}</p>     
            <p>Subject: ${taskItem.taskSubject ? taskItem.taskSubject : 'No subject'}</p>
        </div>

        <div class="checkAndBut">
            <div class="status-checkboxes">
                <div class="checked">
                    <input type="checkbox" id="planned_${index}" ${taskItem.status === 'planned' ? 'checked' : ''} onchange="changeStatus(${index}, 'planned')">
                    <label for="planned_${index}">To Do</label>
                </div>
                <div class="checked">
                    <input type="checkbox" id="in-progress_${index}" ${taskItem.status === 'in-progress' ? 'checked' : ''} onchange="changeStatus(${index}, 'in-progress')">
                    <label for="in-progress_${index}">In Progress</label>
                </div>
                <div class="checked">
                    <input type="checkbox" id="done_${index}" ${taskItem.status === 'done' ? 'checked' : ''} onchange="changeStatus(${index}, 'done')">
                    <label for="done_${index}">Done</label>
                </div>
            </div>

            <div class="buttons">
                <div>
                    <button class='task_button' onclick='delTask(${index})'>delete</button>
                </div>
                <div>
                    <button class='task_button' onclick='updateTask(${index})'>update</button>
                </div>
            </div>
        </div>
    </div>`
}

const toggleDone = (index) => {
    tasks[index].isDone = !tasks[index].isDone;
    showAllTasks();
}

const changeStatus = (index, newStatus) => {
    tasks[index].status = newStatus;
    showAllTasks();
}

const showAllTasks = () => {
    
    document.querySelector('.planned').innerHTML = '';
    document.querySelector('.in-progress').innerHTML = '';
    document.querySelector('.done').innerHTML = '';
    
    console.log('All tasks:', tasks); // для отладки
    
    tasks.forEach((item, index) => {
        const column = document.querySelector(`.${item.status}`);
        if (column) {
            column.innerHTML += showTask(item, index);
        }
    });
}

const delTask = (index) => {
    tasks.splice(index, 1)
    if (box_update.classList.contains('open')) closeForm()
    showAllTasks()
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
    
    <div id="subject">
        <span>Select The Subject</span>
        <select id="newSubject">
            <option value="study" ${tasks[index].taskSubject === 'study' ? 'selected' : ''}>Study</option>
            <option value="work" ${tasks[index].taskSubject === 'work' ? 'selected' : ''}>Work</option>
            <option value="rest" ${tasks[index].taskSubject === 'rest' ? 'selected' : ''}>Rest</option>
        </select>
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
        const newSubject = document.querySelector('#newSubject').value
        
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
        
        setValueTask(index, newValueInput.value, newDateFromInput.value, newDateToInput.value, newSubject)
    })
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
            "isDone": tasks[index].status,
            "dateFrom": newDateFrom,
            "dateTo": newDateTo,
            "taskSubject": newSubject
        },
        ...tasks.slice(index+1)
    ]
    tasks = newTasks
    
    closeForm()
    showAllTasks()
}