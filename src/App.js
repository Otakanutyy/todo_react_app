import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";
import { useLocalStorage, useHotkeys } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const taskTitle = useRef("");
  const taskSummary = useRef("");
  const taskState = useRef("Not done");
  const taskDeadline = useRef("");

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  // Task creation
  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState.current,
      deadline: taskDeadline.current.value, // Handle deadline
    };
    setTasks([...tasks, newTask]);
    saveTasks([...tasks, newTask]);
  }

  // Delete task
  function deleteTask(index) {
    const clonedTasks = [...tasks];
    clonedTasks.splice(index, 1);
    setTasks(clonedTasks);
    saveTasks(clonedTasks);
  }

  // Load tasks from localStorage
  function loadTasks() {
    let loadedTasks = localStorage.getItem("tasks");
    let tasks = JSON.parse(loadedTasks);
    if (tasks) setTasks(tasks);
  }

  // Save tasks to localStorage
  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Sort tasks by state
  const sortTasks = (state) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.state === state && b.state !== state) return -1;
      if (a.state !== state && b.state === state) return 1;
      return 0;
    });
    setTasks(sortedTasks);
  };

  // Filter tasks by state
  const filterTasks = (state) => {
    const filteredTasks = tasks.filter((task) => task.state === state);
    setTasks(filteredTasks);
  };

  // Sort by deadline
  const sortByDeadline = () => {
    const sortedByDeadline = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setTasks(sortedByDeadline);
  };

  return (
    <div className="App">
      {/* Modal to create a new task */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="New Task">
        <TextInput ref={taskTitle} label="Title" placeholder="Task Title" required />
        <TextInput ref={taskSummary} label="Summary" placeholder="Task Summary" />
        
        {/* Task state */}
        <Select
          label="State"
          data={["Done", "Not done", "Doing right now"]}
          onChange={(value) => (taskState.current = value)}
        />
        
        {/* Deadline input */}
        <input
          type="date"
          ref={taskDeadline}
          placeholder="Pick a date"
          style={{ width: "100%", marginTop: "10px" }}
        />

        <Group position="apart" mt="md">
          <Button onClick={() => setOpened(false)} variant="subtle">Cancel</Button>
          <Button onClick={createTask}>Create Task</Button>
        </Group>
      </Modal>

      <Container size={550} my={40}>
        {/* Header */}
        <Group position="apart">
          <Title
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            My Tasks
          </Title>

          {/* Theme toggle button */}
          <ActionIcon color="blue" onClick={() => toggleColorScheme()} size="lg">
            {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
          </ActionIcon>
        </Group>

        {/* Sorting buttons */}
        <Group mt="md">
          <Button onClick={() => sortTasks("Done")}>Show 'Done' first</Button>
          <Button onClick={() => sortTasks("Doing right now")}>Show 'Doing' first</Button>
          <Button onClick={() => sortTasks("Not done")}>Show 'Not done' first</Button>
        </Group>

        {/* Filtering buttons */}
        <Group mt="md">
          <Button onClick={() => filterTasks("Done")}>Show only 'Done'</Button>
          <Button onClick={() => filterTasks("Not done")}>Show only 'Not done'</Button>
          <Button onClick={() => filterTasks("Doing right now")}>Show only 'Doing'</Button>
        </Group>

        {/* Sorting by deadline */}
        <Button onClick={sortByDeadline} mt="md" fullWidth>
          Sort by deadline
        </Button>

        {/* Task list */}
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Card key={index} withBorder mt="sm">
              <Group position="apart">
                <Text weight="bold">{task.title}</Text>
                <Group>
                  <ActionIcon color="yellow" onClick={() => setOpened(true)}>
                    <Edit />
                  </ActionIcon>
                  <ActionIcon onClick={() => deleteTask(index)} color="red">
                    <Trash />
                  </ActionIcon>
                </Group>
              </Group>
              <Text color="dimmed" size="md" mt="sm">
                {task.summary ? task.summary : "No summary provided"}
              </Text>
              <Text size="sm" color="dimmed" mt="sm">
                State: {task.state}
              </Text>
              <Text size="sm" color="dimmed" mt="sm">
                Deadline: {task.deadline ? task.deadline : "No deadline set"}
              </Text>
            </Card>
          ))
        ) : (
          <Text size="lg" mt="md" color="dimmed">
            You have no tasks
          </Text>
        )}

        {/* Add new task button */}
        <Button fullWidth mt="md" onClick={() => setOpened(true)}>
          New Task
        </Button>
      </Container>
    </div>
  );
}
