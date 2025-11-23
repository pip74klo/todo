const todoInput = document.querySelector('#input')
const todoForm = document.querySelector('.todo__form')
const todoOutput = document.querySelector('.todo__output')
const statsAllTasks = document.querySelector('.tasks__stats-all-tasks > span')
const statsCompletedTasks = document.querySelector('.tasks__stats-completed > span')
const themeBtn = document.querySelector('.theme__btn')
const imgBtn = document.querySelector('.theme__btn-img')
const body = document.querySelector('body')
const filtersParent = document.querySelector('.task__filters')
const logoImg = document.querySelector('.todo__title-image')

let taskList;
let theme = 'light'
let filter = 'all'

function getLocalStorage() {
  const localList = JSON.parse(localStorage.getItem('taskList'))
  const localTheme = localStorage.getItem('theme')
  theme = localTheme || 'light'
  taskList = localList || []
}

function setLocalStorageTheme(value) {
  localStorage.setItem('theme', value)
}

function setLocalStorage(taskList) {
  localStorage.setItem('taskList', JSON.stringify(taskList))
}

function addTask() {
  const value = todoInput.value.trim()
  if (!value) return
  const newTask = { title: value, isCompleted: false, id: Date.now() }
  taskList.push(newTask)
  todoInput.focus()
  todoInput.value = ''
  setLocalStorage(taskList)
  render()
}

function deleteTask(e) {
  const task = e.target.closest('.task')
  const taskId = task.getAttribute('id')
  taskList = taskList.filter(task => task.id !== +taskId)
  setLocalStorage(taskList)
  render()
}

function render() {
  todoOutput.innerHTML = ''
  let list = taskList

  if (filter === 'active') {
    list = taskList.filter(task => task.isCompleted === false)
  }
  if (filter === 'completed') {
    list = taskList.filter(task => task.isCompleted === true)
  }

  list.forEach(({ title, isCompleted, id }) => {
    const taskElement = document.createElement('li')
    taskElement.classList.add('task')
    taskElement.setAttribute('id', id)
    taskElement.innerHTML = `
    <span class="task-text ${theme === 'light' ? "" : 'dark-color'} ${isCompleted ? 'completed' : ''}"  >${title}</span>
    <div class="img-icon">
      <svg class="ready ${theme === 'light' ? "" : 'ready-dark'} ${isCompleted ? 'completed' : ''} ">
        <use href="assets/sprites.svg#${isCompleted ? 'ok-icon' : 'circle'}"></use>
      </svg>
      <svg class="cross ${theme === 'light' ? "" : 'cross-dark'}">
        <use href="assets/sprites.svg#cross-icon"></use>
      </svg>
    </div>
    `
    todoOutput.append(taskElement)
  })
  updateStats()
}

function updateStats() {
  statsAllTasks.textContent = taskList.length
  statsCompletedTasks.textContent = taskList.filter(task => task.isCompleted === true).length
}

function changeTheme() {
  const todoTitleImage = document.querySelector('.todo__title-image')
  body.classList.remove('light', 'dark')
  body.classList.add(theme)
  imgBtn.src = `${theme === 'light' ? "assets/light.svg" : "assets/dark.svg"}`
  todoTitleImage.src = `${theme === 'light' ? "assets/rocket.svg" : "assets/rocket-dark.svg"}`
}

function changeTaskStatus(e) {
  const task = e.target.closest('.task')
  const taskId = task.getAttribute('id')
  taskList = taskList.map(task => {
    if (task.id === +taskId) {
      return { ...task, isCompleted: !task.isCompleted }
    }
    return task
  })
  setLocalStorage(taskList)
  render()
}

const clearTaskList = () => {
  const message = 'Очистить задачи?'
  if (confirm(message)) {
    taskList = []

    render()
    setLocalStorage(taskList)
  }
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault()
  addTask()
})

todoOutput.addEventListener('click', (e) => {
  if (e.target.closest('.cross')) {
    deleteTask(e)
  }

  if (e.target.closest('.ready')) {
    changeTaskStatus(e)
  }
})

themeBtn.addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light'
  changeTheme()
  setLocalStorageTheme(theme)
  render()
})

filtersParent.addEventListener('change', (e) => {
  if (e.target.classList.contains('task__filters-input')) {
    filter = e.target.value
    render()
  }
})

logoImg.addEventListener('click', clearTaskList)

getLocalStorage()
changeTheme()
render()