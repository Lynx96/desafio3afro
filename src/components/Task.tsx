
import styles from "./Task.module.scss"
import {	
	CalendarBlank,
	CalendarCheck,
	Check,	
	PencilSimpleLine,
	Trash,
} from "phosphor-react"
import { format, parseISO } from "date-fns"
import { useState } from "react"

interface TaskProps {	
	isDone: boolean
	content: string
	deadline: string
	editingTask: boolean
	onCheck(): void
	onRemove(): void
	onUpdate(): void
}

export function Task({	
	isDone,
	content,
	deadline,
	editingTask,
	onCheck,
	onRemove,
	onUpdate,
}: TaskProps) {
		
		const styleIsDone = isDone ? styles.done : ""	
		const taskEditStyle = editingTask ? styles.border : styles.task
	
		


	 function formatDate() {
		if (deadline !== "") {
			return format(parseISO(deadline), "dd/MM/yyyy")
		}
	} 

	const todayDate = () => {
		if (isDone) {
			return format(new Date, "dd/MM/yyyy")
		}
	} 



	return (	
		
		<li className={taskEditStyle}>
			<div className={styles.taskInfo}>
				<label>
					<input
						type="checkbox"
						id="checkBox"
						checked={isDone}
						onChange={onCheck}
					/>
					<span>
						<Check />
					</span>
				</label>
				<p className={styleIsDone}>{content}</p>

				<button onClick={onRemove}>
					<Trash />
				</button>
				<button onClick={onUpdate}>
					<PencilSimpleLine />
				</button>				
			</div>
			<div className={styles.deadlineText}>
				{isDone && (
					<span>
						<CalendarCheck size={25} />						
						<p>Finalizado em {todayDate()}</p>
					</span>
				)}
				{deadline !== "" && (
					<span>
						<CalendarBlank size={25} />
						<p>Até {formatDate()}</p>
					</span>
				)}
			</div>
		</li>
	)
}
