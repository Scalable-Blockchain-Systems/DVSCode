/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org3.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        // const userIdentity = await wallet.get('User1');
        // if (userIdentity) {
        //     console.log('An identity for the user "User1" already exists in the wallet');
        //     return;
        // }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin3');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin3');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department2',
            enrollmentID: '_Org3MSP_User1',
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: '_Org3MSP_User1',
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org3MSP',
            type: 'X.509',
        };
        await wallet.put('_Org3MSP_User1', x509Identity);
        console.log('Successfully registered and enrolled admin user "User1" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "User1": ${error}`);
        process.exit(1);
    }
}

main();
