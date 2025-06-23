import { useStore, type Task } from '@/store'
import { Checkbox } from '../ui/checkbox'
import { XIcon, SaveIcon, PencilIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

type Props = {
	task: Task
	index: number
}

const TaskList = () => {
	const tasks = useStore((state) => state.tasks)
	return (
		<ul className="flex flex-col gap-2 mt-6">
			{tasks.map((task, i) => (
				<TaskListItem key={task.id} task={task} index={i} />
			))}
		</ul>
	)
}

const TaskListItem = ({ task, index }: Props) => {
	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState(task.text)
	const handleTaskAction = useStore((state) => state.handleTaskAction)

	useEffect(() => {
		setText(task.text)
	}, [task.text])

	const onChangeStatus = (checked: boolean) => {
		handleTaskAction({
			type: 'change',
			payload: {
				...task,
				done: checked,
			},
			index,
		})
	}

	const onSubmit = () => {
		if (text !== task.text) {
			handleTaskAction({
				type: 'change',
				payload: {
					...task,
					text,
				},
				index,
			})
		}

		setIsEditing(false)
	}

	return (
		<li className="flex items-center bg-accent rounded-lg px-3 py-1.5">
			<Checkbox
				checked={task.done}
				className="size-5 mr-2"
				onCheckedChange={(checked: boolean) => onChangeStatus(checked)}
			/>
			{isEditing ? (
				<form action={onSubmit} className="flex-auto flex gap-2">
					<Input
						value={text}
						placeholder="Add new task"
						required
						autoFocus
						className="md:text-base"
						onChange={(e) => setText(e.target.value)}
					/>
					<Button
						variant="ghost"
						size="icon"
						type="submit"
						className="cursor-pointer"
					>
						<SaveIcon className="size-5" />
					</Button>
				</form>
			) : (
				<div className="min-w-0 flex-1 flex justify-between items-center gap-2">
					<p
						className={cn(
							'min-w-0 truncate pl-[.8125rem]',
							task.done ? 'text-muted-foreground line-through' : ''
						)}
					>
						{task.text}
					</p>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer"
						onClick={() => setIsEditing(true)}
					>
						<PencilIcon className="size-5" />
					</Button>
				</div>
			)}
			<Button
				variant="ghost"
				size="icon"
				className="cursor-pointer"
				onClick={() =>
					handleTaskAction({ type: 'delete', payload: task.id, index })
				}
			>
				<XIcon className="size-6" />
			</Button>
		</li>
	)
}

export default TaskList
