export const Contracts = {
    slug: 'contracts',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'contractNumber',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'contractType',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Service Agreement',
                    value: 'service_agreement',
                },
                {
                    label: 'Employment Contract',
                    value: 'employment_contract',
                },
                {
                    label: 'NDA',
                    value: 'nda',
                },
                {
                    label: 'Partnership Agreement',
                    value: 'partnership_agreement',
                },
                {
                    label: 'Purchase Order',
                    value: 'purchase_order',
                },
                {
                    label: 'Other',
                    value: 'other',
                },
            ],
        },
        {
            name: 'amount',
            type: 'number',
            required: false,
            admin: {
                description: 'Contract value in USD',
            },
        },
        {
            name: 'currency',
            type: 'select',
            defaultValue: 'USD',
            options: [
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
                { label: 'GBP', value: 'GBP' },
                { label: 'INR', value: 'INR' },
            ],
        },
        {
            name: 'startDate',
            type: 'date',
            required: false,
        },
        {
            name: 'endDate',
            type: 'date',
            required: false,
        },
        {
            name: 'parties',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'type',
                    type: 'select',
                    options: [
                        { label: 'Client', value: 'client' },
                        { label: 'Vendor', value: 'vendor' },
                        { label: 'Partner', value: 'partner' },
                    ],
                },
                {
                    name: 'email',
                    type: 'email',
                },
            ],
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'draft',
            options: [
                {
                    label: 'Draft',
                    value: 'draft',
                },
                {
                    label: 'Pending Legal Review',
                    value: 'pending_legal_review',
                },
                {
                    label: 'In Legal Review',
                    value: 'in_legal_review',
                },
                {
                    label: 'Pending Executive Approval',
                    value: 'pending_executive_approval',
                },
                {
                    label: 'Approved',
                    value: 'approved',
                },
                {
                    label: 'Rejected',
                    value: 'rejected',
                },
                {
                    label: 'Signed',
                    value: 'signed',
                },
                {
                    label: 'Active',
                    value: 'active',
                },
                {
                    label: 'Expired',
                    value: 'expired',
                },
            ],
        },
        {
            name: 'priority',
            type: 'select',
            defaultValue: 'medium',
            options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
            ],
        },
        // Workflow-related fields
        {
            name: 'workflow',
            type: 'relationship',
            relationTo: 'workflows',
            required: false,
        },
        {
            name: 'workflowStatus',
            type: 'group',
            fields: [
                {
                    name: 'currentStep',
                    type: 'number',
                    defaultValue: 0,
                },
                {
                    name: 'isActive',
                    type: 'checkbox',
                    defaultValue: false,
                },
                {
                    name: 'lastUpdated',
                    type: 'date',
                    admin: {
                        readOnly: true,
                    },
                },
            ],
        },
    ],
    hooks: {
        beforeChange: [
            ({ req, data }) => {
                // Update workflow status timestamp
                if (data.workflowStatus) {
                    data.workflowStatus.lastUpdated = new Date();
                }
                return data;
            },
        ],
    },
};
//# sourceMappingURL=Contracts.js.map