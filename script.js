const LIST_CONTAINER = document.querySelector('[data-lists]')
const NEW_LIST_FORM = document.querySelector('[data-new-list-form]')
const NEW_LIST_INPUT = document.querySelector('[data-new-list-input]')
const DELTE_LIST_BUTTON = document.querySelector('[data-delete-list-button]')
const LIST_DISPLAY_CONTAINER = document.querySelector('[data-lists-display-container]')
const LIST_TITLE_ELEMENT = document.querySelector('[data-lists-title]')
const LIST_COUNT_ELEMENT = document.querySelector('[data-lists-count]')
const TASK_CONTAINER = document.querySelector('[data-tasks]')



const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


DELTE_LIST_BUTTON.addEventListener('click', event => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    save()
    render()
})

LIST_CONTAINER.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'li') {
        selectedListId = event.target.dataset.listId
        render()
        save()
    }
})

NEW_LIST_FORM.addEventListener('submit', event => {
    event.preventDefault()
    const listName = NEW_LIST_INPUT.value
    if (listName == null || listName == '') return 
    const list = createList(listName)
    NEW_LIST_INPUT.value = null
    lists.push(list)
    render()
    save()

}
)

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [{id: 1, name: 'dasfdsfas', complete: false}] }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)

}

function render(){
    clearElement(LIST_CONTAINER)
    renderList()
    let selectedLists = lists.find(list => list.id === selectedListId)
    if(selectedListId == null){
        LIST_DISPLAY_CONTAINER.style.display = 'none'
    }else{
        LIST_DISPLAY_CONTAINER.style.display =' '
        LIST_TITLE_ELEMENT.innerText = selectedLists.name
        renderTaskCount(selectedLists)
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