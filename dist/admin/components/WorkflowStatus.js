import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useField } from 'payload/components/forms';
import { Button } from 'payload/components/elements';
import { toast } from 'react-toastify';
export const WorkflowStatus = ({ path, documentId, collection }) => {
    const [workflowStatus, setWorkflowStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [comment, setComment] = useState('');
    const { value: workflowField } = useField({ path: 'workflow' });
    useEffect(() => {
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
            toast.error('Failed to fetch workflow status');
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
                toast.success('Workflow triggered successfully');
                await fetchWorkflowStatus();
            }
            else {
                toast.error('Failed to trigger workflow');
            }
        }
        catch (error) {
            console.error('Error triggering workflow:', error);
            toast.error('Failed to trigger workflow');
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
                toast.success(`Action ${action} processed successfully`);
                setComment('');
                await fetchWorkflowStatus();
            }
            else {
                toast.error(`Failed to process ${action}`);
            }
        }
        catch (error) {
            console.error('Error processing action:', error);
            toast.error(`Failed to process ${action}`);
        }
        finally {
            setActionLoading(false);
        }
    };
    if (!workflowField) {
        return (_jsxs("div", { className: "workflow-status", children: [_jsx("h3", { children: "Workflow Status" }), _jsx("p", { children: "No workflow assigned to this document." })] }));
    }
    if (loading) {
        return (_jsxs("div", { className: "workflow-status", children: [_jsx("h3", { children: "Workflow Status" }), _jsx("p", { children: "Loading workflow status..." })] }));
    }
    if (!workflowStatus?.hasWorkflow) {
        return (_jsxs("div", { className: "workflow-status", children: [_jsx("h3", { children: "Workflow Status" }), _jsx("p", { children: workflowStatus?.message || 'No active workflow found' }), _jsx(Button, { onClick: triggerWorkflow, disabled: actionLoading, className: "trigger-workflow-btn", children: actionLoading ? 'Triggering...' : 'Trigger Workflow' })] }));
    }
    const { workflow } = workflowStatus;
    return (_jsxs("div", { className: "workflow-status", children: [_jsxs("div", { className: "workflow-header", children: [_jsxs("h3", { children: ["Workflow: ", workflow?.name] }), _jsxs("div", { className: "workflow-meta", children: [_jsx("span", { className: `status ${workflow?.isActive ? 'active' : 'completed'}`, children: workflow?.isActive ? 'Active' : 'Completed' }), _jsxs("span", { className: "current-step", children: ["Step ", workflow?.currentStep + 1, " of ", workflow?.stepStatus.length] })] })] }), _jsx("div", { className: "workflow-steps", children: workflow?.stepStatus.map((step, index) => (_jsxs("div", { className: `workflow-step ${step.status}`, children: [_jsxs("div", { className: "step-header", children: [_jsx("h4", { children: step.name }), _jsx("span", { className: `step-status ${step.status}`, children: step.status.replace('_', ' ').toUpperCase() })] }), _jsxs("div", { className: "step-details", children: [_jsxs("p", { children: [_jsx("strong", { children: "Type:" }), " ", step.type] }), _jsxs("p", { children: [_jsx("strong", { children: "Assignees:" }), " ", step.assignees.length] }), step.approvals.length > 0 && (_jsxs("div", { className: "step-approvals", children: [_jsx("h5", { children: "Approvals:" }), step.approvals.map((approval, approvalIndex) => (_jsxs("div", { className: "approval-item", children: [_jsx("span", { className: `approval-action ${approval.action}`, children: approval.action.toUpperCase() }), _jsxs("span", { className: "approval-user", children: ["User: ", approval.userId] }), _jsx("span", { className: "approval-time", children: new Date(approval.timestamp).toLocaleString() }), approval.comment && (_jsx("p", { className: "approval-comment", children: approval.comment }))] }, approvalIndex)))] })), step.status === 'in_progress' && (_jsxs("div", { className: "step-actions", children: [_jsx("h5", { children: "Actions:" }), _jsxs("div", { className: "action-buttons", children: [_jsx(Button, { onClick: () => processAction(index, 'approve'), disabled: actionLoading, className: "approve-btn", children: "Approve" }), _jsx(Button, { onClick: () => processAction(index, 'reject'), disabled: actionLoading, className: "reject-btn", children: "Reject" }), _jsxs("div", { className: "comment-section", children: [_jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Add a comment...", className: "comment-input" }), _jsx(Button, { onClick: () => processAction(index, 'comment'), disabled: actionLoading || !comment.trim(), className: "comment-btn", children: "Add Comment" })] })] })] }))] })] }, step.stepId))) }), _jsxs("div", { className: "workflow-footer", children: [_jsxs("p", { children: [_jsx("strong", { children: "Started:" }), " ", new Date(workflow?.startDate || '').toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Last Updated:" }), " ", new Date(workflow?.lastUpdated || '').toLocaleString()] })] }), _jsx("style", { children: `
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
//# sourceMappingURL=WorkflowStatus.js.map