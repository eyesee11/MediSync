# MediSync Blockchain Integration - Testing Guide

## Overview

This guide will help you set up and test the blockchain functionality for medical record management using Ethereum smart contracts and IPFS for decentralized storage.

## Prerequisites

### Software Requirements

1. **Node.js** (v18 or higher)
2. **MetaMask** browser extension
3. **Git** for version control

### Development Tools

```bash
# Install Hardhat globally
npm install -g hardhat

# Install IPFS CLI (optional)
npm install -g ipfs
```

## Setup Instructions

### 1. Blockchain Setup

Navigate to the blockchain directory:

```bash
cd blockchain/
```

Install dependencies:

```bash
npm install
```

### 2. Deploy Smart Contract Locally

Start a local Hardhat node (keep this running in a separate terminal):

```bash
npx hardhat node
```

This will:

- Start a local Ethereum network on `http://127.0.0.1:8545`
- Provide 20 test accounts with 10,000 ETH each
- Display private keys for testing

Deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address from the output and update `src/lib/blockchain/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 3. MetaMask Configuration

1. **Install MetaMask** if not already installed
2. **Add Local Network**:

   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. **Import Test Account**:
   - Copy a private key from the Hardhat node output
   - Import into MetaMask for testing

### 4. IPFS Setup (Optional - for local testing)

Install and start local IPFS node:

```bash
# Initialize IPFS
ipfs init

# Start IPFS daemon
ipfs daemon
```

For production, you can use:

- **Infura IPFS**: https://infura.io/product/ipfs
- **Pinata**: https://pinata.cloud/
- **Web3.Storage**: https://web3.storage/

## Testing Scenarios

### Scenario 1: Patient Uploads Medical Record

1. **Connect Wallet**:

   - Open MediSync application
   - Navigate to blockchain features (when enabled)
   - Connect MetaMask wallet

2. **Upload Document**:

   ```javascript
   // Example: Upload a PDF report
   const file = /* File object from input */;
   const recordType = "lab_report";
   const description = "Blood test results - CBC";

   // Upload to IPFS
   const ipfsResult = await ipfsService.uploadFile(file);

   // Store metadata on blockchain
   const success = await blockchainService.uploadRecord(
     ipfsResult.hash,
     recordType,
     description
   );
   ```

3. **Verify Upload**:
   - Check transaction on local blockchain
   - Verify IPFS hash is stored correctly
   - Confirm record appears in patient's list

### Scenario 2: Doctor Approves Record

1. **Add Doctor as Approver**:

   ```javascript
   // Contract owner adds doctor address as approver
   await blockchainService.addApprover(doctorWalletAddress);
   ```

2. **Doctor Reviews and Approves**:

   ```javascript
   // Doctor connects wallet and approves record
   const recordId = 0; // First record
   const success = await blockchainService.approveRecord(recordId);
   ```

3. **Verify Approval**:
   - Check record status changes to approved
   - Verify doctor's address is recorded
   - Confirm approval event is emitted

### Scenario 3: Access Control Testing

1. **Test Unauthorized Access**:

   - Try to approve with non-approver account (should fail)
   - Attempt to access other patient's records

2. **Test Data Integrity**:
   - Verify IPFS hash hasn't changed
   - Check timestamp accuracy
   - Confirm patient ownership

## Integration with MediSync Frontend

### 1. Create Blockchain Components

Create new components for blockchain features:

```typescript
// src/components/blockchain/MedicalRecordUpload.tsx
export function MedicalRecordUpload() {
  // Component for uploading medical records
}

// src/components/blockchain/PendingApprovals.tsx
export function PendingApprovals() {
  // Component for doctors to see pending approvals
}

// src/components/blockchain/PatientRecords.tsx
export function PatientRecords() {
  // Component for patients to view their records
}
```

### 2. Add to Dashboard

Update patient dashboard:

```typescript
// Add blockchain tab back when ready
<TabsTrigger value="blockchain">
  <Link2 className="h-4 w-4 mr-2" />
  Medical Records
</TabsTrigger>
```

### 3. Add to Doctor Dashboard

Update doctor dashboard with approval interface:

```typescript
// Add pending approvals section
<Card>
  <CardHeader>
    <CardTitle>Pending Medical Record Approvals</CardTitle>
  </CardHeader>
  <CardContent>
    <PendingApprovals />
  </CardContent>
</Card>
```

## Testing Checklist

### Smart Contract Tests

- [ ] Contract deploys successfully
- [ ] Owner can add/remove approvers
- [ ] Patients can upload records
- [ ] Only approvers can approve records
- [ ] Record data is stored correctly
- [ ] Events are emitted properly

### IPFS Tests

- [ ] Files upload to IPFS successfully
- [ ] IPFS hashes are generated correctly
- [ ] Files can be retrieved using hash
- [ ] Encryption works (if implemented)

### Frontend Integration Tests

- [ ] MetaMask connects successfully
- [ ] Contract interactions work
- [ ] Error handling works properly
- [ ] UI updates after transactions
- [ ] Loading states are shown

### End-to-End Flow Tests

- [ ] Patient uploads → Record stored
- [ ] Doctor approves → Status updated
- [ ] Access control enforced
- [ ] Data integrity maintained

## Troubleshooting

### Common Issues

1. **MetaMask Connection Failed**:

   - Check network configuration
   - Ensure account has ETH for gas fees
   - Verify contract address is correct

2. **Transaction Failed**:

   - Check gas limits
   - Verify account permissions
   - Review contract requirements

3. **IPFS Upload Failed**:
   - Check IPFS node status
   - Verify file size limits
   - Review API configurations

### Debug Commands

```bash
# Check contract on blockchain
npx hardhat console --network localhost

# Test contract functions
await contract.getTotalRecords()
await contract.getRecord(0)

# Check IPFS
ipfs id
ipfs swarm peers
```

## Production Deployment

### 1. Testnet Deployment

Deploy to Sepolia testnet:

```bash
# Set environment variables
export SEPOLIA_URL="https://sepolia.infura.io/v3/YOUR-PROJECT-ID"
export PRIVATE_KEY="your-private-key"

# Deploy
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Mainnet Deployment

⚠️ **Warning**: Only deploy to mainnet after thorough testing

```bash
# Set mainnet environment variables
export MAINNET_URL="https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
export PRIVATE_KEY="your-private-key"

# Deploy
npx hardhat run scripts/deploy.js --network mainnet
```

## Security Considerations

1. **Private Key Management**:

   - Never commit private keys to version control
   - Use environment variables or hardware wallets
   - Implement proper key rotation

2. **Smart Contract Security**:

   - Audit contract code before mainnet deployment
   - Use OpenZeppelin contracts for standard functionality
   - Implement proper access controls

3. **Data Privacy**:
   - Encrypt sensitive data before IPFS upload
   - Implement proper patient consent mechanisms
   - Follow HIPAA compliance requirements

## Next Steps

1. **Complete Blockchain Integration**: Implement all components and test thoroughly
2. **Add Security Features**: Implement proper encryption and access controls
3. **Performance Optimization**: Optimize gas usage and IPFS operations
4. **Compliance**: Ensure HIPAA and medical data compliance
5. **User Experience**: Create intuitive interfaces for non-technical users

## Support

For questions or issues:

- Review Hardhat documentation: https://hardhat.org/docs
- Check IPFS documentation: https://docs.ipfs.io/
- Ethereum development resources: https://ethereum.org/developers

---

**Note**: This blockchain functionality is currently isolated and not connected to the main MediSync application. Integration should only proceed after thorough testing and approval.
