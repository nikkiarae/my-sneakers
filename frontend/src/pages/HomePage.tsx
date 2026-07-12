import { useQuery } from '@tanstack/react-query'

interface Todo {
  id: number
  title: string
  completed: boolean
}

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('http://localhost:3000/todos')
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json()
}

export function HomePage() {
  const { data: todos, isLoading, isError } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>My Sneakers — Todos</h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p style={{ color: 'red' }}>Could not load todos. Is the backend running?</p>}

      {todos && todos.length === 0 && <p>No todos yet.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            style={{
              padding: '0.5rem 0.75rem',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#94a3b8' : 'inherit',
            }}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </main>
  )
}
