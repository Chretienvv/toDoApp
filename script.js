const LIST_CONTAINER = document.querySelector('[data-lists]')
const NEW_LIST_FORM = document.querySelector('[data-new-list-form]')
const NEW_LIST_INPUT = document.querySelector('[data-new-list-input]')
const DELTE_LIST_BUTTON = document.querySelector('[data-delete-list-button]')
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


DELTE_LIST_BUTTON.addEventListener('click', event => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    save()
    renderList()
})

LIST_CONTAINER.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'li') {
        selectedListId = event.target.dataset.listId
        renderList()
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
    renderList()
    save()

}
)

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)

}

function renderList() {
    clearElement(LIST_CONTAINER)
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

renderList()