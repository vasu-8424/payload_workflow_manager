"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowStatus = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const forms_1 = require("payload/components/forms");
const elements_1 = require("payload/components/elements");
const react_toastify_1 = require("react-toastify");
const WorkflowStatus = ({ path, documentId, collection }) => {
    const [workflowStatus, setWorkflowStatus] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [actionLoading, setActionLoading] = (0, react_1.useState)(false);
    const [comment, setComment] = (0, react_1.useState)('');
    const { value: workflowField } = (0, forms_1.useField)({ path: 'workflow' });
    (0, react_1.useEffect)(() => {
        if (workflowField && documentId) {
            fetchWorkflowStatus();
        }
    }, [workflowField, documentId]);
    const fetchWorkflowStatus = async () => {
        if (!documentId)
            return;
        setLoading(true);
        try {
            const response = await fetch(`/api/workflows/status/${documentId}?collection=${collection}`);
            const data = await response.json();
            setWorkflowStatus(data);
        }
        catch (error) {
            console.error('Error fetching workflow status:', error);
            react_toastify_1.toast.error('Failed to fetch workflow status');
        }
        finally {
            setLoading(false);
        }
    };
    const triggerWorkflow = async () => {
        if (!documentId || !collection)
            return;
        setActionLoading(true);
        try {
            const response = await fetch('/api/workflows/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId,
                    collectionSlug: collection,
                }),
            });
            if (response.ok) {
                react_toastify_1.toast.success('Workflow triggered successfully');
                await fetchWorkflowStatus();
            }
            else {
                react_toastify_1.toast.error('Failed to trigger workflow');
            }
        }
        catch (error) {
            console.error('Error triggering workflow:', error);
            react_toastify_1.toast.error('Failed to trigger workflow');
        }
        finally {
            setActionLoading(false);
        }
    };
    const processAction = async (stepIndex, action) => {
        if (!documentId || !collection)
            return;
        setActionLoading(true);
        try {
            const response = await fetch('/api/workflows/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId,
                    collectionSlug: collection,
                    stepIndex,
                    action,
                    comment: action === 'comment' ? comment : undefined,
                }),
            });
            if (response.ok) {
                react_toastify_1.toast.success(`Action ${action} processed successfully`);
                setComment('');
                await fetchWorkflowStatus();
            }
            else {
                react_toastify_1.toast.error(`Failed to process ${action}`);
            }
        }
        catch (error) {
            console.error('Error processing action:', error);
            react_toastify_1.toast.error(`Failed to process ${action}`);
        }
        finally {
            setActionLoading(false);
        }
    };
    if (!workflowField) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "workflow-status", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Workflow Status" }), (0, jsx_runtime_1.jsx)("p", { children: "No workflow assigned to this document." })] }));
    }
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "workflow-status", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Workflow Status" }), (0, jsx_runtime_1.jsx)("p", { children: "Loading workflow status..." })] }));
    }
    if (!workflowStatus?.hasWorkflow) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "workflow-status", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Workflow Status" }), (0, jsx_runtime_1.jsx)("p", { children: workflowStatus?.message || 'No active workflow found' }), (0, jsx_runtime_1.jsx)(elements_1.Button, { onClick: triggerWorkflow, disabled: actionLoading, className: "trigger-workflow-btn", children: actionLoading ? 'Triggering...' : 'Trigger Workflow' })] }));
    }
    const { workflow } = workflowStatus;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "workflow-status", children: [(0, jsx_runtime_1.jsxs)("div", { className: "workflow-header", children: [(0, jsx_runtime_1.jsxs)("h3", { children: ["Workflow: ", workflow?.name] }), (0, jsx_runtime_1.jsxs)("div", { className: "workflow-meta", children: [(0, jsx_runtime_1.jsx)("span", { className: `status ${workflow?.isActive ? 'active' : 'completed'}`, children: workflow?.isActive ? 'Active' : 'Completed' }), (0, jsx_runtime_1.jsxs)("span", { className: "current-step", children: ["Step ", workflow?.currentStep + 1, " of ", workflow?.stepStatus.length] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "workflow-steps", children: workflow?.stepStatus.map((step, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `workflow-step ${step.status}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "step-header", children: [(0, jsx_runtime_1.jsx)("h4", { children: step.name }), (0, jsx_runtime_1.jsx)("span", { className: `step-status ${step.status}`, children: step.status.replace('_', ' ').toUpperCase() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "step-details", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Type:" }), " ", step.type] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Assignees:" }), " ", step.assignees.length] }), step.approvals.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "step-approvals", children: [(0, jsx_runtime_1.jsx)("h5", { children: "Approvals:" }), step.approvals.map((approval, approvalIndex) => ((0, jsx_runtime_1.jsxs)("div", { className: "approval-item", children: [(0, jsx_runtime_1.jsx)("span", { className: `approval-action ${approval.action}`, children: approval.action.toUpperCase() }), (0, jsx_runtime_1.jsxs)("span", { className: "approval-user", children: ["User: ", approval.userId] }), (0, jsx_runtime_1.jsx)("span", { className: "approval-time", children: new Date(approval.timestamp).toLocaleString() }), approval.comment && ((0, jsx_runtime_1.jsx)("p", { className: "approval-comment", children: approval.comment }))] }, approvalIndex)))] })), step.status === 'in_progress' && ((0, jsx_runtime_1.jsxs)("div", { className: "step-actions", children: [(0, jsx_runtime_1.jsx)("h5", { children: "Actions:" }), (0, jsx_runtime_1.jsxs)("div", { className: "action-buttons", children: [(0, jsx_runtime_1.jsx)(elements_1.Button, { onClick: () => processAction(index, 'approve'), disabled: actionLoading, className: "approve-btn", children: "Approve" }), (0, jsx_runtime_1.jsx)(elements_1.Button, { onClick: () => processAction(index, 'reject'), disabled: actionLoading, className: "reject-btn", children: "Reject" }), (0, jsx_runtime_1.jsxs)("div", { className: "comment-section", children: [(0, jsx_runtime_1.jsx)("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Add a comment...", className: "comment-input" }), (0, jsx_runtime_1.jsx)(elements_1.Button, { onClick: () => processAction(index, 'comment'), disabled: actionLoading || !comment.trim(), className: "comment-btn", children: "Add Comment" })] })] })] }))] })] }, step.stepId))) }), (0, jsx_runtime_1.jsxs)("div", { className: "workflow-footer", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Started:" }), " ", new Date(workflow?.startDate || '').toLocaleString()] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Last Updated:" }), " ", new Date(workflow?.lastUpdated || '').toLocaleString()] })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .workflow-status {
          padding: 20px;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          background: #fff;
          margin: 20px 0;
        }

        .workflow-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e1e5e9;
        }

        .workflow-meta {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.active {
          background: #d4edda;
          color: #155724;
        }

        .status.completed {
          background: #cce5ff;
          color: #004085;
        }

        .current-step {
          font-size: 14px;
          color: #6c757d;
        }

        .workflow-steps {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .workflow-step {
          padding: 15px;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          background: #f8f9fa;
        }

        .workflow-step.pending {
          border-left: 4px solid #6c757d;
        }

        .workflow-step.in_progress {
          border-left: 4px solid #007bff;
          background: #f0f8ff;
        }

        .workflow-step.completed {
          border-left: 4px solid #28a745;
          background: #f8fff8;
        }

        .workflow-step.rejected {
          border-left: 4px solid #dc3545;
          background: #fff8f8;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .step-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .step-status.pending {
          background: #6c757d;
          color: white;
        }

        .step-status.in_progress {
          background: #007bff;
          color: white;
        }

        .step-status.completed {
          background: #28a745;
          color: white;
        }

        .step-status.rejected {
          background: #dc3545;
          color: white;
        }

        .step-details p {
          margin: 5px 0;
          font-size: 14px;
        }

        .step-approvals {
          margin-top: 10px;
        }

        .step-approvals h5 {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .approval-item {
          padding: 8px;
          background: white;
          border-radius: 4px;
          margin-bottom: 5px;
          font-size: 12px;
        }

        .approval-action {
          font-weight: 600;
          margin-right: 10px;
        }

        .approval-action.approve {
          color: #28a745;
        }

        .approval-action.reject {
          color: #dc3545;
        }

        .approval-action.comment {
          color: #007bff;
        }

        .approval-user {
          margin-right: 10px;
        }

        .approval-time {
          color: #6c757d;
        }

        .approval-comment {
          margin-top: 5px;
          font-style: italic;
          color: #495057;
        }

        .step-actions {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e1e5e9;
        }

        .step-actions h5 {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .approve-btn {
          background: #28a745;
          border-color: #28a745;
        }

        .reject-btn {
          background: #dc3545;
          border-color: #dc3545;
        }

        .comment-section {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .comment-input {
          width: 200px;
          height: 60px;
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          resize: vertical;
        }

        .comment-btn {
          background: #6c757d;
          border-color: #6c757d;
          font-size: 12px;
        }

        .workflow-footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e1e5e9;
          font-size: 12px;
          color: #6c757d;
        }

        .workflow-footer p {
          margin: 5px 0;
        }

        .trigger-workflow-btn {
          background: #007bff;
          border-color: #007bff;
          margin-top: 10px;
        }
      ` })] }));
};
exports.WorkflowStatus = WorkflowStatus;
//# sourceMappingURL=WorkflowStatus.js.map