# Quick Start Guide

Get up and running with ProSync in just 5 minutes! This guide assumes you've completed the [Installation](installation.md).

---

## ⚡ 5-Minute Quick Start

### Step 1: Start the Services (1 minute)

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend (new terminal)
cd frontend
npm run dev
```

Wait for:
- Backend: "Server running on port 8080"
- Frontend: "Ready on http://localhost:3000"

### Step 2: Seed Sample Data (30 seconds)

```bash
# Terminal 3: Seed database (new terminal)
cd backend
npm run seed
```

This creates three users:
- **Admin**: admin@prosync.com / Admin123
- **PM**: pm@prosync.com / Manager123
- **Client**: client@prosync.com / Client123

### Step 3: Login as Project Manager (30 seconds)

1. Open browser: `http://localhost:3000`
2. Click **"Login"**
3. Enter:
   - Email: `pm@prosync.com`
   - Password: `Manager123`
4. Click **"Sign In"**

✅ You're now in the dashboard!

### Step 4: Create Your First Project (2 minutes)

1. Click **"Projects"** in the sidebar
2. Click **"New Project"** button
3. Fill in the form:
   - **Title**: "ABC Website Redesign"
   - **Description**: "Complete redesign of ABC Corp website"
   - **Client**: Select "Sarah Johnson"
   - **Project Manager**: Already selected (you!)
   - **Target Launch Date**: Pick a date 30 days from now
   - **Status**: Active
4. Click **"Create Project"**

✅ Your first project is created!

### Step 5: Add a Milestone (1 minute)

1. Click on your newly created project
2. Click **"Add Milestone"** button
3. Fill in:
   - **Title**: "Discovery & Wireframes"
   - **Description**: "Initial research and wireframe creation"
   - **Due Date**: 7 days from now
   - **Order**: 1
4. Click **"Create Milestone"**

✅ Milestone created!

### Step 6: Test Client Approval Workflow (1 minute)

1. **Logout** (click your avatar → Logout)
2. **Login as Client**:
   - Email: `client@prosync.com`
   - Password: `Client123`
3. Click on the project "ABC Website Redesign"
4. You'll see the milestone
5. Update milestone status to "Review" (as PM) and client can approve

✅ You've completed the basic workflow!

---

## 🎯 What You Just Did

You successfully:

1. ✅ Started ProSync backend and frontend
2. ✅ Created sample user accounts
3. ✅ Logged in as a Project Manager
4. ✅ Created a project with a client
5. ✅ Added a milestone to track progress
6. ✅ Experienced the client view

---

## 📚 Explore More Features

### As Project Manager

#### Create Tasks
1. Go to your project
2. Click **"Add Task"** button
3. Fill in:
   - Title: "Create homepage wireframe"
   - Priority: High
   - Assign to yourself
   - Link to milestone
4. Save

#### Manage Task Status
1. Go to **Tasks** page
2. Filter by your assigned tasks
3. Update status: Backlog → In Progress → Review → Done

#### Add Comments
1. Open any task
2. Scroll to comments section
3. Write an update
4. Submit

### As Client

#### Approve a Milestone
1. Login as client
2. View assigned project
3. When milestone is in "Review" status:
   - Click **"Approve"** button
   - Milestone status updates
   - Project progress increases

#### Request Changes
1. View milestone in "Review"
2. Click **"Request Changes"**
3. Enter feedback: "Please update colors"
4. Submit
5. PM receives notification

### As Admin

#### View All Projects
1. Login as admin (admin@prosync.com / Admin123)
2. See all projects in the system
3. Access any project
4. View all users

#### Manage Users
1. Go to settings or user management
2. View all system users
3. See user roles and status

---

## 🎓 Understanding the Workflow

### Complete Project Lifecycle

```
1. PM Creates Project
   ↓
2. PM Adds Milestones (broken into phases)
   ↓
3. PM Creates Tasks (within each milestone)
   ↓
4. Team Works on Tasks
   ↓
5. Tasks Completed → Milestone Ready for Review
   ↓
6. PM Updates Milestone Status to "Review"
   ↓
7. Client Reviews Milestone
   ↓
8. Client Approves ✅ or Requests Changes ❌
   ↓
9. If Approved: Progress Updates, Next Milestone Starts
   If Rejected: PM Makes Revisions, Resubmits
   ↓
10. Repeat for All Milestones
    ↓
11. Final Approval → Project Complete! 🎉
```

---

## 💡 Pro Tips

### For Project Managers

1. **Break Down Work**: Create 3-5 milestones per project
2. **Set Realistic Dates**: Give buffer time for reviews
3. **Communicate**: Use comments liberally
4. **Update Status**: Keep task status current

### For Clients

1. **Review Promptly**: Check milestones in "Review" status
2. **Be Specific**: When requesting changes, explain clearly
3. **Ask Questions**: Use comments to clarify
4. **Trust the Process**: Each milestone approval = progress

### For Admins

1. **Monitor Progress**: Check dashboard regularly
2. **Assign Wisely**: Match PMs to appropriate projects
3. **Support Team**: Help remove blockers
4. **Review Metrics**: Track completion rates

---

## 🧪 Try These Scenarios

### Scenario 1: Complete Task Flow

1. **As PM**: Create task "Design logo"
2. **As PM**: Assign to yourself
3. **As PM**: Move status: Backlog → In Progress
4. **As PM**: Add comment: "Started work"
5. **As PM**: Move status: In Progress → Review
6. **As PM**: Add comment: "Ready for review"
7. **As PM**: Move status: Review → Done

### Scenario 2: Client Rejection & Revision

1. **As PM**: Set milestone to "Review"
2. **As Client**: Click "Request Changes"
3. **As Client**: Enter: "Please adjust color scheme"
4. **As PM**: Check notifications
5. **As PM**: View rejection feedback
6. **As PM**: Make changes
7. **As PM**: Update milestone description
8. **As PM**: Set back to "Review"
9. **As Client**: Review again and approve

### Scenario 3: Multi-Project Management

1. **As Admin**: Create 2-3 different projects
2. **As Admin**: Assign different PMs
3. **As PM**: See only assigned projects
4. **As Client**: See only their project
5. **As Admin**: See all projects

---

## 📊 Understanding the Dashboard

### Project Manager Dashboard
- **Active Projects**: Projects you're managing
- **Tasks**: Your assigned tasks
- **Notifications**: Important updates
- **Recent Activity**: What's happening

### Client Dashboard
- **My Projects**: Projects you're involved in
- **Pending Approvals**: Milestones awaiting review
- **Recent Updates**: Latest activity
- **Notifications**: Project updates

### Admin Dashboard
- **All Projects**: System-wide project list
- **User Stats**: Active users, roles
- **System Health**: Performance metrics
- **Recent Activity**: All system activity

---

## 🎯 Next Steps

Now that you're familiar with the basics:

1. 📖 Read your role-specific guide:
   - [Admin Guide](../user-guides/admin-guide.md)
   - [Project Manager Guide](../user-guides/project-manager-guide.md)
   - [Client Guide](../user-guides/client-guide.md)

2. 🔌 Explore the [API Documentation](../api/)

3. 📋 Understand [Workflows](../workflows/project-lifecycle.md)

4. 🚀 Deploy to production: [Deployment Guide](../deployment/production-deployment.md)

---

## ❓ Common Questions

### Can I register new users?

Yes! Click "Register" on the login page. First user becomes admin automatically.

### How do I reset my password?

Password reset feature is coming soon. For now, admins can update user passwords directly.

### Can I delete projects?

Admins can delete projects. PMs cannot delete projects they're managing.

### How many projects can I create?

Unlimited! The system scales to handle many projects.

### Can clients see other clients' projects?

No. Clients only see projects they're assigned to.

---

## 📞 Need Help?

- 📖 Full documentation: [docs/README.md](../README.md)
- 🐛 Found a bug? Open an issue
- 💬 Questions? support@prosync.com

---

**You're ready to use ProSync!** 🚀
