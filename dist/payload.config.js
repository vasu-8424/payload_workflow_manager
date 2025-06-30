"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("payload/config");
const bundler_webpack_1 = require("@payloadcms/bundler-webpack");
const richtext_slate_1 = require("@payloadcms/richtext-slate");
const db_mongodb_1 = require("@payloadcms/db-mongodb");
const path_1 = __importDefault(require("path"));
// Collections
const Users_1 = require("./collections/Users");
const Blogs_1 = require("./collections/Blogs");
const Contracts_1 = require("./collections/Contracts");
const Workflows_1 = require("./collections/Workflows");
const WorkflowLogs_1 = require("./collections/WorkflowLogs");
const Media_1 = require("./collections/Media");
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    admin: {
        user: Users_1.Users.slug,
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: '- Workflow CMS',
            favicon: '/favicon.ico',
            ogImage: '/og-image.jpg',
        },
    },
    collections: [
        Users_1.Users,
        Blogs_1.Blogs,
        Contracts_1.Contracts,
        Workflows_1.Workflows,
        WorkflowLogs_1.WorkflowLogs,
        Media_1.Media,
    ],
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path_1.default.resolve(__dirname, 'generated-schema.graphql'),
    },
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-cms',
    }),
    editor: (0, richtext_slate_1.slateEditor)({}),
    cors: ['http://localhost:3000', 'http://localhost:3001'],
    csrf: ['http://localhost:3000', 'http://localhost:3001'],
});
//# sourceMappingURL=payload.config.js.map