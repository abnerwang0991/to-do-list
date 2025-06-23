import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

export type Task = { id: string; text: string; done: boolean }

type HistoryStep =
	| {
			id: string
			index: number
			type: 'add' | 'delete'
			payload: Task
	  }
	| {
			id: string
			index: number
			type: 'change'
			payload: {
				before: Task
				after: Task
			}
	  }

type TaskAction =
	| { type: 'add' | 'delete'; payload: string; index?: number }
	| { type: 'change'; payload: Task; index?: number }

type State = {
	tasks: Task[]
	historyPointer: number
	history: HistoryStep[]
}

type Action = {
	addTask: (task: Task) => void
	changeTask: (task: Task) => void
	deleteTask: (id: string) => void
	handleTaskAction: <T extends TaskAction>(action: T) => void
	setHistoryPointer: (type?: 'increase' | 'decrease') => void
	addHistoryStep: (params: HistoryStep) => void
	sliceHistory: () => void
	redo: () => void
	undo: () => void
}

export const useStore = create<State & Action>((set, get) => ({
	tasks: [],
	addTask: (task) =>
		set((state) => ({
			tasks: [...state.tasks, task],
		})),
	changeTask: (task) =>
		set((state) => ({
			tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
		})),
	deleteTask: (id) =>
		set((state) => ({
			tasks: state.tasks.filter((t) => t.id !== id),
		})),
	handleTaskAction: ({ type, payload, index = 0 }) => {
		const {
			tasks,
			historyPointer,
			setHistoryPointer,
			history,
			addHistoryStep,
			sliceHistory,
			addTask,
			changeTask,
			deleteTask,
		} = get()

		let historyStepPayload: HistoryStep['payload']

		switch (type) {
			case 'add': {
				const task = { id: uuid(), text: payload, done: false }

				historyStepPayload = { ...task }

				addTask(task)
				break
			}
			case 'change': {
				historyStepPayload = {
					before: tasks.find((t) => t.id === payload.id)!,
					after: { ...payload },
				}

				changeTask(payload)
				break
			}
			case 'delete': {
				historyStepPayload = tasks.find((t) => t.id === payload)!

				deleteTask(payload)
				break
			}
			default:
				throw new Error(`undo failed`)
		}

		if (historyPointer < history.length - 1) {
			sliceHistory()
		}

		addHistoryStep({
			id: uuid(),
			type,
			payload: historyStepPayload,
			index,
		} as HistoryStep)
		setHistoryPointer()
	},

	historyPointer: -1,
	setHistoryPointer: (type = 'increase') =>
		set((state) => ({
			historyPointer:
				type === 'increase'
					? state.historyPointer + 1
					: state.historyPointer - 1,
		})),

	history: [],
	addHistoryStep: (params) =>
		set((state) => ({
			history: [...state.history, { ...params }],
		})),
	sliceHistory: () =>
		set((state) => ({
			history: state.history.slice(0, state.historyPointer + 1),
		})),

	undo: () => {
		const {
			historyPointer,
			setHistoryPointer,
			history,
			changeTask,
			deleteTask,
		} = get()
		const step = history[historyPointer]

		switch (step.type) {
			case 'add': {
				deleteTask(step.payload.id)
				break
			}
			case 'change': {
				changeTask(step.payload.before)
				break
			}
			case 'delete': {
				set((state) => ({
					tasks: state.tasks.toSpliced(step.index, 0, step.payload),
				}))
				break
			}
			default:
				throw new Error(`undo failed`)
		}

		setHistoryPointer('decrease')
	},

	redo: () => {
		const {
			historyPointer,
			setHistoryPointer,
			history,
			addTask,
			changeTask,
			deleteTask,
		} = get()
		const step = history[historyPointer + 1]

		switch (step.type) {
			case 'add': {
				addTask(step.payload)
				break
			}
			case 'change': {
				changeTask(step.payload.after)
				break
			}
			case 'delete': {
				deleteTask(step.payload.id)
				break
			}
			default:
				throw new Error(`redo failed`)
		}

		setHistoryPointer()
	},
}))
