// Manual debug functions - paste these into browser console

// Patient lookup test functions
const testPatients = [
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

const findPatientById = (registrationId) => {
  console.log("Looking for patient with ID:", registrationId);
  const trimmedId = registrationId.trim().toUpperCase();
  console.log("Trimmed and uppercased ID:", trimmedId);
  
  const result = testPatients.find(patient => {
    const patientId = patient.registrationId.trim().toUpperCase();
    console.log("Comparing with:", patientId);
    return patientId === trimmedId;
  }) || null;
  
  console.log("Search result:", result);
  return result;
};

const searchPatients = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return testPatients.filter(patient => 
    patient.name.toLowerCase().includes(lowercaseQuery) ||
    patient.registrationId.toLowerCase().includes(lowercaseQuery) ||
    patient.email.toLowerCase().includes(lowercaseQuery)
  );
};

const getAllPatients = () => testPatients;

// Create debug object
window.debugMediSync = {
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

console.log('✅ Debug functions loaded! Try: debugMediSync.testPatientLookup()');
