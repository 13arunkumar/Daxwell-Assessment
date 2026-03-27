# Role Permissions & Task Assignment

Complete reference for role-based access control and task assignment rules in ProSync.

---

## 👥 User Roles

ProSync has three primary roles:
1. **Admin** - System oversight and management
2. **Project Manager (PM)** - Project execution and coordination  
3. **Client** - Project review and approval

---

## 🔱 Admin Role

### Purpose
Strategic oversight and system management

### Permissions

**✅ Can Do**:
- View all projects (regardless of assignment)
- Create and manage all projects
- Assign any PM to any project
- View and manage all users
- Create milestones and tasks in any project
- Access system settings
- Generate system-wide reports
- Delete projects
- Deactivate users

**❌ Cannot Do**:
- **Cannot be assigned to tasks** (Admins manage, not execute)
- Cannot approve milestones (Client responsibility)

### Why Admins Can't Be Assigned Tasks

Admins focus on **strategic oversight**, not **tactical execution**:
- Monitor system-wide performance
- Manage users and permissions
- Resolve escalations
- Ensure project success across organization

---

## 👨‍💼 Project Manager (PM) Role

### Purpose
Project planning and execution

### Permissions

**✅ Can Do**:
- View assigned projects only
- Create projects (auto-assigned as PM)
- Create milestones in assigned projects
- Create and manage tasks
- **Can be assigned tasks** (PMs execute work)
- Assign tasks to team members and clients
- Upload deliverables
- Update project/milestone/task status
- Comment on tasks and milestones
- View project notifications

**❌ Cannot Do**:
- View projects not assigned to them
- Delete projects
- Manage users
- Access system settings
- Approve milestones (Client responsibility)

### Why PMs Can Be Assigned Tasks

PMs often **wear multiple hats**:
- Plan the project (management)
- Execute technical work (design, code, etc.)
- This is common in agencies and small teams

---

## 👤 Client Role

### Purpose
Project review and approval

### Permissions

**✅ Can Do**:
- View assigned projects only
- **Approve or reject milestones** (KEY FEATURE!)
- **Can be assigned tasks** (for providing assets, feedback)
- Comment on tasks and milestones
- View project progress
- View and manage notifications
- Update own profile

**❌ Cannot Do**:
- Create projects
- Create milestones
- Create tasks
- Assign tasks to others
- View other clients' projects
- Delete anything
- Access system settings

### Why Clients Can Be Assigned Tasks

Clients need to **participate actively**:
- Provide brand assets (logos, colors, content)
- Review and approve designs
- Test functionality
- Give feedback

**Example Client Tasks**:
- "Provide company logo (SVG format)"
- "Review homepage design and provide feedback"
- "Test mobile app and report any issues"

---

## 📋 Task Assignment Matrix

| Role | Can Be Assigned? | Typical Use Case | Validation |
|------|-----------------|------------------|------------|
| **Admin** | ❌ **NO** | N/A - Admins manage, not execute | Frontend: Hidden from dropdown<br>Backend: API blocks assignment |
| **Project Manager** | ✅ **YES** | Design, development, coordination | ✅ Available in dropdown |
| **Client** | ✅ **YES** | Provide assets, approve, test | ✅ Available in dropdown |
| **Team Members** | ✅ **YES** | Primary task execution | ✅ Available in dropdown |

---

## 🔒 Implementation Details

### Frontend Validation
**File**: `frontend/src/components/tasks/CreateTaskDialog.tsx`

```typescript
// Filter out admin users
const assignableUsers = usersRes.data.data.users.filter(
  (user: any) => user.role !== 'admin'
);
```

### Backend Validation
**File**: `backend/src/controllers/task.controller.js`

```javascript
// In createTask and updateTask
if (req.body.assignedTo) {
  const assignedUser = await User.findById(req.body.assignedTo);
  if (assignedUser && assignedUser.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Tasks cannot be assigned to admin users. Admins manage projects, they do not execute tasks.',
    });
  }
}
```

---

## 🎯 Typical Scenarios

### Scenario 1: Development Task
```
Title: "Build login page"
Assigned To: PM (developer) ✅
Rationale: PM executes technical work
```

### Scenario 2: Client Feedback Task
```
Title: "Review homepage design"
Assigned To: Client ✅
Rationale: Client needs to provide feedback
```

### Scenario 3: Asset Collection
```
Title: "Provide company logo and brand colors"
Assigned To: Client ✅
Rationale: Client provides brand assets
```

### Scenario 4: System Oversight
```
Title: "Monitor project completion"
Assigned To: Admin ❌ BLOCKED
Rationale: Use dashboard for monitoring, not tasks
```

---

## 📊 Permission Comparison Table

| Feature | Admin | PM | Client |
|---------|-------|-------|--------|
| **Projects** |
| View all projects | ✅ | ❌ | ❌ |
| View assigned projects | ✅ | ✅ | ✅ |
| Create project | ✅ | ✅ | ❌ |
| Update project | ✅ | ✅ (own) | ❌ |
| Delete project | ✅ | ❌ | ❌ |
| **Milestones** |
| Create milestone | ✅ | ✅ (own projects) | ❌ |
| Update milestone | ✅ | ✅ (own projects) | ❌ |
| Approve milestone | ❌ | ❌ | ✅ |
| Reject milestone | ❌ | ❌ | ✅ |
| **Tasks** |
| Create task | ✅ | ✅ (own projects) | ❌ |
| Update task | ✅ | ✅ (own projects) | ✅ (assigned) |
| Delete task | ✅ | ✅ (own projects) | ❌ |
| Be assigned task | ❌ | ✅ | ✅ |
| **Users** |
| View all users | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Update own profile | ✅ | ✅ | ✅ |
| **System** |
| Access settings | ✅ | ❌ | ❌ |
| Generate reports | ✅ | ✅ (own) | ❌ |
| System configuration | ✅ | ❌ | ❌ |

---

## 🧪 Testing Task Assignment

### Test 1: Create Task as PM
1. Login as PM
2. Open any project
3. Click "Add Task"
4. Check assignment dropdown
5. **Expected**: Only PMs and Clients visible, no Admin

### Test 2: Try Assigning to Admin (API)
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Task",
    "projectId": "xxx",
    "assignedTo": "<admin-id>"
  }'
```
**Expected**: 400 error with message about admins

### Test 3: Update Existing Task
1. Edit any task
2. Try changing assignment to Admin
3. **Expected**: Blocked with error message

---

## 💡 Design Philosophy

### Separation of Concerns

**Strategic Layer (Admin)**:
- System-wide oversight
- User management
- High-level monitoring
- Tools: Dashboard, analytics

**Tactical Layer (PM)**:
- Project execution
- Team coordination  
- Delivering work
- Tools: Projects, tasks, milestones

**Review Layer (Client)**:
- Approve/reject work
- Provide feedback
- Monitor progress
- Tools: Project view, approval buttons

### Benefits

✅ **Clear responsibilities** - No role confusion  
✅ **Scalability** - Admins focus on management  
✅ **Proper delegation** - Work flows correctly  
✅ **Better oversight** - Admins not buried in tasks

---

## 🔍 API Endpoint Permissions

### Authentication Endpoints
- `/auth/register` - Public
- `/auth/login` - Public
- `/auth/logout` - Authenticated
- `/auth/me` - Authenticated
- `/auth/profile` - Authenticated

### Project Endpoints
- `GET /projects` - All roles (filtered by access)
- `POST /projects` - Admin, PM
- `PUT /projects/:id` - Admin, PM (owner)
- `DELETE /projects/:id` - Admin only

### Milestone Endpoints
- `POST /milestones` - Admin, PM
- `PUT /milestones/:id` - Admin, PM
- `POST /milestones/:id/approve` - Client only
- `POST /milestones/:id/reject` - Client only

### Task Endpoints
- `POST /tasks` - Admin, PM
- `PUT /tasks/:id` - Admin, PM
- `DELETE /tasks/:id` - Admin, PM
- Task assignment validation applies to all

### User Endpoints
- `GET /users` - Admin, PM
- `GET /users/:id` - Authenticated
- `PUT /users/:id` - Admin only

---

## 📚 Related Documentation

- [Project Lifecycle](project-lifecycle.md)
- [Approval Workflow](approval-workflow.md)
- [Admin Guide](../user-guides/admin-guide.md)
- [PM Guide](../user-guides/project-manager-guide.md)
- [Client Guide](../user-guides/client-guide.md)

---

**Remember**: Proper role separation ensures ProSync scales effectively and each user can focus on their core responsibilities! 🚀
