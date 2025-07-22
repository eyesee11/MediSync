// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PatientDataConsent
 * @dev Smart contract for managing patient medical record approvals with IPFS integration
 * @notice This contract handles the decentralized storage and approval of medical records
 */
contract PatientDataConsent {
    address public owner;
    
    // Struct to represent a medical record
    struct Record {
        string ipfsHash;        // IPFS hash of the encrypted medical document
        address patient;        // Address of the patient who owns the record
        address doctor;         // Address of the doctor who approved the record
        bool approved;          // Whether the record has been approved by a doctor
        uint256 timestamp;      // Timestamp when the record was created
        string recordType;      // Type of record (e.g., "lab_report", "prescription", "diagnosis")
        string description;     // Brief description of the record
    }
    
    // Mappings
    mapping(uint => Record) public records;
    mapping(address => bool) public approvers;           // Authorized doctors/approvers
    mapping(address => uint[]) public patientRecords;    // Records owned by each patient
    mapping(address => uint[]) public doctorApprovals;   // Records approved by each doctor
    
    // State variables
    uint public recordCount;
    
    // Events
    event DataUploaded(
        uint indexed id, 
        address indexed patient, 
        string ipfsHash, 
        string recordType,
        string description
    );
    
    event DataApproved(
        uint indexed id, 
        address indexed doctor, 
        address indexed patient
    );
    
    event ApproverAdded(address indexed approver);
    event ApproverRemoved(address indexed approver);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyApprover() {
        require(approvers[msg.sender], "Only authorized approvers can call this function");
        _;
    }
    
    modifier recordExists(uint _id) {
        require(_id < recordCount, "Record does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        approvers[msg.sender] = true; // Owner is initially an approver
    }
    
    /**
     * @dev Add a new approver (doctor)
     * @param _approver Address of the doctor to be added as approver
     */
    function addApprover(address _approver) public onlyOwner {
        require(_approver != address(0), "Invalid address");
        require(!approvers[_approver], "Already an approver");
        
        approvers[_approver] = true;
        emit ApproverAdded(_approver);
    }
    
    /**
     * @dev Remove an approver
     * @param _approver Address of the approver to be removed
     */
    function removeApprover(address _approver) public onlyOwner {
        require(_approver != owner, "Cannot remove owner");
        require(approvers[_approver], "Not an approver");
        
        approvers[_approver] = false;
        emit ApproverRemoved(_approver);
    }
    
    /**
     * @dev Upload a new medical record to IPFS and store metadata on blockchain
     * @param _ipfsHash IPFS hash of the uploaded medical document
     * @param _recordType Type of the medical record
     * @param _description Brief description of the record
     */
    function uploadData(
        string memory _ipfsHash, 
        string memory _recordType,
        string memory _description
    ) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_recordType).length > 0, "Record type cannot be empty");
        
        records[recordCount] = Record({
            ipfsHash: _ipfsHash,
            patient: msg.sender,
            doctor: address(0),
            approved: false,
            timestamp: block.timestamp,
            recordType: _recordType,
            description: _description
        });
        
        patientRecords[msg.sender].push(recordCount);
        
        emit DataUploaded(recordCount, msg.sender, _ipfsHash, _recordType, _description);
        recordCount++;
    }
    
    /**
     * @dev Approve a medical record (only authorized doctors)
     * @param _id ID of the record to approve
     */
    function approveData(uint _id) public onlyApprover recordExists(_id) {
        Record storage rec = records[_id];
        require(!rec.approved, "Record already approved");
        
        rec.doctor = msg.sender;
        rec.approved = true;
        
        doctorApprovals[msg.sender].push(_id);
        
        emit DataApproved(_id, msg.sender, rec.patient);
    }
    
    /**
     * @dev Get detailed information about a record
     * @param _id ID of the record
     * @return ipfsHash IPFS hash of the record
     * @return approved Approval status
     * @return patient Patient address
     * @return doctor Doctor address
     * @return timestamp Record timestamp
     * @return recordType Type of record
     * @return description Record description
     */
    function getRecord(uint _id) public view recordExists(_id) returns (
        string memory ipfsHash,
        bool approved,
        address patient,
        address doctor,
        uint256 timestamp,
        string memory recordType,
        string memory description
    ) {
        Record storage rec = records[_id];
        return (
            rec.ipfsHash,
            rec.approved,
            rec.patient,
            rec.doctor,
            rec.timestamp,
            rec.recordType,
            rec.description
        );
    }
    
    /**
     * @dev Get all record IDs for a specific patient
     * @param _patient Address of the patient
     * @return Array of record IDs
     */
    function getPatientRecords(address _patient) public view returns (uint[] memory) {
        return patientRecords[_patient];
    }
    
    /**
     * @dev Get all record IDs approved by a specific doctor
     * @param _doctor Address of the doctor
     * @return Array of record IDs
     */
    function getDoctorApprovals(address _doctor) public view returns (uint[] memory) {
        return doctorApprovals[_doctor];
    }
    
    /**
     * @dev Get pending records (unapproved) for a specific patient
     * @param _patient Address of the patient
     * @return Array of pending record IDs
     */
    function getPendingRecords(address _patient) public view returns (uint[] memory) {
        uint[] memory patientRecordIds = patientRecords[_patient];
        uint[] memory tempPending = new uint[](patientRecordIds.length);
        uint pendingCount = 0;
        
        for (uint i = 0; i < patientRecordIds.length; i++) {
            if (!records[patientRecordIds[i]].approved) {
                tempPending[pendingCount] = patientRecordIds[i];
                pendingCount++;
            }
        }
        
        // Create array with exact size
        uint[] memory pendingRecords = new uint[](pendingCount);
        for (uint i = 0; i < pendingCount; i++) {
            pendingRecords[i] = tempPending[i];
        }
        
        return pendingRecords;
    }
    
    /**
     * @dev Get total number of records
     * @return Total record count
     */
    function getTotalRecords() public view returns (uint) {
        return recordCount;
    }
    
    /**
     * @dev Check if an address is an approved doctor
     * @param _address Address to check
     * @return Boolean indicating if address is an approver
     */
    function isApprover(address _address) public view returns (bool) {
        return approvers[_address];
    }
}
