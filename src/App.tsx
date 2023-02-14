import { ChangeEvent, FormEvent, useState } from "react"
import "./styles/global.scss"
import styles from "./App.module.scss"

import Header from "./components/Header"
import { ClipboardText, Plus } from "phosphor-react"
import { Task } from "./components/Task"

interface Task {
	id: number
	content: string
	done: boolean
	deadline: string	
	editingTask: boolean
}

function App() {
	const [taskText, setTaskText] = useState("")
	const [taskDeadline, setTaskDeadline] = useState("")
	const [idEdit, setIdEdit] = useState<number | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [taskTextEdited, setTaskTextEdited] = useState("")
	const [taskDeadlineEdited, setTaskDeadlineEdited] = useState("")

	const [tasks, setTasks] = useState<Task[]>(() => {
		const localTasks = localStorage.getItem("@AfroToDo:tasks") || "[]"

		return JSON.parse(localTasks)
	})

	const doneCount = tasks.reduce((acc: number, task) => {
		return task.done ? (acc += 1) : acc
	}, 0)

	function handleSubmit(event: FormEvent) {
		event.preventDefault()

		if (taskText === "") {
			alert("Envie uma atividade válida!")
		} else {
			const newTask: Task = {
				id: Date.now(),
				content: taskText,
				done: false,
				deadline: taskDeadline,
				editingTask: isEditing
				
			}
			const newTasks = [...tasks, newTask]
			localStorage.setItem("@AfroToDo:tasks", JSON.stringify(newTasks))

			setTasks(newTasks)
			setTaskText("")
			setTaskDeadline("")
		}
	}

	function handleEditSubmit(event: FormEvent) {
		event.preventDefault()
		if (taskTextEdited === "") {
			alert("Envie uma atividade válida!")
		} else {
			if (idEdit) {
				const editedTaskList = tasks.map((task) => {
					if (task.id === idEdit) {
						return {
							...task,
							content: taskTextEdited,
							deadline: taskDeadlineEdited,
							editingTask: isEditing
						}
					}
					return task
				})
				setTasks(editedTaskList)
				localStorage.setItem("@AfroToDo:tasks", JSON.stringify(editedTaskList))
				setTaskTextEdited("")
				setTaskDeadlineEdited("")
					
			}
		}

		setIdEdit(null)	
	}

	function handleChangeInput(event: ChangeEvent<HTMLInputElement>) {
		setTaskText(event.currentTarget.value)
	}

	function handleChangeDeadline(event: ChangeEvent<HTMLInputElement>) {
		setTaskDeadline(event.currentTarget.value)
	}
	function handleChangeInputEdited(event: ChangeEvent<HTMLInputElement>) {
		setTaskTextEdited(event.currentTarget.value)
	}

	function handleChangeDeadlineEdited(event: ChangeEvent<HTMLInputElement>) {
		setTaskDeadlineEdited(event.currentTarget.value)
	}

	function handleToggleTask(id: number) {
		const updatedTasks = tasks.map((task) => {
			return task.id === id ? { ...task, done: !task.done } : task
		})

		localStorage.setItem("@AfroToDo:tasks", JSON.stringify(updatedTasks))

		setTasks(updatedTasks)
	}

	function handleRemoveTask(id: number) {
		const filteredTasks = tasks.filter((task) => {
			return task.id !== id
		})

		localStorage.setItem("@AfroToDo:tasks", JSON.stringify(filteredTasks))

		setTasks(filteredTasks)
	}

	function handleUpdateTask(id: number) {
		setIdEdit(id)		
		setTaskTextEdited(() => tasks.filter((task) => id === task.id)[0].content)
		setTaskDeadlineEdited(() => tasks.filter((task) => id === task.id)[0].deadline)	

		const editedTasks = tasks.map((task) => {
			return task.id === id ? { ...task, editingTask: !task.editingTask } : task
		})
		localStorage.setItem("@AfroToDo:tasks", JSON.stringify(editedTasks))
		setTasks(editedTasks)
		
				
	}


	
		
	return (
		<>
			<Header />
			<main className={styles.container}>
				{idEdit ? (
					<>
						<form className={styles.addTaskForm} onSubmit={handleEditSubmit}>
							<input
								type="text"
								onChange={handleChangeInputEdited}
								value={taskTextEdited}
							/>

							<div className={styles.addTaskDeadline}>
								<input
									type="date"
									onChange={handleChangeDeadlineEdited}
									value={taskDeadlineEdited}
								/>

								<button>
									<Plus />
								</button>
								<button
									className={styles.cancelButton}
									onClick={() => setIdEdit(null)}	
																
								>
									Cancelar
								</button>
							</div>
						</form>
					</>
				) : (
					<>
						<form className={styles.addTaskForm} onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Insira uma nova atividade"
								value={taskText}
								onChange={handleChangeInput}
							/>
							<div className={styles.addTaskDeadline}>
								<input
									type="date"
									value={taskDeadline}
									placeholder="Insira a data limite para a atividade"
									onChange={handleChangeDeadline}
								/>
								<button>
									<Plus />
								</button>
							</div>
						</form>
					</>
				)}

				{tasks.length ? (
					<>
						<h3 className={styles.status}>
							Tarefas Concluidas{" "}
							<span>
								{doneCount} de {tasks.length}
							</span>
						</h3>

						<ul className={styles.taskList}>
							{tasks.map((task) => (
								<Task
									key={task.id}
									content={task.content}
									isDone={task.done}
									deadline={task.deadline}	
									editingTask={task.editingTask}											
									onUpdate={() => handleUpdateTask(task.id)}
									onCheck={() => handleToggleTask(task.id)}
									onRemove={() => handleRemoveTask(task.id)}
								/>
							))}
						</ul>
					</>
				) : (
					<div className={styles.empty}>
						<ClipboardText size={55} />
						<p>
							Você não tem nenhuma tarefa no momento. <br /> Adicione novas
							tarefas para que elas sejam mostradas.
						</p>
					</div>
				)}
			</main>
		</>
	)
}

export default App
