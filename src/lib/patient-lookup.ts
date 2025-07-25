// Patient lookup service for both test accounts and Firestore data
import { collection, query, where, getDocs, Firestore } from 'firebase/firestore';
// @ts-ignore - Firebase_config.js doesn't provide proper TypeScript types
import { db as dbImport } from '../../Firebase_config';

// Type-safe Firebase instance
// @ts-ignore
const db = dbImport as import('firebase/firestore').Firestore | null;

interface Patient {
  name: string;
  registrationId: string;
  email: string;
  description: string;
}

const testPatients: Patient[] = [
  {
    name: "John Smith",
    registrationId: "P-MS-003",
    email: "john.smith@test.com",
    description: "Patient with cardiac monitoring data"
  },
  {
    name: "Sarah Johnson",
    registrationId: "P-MS-004",
    email: "sarah.johnson@test.com",
    description: "Patient with diabetes management records"
  }
];

// Firestore lookup for real patient data
async function findPatientInFirestore(registrationId: string): Promise<Patient | null> {
  try {
    if (!db || typeof db !== 'object') {
      console.log("Firestore not available, skipping database lookup");
      return null;
    }

    const usersRef = collection(db as Firestore, 'users');
    const q = query(usersRef, where('registrationId', '==', registrationId.trim()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return {
        name: userData.displayName || 'Unknown Patient',
        registrationId: userData.registrationId,
        email: userData.email,
        description: `${userData.role === 'patient' ? 'Patient' : 'Doctor'} registered in Firestore`
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching Firestore:", error);
    return null;
  }
}

export async function findPatientById(registrationId: string): Promise<Patient | null> {
  console.log("Looking for patient with ID:", registrationId);
  const trimmedId = registrationId.trim().toUpperCase();
  console.log("Trimmed and uppercased ID:", trimmedId);
  
  // First try Firestore
  const firestoreResult = await findPatientInFirestore(trimmedId);
  if (firestoreResult) {
    console.log("Found in Firestore:", firestoreResult);
    return firestoreResult;
  }
  
  // Fall back to test patients
  const result = testPatients.find(patient => {
    const patientId = patient.registrationId.trim().toUpperCase();
    console.log("Comparing with:", patientId);
    return patientId === trimmedId;
  }) || null;
  
  console.log("Search result:", result);
  return result;
}

export function searchPatients(query: string): Patient[] {
  const lowercaseQuery = query.toLowerCase();
  return testPatients.filter(patient => 
    patient.name.toLowerCase().includes(lowercaseQuery) ||
    patient.registrationId.toLowerCase().includes(lowercaseQuery) ||
    patient.email.toLowerCase().includes(lowercaseQuery)
  );
}

export function getAllPatients(): Patient[] {
  return testPatients;
}
