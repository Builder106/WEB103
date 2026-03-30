# Study Sprint Tracker — Milestone 1 Deliverables

## Project Name
Study Sprint Tracker

## Team
- Olayinka Vaughan
- [Partner Name 1]
- [Partner Name 2]

## Description / Purpose
Study Sprint Tracker is a web app for students to plan, track, and visualize focused study sessions by goal. Users can create study goals, log timed sessions, and review progress in a dashboard without losing context.

## Inspiration
I wanted a simple app that supports deliberate practice and productivity in student life. The concept is inspired by Pomodoro habits and task-focused learning; it should help learners measure progress and feel momentum.

## Baseline Features (to implement in final product)
- Full-stack app: Express backend + React frontend
- PostgreSQL schema with one-to-many and many-to-many
- API RESTful CRUD for Study Goals
- Reset DB endpoint
- React Router dynamic routes (home, goal detail, session log)
- Same-page interaction: start/stop timer + add log without navigation
- Frontend redirect (e.g., login redirects to dashboard)
- Component hierarchy: pages/components and container/presenter design
- Deployed on Render with all visible features working

## Custom Features (pick two, plus optional extras)
1. Auto-generate starter data when a new user creates an account (starter goals + subject tags)
2. Modal for adding/editing study sessions (covers current page content), plus a slide-out details panel
3. (Stretch) Validation: session duration must be > 0 and goal target hours must be positive before DB update
4. (Stretch) Filter/sort goals by status, time logged, or subject

## Suggested Entity Relationship (for milestone 2 ERD)
- `users` (id, name, email)
- `goals` (id, user_id, title, description, target_hours, status)
- `subjects` (id, name)
- `goal_subjects` (goal_id, subject_id, unique constraint)
- `sessions` (id, goal_id, user_id, duration_minutes, notes, completed_at)

Relationships:
- one-to-many: user -> goals
- one-to-many: goal -> sessions
- many-to-many: goal <-> subjects via goal_subjects (unique field: goal_id + subject_id)

## Core User Stories (min 10)
1. As a learner, I can create a new study goal so I can plan my semester work.
2. As a learner, I can view all active goals on a dashboard so I can prioritize work.
3. As a learner, I can click a goal to see details and progress.
4. As a learner, I can add a session log for a goal (duration + notes) without leaving the page.
5. As a learner, I can edit and delete sessions.
6. As a learner, I can mark a goal as complete and see percentage complete.
7. As a learner, I can auto-populate sample goals when first registering.
8. As a learner, I can filter goals by "Active", "Paused", and "Completed".
9. As a learner, I can see total logged hours and remaining target hours.
10. As a learner, I can use a modal to create a session quickly.
11. As a learner, I can return to the landing page when not logged in.

## Milestone 1 Checklist
- [x] Understand baseline + custom feature requirements
- [x] Chosen project: Study Sprint Tracker
- [x] `README.md` planned update: name, members, description, purpose, inspiration, features
- [x] `planning/user_stories.md` planned: 10+ user stories (above)
- [x] `milestones/milestone1.md` reflection answers ready

## Reflection Answers (to add into `milestones/milestone1.md`)
1. What did you learn about app design today?
   - Plan the smallest viable feature set to satisfy baseline before adding custom/extra features. Building database relationships early gives the app structure.
2. What challenges do you expect and how will you solve them?
   - Need clear route patterns (`/goals`, `/goals/:id`, `/sessions`). Solve by writing a route map first in the planning doc. Handle React state updates with optimistic UI and fallback error handling.
3. What do you want to complete in the next milestone?
   - Wireframes for 3 pages (dashboard, goal page, session modal), ERD for user-goal-subject-session join table relationships, and project pitch checklist.
