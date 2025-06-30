export const Workflows = {
    slug: 'workflows',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
        },
        {
            name: 'appliesTo',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'collection',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Collection slug (e.g., blogs, contracts)',
                    },
                },
                {
                    name: 'conditions',
                    type: 'group',
                    fields: [
                        {
                            name: 'field',
                            type: 'text',
                            admin: {
                                description: 'Field name to check (e.g., amount, priority)',
                            },
                        },
                        {
                            name: 'operator',
                            type: 'select',
                            options: [
                                { label: 'Equals', value: 'equals' },
                                { label: 'Not Equals', value: 'not_equals' },
                                { label: 'Greater Than', value: 'greater_than' },
                                { label: 'Less Than', value: 'less_than' },
                                { label: 'Contains', value: 'contains' },
                                { label: 'Not Contains', value: 'not_contains' },
                                { label: 'Is Empty', value: 'is_empty' },
                                { label: 'Is Not Empty', value: 'is_not_empty' },
                            ],
                        },
                        {
                            name: 'value',
                            type: 'text',
                            admin: {
                                description: 'Value to compare against',
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: 'steps',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    required: false,
                },
                {
                    name: 'stepType',
                    type: 'select',
                    required: true,
                    options: [
                        {
                            label: 'Approval',
                            value: 'approval',
                        },
                        {
                            label: 'Review',
                            value: 'review',
                        },
                        {
                            label: 'Sign-off',
                            value: 'sign_off',
                        },
                        {
                            label: 'Comment Only',
                            value: 'comment_only',
                        },
                    ],
                },
                {
                    name: 'order',
                    type: 'number',
                    required: true,
                    admin: {
                        description: 'Step order (1, 2, 3...)',
                    },
                },
                {
                    name: 'assignees',
                    type: 'group',
                    fields: [
                        {
                            name: 'type',
                            type: 'select',
                            required: true,
                            options: [
                                { label: 'Specific Users', value: 'users' },
                                { label: 'User Roles', value: 'roles' },
                                { label: 'Department', value: 'department' },
                            ],
                        },
                        {
                            name: 'users',
                            type: 'relationship',
                            relationTo: 'users',
                            hasMany: true,
                            admin: {
                                condition: (data, siblingData) => siblingData?.type === 'users',
                            },
                        },
                        {
                            name: 'roles',
                            type: 'select',
                            hasMany: true,
                            options: [
                                { label: 'Admin', value: 'admin' },
                                { label: 'Manager', value: 'manager' },
                                { label: 'Reviewer', value: 'reviewer' },
                                { label: 'Editor', value: 'editor' },
                            ],
                            admin: {
                                condition: (data, siblingData) => siblingData?.type === 'roles',
                            },
                        },
                        {
                            name: 'department',
                            type: 'text',
                            admin: {
                                condition: (data, siblingData) => siblingData?.type === 'department',
                            },
                        },
                    ],
                },
                {
                    name: 'conditions',
                    type: 'group',
                    fields: [
                        {
                            name: 'enabled',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'rules',
                            type: 'array',
                            fields: [
                                {
                                    name: 'field',
                                    type: 'text',
                                    admin: {
                                        description: 'Document field to check',
                                    },
                                },
                                {
                                    name: 'operator',
                                    type: 'select',
                                    options: [
                                        { label: 'Equals', value: 'equals' },
                                        { label: 'Not Equals', value: 'not_equals' },
                                        { label: 'Greater Than', value: 'greater_than' },
                                        { label: 'Less Than', value: 'less_than' },
                                        { label: 'Contains', value: 'contains' },
                                        { label: 'Not Contains', value: 'not_contains' },
                                    ],
                                },
                                {
                                    name: 'value',
                                    type: 'text',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'sla',
                    type: 'group',
                    fields: [
                        {
                            name: 'enabled',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'hours',
                            type: 'number',
                            admin: {
                                description: 'SLA in hours',
                            },
                        },
                        {
                            name: 'autoEscalate',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'escalateTo',
                            type: 'relationship',
                            relationTo: 'users',
                            admin: {
                                description: 'User to escalate to if SLA is exceeded',
                            },
                        },
                    ],
                },
                {
                    name: 'actions',
                    type: 'group',
                    fields: [
                        {
                            name: 'onApprove',
                            type: 'select',
                            hasMany: true,
                            options: [
                                { label: 'Move to Next Step', value: 'next_step' },
                                { label: 'Complete Workflow', value: 'complete' },
                                { label: 'Send Notification', value: 'notify' },
                                { label: 'Update Document Status', value: 'update_status' },
                            ],
                        },
                        {
                            name: 'onReject',
                            type: 'select',
                            hasMany: true,
                            options: [
                                { label: 'End Workflow', value: 'end' },
                                { label: 'Return to Previous Step', value: 'previous_step' },
                                { label: 'Send Notification', value: 'notify' },
                                { label: 'Update Document Status', value: 'update_status' },
                            ],
                        },
                        {
                            name: 'statusOnApprove',
                            type: 'text',
                            admin: {
                                description: 'Document status to set on approval',
                            },
                        },
                        {
                            name: 'statusOnReject',
                            type: 'text',
                            admin: {
                                description: 'Document status to set on rejection',
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: 'settings',
            type: 'group',
            fields: [
                {
                    name: 'autoStart',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Automatically start workflow when document is created',
                    },
                },
                {
                    name: 'requireAllApprovals',
                    type: 'checkbox',
                    defaultValue: true,
                    admin: {
                        description: 'Require all assignees to approve before moving to next step',
                    },
                },
                {
                    name: 'allowParallelApproval',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Allow multiple steps to run in parallel',
                    },
                },
                {
                    name: 'notifications',
                    type: 'group',
                    fields: [
                        {
                            name: 'email',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                        {
                            name: 'inApp',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                    ],
                },
            ],
        },
    ],
    hooks: {
        beforeValidate: [
            ({ data }) => {
                // Ensure steps are ordered correctly
                if (data && data.steps) {
                    data.steps.sort((a, b) => a.order - b.order);
                }
                return data;
            },
        ],
    },
};
//# sourceMappingURL=Workflows.js.map