# LMS-FRONTEND-V2

This is a small React learning project. It uses JavaScript, JSX, CSS, `useState`, and native `fetch`. API calls happen after a form submit or button click; there is no `useEffect`, router, or state library.

## Start the project

1. Start MongoDB and the existing LMS backend. The local MongoDB instance uses port 27017 and the backend uses port 3000.
2. In `LMS-Frontend`, run `npm install`.
3. Run `npm run dev -- --port 5173 --strictPort`.
4. Open `http://localhost:5173`.
5. Run `npm run build` and `npm run lint` to check the project.

The API base URL is `http://localhost:3000` by default. To use another backend, set `VITE_API_URL` in a local `.env.local` file. Do not put passwords or tokens in that file. The backend CORS setting allows `http://localhost:5173`.

## Real backend contract

The backend mounts these routes under `/api`. These paths and response fields were checked in the backend source.

| Route | What it does | Frontend use |
| --- | --- | --- |
| `POST /api/auth/login` | Returns top-level `token` and `data.user` | Sign in |
| `GET /api/profiles/me` | Returns the signed-in user's profile | Check profile button |
| `POST /api/auth/register` | Public learner registration | Admin Users page form |
| `GET /api/trainer/Courses` | Lists every course for Admin, including drafts | Admin Courses page |
| `POST /api/courses` | Creates a draft course | Admin Courses page |
| `PATCH /api/courses/:id` | Updates a course | Admin Courses page |
| `PATCH /api/courses/:id/unpublish` | Changes a published course to draft | Admin Courses page |
| `PATCH /api/courses/:id/archived` | Archives a course | Admin Courses page |
| `GET /api/enrollments/me` | Returns only the signed-in Learner's enrollments | Learner My courses |

Login sends JSON with `email` and `password`. Its user object contains `id`, `name`, `email`, and `role`. The role comes from the server, never from a role picker. Protected requests use `Authorization: Bearer <token>`.

`GET /api/enrollments/me` returns `data.enrollments`. Each item has `_id`, enrollment `status`, and a populated `course` with `title`, `description`, and course `status`. It uses the JWT identity; the frontend does not send a learner ID. If a course was deleted, its populated value can be null and the card says it is unavailable.

Backend errors use `{"success":false,"message":"..."}`. A missing or expired token gives 401. A forbidden role gives 403. Wrong login credentials currently give 400. A protected-request 401 clears the React session. A 403 shows "Access denied" and keeps the session.

## What each screen does

- **Login:** controlled email and password fields. The token and user stay only in React memory. Refresh or logout clears them.
- **Admin Home:** simple navigation to Users and Courses.
- **Admin Users:** creates a learner through the real registration route. Duplicate email shows 409. The backend has **no route** to list, edit, activate, or suspend users, so this screen does not invent user data or filters. Registration itself is public on the backend.
- **Admin Courses:** loads real courses on a button click, filters by category and status, selects a course, creates or edits it, and confirms archive/unpublish actions. New courses start as drafts. The list returns trainer IDs rather than trainer names.
- **Learner My courses:** loads real enrollments on a button click. It shows loading, empty, error, and course-card states. No other learner's ID is selectable.

The PDF's example enrollment path differs from this backend. The real path is `/api/enrollments/me`. The backend also accepts suspended users at login, but protected requests reject them; this frontend does not change that backend behavior.

## Component map

```text
App (session and message)
|- LoginForm
|- AppShell (profile button and logout)
|  |- ProtectedView
|     |- AdminDashboard
|     |  |- UserManagement -> UserForm
|     |  |- CourseManagement -> CourseList -> CourseCard
|     |  |                    -> CourseForm
|     |- LearnerDashboard -> EnrollmentCard
```

Props pass data down to child components. Callbacks pass clicks and form submissions back to a parent. `useState` remembers the session, form values, filters, and loaded data. `.map()` draws a card for each item with a stable `_id` key. `.filter()` calculates visible courses without copying filtered data into another state variable.

## Layout sketches

```text
Desktop: [EduLearn header / profile / logout]
         [Admin menu] [Welcome or Users or Course list + details]
         [Learner welcome] [My course cards in two columns]

Mobile:  [EduLearn header]
         [Profile / logout]
         [Menu or welcome]
         [Cards and forms stacked in one column]
```

## Checks already executed

The API checks below used temporary accounts, a temporary course, and a temporary enrollment in local Docker MongoDB. Those records were removed after testing. No real password or token was saved in this repository.

- Admin and Learner login returned 200 with the correct server role.
- Learner registration returned 201; duplicate registration returned 409.
- Admin course create returned 201; edit, unpublish, and archive returned 200.
- A course request with invalid data returned 400.
- A missing token on a protected route returned 401.
- A Learner request to an Admin course route returned 403.
- For Day 5, Learner A received one enrollment with the populated course title; Learner B received an empty list. Admin access to `/api/enrollments/me` returned 403.
- `npm run build` and `npm run lint` passed after Day 5.

## Manual browser checklist

- [ ] Sign in as Admin; check Home, Users, and Courses.
- [ ] Sign in as Learner; check that Admin pages are hidden.
- [ ] Click Load my courses with no enrollments; see the empty message.
- [ ] With an enrolled Learner, click Load my courses; see real course details.
- [ ] Try wrong login details; see an error and no private view.
- [ ] Click Check profile and Log out; refresh after login to see memory-only session behavior.
- [ ] Use Tab to reach inputs, buttons, and course cards; check the visible focus outline.
- [ ] View at a narrow mobile width; check that nothing scrolls sideways.
- [ ] Capture a browser screenshot and a direct 403 response for the school presentation.

Browser automation was unavailable during implementation, so the visual and keyboard checks above are still for a human to complete. The missing user-management routes also prevent the full Day 3 user-list acceptance checks.
