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
declare class WorkflowEngine {
    private workflows;
    private statuses;
    initialize(): Promise<void>;
    triggerWorkflow(documentId: string, collectionSlug: string): Promise<void>;
    startStep(documentId: string, collectionSlug: string, stepIndex: number): Promise<void>;
    processApproval(documentId: string, collectionSlug: string, stepIndex: number, userId: string, action: 'approve' | 'reject' | 'comment', comment?: string): Promise<void>;
    private getStepAssignees;
    private isStepComplete;
    private completeStep;
    private moveToNextStep;
    private completeWorkflow;
    private sendNotifications;
    private logWorkflowAction;
    getWorkflowStatus(documentId: string, collectionSlug: string): Promise<{
        hasWorkflow: boolean;
        message: string;
        workflow?: undefined;
    } | {
        hasWorkflow: boolean;
        workflow: {
            id: string;
            name: string;
            currentStep: number;
            isActive: boolean;
            stepStatus: {
                stepId: number;
                status: "pending" | "in_progress" | "completed" | "rejected";
                assignees: string[];
                approvals: Array<{
                    userId: string;
                    action: "approve" | "reject" | "comment";
                    timestamp: Date;
                    comment?: string;
                }>;
            }[];
            startDate: Date;
            lastUpdated: Date;
        };
        message?: undefined;
    }>;
}
//# sourceMappingURL=workflow-plugin.d.ts.map