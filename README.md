# Dynamic Workflow Management System for Payload CMS

A comprehensive workflow management system built on Payload CMS that allows users to create, assign, and track multi-stage approval workflows for any collection dynamically via the Admin UI.

## 🎯 Features

### ✅ Core Workflow Engine
- **Dynamic Workflow Creation**: Create workflows with unlimited steps
- **Flexible Assignments**: Assign steps to specific users, roles, or departments
- **Conditional Logic**: Set conditions for workflow triggers and step execution
- **Multiple Step Types**: Support for approval, review, sign-off, and comment-only steps
- **Automatic Triggering**: Workflows start automatically on document save/update

### ✅ Admin UI Integration
- **Workflow Status Display**: Real-time workflow progress in document edit views
- **Inline Actions**: Approve, reject, or comment directly from the admin interface
- **Audit Trail**: Complete history of all workflow activities
- **Role-based Access**: Secure access control based on user roles

### ✅ Advanced Features
- **SLA Management**: Set time limits for steps with auto-escalation
- **Conditional Branching**: Dynamic workflow paths based on document properties
- **Email Notifications**: Automated notifications for workflow events
- **REST APIs**: Custom endpoints for workflow management

## 🏗️ Architecture

### File Structure
```
src/
├── collections/           # Payload CMS collections
│   ├── Users.ts          # User management with roles
│   ├── Blogs.ts          # Blog posts with workflow integration
│   ├── Contracts.ts      # Legal contracts with workflow integration
│   ├── Workflows.ts      # Workflow definitions
│   └── WorkflowLogs.ts   # Immutable audit trail
├── plugins/
│   └── workflow-plugin.ts # Core workflow engine
├── admin/
│   └── components/       # Custom admin UI components
│       └── WorkflowStatus.tsx
├── index.ts             # Main application entry point
├── payload.config.ts    # Payload CMS configuration
└── seed.ts             # Database seeding
```

### Core Components

#### 1. Workflow Engine (`workflow-plugin.ts`)
- **WorkflowEngine Class**: Main orchestrator for workflow logic
- **Step Management**: Handles step transitions and assignments
- **Condition Evaluation**: Evaluates workflow and step conditions
- **Status Tracking**: Maintains real-time workflow status

#### 2. Collections
- **Workflows**: Stores workflow definitions with steps, conditions, and settings
- **WorkflowLogs**: Immutable audit trail of all workflow activities
- **Users**: Role-based user management
- **Blogs/Contracts**: Example collections with workflow integration

#### 3. Admin Components
- **WorkflowStatus**: React component for displaying workflow progress
- **Custom Fields**: Workflow assignment and status tracking fields

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd workflow-cms

# Install dependencies
npm install

# Copy environment file
cp env.example .env
```

### 2. Environment Configuration

Edit `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/workflow-cms

# Payload Configuration
PAYLOAD_SECRET=your-super-secret-payload-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# The application will be available at:
# - Main app: http://localhost:3000
# - Admin panel: http://localhost:3000/admin
```

### 5. Seed Database

```bash
# Seed with sample data
npm run seed

# Or use the API endpoint
curl -X POST http://localhost:3000/api/seed
```

## 📋 Demo Credentials

After seeding the database, you can log in with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@weframetech.com | (set during first login) |
| Manager | manager@weframetech.com | (set during first login) |
| Reviewer | reviewer@weframetech.com | (set during first login) |
| Editor | editor@weframetech.com | (set during first login) |

## 🔧 API Endpoints

### Workflow Management
```bash
# Trigger workflow on a document
POST /api/workflows/trigger
{
  "documentId": "doc-id",
  "collectionSlug": "blogs"
}

# Get workflow status
GET /api/workflows/status/:docId?collection=blogs

# Process workflow action
POST /api/workflows/action
{
  "documentId": "doc-id",
  "collectionSlug": "blogs",
  "stepIndex": 0,
  "action": "approve",
  "comment": "Optional comment"
}
```

### Development
```bash
# Seed database
POST /api/seed
```

## 📖 Sample Workflows

### 1. Blog Publication Workflow
- **Step 1**: Content Review (Reviewer role)
- **Step 2**: Manager Approval (Manager role)
- **Auto-start**: When blog is created with workflow assigned

### 2. Contract Approval Workflow
- **Trigger**: Contracts with amount > $10,000
- **Step 1**: Legal Review (Reviewer role)
- **Step 2**: Executive Approval (Manager role)
- **Conditions**: Only applies to high-value contracts

## 🎥 Demo Walkthrough

### Creating a Workflow
1. Navigate to Admin Panel → Workflows
2. Click "Create New"
3. Configure workflow settings:
   - Name and description
   - Target collections
   - Step definitions
   - Assignee rules
   - Conditions and actions

### Testing Workflow
1. Create a new blog post or contract
2. Assign a workflow to the document
3. Save the document (triggers workflow)
4. View workflow status in the document edit view
5. Process approvals/rejections as assigned users

## 🚀 Deployment

### Vercel Deployment

1. **Prepare for Deployment**
```bash
# Build the application
npm run build
```

2. **Environment Variables**
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`

3. **Deploy**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The application can be deployed to any Node.js hosting platform:
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

## 🔒 Security Features

- **Role-based Access Control**: Users can only access workflows they're assigned to
- **Immutable Audit Trail**: Workflow logs cannot be modified or deleted
- **Condition Validation**: All workflow conditions are validated before execution
- **Input Sanitization**: All user inputs are sanitized and validated

## 🛠️ Customization

### Adding New Collections
1. Create collection in `src/collections/`
2. Add workflow fields:
   ```typescript
   {
     name: 'workflow',
     type: 'relationship',
     relationTo: 'workflows',
   },
   {
     name: 'workflowStatus',
     type: 'group',
     fields: [
       { name: 'currentStep', type: 'number' },
       { name: 'isActive', type: 'checkbox' },
       { name: 'lastUpdated', type: 'date' },
     ],
   }
   ```
3. Add collection to workflow plugin configuration

### Custom Step Types
1. Extend the `WorkflowStep` interface
2. Add step type to the workflow plugin
3. Implement step-specific logic in the workflow engine

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure network access if using cloud MongoDB

2. **Workflow Not Triggering**
   - Check if workflow is active
   - Verify collection assignment
   - Check workflow conditions

3. **Admin Panel Not Loading**
   - Clear browser cache
   - Check console for errors
   - Verify PAYLOAD_SECRET is set

### Debug Mode
```bash
# Enable debug logging
DEBUG=payload:* npm run dev
```

## 📝 License

This project is created for the WeFrameTech Backend Hiring Task.

## 🤝 Contributing

This is a demonstration project for the WeFrameTech hiring process. For questions or issues, please contact the development team.

---

**Built with ❤️ for WeFrameTech Backend Hiring Task**

# WeframeTech Backend Hiring Task – Advanced Payload CMS Challenge

## Loom Video Script & Checklist

### 1. Introduction (with your face visible)
Hi, my name is [Your Name]. I'm a backend developer, and this is my submission for the WeframeTech advanced Payload CMS workflow challenge. I'll walk you through my approach, the architecture, a live demo, and some of the technical challenges I faced.

### 2. Architecture Explanation (show your code structure)
- `src/collections`: Main collections (`Blogs`, `Contracts`, `Users`, `Workflows`, `WorkflowLogs`, `Media`).
- `src/plugins/workflow-plugin.ts`: Core workflow logic, dynamic and reusable for any collection.
- `src/admin/components/WorkflowStatus.tsx`: Custom admin UI for workflow status and actions.
- `src/index.ts`: Main server and custom API endpoints.
- `src/payload.config.ts`: Registers collections and plugins.

### 3. Live Demo (create a workflow, assign it, test approval process)
- Log in as admin and create a workflow with multiple steps (assign to users/roles, set conditions, step types).
- Attach workflow to a document (e.g., Contract).
- Update the document to trigger workflow progression; only assigned users can act at each step.
- View workflow status and logs in the custom admin UI tab.
- Demonstrate inline actions (approve/reject/comment) and show immutable audit trail.

### 4. Technical Challenges and Solutions
- Making the workflow engine dynamic for any collection using Payload's plugin system and dynamic slugs.
- Customizing the admin UI with Payload's `admin.components` override system.
- Ensuring audit trail immutability with Payload hooks.

### 5. Bonus Features (if any)
- Conditional branching between steps based on outcomes.
- SLA timers for steps and auto-escalation if overdue.
- Email notifications simulated with console logs.

### 6. Deployment Demonstration
- Project is deployed on [Render/Vercel].
- Live admin panel and custom API endpoints are demonstrated.
- Deployment process is documented below.

### 7. Credentials and Sample Data
- Demo credentials for admin and reviewer roles are included below.
- Database is seeded with sample Blog and Contract documents.

### 8. Closing
Thank you for reviewing my submission. I enjoyed working on this challenge and learned a lot about Payload CMS. Please let me know if you have any questions!

---

## Video Checklist
- [ ] Face visible throughout the video
- [ ] Clear introduction
- [ ] Show and explain project structure
- [ ] Live demo: create workflow, assign, attach, progress, show logs
- [ ] Explain technical challenges and solutions
- [ ] Show any bonus features (branching, SLA, notifications)
- [ ] Show deployment and live demo
- [ ] Mention credentials and sample data
- [ ] Thank the reviewers and offer to answer questions

---

*Replace [Your Name] and deployment platform as appropriate. Use this as your guide for recording the Loom video as required by the task.* 