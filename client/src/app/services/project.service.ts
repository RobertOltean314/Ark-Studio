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
import { Project } from '../models/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  constructor(private firestore: Firestore) {}

  // Projects Collection Methods
  async addProject(project: Omit<Project, 'id'>): Promise<string> {
    try {
      const projectsCollection = collection(this.firestore, 'projects');
      const docRef = await addDoc(projectsCollection, {
        ...project,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const docRef = doc(this.firestore, 'projects', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const projectsCollection = collection(this.firestore, 'projects');
      const q = query(
        projectsCollection, 
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const projects: Project[] = [];
      
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() } as Project);
      });
      
      return projects;
    } catch (error) {
      console.error('Error getting user projects:', error);
      throw error;
    }
  }

  // Real-time listener for user projects
  getUserProjectsRealtime(userId: string): Observable<Project[]> {
    return new Observable(observer => {
      const projectsCollection = collection(this.firestore, 'projects');
      const q = query(
        projectsCollection, 
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
          projects.push({ id: doc.id, ...doc.data() } as Project);
        });
        observer.next(projects);
      }, (error) => {
        observer.error(error);
      });

      // Return cleanup function
      return () => unsubscribe();
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'projects', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'projects', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}