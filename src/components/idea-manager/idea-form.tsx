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
      HTMLInputElement | HTMLTextAreaElement
    >,
    index?: number,
    fieldName?: string
  ) => {
    if (e.target.name === "createGitHubRepo") {
      setIdea({
        ...idea,
        createGitHubRepo: (e.target as HTMLInputElement).checked,
      });
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
      {/* Other form fields */}
      <div>
        <label>使用する言語</label>
        {idea.languages.map((language, index) => (
          <div key={index} className="items-center">
            <input
              type="text"
              name="languages"
              placeholder="使用する言語"
              value={language}
              onChange={(e) => handleChange(e, index, "languages")}
              className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg"
            />
            {index === idea.languages.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField("languages")}
                className="w-full p-1 text-2xl bg-blue-500 text-white rounded-lg"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
      <div>
        <label>使用するフレームワーク</label>
        {idea.frameworks.map((framework, index) => (
          <div key={index} className="items-center">
            <input
              type="text"
              name="frameworks"
              placeholder="使用するフレームワーク"
              value={framework}
              onChange={(e) => handleChange(e, index, "frameworks")}
              className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg"
            />
            {index === idea.frameworks.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField("frameworks")}
                className="w-full p-1 text-2xl bg-blue-500 text-white rounded-lg"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Remaining form fields and submit button */}
    </form>
  );
};

export default IdeaForm;
