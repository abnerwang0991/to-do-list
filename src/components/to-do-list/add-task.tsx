import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useStore } from '@/store'

const AddTask = () => {
	const handleTaskAction = useStore((state) => state.handleTaskAction)
	const [text, setText] = useState('')

	const onSubmit = () => {
		handleTaskAction({ type: 'add', payload: text })
		setText('')
	}

	return (
		<form action={onSubmit} className="flex gap-2">
			<Input
				value={text}
				placeholder="Add new task"
				required
				autoFocus
				onChange={(e) => setText(e.target.value)}
			/>
			<Button
				variant="default"
				size="icon"
				type="submit"
				className="cursor-pointer"
			>
				<PlusIcon />
			</Button>
		</form>
	)
}

export default AddTask
