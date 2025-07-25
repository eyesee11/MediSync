// Debug helper to expose functions to browser console
import { findPatientById, searchPatients, getAllPatients } from '@/lib/patient-lookup';

if (typeof window !== 'undefined') {
  // Make functions available in browser console for debugging
  (window as any).debugMediSync = {
    findPatientById,
    searchPatients,
    getAllPatients,
    testPatientLookup: () => {
      console.log('🧪 Testing Patient Lookup Functions:');
      console.log('📋 All Patients:', getAllPatients());
      console.log('🔍 Find P-MS-003:', findPatientById('P-MS-003'));
      console.log('🔍 Find p-ms-004:', findPatientById('p-ms-004'));
      console.log('🔍 Search "John":', searchPatients('John'));
      console.log('🔍 Search "Dr":', searchPatients('Dr'));
    }
  };
  
  console.log('🎯 MediSync Debug Functions Available:');
  console.log('   • debugMediSync.findPatientById("P-MS-003")');
  console.log('   • debugMediSync.searchPatients("John")');
  console.log('   • debugMediSync.getAllPatients()');
  console.log('   • debugMediSync.testPatientLookup()');
}
