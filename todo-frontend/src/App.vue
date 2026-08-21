<script setup>
import { ref, computed, onMounted } from "vue";
import { taskService } from "./api.js";

// ===== State =====
const tasks = ref([]);
const newTaskTitle = ref("");
const filter = ref("all"); // all | active | completed
const loading = ref(false);
const error = ref("");

// ===== Editing state =====
const editingId = ref(null); // id of the task being edited
const editingText = ref(""); // temporary text while editing

// ===== FE data processing (Tier 3 requirement) =====
const filteredTasks = computed(() => {
  if (filter.value === "active") {
    return tasks.value.filter((t) => !t.completed);
  }
  if (filter.value === "completed") {
    return tasks.value.filter((t) => t.completed);
  }
  return tasks.value;
});

const remainingCount = computed(
  () => tasks.value.filter((t) => !t.completed).length,
);

// ===== Read =====
async function loadTasks() {
  loading.value = true;
  error.value = "";
  try {
    const response = await taskService.getAll();
    tasks.value = response.data;
  } catch (e) {
    error.value = "Failed to load tasks. Make sure the server is running.";
  } finally {
    loading.value = false;
  }
}

// ===== Create =====
async function addTask() {
  const title = newTaskTitle.value.trim();
  if (!title) return;
  try {
    const response = await taskService.create(title);
    tasks.value.unshift(response.data);
    newTaskTitle.value = "";
  } catch (e) {
    error.value = "Failed to add task.";
  }
}

// ===== Update: toggle completed =====
async function toggleTask(task) {
  try {
    const response = await taskService.update(task.id, {
      title: task.title,
      completed: !task.completed,
    });
    const index = tasks.value.findIndex((t) => t.id === task.id);
    if (index !== -1) tasks.value[index] = response.data;
  } catch (e) {
    error.value = "Failed to update task.";
  }
}

// ===== Update: edit title =====
function startEditing(task) {
  editingId.value = task.id;
  editingText.value = task.title;
}

function cancelEditing() {
  editingId.value = null;
  editingText.value = "";
}

async function saveEditing(task) {
  const title = editingText.value.trim();
  if (!title) return;
  try {
    const response = await taskService.update(task.id, {
      title: title,
      completed: task.completed,
    });
    const index = tasks.value.findIndex((t) => t.id === task.id);
    if (index !== -1) tasks.value[index] = response.data;
    cancelEditing();
  } catch (e) {
    error.value = "Failed to save changes.";
  }
}

// ===== Delete =====
async function deleteTask(id) {
  try {
    await taskService.remove(id);
    tasks.value = tasks.value.filter((t) => t.id !== id);
  } catch (e) {
    error.value = "Failed to delete task.";
  }
}

onMounted(loadTasks);
</script>

<template>
  <main class="container">
    <h1>Task List</h1>

    <!-- Add new task -->
    <form @submit.prevent="addTask" class="add-form">
      <input
        v-model="newTaskTitle"
        type="text"
        placeholder="Add a new task..."
        class="task-input"
      />
      <button type="submit" class="btn-add">Add</button>
    </form>

    <!-- Filters -->
    <div class="filters">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
        All
      </button>
      <button
        :class="{ active: filter === 'active' }"
        @click="filter = 'active'"
      >
        Active
      </button>
      <button
        :class="{ active: filter === 'completed' }"
        @click="filter = 'completed'"
      >
        Completed
      </button>
    </div>

    <!-- Error message -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Loading -->
    <p v-if="loading" class="loading">Loading...</p>

    <!-- Task list -->
    <ul v-else class="task-list">
      <li v-if="filteredTasks.length === 0" class="empty">No tasks to show.</li>
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        :class="{ done: task.completed }"
      >
        <!-- Edit mode -->
        <template v-if="editingId === task.id">
          <input
            v-model="editingText"
            type="text"
            class="edit-input"
            @keyup.enter="saveEditing(task)"
            @keyup.esc="cancelEditing"
          />
          <button @click="saveEditing(task)" class="btn-save">Save</button>
          <button @click="cancelEditing" class="btn-cancel">Cancel</button>
        </template>

        <!-- Normal mode -->
        <template v-else>
          <button
            class="btn-toggle"
            :class="{ completed: task.completed }"
            @click="toggleTask(task)"
          >
            {{ task.completed ? "✓ Done" : "Mark done" }}
          </button>
          <span class="task-title">{{ task.title }}</span>
          <button @click="startEditing(task)" class="btn-edit">Edit</button>
          <button @click="deleteTask(task.id)" class="btn-delete">
            Delete
          </button>
        </template>
      </li>
    </ul>

    <!-- Remaining counter -->
    <p class="counter" v-if="tasks.length">
      Remaining: {{ remainingCount }} of {{ tasks.length }}
    </p>
  </main>
</template>

<style scoped>
.container {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
  direction: ltr;
}
h1 {
  text-align: center;
  color: #2c3e50;
}
.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.task-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
}
.btn-add {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-add:hover {
  background: #369870;
}
.filters {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}
.filters button {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
}
.filters button.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}
.task-list {
  list-style: none;
  padding: 0;
}
.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
}
.task-item.done .task-title {
  text-decoration: line-through;
  color: #aaa;
}
.task-title {
  flex: 1;
  text-align: left;
}
.btn-toggle {
  padding: 6px 12px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}
.btn-toggle.completed {
  background: #42b883;
  color: white;
  border-color: #42b883;
}
.btn-edit {
  padding: 4px 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-edit:hover {
  background: #2980b9;
}
.btn-delete {
  padding: 4px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-delete:hover {
  background: #c0392b;
}
.edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #42b883;
  border-radius: 6px;
  font-size: 14px;
}
.btn-save {
  padding: 4px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-cancel {
  padding: 4px 12px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.error {
  color: #e74c3c;
  text-align: center;
}
.loading,
.empty {
  text-align: center;
  color: #888;
}
.counter {
  text-align: center;
  color: #666;
  margin-top: 16px;
}
</style>
