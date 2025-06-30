"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = seedData;
const payload_1 = __importDefault(require("payload"));
async function seedData() {
    console.log('🌱 Starting database seeding...');
    try {
        // Create users
        const adminUser = await payload_1.default.create({
            collection: 'users',
            data: {
                name: 'Admin User',
                email: 'admin@weframetech.com',
                role: 'admin',
                department: 'IT',
            },
        });
        const managerUser = await payload_1.default.create({
            collection: 'users',
            data: {
                name: 'Manager User',
                email: 'manager@weframetech.com',
                role: 'manager',
                department: 'Operations',
            },
        });
        const reviewerUser = await payload_1.default.create({
            collection: 'users',
            data: {
                name: 'Reviewer User',
                email: 'reviewer@weframetech.com',
                role: 'reviewer',
                department: 'Legal',
            },
        });
        const editorUser = await payload_1.default.create({
            collection: 'users',
            data: {
                name: 'Editor User',
                email: 'editor@weframetech.com',
                role: 'editor',
                department: 'Content',
            },
        });
        console.log('✅ Users created');
        // Create blog workflow
        const blogWorkflow = await payload_1.default.create({
            collection: 'workflows',
            data: {
                name: 'Blog Publication Workflow',
                description: 'Standard workflow for blog post publication',
                isActive: true,
                appliesTo: [
                    {
                        collection: 'blogs',
                    },
                ],
                steps: [
                    {
                        name: 'Content Review',
                        description: 'Review content for quality and accuracy',
                        stepType: 'review',
                        order: 1,
                        assignees: {
                            type: 'roles',
                            roles: ['reviewer'],
                        },
                        actions: {
                            onApprove: ['next_step'],
                            onReject: ['end'],
                            statusOnApprove: 'pending_approval',
                            statusOnReject: 'rejected',
                        },
                    },
                    {
                        name: 'Manager Approval',
                        description: 'Final approval from manager',
                        stepType: 'approval',
                        order: 2,
                        assignees: {
                            type: 'roles',
                            roles: ['manager'],
                        },
                        actions: {
                            onApprove: ['complete'],
                            onReject: ['end'],
                            statusOnApprove: 'approved',
                            statusOnReject: 'rejected',
                        },
                    },
                ],
                settings: {
                    autoStart: true,
                    requireAllApprovals: true,
                    allowParallelApproval: false,
                    notifications: {
                        email: true,
                        inApp: true,
                    },
                },
            },
        });
        // Create contract workflow
        const contractWorkflow = await payload_1.default.create({
            collection: 'workflows',
            data: {
                name: 'Contract Approval Workflow',
                description: 'Multi-step contract approval process',
                isActive: true,
                appliesTo: [
                    {
                        collection: 'contracts',
                        conditions: {
                            field: 'amount',
                            operator: 'greater_than',
                            value: '10000',
                        },
                    },
                ],
                steps: [
                    {
                        name: 'Legal Review',
                        description: 'Legal team reviews contract terms',
                        stepType: 'review',
                        order: 1,
                        assignees: {
                            type: 'roles',
                            roles: ['reviewer'],
                        },
                        actions: {
                            onApprove: ['next_step'],
                            onReject: ['end'],
                            statusOnApprove: 'pending_executive_approval',
                            statusOnReject: 'rejected',
                        },
                    },
                    {
                        name: 'Executive Approval',
                        description: 'Executive approval for high-value contracts',
                        stepType: 'approval',
                        order: 2,
                        assignees: {
                            type: 'roles',
                            roles: ['manager'],
                        },
                        actions: {
                            onApprove: ['complete'],
                            onReject: ['end'],
                            statusOnApprove: 'approved',
                            statusOnReject: 'rejected',
                        },
                    },
                ],
                settings: {
                    autoStart: true,
                    requireAllApprovals: true,
                    allowParallelApproval: false,
                    notifications: {
                        email: true,
                        inApp: true,
                    },
                },
            },
        });
        console.log('✅ Workflows created');
        // Create sample blog post
        const sampleBlog = await payload_1.default.create({
            collection: 'blogs',
            data: {
                title: 'Getting Started with Payload CMS',
                content: [
                    {
                        children: [
                            {
                                text: 'Payload CMS is a powerful headless CMS built with Node.js and TypeScript. It provides a great developer experience with a flexible admin interface.',
                            },
                        ],
                    },
                ],
                excerpt: 'Learn how to get started with Payload CMS for your next project.',
                author: editorUser.id,
                status: 'draft',
                tags: [
                    { tag: 'Payload CMS' },
                    { tag: 'Headless CMS' },
                    { tag: 'TypeScript' },
                ],
                workflow: blogWorkflow.id,
                workflowStatus: {
                    currentStep: 0,
                    isActive: false,
                    lastUpdated: new Date(),
                },
            },
        });
        // Create sample contract
        const sampleContract = await payload_1.default.create({
            collection: 'contracts',
            data: {
                title: 'Software Development Agreement',
                contractNumber: 'CON-2024-001',
                description: 'Agreement for custom software development services',
                content: [
                    {
                        children: [
                            {
                                text: 'This agreement outlines the terms and conditions for software development services...',
                            },
                        ],
                    },
                ],
                contractType: 'service_agreement',
                amount: 50000,
                currency: 'USD',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-06-30'),
                parties: [
                    {
                        name: 'WeFrameTech Solutions',
                        type: 'client',
                        email: 'contact@weframetech.com',
                    },
                    {
                        name: 'TechCorp Inc',
                        type: 'vendor',
                        email: 'legal@techcorp.com',
                    },
                ],
                status: 'draft',
                priority: 'high',
                workflow: contractWorkflow.id,
                workflowStatus: {
                    currentStep: 0,
                    isActive: false,
                    lastUpdated: new Date(),
                },
            },
        });
        console.log('✅ Sample documents created');
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Sample Data Created:');
        console.log('- 4 Users (Admin, Manager, Reviewer, Editor)');
        console.log('- 2 Workflows (Blog Publication, Contract Approval)');
        console.log('- 1 Sample Blog Post');
        console.log('- 1 Sample Contract');
        console.log('\n🔑 Demo Credentials:');
        console.log('- Admin: admin@weframetech.com');
        console.log('- Manager: manager@weframetech.com');
        console.log('- Reviewer: reviewer@weframetech.com');
        console.log('- Editor: editor@weframetech.com');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}
//# sourceMappingURL=seed.js.map