"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const payload_1 = __importDefault(require("payload"));
const seed_1 = require("./seed");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Payload
const start = async () => {
    await payload_1.default.init({
        secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
        express: app,
        onInit: async () => {
            payload_1.default.logger.info(`Payload Admin URL: ${payload_1.default.getAdminURL()}`);
        },
    });
    // Simple API routes for workflow management
    app.post('/api/workflows/trigger', async (req, res) => {
        try {
            const { documentId, collectionSlug } = req.body;
            if (!documentId || !collectionSlug) {
                return res.status(400).json({ error: 'Document ID and collection slug are required' });
            }
            // For demo purposes, just log the action
            console.log(`🚀 Workflow triggered for document ${documentId} in collection ${collectionSlug}`);
            res.json({ success: true, message: 'Workflow triggered successfully' });
        }
        catch (error) {
            console.error('Error triggering workflow:', error);
            res.status(500).json({ error: 'Failed to trigger workflow' });
        }
    });
    app.get('/api/workflows/status/:docId', async (req, res) => {
        try {
            const { docId } = req.params;
            const { collection } = req.query;
            if (!collection) {
                return res.status(400).json({ error: 'Collection parameter is required' });
            }
            // For demo purposes, return mock status
            const mockStatus = {
                hasWorkflow: true,
                workflow: {
                    id: 'demo-workflow',
                    name: 'Demo Workflow',
                    currentStep: 0,
                    isActive: true,
                    stepStatus: [
                        {
                            stepId: 1,
                            name: 'Review Step',
                            type: 'review',
                            status: 'in_progress',
                            assignees: ['demo-user'],
                            approvals: []
                        }
                    ],
                    startDate: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                }
            };
            res.json(mockStatus);
        }
        catch (error) {
            console.error('Error getting workflow status:', error);
            res.status(500).json({ error: 'Failed to get workflow status' });
        }
    });
    app.post('/api/workflows/action', async (req, res) => {
        try {
            const { documentId, collectionSlug, stepIndex, action, comment } = req.body;
            if (!documentId || !collectionSlug || stepIndex === undefined || !action) {
                return res.status(400).json({
                    error: 'Document ID, collection slug, step index, and action are required'
                });
            }
            // For demo purposes, just log the action
            console.log(`📝 Action ${action} processed for document ${documentId}, step ${stepIndex}`);
            if (comment) {
                console.log(`💬 Comment: ${comment}`);
            }
            res.json({ success: true, message: `Action ${action} processed successfully` });
        }
        catch (error) {
            console.error('Error processing workflow action:', error);
            res.status(500).json({ error: 'Failed to process workflow action' });
        }
    });
    // Seed data endpoint (for development)
    if (process.env.NODE_ENV === 'development') {
        app.post('/api/seed', async (req, res) => {
            try {
                await (0, seed_1.seedData)();
                res.json({ success: true, message: 'Database seeded successfully' });
            }
            catch (error) {
                console.error('Error seeding data:', error);
                res.status(500).json({ error: 'Failed to seed data' });
            }
        });
    }
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`📊 Admin panel: http://localhost:${port}/admin`);
        console.log(`🔧 API endpoints:`);
        console.log(`   POST /api/workflows/trigger`);
        console.log(`   GET /api/workflows/status/:docId`);
        console.log(`   POST /api/workflows/action`);
        console.log(`   POST /api/seed (development only)`);
    });
};
start().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map