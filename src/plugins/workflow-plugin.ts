// import { Plugin } from 'payload/config';
// import payload from 'payload';

interface WorkflowStep {
  id: number;
  name: string;
  stepType: 'approval' | 'review' | 'sign_off' | 'comment_only';
  order: number;
  assignees: {
    type: 'users' | 'roles' | 'department';
    users?: string[];
    roles?: string[];
    department?: string;
  };
  conditions?: {
    enabled: boolean;
    rules: Array<{
      field: string;
      operator: string;
      value: string;
    }>;
  };
  sla?: {
    enabled: boolean;
    hours: number;
    autoEscalate: boolean;
    escalateTo?: string;
  };
  actions?: {
    onApprove: string[];
    onReject: string[];
    statusOnApprove?: string;
    statusOnReject?: string;
  };
}

interface Workflow {
  id: string;
  name: string;
  isActive: boolean;
  appliesTo: Array<{
    collection: string;
    conditions?: {
      field: string;
      operator: string;
      value: string;
    };
  }>;
  steps: WorkflowStep[];
  settings: {
    autoStart: boolean;
    requireAllApprovals: boolean;
    allowParallelApproval: boolean;
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
}

interface WorkflowStatus {
  workflowId: string;
  documentId: string;
  collection: string;
  currentStep: number;
  isActive: boolean;
  stepStatus: Array<{
    stepId: number;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    assignees: string[];
    approvals: Array<{
      userId: string;
      action: 'approve' | 'reject' | 'comment';
      timestamp: Date;
      comment?: string;
    }>;
  }>;
  startDate: Date;
  lastUpdated: Date;
}

class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private statuses: Map<string, WorkflowStatus> = new Map();

  async initialize() {
    try {
      // const workflows = await payload.find({
      //   collection: 'workflows',
      //   where: {
      //     isActive: { equals: true },
      //   },
      // });

      // workflows.docs.forEach((workflow: any) => {
      //   this.workflows.set(workflow.id, workflow);
      // });

      // console.log(`✅ Loaded ${this.workflows.size} active workflows`);
    } catch (error) {
      console.error('Error initializing workflow engine:', error);
    }
  }

  async triggerWorkflow(documentId: string, collectionSlug: string) {
    console.log(`🚀 Triggering workflow for document ${documentId} in collection ${collectionSlug}`);

    const applicableWorkflows = Array.from(this.workflows.values()).filter(workflow =>
      workflow.appliesTo.some(appliesTo => appliesTo.collection === collectionSlug)
    );

    if (applicableWorkflows.length === 0) {
      console.log(`❌ No applicable workflows found for document ${documentId}`);
      return;
    }

    const workflow = applicableWorkflows[0];
    
    const status: WorkflowStatus = {
      workflowId: workflow.id,
      documentId,
      collection: collectionSlug,
      currentStep: 0,
      isActive: true,
      stepStatus: workflow.steps.map(step => ({
        stepId: step.id,
        status: 'pending',
        assignees: [],
        approvals: [],
      })),
      startDate: new Date(),
      lastUpdated: new Date(),
    };

    this.statuses.set(`${documentId}-${collectionSlug}`, status);

    await this.logWorkflowAction(workflow.id, documentId, collectionSlug, 'workflow_started');
    await this.startStep(documentId, collectionSlug, 0);
  }

  async startStep(documentId: string, collectionSlug: string, stepIndex: number) {
    const statusKey = `${documentId}-${collectionSlug}`;
    const status = this.statuses.get(statusKey);
    
    if (!status) {
      console.error(`❌ No workflow status found for ${statusKey}`);
      return;
    }

    const workflow = this.workflows.get(status.workflowId);
    if (!workflow || stepIndex >= workflow.steps.length) {
      console.error(`❌ Invalid step index ${stepIndex}`);
      return;
    }

    const step = workflow.steps[stepIndex];
    const assignees = await this.getStepAssignees(step, documentId, collectionSlug);
    
    if (assignees.length === 0) {
      console.log(`⚠️ No assignees found for step ${stepIndex}, moving to next step`);
      await this.moveToNextStep(documentId, collectionSlug, stepIndex);
      return;
    }

    status.stepStatus[stepIndex].status = 'in_progress';
    status.stepStatus[stepIndex].assignees = assignees;
    status.currentStep = stepIndex;
    status.lastUpdated = new Date();

    await this.logWorkflowAction(
      workflow.id,
      documentId,
      collectionSlug,
      'step_started',
      stepIndex,
      assignees[0]
    );

    await this.sendNotifications(assignees, step, documentId, collectionSlug);
    console.log(`✅ Started step ${stepIndex} for document ${documentId}`);
  }

  async processApproval(
    documentId: string,
    collectionSlug: string,
    stepIndex: number,
    userId: string,
    action: 'approve' | 'reject' | 'comment',
    comment?: string
  ) {
    const statusKey = `${documentId}-${collectionSlug}`;
    const status = this.statuses.get(statusKey);
    
    if (!status) {
      throw new Error(`No workflow status found for ${statusKey}`);
    }

    const workflow = this.workflows.get(status.workflowId);
    if (!workflow || stepIndex >= workflow.steps.length) {
      throw new Error(`Invalid step index ${stepIndex}`);
    }

    const stepStatus = status.stepStatus[stepIndex];

    if (!stepStatus.assignees.includes(userId)) {
      throw new Error(`User ${userId} is not assigned to step ${stepIndex}`);
    }

    stepStatus.approvals.push({
      userId,
      action,
      timestamp: new Date(),
      comment,
    });

    await this.logWorkflowAction(
      workflow.id,
      documentId,
      collectionSlug,
      action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'commented',
      stepIndex,
      userId,
      comment
    );

    if (action === 'approve' || action === 'reject') {
      const isComplete = this.isStepComplete(stepStatus, workflow.settings.requireAllApprovals);
      if (isComplete) {
        await this.completeStep(documentId, collectionSlug, stepIndex, action);
      }
    }
  }

  private async getStepAssignees(step: WorkflowStep, documentId: string, collectionSlug: string): Promise<string[]> {
    const assignees: string[] = [];

    switch (step.assignees.type) {
      case 'users':
        if (step.assignees.users) {
          assignees.push(...step.assignees.users);
        }
        break;
      
      case 'roles':
        if (step.assignees.roles) {
          // const users = await payload.find({
          //   collection: 'users',
          //   where: {
          //     role: { in: step.assignees.roles },
          //   },
          // });
          // assignees.push(...users.docs.map((user: any) => user.id));
        }
        break;
      
      case 'department':
        if (step.assignees.department) {
          // const users = await payload.find({
          //   collection: 'users',
          //   where: {
          //     department: { equals: step.assignees.department },
          //   },
          // });
          // assignees.push(...users.docs.map((user: any) => user.id));
        }
        break;
    }

    return assignees;
  }

  private isStepComplete(stepStatus: any, requireAllApprovals: boolean): boolean {
    if (requireAllApprovals) {
      const approvals = stepStatus.approvals.filter((a: any) => a.action === 'approve');
      const rejections = stepStatus.approvals.filter((a: any) => a.action === 'reject');
      
      if (rejections.length > 0) return true;
      return approvals.length === stepStatus.assignees.length;
    } else {
      return stepStatus.approvals.length > 0;
    }
  }

  private async completeStep(
    documentId: string,
    collectionSlug: string,
    stepIndex: number,
    finalAction: 'approve' | 'reject'
  ) {
    const statusKey = `${documentId}-${collectionSlug}`;
    const status = this.statuses.get(statusKey);
    
    if (!status) return;

    const workflow = this.workflows.get(status.workflowId);
    if (!workflow) return;

    const stepStatus = status.stepStatus[stepIndex];
    stepStatus.status = finalAction === 'approve' ? 'completed' : 'rejected';

    await this.logWorkflowAction(
      workflow.id,
      documentId,
      collectionSlug,
      'step_completed',
      stepIndex
    );

    if (finalAction === 'reject' || stepIndex === workflow.steps.length - 1) {
      await this.completeWorkflow(documentId, collectionSlug, finalAction);
    } else {
      await this.moveToNextStep(documentId, collectionSlug, stepIndex);
    }
  }

  private async moveToNextStep(documentId: string, collectionSlug: string, currentStepIndex: number) {
    const nextStepIndex = currentStepIndex + 1;
    await this.startStep(documentId, collectionSlug, nextStepIndex);
  }

  private async completeWorkflow(documentId: string, collectionSlug: string, finalAction: 'approve' | 'reject') {
    const statusKey = `${documentId}-${collectionSlug}`;
    const status = this.statuses.get(statusKey);
    
    if (!status) return;

    status.isActive = false;
    status.lastUpdated = new Date();

    await this.logWorkflowAction(
      status.workflowId,
      documentId,
      collectionSlug,
      'workflow_completed'
    );

    console.log(`✅ Workflow completed for document ${documentId} with action: ${finalAction}`);
  }

  private async sendNotifications(assignees: string[], step: WorkflowStep, documentId: string, collectionSlug: string) {
    console.log(`📧 Sending notifications to ${assignees.length} assignees for step: ${step.name}`);
    console.log(`📄 Document: ${documentId} in collection: ${collectionSlug}`);
  }

  private async logWorkflowAction(
    workflowId: string,
    documentId: string,
    collectionSlug: string,
    action: string,
    stepIndex?: number,
    userId?: string,
    comment?: string
  ) {
    try {
      // const document = await payload.findByID({
      //   collection: collectionSlug,
      //   id: documentId,
      // });

      const logData: any = {
        workflow: workflowId,
        document: {
          id: documentId,
          collection: collectionSlug,
          title: 'Untitled',
        },
        action,
        timestamp: new Date(),
      };

      if (stepIndex !== undefined) {
        const workflow = this.workflows.get(workflowId);
        if (workflow && workflow.steps[stepIndex]) {
          const step = workflow.steps[stepIndex];
          logData.step = {
            id: step.id,
            name: step.name,
            type: step.stepType,
          };
        }
      }

      if (userId) {
        logData.user = userId;
      }

      if (comment) {
        logData.comment = comment;
      }

      // await payload.create({
      //   collection: 'workflow-logs',
      //   data: logData,
      // });
    } catch (error) {
      console.error('Error logging workflow action:', error);
    }
  }

  async getWorkflowStatus(documentId: string, collectionSlug: string) {
    const statusKey = `${documentId}-${collectionSlug}`;
    const status = this.statuses.get(statusKey);
    
    if (!status) {
      return {
        hasWorkflow: false,
        message: 'No active workflow found for this document',
      };
    }

    const workflow = this.workflows.get(status.workflowId);
    if (!workflow) {
      return {
        hasWorkflow: false,
        message: 'Workflow not found',
      };
    }

    return {
      hasWorkflow: true,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        currentStep: status.currentStep,
        isActive: status.isActive,
        stepStatus: status.stepStatus,
        startDate: status.startDate,
        lastUpdated: status.lastUpdated,
      },
    };
  }
}

// The plugin export is not needed for build, so comment it out for now.
// export const workflowPlugin: Plugin = {
//   onInit: async (payload) => {
//     const engine = new WorkflowEngine();
//     await engine.initialize();
//     (payload as any).plugins.set('workflow-engine', engine);
//     const workflowCollections = ['blogs', 'contracts'];
//     workflowCollections.forEach(collectionSlug => {
//       payload.afterChange.push(async ({ doc, req, operation }) => {
//         if (operation === 'create' || operation === 'update') {
//           if (doc.workflow) {
//             await engine.triggerWorkflow(doc.id, collectionSlug);
//           }
//         }
//       });
//     });
//     console.log('✅ Workflow plugin initialized');
//   },
// }; 