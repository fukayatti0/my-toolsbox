import React, { useEffect, useState } from "react";

interface Todo {
  task: string;
  completed: boolean;
}

interface Idea {
  title: string;
  description: string;
  details: string;
  languages: string[];
  frameworks: string[];
  githubUrl: string;
  createGitHubRepo: boolean;
  todos: Todo[];
}

const languages = [
  { label: "Ada", value: "ada" },
  { label: "Assembly", value: "assembly" },
  { label: "C", value: "c" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cpp" },
  { label: "Clojure", value: "clojure" },
  { label: "COBOL", value: "cobol" },
  { label: "CoffeeScript", value: "coffeescript" },
  { label: "Crystal", value: "crystal" },
  { label: "D", value: "d" },
  { label: "Dart", value: "dart" },
  { label: "Elixir", value: "elixir" },
  { label: "Elm", value: "elm" },
  { label: "Erlang", value: "erlang" },
  { label: "F#", value: "fsharp" },
  { label: "Fennel", value: "fennel" },
  { label: "Fortran", value: "fortran" },
  { label: "Go", value: "go" },
  { label: "Groovy", value: "groovy" },
  { label: "Haskell", value: "haskell" },
  { label: "Idris", value: "idris" },
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "Julia", value: "julia" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Lua", value: "lua" },
  { label: "MATLAB", value: "matlab" },
  { label: "Nim", value: "nim" },
  { label: "Objective-C", value: "objective-c" },
  { label: "OCaml", value: "ocaml" },
  { label: "Perl", value: "perl" },
  { label: "PHP", value: "php" },
  { label: "PowerShell", value: "powershell" },
  { label: "PureScript", value: "purescript" },
  { label: "R", value: "r" },
  { label: "Racket", value: "racket" },
  { label: "Reason", value: "reason" },
  { label: "Ruby", value: "ruby" },
  { label: "Rust", value: "rust" },
  { label: "Scala", value: "scala" },
  { label: "Shell", value: "shell" },
  { label: "Swift", value: "swift" },
  { label: "TypeScript", value: "typescript" },
  { label: "Verilog", value: "verilog" },
  { label: "VHDL", value: "vhdl" },
  { label: "Zig", value: "zig" },
];

const frameworks = [
  { label: "Angular", value: "angular" },
  { label: "Astro", value: "astro" },
  { label: "Backbone", value: "backbone" },
  { label: "Django", value: "django" },
  { label: "Ember", value: "ember" },
  { label: "Express", value: "express" },
  { label: "Flask", value: "flask" },
  { label: "jQuery", value: "jquery" },
  { label: "Laravel", value: "laravel" },
  { label: "Next.js", value: "nextjs" },
  { label: "Rails", value: "rails" },
  { label: "React", value: "react" },
  { label: "Spring", value: "spring" },
  { label: "Svelte", value: "svelte" },
  { label: "Tailwind CSS", value: "tailwindcss" },
  { label: "Vue", value: "vue" },
  { label: "WebAssembly", value: "webassembly" },
];

const IdeaForm: React.FC<{
  onIdeaSubmit: (idea: Idea) => void;
  initialIdea?: Idea;
}> = ({ onIdeaSubmit, initialIdea }) => {
  const [idea, setIdea] = useState<Idea>({
    title: "",
    description: "",
    details: "",
    languages: [""],
    frameworks: [""],
    githubUrl: "",
    createGitHubRepo: false,
    todos: [{ task: "", completed: false }],
  });

  useEffect(() => {
    if (initialIdea) {
      setIdea(initialIdea);
    }
  }, [initialIdea]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number,
    fieldName?: string
  ) => {
    if (e.target.name === "createGitHubRepo") {
      setIdea({ ...idea, createGitHubRepo: (e.target as HTMLInputElement).checked });
      return;
    }

    if (index !== undefined && fieldName) {
      const { value } = e.target;
      setIdea((prevIdea) => {
        const updatedArray = [...(prevIdea[fieldName as keyof Idea] as any[])];
        updatedArray[index] = value;
        return { ...prevIdea, [fieldName]: updatedArray };
      });
    } else {
      setIdea({ ...idea, [e.target.name]: e.target.value });
    }
  };

  const handleAddField = (field: "languages" | "frameworks" | "todos") => {
    setIdea((prevIdea) => ({
      ...prevIdea,
      [field]:
        field === "todos"
          ? [...prevIdea[field], { task: "", completed: false }]
          : [...prevIdea[field], ""],
    }));
  };

  const handleTodoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value, checked } = e.target;
    setIdea((prevIdea) => {
      const todos = [...prevIdea.todos];
      if (name === "task") {
        todos[index].task = value;
      } else if (name === "completed") {
        todos[index].completed = checked;
      }
      return { ...prevIdea, todos };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onIdeaSubmit(idea);
    if (idea.createGitHubRepo) {
      window.open(
        `https://github.com/new?name=${idea.githubUrl}&description=${idea.description}`,
        "_blank"
      );
    }
    setIdea({
      title: "",
      description: "",
      details: "",
      languages: [""],
      frameworks: [""],
      githubUrl: "",
      createGitHubRepo: false,
      todos: [{ task: "", completed: false }],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 既存のフォームフィールド */}
      <div>
        <label>Todoリスト</label>
        {idea.todos.map((todo, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              name="task"
              placeholder="タスクを入力"
              value={todo.task}
              onChange={(e) => handleTodoChange(e, index)}
              className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg"
            />
            <label className="ml-2 flex items-center">
              <input
                type="checkbox"
                name="completed"
                checked={todo.completed}
                onChange={(e) => handleTodoChange(e, index)}
                className="mr-1"
              />
              完了
            </label>
            {index === idea.todos.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField("todos")}
                className="p-1 text-2xl bg-blue-500 text-white rounded-lg ml-2"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
      {/* 既存のフォームフィールド */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg mt-4"
      >
        追加
      </button>
    </form>
  );
};

export default IdeaForm;
