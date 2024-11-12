"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import IdeaList from "../../components/idea-manager/idea-list";
import IdeaForm from "../../components/idea-manager/idea-form";
import { motion } from "framer-motion";

interface Idea {
  title: string;
  description: string;
  details: string;
  languages: string[];
  frameworks: string[];
  githubUrl: string;
  createGitHubRepo: boolean;
  todos: { task: string; completed: boolean }[];
}

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedIdeas = localStorage.getItem("ideas");
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  const handleIdeaSubmit = (idea: Idea) => {
    if (editingIndex !== null) {
      const updatedIdeas = ideas.map((item, index) =>
        index === editingIndex ? { ...idea } : item
      );
      setIdeas(updatedIdeas);
      localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
      setEditingIndex(null);
    } else {
      const newIdeas = [...ideas, { ...idea }];
      setIdeas(newIdeas);
      localStorage.setItem("ideas", JSON.stringify(newIdeas));
    }
  };

  const handleDeleteIdea = (index: number) => {
    const newIdeas = ideas.filter((_, i) => i !== index);
    setIdeas(newIdeas);
    localStorage.setItem("ideas", JSON.stringify(newIdeas));
  };

  const handleEditIdea = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <>
      <Head>
        <title>Idea Manager</title>
        <meta name="description" content="アイデアを管理します" />
      </Head>
      <motion.div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            My Idea Organizer
          </motion.h1>
          <motion.div
            className="backdrop-blur-sm bg-white/30 rounded-xl p-6 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <IdeaForm
              onIdeaSubmit={handleIdeaSubmit}
              initialIdea={
                editingIndex !== null ? ideas[editingIndex] : undefined
              }
            />
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <IdeaList
              ideas={ideas}
              onEdit={handleEditIdea}
              onDelete={handleDeleteIdea}
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default App;
