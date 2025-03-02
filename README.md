# Academic Certificates on the Blockchain

## Improvements from the Original Version

Original version: <https://github.com/TasinIshmam/blockchain-academic-certificates>

Improvements:

- Tested with Hyperledger Fabric 2.2.15 (19 Feb 2025)
- Fix a small code spelling error in chaincode EducertContract
- Add a step-by-step installation guide in this README file.

## Introduction

The academic certificate verification platform using blockchain technology is used to issue, manage and verify academic certificates in a secure and distributed manner. This project addresses the need for a secure digital platform to issue and verify academic certificates without intervention from the original certificate issuer (University).

![solution-overview](./resources/solution-overview.png)

The core functionality of this application are :
* Create and issue academic certificates.
* Manage and share academic certificates.
* Verify authenticity of shared certificates.

## Architecture Overview
![architecture-overview](./resources/network-architecture.png)

The following technologies are used on the application
* **[Hyperledger Fabric](https://www.hyperledger.org/use/fabric)**: Used to build the blockchain network, run smart contracts. Fabric CA is used to enroll members in the network. 
* **[Node.js](https://nodejs.org/en/)**: Backend of the web application is built in nodeJS runtime using the express framework. Chaincode is also written in NodeJS.
* **[MongoDB](https://www.mongodb.com/)**: The user and certificate data is stored in MongoDB database. 
* **[Bootstrap](https://getbootstrap.com/)**: The front-end of the web application is built using bootstrap, ejs & jQuery.

## Network Users

The users of the platform include - Universities, Students and Certificate Verifiers (Eg - Employers). The actions that can be performed by each party are as follows

**Universities**
* Issue academic certificates.
* View academic certificates issued. 
* Endorse Verification and digitally sign academic certificates.

**Students**
* Receive academic certificates from universities.
* View and manage received academic certificates.
* Share academic certificates with third party verifiers.
* Selective disclosure of certificate data.

**Verifier**
* Receive certificate data from students.
* Verify certificate authenticity with blockchain platform.

To learn more about how selective disclosure and decentralized verifications work, read about [verifiable credentials](https://en.wikipedia.org/wiki/Verifiable_credentials).


## Getting Started

#### Prerequisites

In order to install the application, please make sure you have the following installed with the same major version number.

1) Hyperledger fabric version 2.2.15.
   Follow instructions [here](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html)
   and [here](https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html).

2) Node version 12+

3) MongoDB version 4+

4) Latest version of NPM package manager  

#### Starting Fabric Network

The official documentation on starting network and installing chaincode
of Hyperledger Fabric is at
    <https://hyperledger-fabric.readthedocs.io/en/release-2.2/deploy_chaincode.html#javascript>

Here for clarity, we present you a step-by-step guide:

1. Clone the repo

2. Start the fabric test-network with couchdb

    ```sh
    PROJECT_ROOT= # The root directory of this project
    FABRIC_SAMPLES_DIR= # Location of fabric-samples
    
    cd $FABRIC_SAMPLES_DIR
    cd test-network
    ./network.sh up createChannel -ca -c mychannel -s couchdb
    # Make sure you see the following message at the end of the command's output:
    #   Anchor peer set for org 'Org2MSP' on channel 'mychannel'
    #   Channel 'mychannel' joined
    ```

3. Package and install the chaincode situated in the `<projectroot>/chaincode` directory.

    ```sh
    # 1. PACKAGE THE SMART CONTRACT/CHAINCODE

    cd $PROJECT_ROOT
    cd chaincode
    npm i

    cd "${FABRIC_SAMPLES_DIR}/test-network"
    peer lifecycle chaincode package edu.tar.gz --path "$PROJECT_ROOT/chaincode/" --lang node --label edu-1_0

    # 2. INSTALL THE CHAINCODE ONTO EVERY PEER IN THE NETWORK THAT WILL ENDORSE TRANSACTIONS.
    #    IN THIS CASE, THERE ARE PEERS IN TWO ORGANIZATIONS: Org1 and Org2.

    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
    peer lifecycle chaincode install edu.tar.gz

    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
    peer lifecycle chaincode install edu.tar.gz
    ```

4. Approve the chaincode definition in each organization.
    Run this command:

    ```sh
    peer lifecycle chaincode queryinstalled
    ```

    The output will be similar to this:

    ```plain
    Installed chaincodes on peer:
    Package ID: edu-1_0:69de748301770f6ef64b42aa6bb6cb291df20aa39542c3ef94008615704007f3, Label: edu-1_0
    ```

    Copy the package ID and run this command:

    ```sh
    export CC_PACKAGE_ID= # The package ID copied
    ```

    Then run the following commands:

    ```sh
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name edu --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${FABRIC_SAMPLES_DIR}/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name edu --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${FABRIC_SAMPLES_DIR}/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    ```

5. Commit the chaincode definition to the channel.

    First, run the following command:

    ```sh
    peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name edu --version 1.0 --sequence 1 --tls --cafile "${FABRIC_SAMPLES_DIR}/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    ```

    and make sure the output indicates that all the organizations have
    approved the chaincode definition before:

    ```json
    {
        "Approvals": {
            "Org1MSP": true,
            "Org2MSP": true
        }
    }
    ```

    If that is the case, run the following command to commit the chaincode
    definition to the channel:

    ```sh
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name edu --version 1.0 --sequence 1 --tls --cafile "${FABRIC_SAMPLES_DIR}/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
    ```

    Finally, run the following command to confirm that the chaincode
    definition has been committed to the channel:

    ```sh
    peer lifecycle chaincode querycommitted --channelID mychannel --name edu --cafile "${FABRIC_SAMPLES_DIR}/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    ```

    If the chaincode was successfully committed to the channel, the above command will
    return the sequence and version of the chaincode definition:

    ```plain
    Committed chaincode definition for chaincode 'edu' on channel 'mychannel':
    Version: 1.0, Sequence: 1, Endorsement Plugin: escc, Validation Plugin: vscc, Approvals: [Org1MSP: true, Org2MSP: true]
    ```

    At this point, keep in mind that our installed chaincode is named `edu`.
    That will be helpful in the next step.

#### Starting Web Application

Make sure mongodb and fabric network are running in the background before starting this process. 

1) Go to web-app
    ```sh
    # at blockchain-academic-certificates
    cd web-app
    ```
2) Install all modules
    ```sh 
   npm install
   npm install --only=dev  # For dev dependencies
    ```
3) Create .env file
    ``` 
    touch .env 
    ```
4) Specify environment variables in .env file.
    1) Specify ```MONGODB_URI_LOCAL``` to your mongodb database.
    2) Specify ```EXPRESS_SESSION_SECRET``` as a long random secret string.
    3) Specify ```CCP_PATH``` as the connection profile of org1 in your test network. The path for this should be ```${FABRIC_SAMPLES_DIR}/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json```  
    4) In ```FABRIC_CHANNEL_NAME``` and ```FABRIC_CHAINCODE_NAME``` specify the channel and chaincode label respectively used during fabric network installation.
        Per [our step-by-step guide above](#starting-fabric-network), it should be `mychannel`
        and `edu`, respectively.
    5) Sample .env file
        ```dotenv
        MONGODB_URI_LOCAL = mongodb://localhost:27017/blockchaincertificate
        PORT = 3000
        LOG_LEVEL = info
        EXPRESS_SESSION_SECRET = sdfsdfddfgdfg3242efDFHI234 
        CCP_PATH = /home/tasin/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
        FABRIC_CHANNEL_NAME = mychannel
        FABRIC_CHAINCODE_NAME = edu
        ```

5) Start the server in development mode
    ```sh
    npm run start-development
    ```
