import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where, 
  onSnapshot,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your firebase config from step 1
const firebaseConfig = {
  apiKey: "AIzaSyCnw7wS5L0D0AFkCOnOUolzCYkYyVxAw4o",
  authDomain: "smart-campus-9b542.firebaseapp.com",
  projectId: "smart-campus-9b542",
  storageBucket: "smart-campus-9b542.firebasestorage.app",
  messagingSenderId: "534838230010",
  appId: "1:534838230010:web:aaf036c29fdc3d8c5c4243",
  measurementId: "G-QRZZ91VF5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection references
export const usersCollection = collection(db, 'users');
export const appointmentsCollection = collection(db, 'appointments');
export const maintenanceCollection = collection(db, 'maintenance');
export const notificationsCollection = collection(db, 'notifications');
export const timeSlotsCollection = collection(db, 'timeSlots');
export const roomsCollection = collection(db, 'rooms');

// Helper Functions
export const addDocument = async (collectionRef, data) => {
  return await addDoc(collectionRef, { 
    ...data, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

export const getDocuments = async (collectionRef) => {
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocumentById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  return await updateDoc(docRef, { 
    ...data, 
    updatedAt: new Date().toISOString() 
  });
};

export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return await deleteDoc(docRef);
};

export const queryDocuments = async (collectionRef, conditions) => {
  let q = collectionRef;
  conditions.forEach(condition => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Real-time listener
export const listenToCollection = (collectionRef, callback) => {
  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const listenToQuery = (q, callback) => {
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};