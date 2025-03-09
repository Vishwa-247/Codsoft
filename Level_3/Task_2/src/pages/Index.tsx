
import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "On Hold";
  dueDate: string;
  memberCount: number;
  tasks: Task[];
}

const Index = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Website Redesign",
      description: "Revamp the company website with modern design and improved UX",
      status: "In Progress",
      dueDate: "2024-04-30",
      memberCount: 4,
      tasks: [],
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Create a new mobile app for customer engagement",
      status: "On Hold",
      dueDate: "2024-05-15",
      memberCount: 6,
      tasks: [],
    },
  ]);

  const handleCreateProject = (projectData: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    const newProject: Project = {
      id: projects.length + 1,
      ...projectData,
      status: "In Progress",
      memberCount: 1,
      tasks: [],
    };
    setProjects([...projects, newProject]);
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully.",
    });
  };

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    dueDate: string;
    projectId: number;
  }) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id === taskData.projectId) {
          const newTask: Task = {
            id: (project.tasks.length || 0) + 1,
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            completed: false,
          };
          return {
            ...project,
            tasks: [...project.tasks, newTask],
          };
        }
        return project;
      })
    );
    toast({
      title: "Task Created",
      description: "New task has been added to the project.",
    });
  };

  const handleToggleTask = (taskId: number, projectId: number) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          return { ...project, tasks: updatedTasks };
        }
        return project;
      })
    );
  };

  const handleProjectClick = (projectId: number) => {
    console.log("Clicked project:", projectId);
    // Will implement project details view in the next iteration
  };

  return (
    <div className="min-h-screen bg-accent p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-in">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your ongoing projects
            </p>
          </div>
          <CreateProjectDialog onCreateProject={handleCreateProject} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              status={project.status}
              dueDate={project.dueDate}
              memberCount={project.memberCount}
              tasks={project.tasks}
              onClick={() => handleProjectClick(project.id)}
              onCreateTask={handleCreateTask}
              onToggleTask={handleToggleTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
