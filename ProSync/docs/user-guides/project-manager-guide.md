# Project Manager User Guide

Complete guide for Project Managers using ProSync to create, manage, and deliver successful client projects.

---

## 👨‍💼 Project Manager Role Overview

As a **Project Manager (PM)**, you're the orchestrator of client success. Your responsibilities include:

- 🎯 Creating and planning projects
- 📋 Breaking work into milestones and tasks
- 👥 Assigning and tracking team work
- 📤 Delivering work for client approval
- 💬 Communicating progress and updates
- ✅ Ensuring on-time, quality delivery

**Key Capability**: Unlike admins, PMs can **be assigned tasks** and execute work while also managing.

---

## 🚀 Getting Started

### Logging In

1. Navigate to your ProSync instance
2. Enter your credentials:
   - **Email**: `pm@prosync.com` (demo)
   - **Password**: `Manager123` (demo)
3. Click **"Sign In"**

### Your Dashboard

After logging in, you'll see:

**Your Projects**
- Projects you're managing
- Quick status overview
- Progress indicators

**Your Tasks**
- Tasks assigned to you
- Due dates and priorities
- Status tracking

**Notifications**
- Client approvals/rejections
- Team updates
- System alerts

**Recent Activity**
- Latest project updates
- Comments and mentions
- Milestone completions

---

## 📊 Creating Your First Project

### Step-by-Step: New Project

1. Click **"Projects"** in sidebar
2. Click **"New Project"** button
3. Fill in project details:

**Basic Information**:
```
Title: "ABC Corp Website Redesign"
Description: "Complete redesign of corporate website with modern UI/UX"
```

**Team Assignment**:
```
Client: Select from dropdown (e.g., "Sarah Johnson")
Project Manager: Auto-selected (you!)
```

**Timeline**:
```
Target Launch Date: Pick date 30-60 days out
Status: Active
```

**Optional**:
```
Budget: Enter project budget
Tags: Add tags for categorization
```

4. Click **"Create Project"**

✅ **Result**: Project created, client notified!

---

## 🎯 Planning: Milestones

### What Are Milestones?

Milestones are **major phases** of your project that clients approve. They represent **deliverable checkpoints**.

**Example Milestones**:
1. Discovery & Wireframes
2. Design Mockups
3. Development
4. Testing & Launch

### Creating Milestones

1. Open your project
2. Click **"Add Milestone"** button
3. Fill in details:

```
Title: "Discovery & Wireframes"
Description: "User research, competitor analysis, and initial wireframes"
Due Date: 7 days from now
Order: 1
Status: Pending
```

4. Click **"Create Milestone"**

### Milestone Workflow

```
Pending → In Progress → Review → Client Approved ✅
                               → Rejected ❌ → (revise) → Review
```

**Your Actions**:
- `Pending`: Created, not started yet
- `In Progress`: Actively working on it
- `Review`: Ready for client review
- `Client Approved`: Client accepted (milestone done!)
- `Rejected`: Client wants changes (see feedback)

---

## 📋 Task Management

### Creating Tasks

Tasks are the **individual work items** that make up milestones.

1. Open project
2. Click **"Add Task"** button
3. Fill in details:

```
Title: "Conduct client interview"
Description: "30-minute discovery call to gather requirements"
Status: Backlog
Priority: High
Assigned To: Select team member (or yourself)
Milestone: "Discovery & Wireframes"
Due Date: 2 days from now
Estimated Hours: 2
```

4. Click **"Create Task"**

### Task Assignment Rules

✅ **Can Assign To**:
- Project Managers (including yourself)
- Clients (for feedback/assets)
- Team members

❌ **Cannot Assign To**:
- Admin users (they manage, not execute)

### Task Statuses

Move tasks through these statuses:

1. **Backlog**: Not started
2. **In Progress**: Currently working
3. **Review**: Ready for PM review
4. **Done**: Completed

### Managing Your Tasks

**View Your Tasks**:
1. Click **"Tasks"** in sidebar
2. Filter by:
   - Assigned to me
   - Status
   - Priority
   - Due date

**Update Task Status**:
1. Open task
2. Change status dropdown
3. Add comment with update
4. Save

**Example Updates**:
```
Status: Backlog → In Progress
Comment: "Started working on this. Gathering requirements."

Status: In Progress → Review
Comment: "Wireframes complete. Ready for review."

Status: Review → Done
Comment: "Approved! Moving to next task."
```

---

## 💬 Communication

### Adding Comments

1. Open project, milestone, or task
2. Scroll to **Comments** section
3. Write your update:
   ```
   "Just completed the homepage design. 
   Client meeting scheduled for Friday to review."
   ```
4. Click **"Post Comment"**

**Best Practices**:
- Comment when starting work
- Comment when blocked
- Comment when completing
- @ mention team members if needed

### Responding to Client Feedback

When client rejects a milestone:

1. Check **Notifications** for rejection
2. Open the milestone
3. Read rejection reason:
   ```
   "The color scheme doesn't match our brand guidelines. 
   Please use our brand colors from the style guide."
   ```
4. Make necessary changes
5. Update milestone description
6. Add comment:
   ```
   "Updated colors to match brand guidelines per feedback.
   Ready for re-review."
   ```
7. Set milestone status back to **"Review"**

---

## 📤 Submitting Work for Approval

### Milestone Approval Workflow

1. **Complete All Tasks**:
   - Ensure all tasks in milestone are "Done"
   - Review work quality

2. **Prepare Deliverables**:
   - Upload files (if file upload enabled)
   - Document what was completed
   - Add preview links if applicable

3. **Update Milestone**:
   - Change status to **"Review"**
   - Add comment:
     ```
     "All wireframes complete and ready for client review.
     12 screens included covering all main user flows."
     ```

4. **Notify Client**:
   - Client automatically gets notification
   - They can now approve or request changes

5. **Wait for Approval**:
   - Monitor notifications
   - Respond to questions
   - Make revisions if needed

---

## 📊 Tracking Progress

### Project Progress

ProSync automatically calculates:
```
Progress = (Approved Milestones / Total Milestones) × 100%
```

**Example**:
- 4 total milestones
- 2 approved
- Progress: 50%

### Monitor Your Projects

**Project Dashboard**:
1. View all your projects
2. Check progress bars
3. Identify:
   - ✅ On track (green)
   - ⚠️ At risk (yellow)
   - 🚨 Delayed (red)

**Key Metrics**:
- Days until due date
- Tasks completed vs total
- Client approval status
- Team velocity

---

## 🎯 Best Practices for PMs

### Planning Phase

- [ ] Break project into 3-5 clear milestones
- [ ] Each milestone = 1-2 weeks of work
- [ ] Set realistic due dates (add buffer!)
- [ ] Get client buy-in on milestone plan

### Execution Phase

- [ ] Update task status daily
- [ ] Comment on progress regularly
- [ ] Flag blockers immediately
- [ ] Keep client informed

### Review Phase

- [ ] Double-check all deliverables
- [ ] Test everything works
- [ ] Write clear submission notes
- [ ] Be responsive to questions

### Client Management

- [ ] Set clear expectations upfront
- [ ] Communicate proactively
- [ ] Respond to rejections quickly
- [ ] Document all decisions

---

## 🚨 Handling Common Scenarios

### Scenario 1: Client Rejects Milestone

**Don't Panic!** This is normal.

**Steps**:
1. Read rejection feedback carefully
2. Ask clarifying questions if needed
3. Make requested changes
4. Document what you changed
5. Resubmit for review
6. Follow up

### Scenario 2: Task Blocked

**Example**: "Can't proceed without client logo"

**Steps**:
1. Create task for client:
   ```
   Title: "Provide company logo"
   Assigned To: Client
   Priority: High
   Due Date: ASAP
   ```
2. Add comment explaining blocker
3. Work on other tasks meanwhile
4. Follow up with client

### Scenario 3: Running Behind Schedule

**Steps**:
1. Identify the delay cause
2. Adjust timeline if needed
3. Communicate with client:
   ```
   "We've encountered some technical challenges with the integration.
   I've adjusted the timeline by 3 days to ensure quality delivery.
   New target date: [DATE]"
   ```
4. Update project dates
5. Add buffer to remaining work

### Scenario 4: Scope Creep

Client keeps adding requirements.

**Steps**:
1. Document new requests
2. Assess impact:
   - Time required
   - Resource needs
   - Timeline impact
3. Create change request
4. Get client approval for:
   - Additional time
   - Additional budget (if applicable)
5. Update project plan

---

## 📋 Task Management Strategies

### Priority Matrix

**Urgent + Important** → Do First
- Client blockers
- Launch-critical tasks
- Due today/tomorrow

**Important, Not Urgent** → Schedule
- Planning tasks
- Quality improvements
- Documentation

**Urgent, Not Important** → Delegate
- Minor fixes
- Administrative tasks
- Client asset collection

**Neither** → Defer or Delete
- Nice-to-haves
- Future enhancements

### Daily Workflow

**Morning** (15 minutes):
- [ ] Check notifications
- [ ] Review task list
- [ ] Prioritize today's work
- [ ] Respond to urgent items

**During Day**:
- [ ] Update task status as you work
- [ ] Add comments on progress
- [ ] Flag any blockers
- [ ] Communicate with team

**End of Day** (10 minutes):
- [ ] Complete status updates
- [ ] Plan tomorrow's priorities
- [ ] Send any necessary updates
- [ ] Clear notifications

---

## 📊 Reporting to Stakeholders

### Weekly Status Update

Send to clients every Friday:

```
Subject: Weekly Update - [Project Name]

Hi [Client Name],

Here's this week's progress:

✅ COMPLETED:
- Milestone 1: Discovery (Approved!)
- 12 wireframes created
- User flow documented

🚧 IN PROGRESS:
- Milestone 2: Design Mockups (50% complete)
- Homepage design
- Mobile responsive layouts

📅 NEXT WEEK:
- Complete all design mockups
- Submit Milestone 2 for your review
- Expected review date: [DATE]

🚨 BLOCKERS:
- Still need brand color codes from your team
- Task assigned - due Monday

Overall Progress: 45%
Timeline: On track

Questions? Let me know!

Best,
[Your Name]
```

---

## 🎯 Success Metrics

Track your PM performance:

**Project Metrics**:
- On-time delivery: >85%
- First-time approval rate: >70%
- Client satisfaction: >4.5/5

**Personal Metrics**:
- Tasks completed per week: Track and improve
- Average milestone approval time: <3 days
- Communication response time: <2 hours

---

## 🔧 Tips & Tricks

### Keyboard Shortcuts (if available)
- `N` - New task
- `M` - New milestone
- `/` - Search
- `G + P` - Go to projects
- `G + T` - Go to tasks

### Quick Actions
- Hover over task → Quick status update
- Right-click project → Quick actions menu
- Star important projects for easy access

### Templates
- Save milestone templates for common project types
- Reuse task lists for similar work
- Document your processes for efficiency

---

## 📚 Additional Resources

- [Complete Workflow Guide](../workflows/project-lifecycle.md)
- [API Documentation](../api/) (for integrations)
- [Client Guide](client-guide.md) (understand client perspective)

---

## 📞 Getting Help

**Technical Issues**:
- Check documentation first
- Contact admin
- Email: support@prosync.com

**Project Questions**:
- Discuss with admin
- Consult client directly
- Review project history

---

## ✅ PM Quick Checklist

### New Project Setup
- [ ] Create project with clear title/description
- [ ] Assign client
- [ ] Create 3-5 milestones
- [ ] Break first milestone into tasks
- [ ] Assign tasks to team
- [ ] Set realistic deadlines
- [ ] Kick off with client

### During Project
- [ ] Daily status updates
- [ ] Weekly client communication
- [ ] Prompt milestone submissions
- [ ] Quick revision turnaround
- [ ] Document all decisions

### Project Completion
- [ ] All milestones approved
- [ ] Final deliverables sent
- [ ] Client sign-off received
- [ ] Project marked complete
- [ ] Retrospective documented

---

**You've got this!** 🚀 As a PM, you're the bridge between vision and delivery. Use ProSync to stay organized, keep clients happy, and deliver amazing work!
