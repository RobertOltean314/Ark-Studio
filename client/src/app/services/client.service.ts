import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    DocumentData,
    QuerySnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../models/client.interface';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    constructor(private firestore: Firestore) { }

    async addClient(client: Omit<Client, 'id'>): Promise<string> {
        try {
            const clientsCollection = collection(this.firestore, 'clients');
            const docRef = await addDoc(clientsCollection, {
                ...client,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding client:', error);
            throw error;
        }
    }

    async getClient(id: string): Promise<Client | null> {
        try {
            const docRef = doc(this.firestore, 'clients', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Client;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting client:', error);
            throw error;
        }
    }

    async getUserClients(userId: string): Promise<Client[]> {
        try {
            const clientsCollection = collection(this.firestore, 'clients');
            const q = query(
                clientsCollection,
                where('userId', '==', userId),
                orderBy('name', 'asc')
            );

            const querySnapshot = await getDocs(q);
            const clients: Client[] = [];

            querySnapshot.forEach((doc) => {
                clients.push({ id: doc.id, ...doc.data() } as Client);
            });

            return clients;
        } catch (error) {
            console.error('Error getting user clients:', error);
            throw error;
        }
    }

    getUserClientsRealtime(userId: string): Observable<Client[]> {
        return new Observable(observer => {
            const clientsCollection = collection(this.firestore, 'clients');
            const q = query(
                clientsCollection,
                where('userId', '==', userId),
                orderBy('name', 'asc')
            );

            const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
                const clients: Client[] = [];
                querySnapshot.forEach((doc) => {
                    clients.push({ id: doc.id, ...doc.data() } as Client);
                });
                observer.next(clients);
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    async updateClient(id: string, updates: Partial<Client>): Promise<void> {
        try {
            const docRef = doc(this.firestore, 'clients', id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        }
    }

    async deleteClient(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, 'clients', id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    }
}