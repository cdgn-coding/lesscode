import {getDatabase} from "@/lib/mongodb";
import {nanoid} from "nanoid";
import { ObjectId } from "mongodb";

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

export const getApplications = async (): Promise<Application[]> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    return applications.find().toArray();
}

export const addWorkflow = async (appId: string, data: Partial<Workflow>): Promise<Application | null> => {
    const db = await getDatabase();
    const applications = db.collection<Application>(collectionName);
    const idObject = new ObjectId(appId);
    const id = new ObjectId().toHexString();
    const res = await applications.updateOne(
        { _id: idObject } as any,
        { $push: { workflows: {
            ...data,
            _id: id
        } as Workflow } }
    );
    const result = await getApplicationById(appId);
    return result;
}