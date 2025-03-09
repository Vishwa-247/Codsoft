
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Check } from "lucide-react";
import TaskDialog from "./TaskDialog";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "On Hold";
  dueDate: string;
  memberCount: number;
  tasks: Task[];
  onClick: () => void;
  onCreateTask: (task: { title: string; description: string; dueDate: string; projectId: number }) => void;
  onToggleTask: (taskId: number, projectId: number) => void;
}

const ProjectCard = ({
  id,
  title,
  description,
  status,
  dueDate,
  memberCount,
  tasks,
  onClick,
  onCreateTask,
  onToggleTask,
}: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-primary text-primary-foreground";
      case "Completed":
        return "bg-green-500 text-white";
      case "On Hold":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Badge className={getStatusColor(status)}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2 mb-4">{description}</p>
        <div className="flex items-center gap-4 mb-4 text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{dueDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{memberCount} members</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">Tasks</h4>
            <TaskDialog projectId={id} onCreateTask={onCreateTask} />
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 bg-accent rounded-md"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 ${task.completed ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => onToggleTask(task.id, id)}
              >
                <Check className="h-3 w-3" />
              </Button>
              <span className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onClick}
          variant="ghost"
          className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
