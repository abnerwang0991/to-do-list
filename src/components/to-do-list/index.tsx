import AddTask from './add-task'
import TaskList from './task-list'
import UndoRedoControl from './undo-redo-control'

const ToDoList = () => {
	return (
		<main className="max-w-2xl mx-auto">
			<h1 className="text-3xl text-start font-bold mb-6">To Do List</h1>
			<UndoRedoControl />
			<AddTask />
			<TaskList />
		</main>
	)
}

export default ToDoList
