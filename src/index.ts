import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import payload from 'payload';
import { seedData } from './seed';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Simple API routes for workflow management
  app.post('/api/workflows/trigger', async (req: any, res: any) => {
    try {
      const { documentId, collectionSlug } = req.body;
      
      if (!documentId || !collectionSlug) {
        return res.status(400).json({ error: 'Document ID and collection slug are required' });
      }

      // For demo purposes, just log the action
      console.log(`🚀 Workflow triggered for document ${documentId} in collection ${collectionSlug}`);
      
      res.json({ success: true, message: 'Workflow triggered successfully' });
    } catch (error) {
      console.error('Error triggering workflow:', error);
      res.status(500).json({ error: 'Failed to trigger workflow' });
    }
  });

  app.get('/api/workflows/status/:docId', async (req: any, res: any) => {
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
    } catch (error) {
      console.error('Error getting workflow status:', error);
      res.status(500).json({ error: 'Failed to get workflow status' });
    }
  });

  app.post('/api/workflows/action', async (req: any, res: any) => {
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
    } catch (error) {
      console.error('Error processing workflow action:', error);
      res.status(500).json({ error: 'Failed to process workflow action' });
    }
  });

  // Seed data endpoint (for development)
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/seed', async (req: any, res: any) => {
      try {
        await seedData();
        res.json({ success: true, message: 'Database seeded successfully' });
      } catch (error) {
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