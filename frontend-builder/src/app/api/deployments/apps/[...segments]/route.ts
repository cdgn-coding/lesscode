import {getApplicationById} from "@/repository/apps";
import {getWorkflowDefinition, getWorkflowDefinitionString} from "@/repository/workflows";
import {Workflow} from "executable-workflows";

function matchPathPattern(path, pathPattern) {
    const pathSegments = path.split('/');
    const patternSegments = pathPattern.split('/');

    // Check if both paths have the same number of segments
    if (pathSegments.length !== patternSegments.length) {
        return false;
    }

    for (let i = 0; i < patternSegments.length; i++) {
        if (!patternSegments[i].startsWith(':') && patternSegments[i] !== pathSegments[i]) {
            // Segment does not match
            return false;
        }
    }

    return true;
}

function extractPathParameters(path, pathPattern) {
    const pathSegments = path.split('/');
    const patternSegments = pathPattern.split('/');

    const params = {};

    for (let i = 0; i < patternSegments.length; i++) {
        if (patternSegments[i].startsWith(':')) {
            // It's a parameter
            const paramName = patternSegments[i].substring(1);
            params[paramName] = pathSegments[i];
        }
    }

    return params;
}

async function databaseConnection(type: string, connectionStr: string): any {
    if (type === 'MongoDB') {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(connectionStr);
        await client.connect();
        return {
            client,
            disconnect: async () => {
                await client.close();
            }
        }
    }

    if (type === 'PostgreSQL') {
        const { Client } = require('pg');
        const client = new Client({
            connectionString: connectionStr
        });
        await client.connect();
        return {
            client,
            disconnect: async () => {
                await client.end();
            }
        }
    }

    throw new Error('Unsupported database type');
}

async function handler(req, { params }) {
    const { segments } = params;
    const applicationId = segments[0];
    const application = await getApplicationById(applicationId)
    const applicationSegments = [...segments]
    applicationSegments.shift()
    const endpointPath = `/${applicationSegments.join('/')}`
    const matches = application?.endpoints!.filter(endpoint => endpoint.method === req.method && matchPathPattern(endpointPath, endpoint.pathPattern))

    if (matches.length === 0) {
        return new Response(JSON.stringify({message: 'No matching path'}), {
            status: 404,
            headers: {'Content-Type': 'application/json'}
        });
    }

    if (matches.length > 1) {
        return new Response(JSON.stringify({message: 'Multiple application endpoints matching'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }

    const endpoint = matches[0]
    const endpointParams = extractPathParameters(endpointPath, endpoint.pathPattern)

    const databases = {}
    for (const db of application?.databases) {
        databases[db.name] = await databaseConnection(db.type, db.connectionStr)
    }

    const context = {
        request: {
            path: endpointPath,
            params: endpointParams,
            async json() {
                return req.json()
            },
            async text() {
                return req.text()
            }
        },
        response: {
            body: {},
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        },
        databases,
    }

    const workflowDefinition = await getWorkflowDefinitionString(endpoint.workflow)
    const workflow = Workflow.load(workflowDefinition)
    await workflow.run(context)

    for (const db of Object.values(databases)) {
        await db.disconnect()
    }

    return new Response(JSON.stringify(context.response.body), {
        status: context.response.status,
        headers: context.response.headers,
    });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;

export const PATCH = handler;

export const HEAD = handler;

export const OPTIONS = handler;