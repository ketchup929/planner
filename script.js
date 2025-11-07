let addToList = document.querySelector(".addToList")
let task = document.querySelector("#task")
let date_from = document.querySelector("#dateFrom")
let date_to = document.querySelector("#dateTo")
let subject = document.querySelector("#subjects")
let created_subject = document.querySelector("#newSubject")
let add_subject = document.querySelector(".newSubject")
let tasks_block = document.querySelector(".tasksList")

addToList.addEventListener("click", ()=>{
    let newTaskValue = task.value
    let newTask = {
        "name" : newTaskValue,
        "isDone": false,
        "dateFrom": date_from.value,
        "dateTo": date_to.value,
        "taskSubject": subject.value
    }
    tasks.push(newTask)
    showAllTasks()
    task.value = ''
})


let tasks = []

const showTask = (task, index) => {
    return `<div class="task">
        <div class="namePlusdatePlusSubject">
            <p class='task_text ${task.isDone ? 'done' : 'notdone'}'>${task.name}</p>
            <p>Date: ${task.dateFrom ? task.dateFrom : 'No date'} - ${task.dateTo ? task.dateTo : 'No date'}</p>
            <p>Subject: ${task.taskSubject ? task.taskSubject : 'No subject'}</p>
        </div>
        <div class="buttons">
            <div>
                <button class='task_button' onclick='delTask(${index})'>delete</button>
            </div>
            <div>
                <button class='task_button' onclick='updateTask(${index})'>update</button>
            </div>
        </div>
    </div>`
}

const showAllTasks = () => {
    let s=''
    tasks.map((item, index) => {
        s+=showTask(item, index)
    })
    tasks_block.innerHTML=s
}

const delTask = (index) => {
    tasks.splice(index, 1)
    showAllTasks()
}

const updateTask = (index) => {
    box_update.classList.remove('close')
    box_update.classList.add('open')
    box_update.innerHTML = 
    `<div>
        <p>Current Task</p>
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
        </div>
    </div>`

    const update_button = document.querySelector('#update_button')
    update_button.addEventListener('click', ()=> {
        const newValue = document.querySelector('#newValue').value
        const newDateFrom = document.querySelector('#newDateFrom').value
        const newDateTo = document.querySelector('#newDateTo').value
        const newSubject = document.querySelector('#newSubject').value
        
        setValueTask(index, newValue, newDateFrom, newDateTo, newSubject)
    })
}

const closeForm = () => {
    box_update.classList.add('close')
    box_update.classList.remove('open')
}

const setValueTask = (index, newValue) => {
    let newTasks = [
        ...tasks.slice(0,index),
        {
            "name": newValue,
            "isDone": tasks[index].isDone,
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