"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowLogs = void 0;
exports.WorkflowLogs = {
    slug: 'workflow-logs',
    admin: {
        useAsTitle: 'action',
        defaultColumns: ['action', 'user', 'document', 'timestamp'],
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => false, // Immutable logs
        delete: () => false, // Immutable logs
    },
    fields: [
        {
            name: 'workflow',
            type: 'relationship',
            relationTo: 'workflows',
            required: true,
        },
        {
            name: 'document',
            type: 'group',
            fields: [
                {
                    name: 'id',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'collection',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'title',
                    type: 'text',
                    required: false,
                },
            ],
        },
        {
            name: 'step',
            type: 'group',
            fields: [
                {
                    name: 'id',
                    type: 'number',
                    required: true,
                },
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'type',
                    type: 'select',
                    options: [
                        { label: 'Approval', value: 'approval' },
                        { label: 'Review', value: 'review' },
                        { label: 'Sign-off', value: 'sign_off' },
                        { label: 'Comment Only', value: 'comment_only' },
                    ],
                },
            ],
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'action',
            type: 'select',
            required: true,
            options: [
                { label: 'Workflow Started', value: 'workflow_started' },
                { label: 'Step Assigned', value: 'step_assigned' },
                { label: 'Step Started', value: 'step_started' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Commented', value: 'commented' },
                { label: 'Step Completed', value: 'step_completed' },
                { label: 'Workflow Completed', value: 'workflow_completed' },
                { label: 'Workflow Cancelled', value: 'workflow_cancelled' },
                { label: 'SLA Exceeded', value: 'sla_exceeded' },
                { label: 'Escalated', value: 'escalated' },
            ],
        },
        {
            name: 'timestamp',
            type: 'date',
            required: true,
            admin: {
                readOnly: true,
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'comment',
            type: 'textarea',
            required: false,
        },
        {
            name: 'metadata',
            type: 'json',
            required: false,
            admin: {
                description: 'Additional data about the action',
            },
        },
        {
            name: 'previousStatus',
            type: 'text',
            required: false,
        },
        {
            name: 'newStatus',
            type: 'text',
            required: false,
        },
        {
            name: 'duration',
            type: 'number',
            required: false,
            admin: {
                description: 'Duration in milliseconds',
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data }) => {
                // Always set timestamp to current time
                data.timestamp = new Date();
                return data;
            },
        ],
    },
};
//# sourceMappingURL=WorkflowLogs.js.map