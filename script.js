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
        "isDone": false
    }
    tasks.push(newTask)
    showAllTasks()
})


let tasks = []

const showTask = (task, index) => {
    return `<div class="task">
    <p class='task_text ${task.isDone ? 'done' : 'notdone'}'>${task.name}</p>
    <button class='task_button' onclick='delTask(${index})'>delete</button>
    <button class='task_button' onclick='updateTask(${index})'>update</button>
    
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
        <p>Inout new task value</p>
        <input type="text" id="newValue" value="${tasks[index].name}">
        <div>
            <button id="update_button">update</button>
            <button onclick="closeForm()">cancel</button>
        </div>
    </div>`

    const update_button = document.querySelector('#update_button')
    update_button.addEventListener('click', ()=> {
        const newValue = document.querySelector('#newValue').value
        setValueTask(index, newValue)
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
            "isDone": tasks[index].isDone
        },
        ...tasks.slice(index+1)
    ]
    tasks = newTasks
    closeForm()
    showAllTasks()
}