"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("payload/config");
const path_1 = __importDefault(require("path"));
// Collections
const Users_1 = require("./collections/Users");
const Blogs_1 = require("./collections/Blogs");
const Contracts_1 = require("./collections/Contracts");
const Workflows_1 = require("./collections/Workflows");
const WorkflowLogs_1 = require("./collections/WorkflowLogs");
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    admin: {
        user: Users_1.Users.slug,
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
    ],
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path_1.default.resolve(__dirname, 'generated-schema.graphql'),
    },
    cors: ['http://localhost:3000', 'http://localhost:3001'],
    csrf: ['http://localhost:3000', 'http://localhost:3001'],
});
//# sourceMappingURL=payload.config.js.map