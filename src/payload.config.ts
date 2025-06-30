import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import path from 'path';

// Collections
import { Users } from './collections/Users';
import { Blogs } from './collections/Blogs';
import { Contracts } from './collections/Contracts';
import { Workflows } from './collections/Workflows';
import { WorkflowLogs } from './collections/WorkflowLogs';
import { Media } from './collections/Media';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Workflow CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },
  collections: [
    Users,
    Blogs,
    Contracts,
    Workflows,
    WorkflowLogs,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-cms',
  }),
  editor: slateEditor({}),
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  csrf: ['http://localhost:3000', 'http://localhost:3001'],
}); 