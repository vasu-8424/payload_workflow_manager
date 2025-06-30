import { CollectionConfig } from 'payload/types';

export const Blogs: CollectionConfig = {
  slug: 'blogs',
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
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: false,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
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
          label: 'Pending Review',
          value: 'pending_review',
        },
        {
          label: 'In Review',
          value: 'in_review',
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
          label: 'Published',
          value: 'published',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
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