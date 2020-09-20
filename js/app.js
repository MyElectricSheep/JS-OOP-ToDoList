const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListBtn = document.querySelector('[data-delete-list-button]');

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

class TodoList {
    constructor() {
        this._lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
        this._selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
    }
    // Instance Methods
    addNewList(e) {
        e.preventDefault();
        const userInput = newListInput.value
        if (!userInput) return alert('Please enter the name of a new form');
        const newList = TodoList.createList(userInput)
        this._lists.push(newList)
        newListInput.value = null;
        saveAndRender();
    }
    selectList(e) {
        if (e.target.tagName.toLowerCase() === 'li') {
            this._selectedListId = e.target.dataset.listId
        }
        saveAndRender();
    }
    deleteList() {
        this._lists = this._lists.filter(l => l.id !== this._selectedListId)
        this._selectedListId = null;
        saveAndRender()
    }
    saveToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(this._lists))
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, this._selectedListId)
    }
    // Static Methods
    static createList(name) {
        return { id: Date.now().toString(), name, tasks: [] };
    }

    static clearElement(item) {
        while (item.firstChild) {
            item.removeChild(item.firstChild);
          }
    }
}

const todoList = new TodoList();

listsContainer.addEventListener('click', todoList.selectList.bind(todoList))
deleteListBtn.addEventListener('click', todoList.deleteList.bind(todoList))
newListForm.addEventListener('submit', todoList.addNewList.bind(todoList));

function saveAndRender() {
    todoList.saveToLocalStorage();
    render();
}

function render() {
    TodoList.clearElement(listsContainer);
    todoList._lists.forEach((li) => {
        // element we want to create: <li class="list-name">Something</li>
        const newListItem = document.createElement("li");
        newListItem.dataset.listId = li.id;
        newListItem.textContent = li.name;
        newListItem.classList.add("list-name");
        if (todoList._selectedListId === li.id) newListItem.classList.add("active-list");
        listsContainer.appendChild(newListItem);
    });
}

render();
