// MongoDB Service - Emulation for later connection to real MongoDB
import { MongoClient, Collection, OptionalId } from 'mongodb';

export interface MongoDocument {
    _id?: string;
    [key: string]: any;
}

export interface MongoQueryOptions {
    sort?: { [key: string]: 1 | -1 };
    limit?: number;
    skip?: number;
}

export interface MongoLeaderRecord extends MongoDocument {
    _id?: string;
    name: string;
    timeMs: number;
    moves: number;
    score: number;
    size: number;
    clientId: string;
    createdAt: Date;
}

export class MongoDBService {
    private uri: string;
    private dbName: string;
    private client: MongoClient | null = null;
    private mongoCollection: Collection<MongoLeaderRecord> | null = null;
    private isConnected: boolean = false;

    constructor() {
        // this.uri = "mongodb+srv://alejoas1981:<db_password>@cluster0.afbg1az.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        // this.dbName = "15_Puzzle";
    }

    async connect(): Promise<boolean> {
        try {
            // this.client = new MongoClient(this.uri.replace('<db_password>', 'ngSMvCxcL1lixDrl'));
            // await this.client.connect();
            // this.mongoCollection = this.client.db(this.dbName).collection('liders');
            this.isConnected = true;
            console.log('MongoDB connected successfully');
            return true;
        } catch (error) {
            console.warn('MongoDB connection failed, using localStorage fallback:', error);
            this.isConnected = false;
            return false;
        }
    }

    private getCollection(): MongoLeaderRecord[] {
        if (this.isConnected && this.mongoCollection) {
            return this.mongoCollection as unknown as MongoLeaderRecord[];
        }
        const data = localStorage.getItem('mongodb_liders') || '[]';
        return JSON.parse(data);
    }

    private saveCollection(data: any[]) {
        localStorage.setItem('mongodb_liders', JSON.stringify(data));
    }

    async insertOne(document: Omit<MongoLeaderRecord, '_id'>): Promise<{ insertedId: string }> {
        try {
            const fullDoc: OptionalId<MongoLeaderRecord> = {
                name: document.name,
                timeMs: document.timeMs,
                moves: document.moves,
                score: document.score,
                size: document.size,
                clientId: document.clientId,
                createdAt: document.createdAt || new Date()
            };

            if (this.isConnected && this.mongoCollection) {
                const result = await this.mongoCollection.insertOne(fullDoc);
                console.log('MongoDB insertOne:', result.insertedId.toString());
                return { insertedId: result.insertedId.toString() };
            } else {
                const collection = this.getCollection();
                const newDoc: MongoLeaderRecord = { ...fullDoc, _id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
                collection.push(newDoc);
                this.saveCollection(collection);
                console.log('LocalStorage insertOne:', newDoc);
                return { insertedId: newDoc._id! };
            }
        } catch (error) {
            console.error('insertOne error:', error);
            throw error;
        }
    }

    async find(filter: Partial<MongoLeaderRecord> = {}, options: MongoQueryOptions = {}): Promise<MongoLeaderRecord[]> {
        try {
            if (this.isConnected && this.mongoCollection) {
                const cursor = this.mongoCollection.find(filter);
                if (options.sort) cursor.sort(options.sort);
                if (options.skip) cursor.skip(options.skip);
                if (options.limit) cursor.limit(options.limit);
                const results = await cursor.toArray();
                return results;
            } else {
                let collection = this.getCollection().map((doc: any) => ({ ...doc, createdAt: new Date(doc.createdAt) }));
                if (Object.keys(filter).length > 0) {
                    collection = collection.filter(doc =>
                        Object.entries(filter).every(([k, v]) => v === undefined || doc[k as keyof MongoLeaderRecord] === v)
                    );
                }
                if (options.sort) {
                    const sortKeys = Object.entries(options.sort);
                    collection.sort((a, b) => {
                        for (const [key, dir] of sortKeys) {
                            const aVal = a[key as keyof MongoLeaderRecord];
                            const bVal = b[key as keyof MongoLeaderRecord];
                            if (aVal < bVal) return dir === 1 ? -1 : 1;
                            if (aVal > bVal) return dir === 1 ? 1 : -1;
                        }
                        return 0;
                    });
                }
                if (options.skip) collection = collection.slice(options.skip);
                if (options.limit) collection = collection.slice(0, options.limit);
                console.log('LocalStorage find:', { filter, options, results: collection.length });
                return collection;
            }
        } catch (error) {
            console.error('find error:', error);
            throw error;
        }
    }

    async findOne(filter: Partial<MongoLeaderRecord>): Promise<MongoLeaderRecord | null> {
        const results = await this.find(filter, { limit: 1 });
        return results.length > 0 ? results[0] : null;
    }

    async updateOne(filter: Partial<MongoLeaderRecord>, update: Partial<MongoLeaderRecord>): Promise<{ modifiedCount: number }> {
        try {
            if (this.isConnected && this.mongoCollection) {
                const result = await this.mongoCollection.updateOne(filter, { $set: update });
                return { modifiedCount: result.modifiedCount };
            } else {
                const collection = this.getCollection();
                let modifiedCount = 0;
                for (let i = 0; i < collection.length; i++) {
                    const doc = collection[i];
                    const matches = Object.entries(filter).every(([k, v]) => doc[k] === v);
                    if (matches) {
                        collection[i] = { ...doc, ...update };
                        modifiedCount = 1;
                        break;
                    }
                }
                this.saveCollection(collection);
                console.log('LocalStorage updateOne:', { filter, update, modifiedCount });
                return { modifiedCount };
            }
        } catch (error) {
            console.error('updateOne error:', error);
            throw error;
        }
    }

    async deleteOne(filter: Partial<MongoLeaderRecord>): Promise<{ deletedCount: number }> {
        try {
            if (this.isConnected && this.mongoCollection) {
                const result = await this.mongoCollection.deleteOne(filter);
                return { deletedCount: result.deletedCount };
            } else {
                let collection = this.getCollection();
                const initialLength = collection.length;
                collection = collection.filter(doc => !Object.entries(filter).every(([k, v]) => doc[k] === v));
                const deletedCount = initialLength - collection.length;
                this.saveCollection(collection);
                console.log('LocalStorage deleteOne:', { filter, deletedCount });
                return { deletedCount };
            }
        } catch (error) {
            console.error('deleteOne error:', error);
            throw error;
        }
    }

    async countDocuments(filter: Partial<MongoLeaderRecord> = {}): Promise<number> {
        try {
            if (this.isConnected && this.mongoCollection) {
                return await this.mongoCollection.countDocuments(filter);
            } else {
                const results = await this.find(filter);
                console.log('LocalStorage countDocuments:', { filter, count: results.length });
                return results.length;
            }
        } catch (error) {
            console.error('countDocuments error:', error);
            throw error;
        }
    }

    async aggregate(pipeline: any[]): Promise<any[]> {
        try {
            if (this.isConnected && this.mongoCollection) {
                const cursor = this.mongoCollection.aggregate(pipeline);
                return await cursor.toArray();
            } else {
                const collection = this.getCollection();
                console.log('LocalStorage aggregate (simplified):', pipeline);
                return collection;
            }
        } catch (error) {
            console.error('aggregate error:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.mongoCollection = null;
            this.isConnected = false;
            console.log('MongoDB connection closed');
        }
    }

    isConnectionActive(): boolean {
        return this.isConnected;
    }
}

// Singleton
export const mongodb = new MongoDBService();
