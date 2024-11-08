"use client";

import React, { useState, useEffect} from 'react';

interface Idea {
  id?: number;
  title: string;
  description: string;
  language: string;
  framework: string;
  githubUrl: string;
}

const IdeaForm: React.FC<{ onIdeaSubmit: (idea: Idea) => void; initialIdea?: Idea }> = ({ onIdeaSubmit, initialIdea }) => {
  const [idea, setIdea] = useState<Idea>({
    title: '',
    description: '',
    language: '',
    framework: '',
    githubUrl: '',
  });

  useEffect(() => {
    if (initialIdea) {
      setIdea(initialIdea);
    }
  }, [initialIdea]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIdea({ ...idea, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onIdeaSubmit(idea);
    setIdea({
      title: '',
      description: '',
      language: '',
      framework: '',
      githubUrl: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>アイデアのタイトル</label>
        <input
          type="text"
          name="title"
          placeholder="アイデアのタイトル"
          value={idea.title}
          onChange={handleChange}
          className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label>アイデアの概要</label>
        <textarea
          name="description"
          placeholder="アイデアの概要"
          value={idea.description}
          onChange={handleChange}
          className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label>使用する言語</label>
        <input
          type="text"
          name="language"
          placeholder="使用する言語"
          value={idea.language}
          onChange={handleChange}
          className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label>使用するフレームワーク</label>
        <input
          type="text"
          name="framework"
          placeholder="使用するフレームワーク"
          value={idea.framework}
          onChange={handleChange}
          className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label>GitHub Project Name</label>
        <input
          type="text"
          name="githubUrl"
          placeholder="GitHub Project Name"
          value={idea.githubUrl}
          onChange={handleChange}
          className="w-full p-3 my-2 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg mt-4 transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        追加
      </button>
    </form>
  );
};

const IdeaList: React.FC<{ ideas: Idea[]; onEdit: (index: number) => void; onDelete: (index: number) => void }> = ({ ideas, onEdit, onDelete }) => {
  const getLanguageIcon = (language: string) => {
    return <img src={`https://skillicons.dev/icons?i=${language.toLowerCase()}`} alt={language} className="mr-2 w-5 h-5" />;
  };

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {ideas.map((idea, index) => (
        <div
          key={index}
          className="bg-white backdrop-blur-sm bg-white/90 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative"
        >
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Delete idea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onEdit(index)}
            className="absolute top-4 right-12 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            aria-label="Edit idea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6" fill="currentColor">
              <path d="M165.628,461.127c0,0,0.827-0.828,1.838-1.839l194.742-194.742c1.012-1.011,1.92-1.92,2.019-2.019c0.099-0.099,1.008-1.008,2.019-2.019l103.182-103.182c0.018-0.018,0.018-0.048,0-0.067L354.259,42.092c-0.018-0.018-0.048-0.018-0.067,0L251.01,145.274c-1.011,1.011-1.92,1.92-2.019,2.019c-0.099,0.099-1.008,1.008-2.019,2.019L50.401,345.884c-0.006,0.006-0.01,0.012-0.012,0.02L0.002,511.459c-0.011,0.036,0.023,0.07,0.059,0.059l163.079-49.633C164.508,461.468,165.628,461.127,165.628,461.127z M36.734,474.727l25.159-82.666c0.01-0.034,0.053-0.045,0.078-0.02l57.507,57.507c0.025,0.025,0.014,0.068-0.02,0.078l-82.666,25.16C36.756,474.797,36.722,474.764,36.734,474.727z"></path>
              <path d="M502.398,104.432c12.803-12.804,12.803-33.754,0-46.558l-47.791-47.792c-12.804-12.803-33.754-12.803-46.558,0l-23.862,23.862c-0.018,0.018-0.018,0.048,0,0.067l94.282,94.282c0.018,0.018,0.048,0.018,0.067,0L502.398,104.432z"></path>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-1">{idea.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
              {getLanguageIcon(idea.language)}
              {idea.language}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
              {getLanguageIcon(idea.framework)}
              {idea.framework}
            </span>
            <a
              href={`https://github.com/${idea.githubUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.85c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.48C19.14 20.17 22 16.42 22 12c0-5.523-4.477-10-10-10z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas');
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  const handleIdeaSubmit = (idea: Idea) => {
    if (editingIndex !== null) {
      const updatedIdeas = ideas.map((item, index) => (index === editingIndex ? { ...idea } : item));
      setIdeas(updatedIdeas);
      localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
      setEditingIndex(null);
    } else {
      const newIdeas = [...ideas, { ...idea }];
      setIdeas(newIdeas);
      localStorage.setItem('ideas', JSON.stringify(newIdeas));
    }
  };

  const handleDeleteIdea = (index: number) => {
    const newIdeas = ideas.filter((_, i) => i !== index);
    setIdeas(newIdeas);
    localStorage.setItem('ideas', JSON.stringify(newIdeas));
  };

  const handleEditIdea = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">
          My Idea Organizer
        </h1>
        <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 shadow-lg">
          <IdeaForm onIdeaSubmit={handleIdeaSubmit} initialIdea={editingIndex !== null ? ideas[editingIndex] : undefined} />
        </div>
        <IdeaList ideas={ideas} onEdit={handleEditIdea} onDelete={handleDeleteIdea} />
      </div>
    </div>
  );
};

export default App;