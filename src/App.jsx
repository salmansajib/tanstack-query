import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, status, error } = useQuery({
    queryKey: ["todo"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users/1/todos").then((res) =>
        res.json(),
      ),
  });

  if (status === "pending") {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen grid place-content-center">
        <span className="text-2xl text-red-500">Error: {error.message}</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-screen grid place-content-center">
        <div>
          <h1 className="text-4xl font-bold text-center mb-5 uppercase">
            Todos
          </h1>
          <div>
            {data?.map((todo) => (
              <h1 key={todo.id}>{todo.title}</h1>
            ))}
          </div>
        </div>
      </main>
    );
  }
}

export default App;
