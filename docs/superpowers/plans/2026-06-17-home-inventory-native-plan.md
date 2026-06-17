# Home Inventory Native App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React Native (Expo) app that stores data in the local file system, supports home screen widgets, and pushes notifications for expiry alerts.

**Architecture:** Expo-managed project. Data is saved as a JSON file using `expo-file-system`. Push notifications via `expo-notifications`. Widget functionality via `expo-widgets` (or platform-specific native modules if needed).

---

### Task 1: Expo Project Initialization
- [ ] Initialize project: `npx create-expo-app@latest`
- [ ] Install dependencies: `expo-file-system`, `expo-notifications`, `expo-widgets` (or relevant expo widget package)
- [ ] Setup base navigation and folder structure

### Task 2: Native Data Storage (File System)
- [ ] Implement data manager to read/write JSON files via `expo-file-system`
- [ ] Ensure persistence across app restarts

### Task 3: UI & Functionality (List, Add, Edit, Delete)
- [ ] Implement screens (List, Add/Edit) using React Native components (`FlatList`, `TextInput`, etc.)
- [ ] Integrate local file storage logic

### Task 4: Push Notifications
- [ ] Configure `expo-notifications` permissions
- [ ] Implement logic to schedule notifications based on expiry dates

### Task 5: Widget Integration & Final Build
- [ ] Implement home screen widget
- [ ] Final testing and build configuration
