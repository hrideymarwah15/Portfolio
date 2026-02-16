import fs from "fs";
import path from "path";

// Force dynamic since we are reading file system
export const dynamic = "force-dynamic";

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  indent: number;
}

function parseTasks(content: string): TaskItem[] {
  const lines = content.split("\n");
  const tasks: TaskItem[] = [];
  
  lines.forEach((line, index) => {
    const match = line.match(/^(\s*)-\s\[([ x])\]\s(.*)$/);
    if (match) {
      const indent = match[1].length / 2; // Assume 2 spaces per indent
      const completed = match[2] === "x";
      const text = match[3].replace(/<!-- id: \d+ -->/, "").trim().replace(/\*\*/g, ""); // Remove ID comments and bold markdown
      
      tasks.push({
        id: `task-${index}`,
        text,
        completed,
        indent
      });
    }
  });
  
  return tasks;
}

export default function TaskPage() {
  const taskPath = path.join(process.cwd(), "content/task.md");
  let tasks: TaskItem[] = [];
  
  try {
    if (fs.existsSync(taskPath)) {
      const content = fs.readFileSync(taskPath, "utf-8");
      tasks = parseTasks(content);
    }
  } catch (error) {
    console.error("Error reading task.md", error);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold mb-2">PROJECT TASKS</h1>
        <p className="text-[var(--muted)] font-mono text-sm">
          // LIVE STATUS FROM CONTENT/TASK.MD
        </p>
      </div>

      <div className="bg-[var(--background)] border-2 border-[var(--border)] p-6 shadow-hard" style={{ borderRadius: "3px 15px 5px 15px / 15px 5px 15px 5px" }}>
        <ul className="space-y-4 font-mono">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className={`flex items-start gap-3 transition-colors ${task.completed ? "text-[var(--muted)] line-through decoration-2 decoration-[var(--border)]" : "text-[var(--foreground)]"}`}
              style={{ marginLeft: `${task.indent * 1.5}rem` }}
            >
              <div className={`mt-1.5 w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${task.completed ? "bg-[var(--foreground)] border-[var(--foreground)]" : "border-[var(--muted)]"}`}>
                {task.completed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4L3.5 6L8.5 1" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-sm md:text-base ${task.completed ? "opacity-70" : ""}`}>
                {task.text}
              </span>
            </li>
          ))}
          
          {tasks.length === 0 && (
            <li className="text-[var(--muted)]">No tasks found in content/task.md</li>
          )}
        </ul>
      </div>
    </div>
  );
}
