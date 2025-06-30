"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
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
            name: 'email',
            type: 'email',
            required: true,
            unique: true,
        },
        {
            name: 'role',
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: [
                {
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'Manager',
                    value: 'manager',
                },
                {
                    label: 'Reviewer',
                    value: 'reviewer',
                },
                {
                    label: 'Editor',
                    value: 'editor',
                },
                {
                    label: 'Viewer',
                    value: 'viewer',
                },
            ],
        },
        {
            name: 'department',
            type: 'text',
            required: false,
        },
    ],
    hooks: {
        beforeChange: [
            ({ req, data }) => {
                // Ensure email is lowercase
                if (data.email) {
                    data.email = data.email.toLowerCase();
                }
                return data;
            },
        ],
    },
};
//# sourceMappingURL=Users.js.map