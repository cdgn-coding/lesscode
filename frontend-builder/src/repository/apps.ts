import {getDatabase} from "@/lib/mongodb";
import {nanoid} from "nanoid";
import { ObjectId } from "mongodb";
import {Workflow} from 'executable-workflows';

const shortIdSize = 6;

export type Endpoint = {
    _id?: string
    method: string
    pathPattern: string
    workflow: string
}

export type Workflow = {
    _id?: string
    name: string
    description: string
}

export type Database = {
    _id?: string
    name: string
    description: string
    type: string
    connectionStr: string
}

export type Application = {
    _id?: string
    shortId: string
    name: string
    description: string
    createdAt: string
    endpoints: Endpoint[]
    workflows: Workflow[]
    databases: Database[]
}

const collectionName = 'applications';

export const createApplication = async (data: Partial<Application>): Promise<Application> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const res = await applications.insertOne({
        name: data.name!,
        description: data.description!,
        createdAt: new Date().toISOString(),
        shortId: nanoid(shortIdSize),
        endpoints: [],
        workflows: [],
        databases: []
    });
    const result = await getApplicationById(res.insertedId);

    return result!
}

export const getApplicationById = async (id: string): Promise<Application | null> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(id);
    return applications.findOne({ _id: idObject } as any);
}

// patch only the fields that are present in the data object
export const updateApplication = async (id: string, data: Partial<Application>): Promise<Application> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(id);
    const subset = Object.keys(data).reduce((acc, key) => {
        if (['name', 'description'].includes(key) && data[key] !== undefined) {
            acc[key] = data[key];
        }
        return acc;
    }, {} as Partial<Application>);
    await applications.updateOne(
        { _id: idObject } as any,
        { $set: subset }
    );

    return getApplicationById(id)!;
}

export const getApplications = async (): Promise<Application[]> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    return applications.find().toArray();
}

export const addWorkflow = async (appId: string, data: Partial<Workflow>): Promise<Workflow> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(appId);
    const id = new ObjectId().toHexString();
    const workflow = {
        ...data,
        _id: id
    } as Workflow;
    await applications.updateOne(
        { _id: idObject } as any,
        { $push: { workflows: workflow } }
    );

    return workflow;
}

export const addEndpoint = async (appId: string, data: Partial<Endpoint>): Promise<Endpoint> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(appId);
    const id = new ObjectId().toHexString();
    const endpoint = {
        ...data,
        _id: id
    } as Endpoint;
    await applications.updateOne(
        { _id: idObject } as any,
        { $push: { endpoints: endpoint } }
    );

    return endpoint;
}

export const editEndpoint = async (appId: string, endpointId: string, data: Partial<Endpoint>): Promise<Endpoint> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(appId);
    const endpoint = {
        ...data,
        _id: endpointId
    } as Endpoint;

    await applications.updateOne(
        { _id: idObject, "endpoints._id": endpointId } as any,
        { $set: { "endpoints.$": endpoint } }
    );

    return endpoint;
}

export const addDatabase = async (appId: string, data: Partial<Database>): Promise<Database> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(appId);
    const id = new ObjectId().toHexString();
    const database = {
        ...data,
        _id: id
    } as Database;
    console.log('database', database)
    await applications.updateOne(
        { _id: idObject } as any,
        { $push: { databases: database } }
    );

    return database;
}

export const editDatabase = async (appId: string, databaseId: string, data: Partial<Database>): Promise<Database> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(appId);
    const database = {
        ...data,
        _id: databaseId
    } as Database;

    await applications.updateOne(
        { _id: idObject, "databases._id": databaseId } as any,
        { $set: { "databases.$": database } }
    );

    return database;
}