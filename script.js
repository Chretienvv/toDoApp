const LIST_CONTAINER = document.querySelector('[data-lists]')
const NEW_LIST_FORM = document.querySelector('[data-new-list-form]')
const NEW_LIST_INPUT = document.querySelector('[data-new-list-input]')
const DELTE_LIST_BUTTON = document.querySelector('[data-delete-list-button]')
const LIST_DISPLAY_CONTAINER = document.querySelector('[data-lists-display-container]')
const LIST_TITLE_ELEMENT = document.querySelector('[data-lists-title]')
const LIST_COUNT_ELEMENT = document.querySelector('[data-lists-count]')
const TASK_CONTAINER = document.querySelector('[data-tasks]')
const TASK_TEMPLATE = document.getElementById('task-template')
const NEW_TASK_FORM = document.querySelector('[data-new-task-form]')
const NEW_TASK_INPUT= document.querySelector('[data-new-task-input]')
const CLEAR_COMPLETE_TASKS_BUTTON = document.querySelector('[data-clear-complete-tasks-button')
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

class Task {
    constructor(id=Date.now().toString(), name="no name found", complete=false){
        this.id = id;
        this.name = name,
        this.complete = complete
    }
}

class List {
    constructor(id=Date.now().toString(), name="no name found", tasks=[]){
        this.id = id;
        this.name = name,
        this.tasks = tasks
    }
}

function createList(name) {
    return new List(Date.now().toString(), name,)
}

DELTE_LIST_BUTTON.addEventListener('click', event => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    save()
    render()
})

LIST_CONTAINER.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'li') {
        selectedListId = event.target.dataset.listId
        save()
        render()

    }
})

NEW_LIST_FORM.addEventListener('submit', event => {
    event.preventDefault()
    const listName = NEW_LIST_INPUT.value
    if (listName == null || listName == '') return 
    const list = createList(listName)
    NEW_TASK_INPUT.value = null
    lists.push(list)
    save()
    render()
})

TASK_CONTAINER.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'input') {
      const selectedList = getSelectedList()
      const selectedTask = selectedList.tasks.find(task => task.id === event.target.id)
      selectedTask.complete = event.target.checked
      save()
      renderTaskCount(selectedList)
    }
  })

NEW_TASK_FORM.addEventListener('submit', event => {
    event.preventDefault()
    const taskName = NEW_TASK_INPUT.value
    if (taskName == null || taskName == '') return 
    const task = createTask(taskName)
    NEW_TASK_INPUT.value = null
    const selectedList = getSelectedList()
    selectedList.tasks.push(task)
    save()
    render()
}
)


CLEAR_COMPLETE_TASKS_BUTTON.addEventListener('click', event =>{
    const selectedList = getSelectedList()
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    save()
    render()
}
 )

function getSelectedList(){
    return lists.find(list => list.id === selectedListId)
}

function createList(name) {
    return new List(Date.now().toString(), name,)
}

function createTask(name){
    return new Task(Date.now().toString(), name,)
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render(){
    clearElement(LIST_CONTAINER)
    renderList()
    let selectedLists = getSelectedList()
    if(selectedListId == null){
        LIST_DISPLAY_CONTAINER.style.display = 'none'
    }else{
        LIST_DISPLAY_CONTAINER.style.display =''
        LIST_TITLE_ELEMENT.innerText = selectedLists.name
        renderTaskCount(selectedLists)
        clearElement(TASK_CONTAINER)
        renderTasks(selectedLists)
    }
}

function renderTasks(selectedLists){
    console.log("in render",selectedLists)
    for( task of selectedLists.tasks){
        let taskElement = document.importNode(TASK_TEMPLATE.content, true)
        let checkBox = taskElement.querySelector('input')
        checkBox.id = task.id
        checkBox.checked = task.complete
        let label =taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        TASK_CONTAINER.appendChild(taskElement)
    }
}

function renderTaskCount(selectedList){
    const incompleteTaskCount =selectedList.tasks.filter(task => !task.complete).length
    let taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    LIST_COUNT_ELEMENT.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderList() {
    for (list of lists) {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-name')
        listElement.innerText = list.name
        if (list.id === selectedListId) listElement.classList.add("active-list")
        LIST_CONTAINER.appendChild(listElement)
    }

}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()