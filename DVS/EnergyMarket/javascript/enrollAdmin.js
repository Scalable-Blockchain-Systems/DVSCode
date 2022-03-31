/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin1');
        if (identity) {
            console.log('An identity for the admin user "admin1" already exists in the wallet');
            // return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin1', x509Identity);
        console.log('Successfully enrolled admin user "admin1" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }

    // try {
    //     // load the network configuration
    //     const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
    //     const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    //     // Create a new CA client for interacting with the CA.
    //     const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
    //     const caTLSCACerts = caInfo.tlsCACerts.pem;
    //     const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    //     // Create a new file system based wallet for managing identities.
    //     const walletPath = path.join(process.cwd(), 'wallet');
    //     const wallet = await Wallets.newFileSystemWallet(walletPath);
    //     console.log(`Wallet path: ${walletPath}`);

    //     // Check to see if we've already enrolled the admin user.
    //     const identity = await wallet.get('admin2');
    //     if (identity) {
    //         console.log('An identity for the admin user "admin2" already exists in the wallet');
    //         // return;
    //     }

    //     // Enroll the admin user, and import the new identity into the wallet.
    //     const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    //     const x509Identity = {
    //         credentials: {
    //             certificate: enrollment.certificate,
    //             privateKey: enrollment.key.toBytes(),
    //         },
    //         mspId: 'Org2MSP',
    //         type: 'X.509',
    //     };
    //     await wallet.put('admin2', x509Identity);
    //     console.log('Successfully enrolled admin user "admin2" and imported it into the wallet');

    // } catch (error) {
    //     console.error(`Failed to enroll admin user "admin2": ${error}`);
    //     process.exit(1);
    // }

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org3.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin3');
        if (identity) {
            console.log('An identity for the admin user "admin3" already exists in the wallet');
            // return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org3MSP',
            type: 'X.509',
        };
        await wallet.put('admin3', x509Identity);
        console.log('Successfully enrolled admin user "admin3" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin3": ${error}`);
        process.exit(1);
    }


    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org5.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin5');
        if (identity) {
            console.log('An identity for the admin user "admin5" already exists in the wallet');
            // return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org5MSP',
            type: 'X.509',
        };
        await wallet.put('admin5', x509Identity);
        console.log('Successfully enrolled admin user "admin5" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin5": ${error}`);
        process.exit(1);
    }
}

main();
