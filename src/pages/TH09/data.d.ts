export interface ITask {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
