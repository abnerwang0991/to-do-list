import { Button } from '../ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { useStore } from '@/store'

const UndoRedoControl = () => {
	const historyPointer = useStore((state) => state.historyPointer)
	const history = useStore((state) => state.history)
	const undo = useStore((state) => state.undo)
	const redo = useStore((state) => state.redo)

	return (
		<div className="flex gap-2 mb-4">
			<Button
				variant="outline"
				size="icon"
				title="undo"
				disabled={historyPointer === -1}
				className="rounded-full cursor-pointer"
				onClick={undo}
			>
				<ArrowLeftIcon />
			</Button>
			<Button
				variant="outline"
				size="icon"
				title="redo"
				disabled={historyPointer >= history.length - 1}
				className="rounded-full cursor-pointer"
				onClick={redo}
			>
				<ArrowRightIcon />
			</Button>
		</div>
	)
}

export default UndoRedoControl
