import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();

  // query
  const { data, status, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json(),
      ),
    // staleTime: 4000,
    refetchInterval: 10000,
    retry: 5, //the default is 3
  });

  // mutation
  const {
    mutate,
    status: mutationStatus,
    error: mutationError,
  } = useMutation({
    mutationFn: (newPost) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(newPost),
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      queryClient.setQueryData(["posts"], (oldPost) => [...oldPost, newPost]);
    },
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
  if (mutationStatus === "error") {
    return (
      <div className="min-h-screen grid place-content-center">
        <span className="text-2xl text-red-500">
          Error: {mutationError.message}
        </span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#FDF7F4] grid place-content-center py-5 px-2">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold text-center uppercase">Posts</h1>
          <div className="flex items-center justify-center">
            <button
              onClick={() =>
                // do not need to pass an ID
                // it will auto generate from the API
                mutate({
                  userId: 5000,
                  title: "New Post",
                  body: "This is the new post.",
                })
              }
              className="bg-blue-600 px-[30px] py-[10px] text-gray-50 hover:bg-blue-700 transition-colors"
            >
              Add Post
            </button>
          </div>
          {mutationStatus === "pending" && <p>Data is being added</p>}
          <div className="space-y-3">
            {data?.map((post) => (
              <div
                key={post.id}
                className="w-full max-w-[650px]  p-3 space-y-2 bg-[#BFECFF] rounded-sm shadow-sm"
              >
                <h1 className="text-xl text-gray-800 font-medium">
                  {post.title}
                </h1>
                <p className="text-gray-600">{post.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }
}

export default App;
