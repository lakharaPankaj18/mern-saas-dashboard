import Task from "../models/Task.js";

// Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching tasks" });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, priority, due } = req.body;
    const newTask = await Task.create({
      user: req.user._id,
      title,
      priority,
      due
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Error creating task" });
  }
};

// Toggle task completion status
export const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!result) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed" });
  }
};

// Update a task

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, priority, due } = req.body;
    
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update only the fields provided in the request
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    if (due !== undefined) task.due = due;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};