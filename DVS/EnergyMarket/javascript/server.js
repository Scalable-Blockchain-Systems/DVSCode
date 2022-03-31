'use strict';
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const Complex = require('complex.js');
const path = require('path');
// const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const List = require("../../chaincode/VSIContract/lib/List.js");
const Jacobian = require("../../chaincode/VSIContract/lib/Jacobian.js");
async function main() {
    try {
        console.log("main");
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('User1');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: 'User1', discovery: { enabled: true, asLocalhost: true } });

        // // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork('mychannel');

        // // Get the contract from the network.
        // const contract = network.getContract('VSIContract');

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.post('/VSI', async (req, res) => {

            var result = "";
            var threshold = JSON.parse(req.body.threshold)
            if (req.body.shard == 3) {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
                const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
                const ccp = JSON.parse(ccpJSON);
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'admin5', discovery: { enabled: true, asLocalhost: true } });


                const network = await gateway.getNetwork('shard4');


                const contract = network.getContract('VSIContract4');
                console.log("Compute VSI")
                result = await contract.submitTransaction('ComputeVSI', req.body.bus, req.body.branch, req.body.VSC, req.body.group, threshold[0], '123');

            }
            else if (req.body.shard == 2) {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
                const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
                const ccp = JSON.parse(ccpJSON);
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'admin3', discovery: { enabled: true, asLocalhost: true } });


                const network = await gateway.getNetwork('shard3');


                const contract = network.getContract('VSIContract3');
                console.log("Compute VSI")
                result = await contract.submitTransaction('ComputeVSI', req.body.bus, req.body.branch, req.body.VSC, req.body.group, threshold[0], '123');

            }
            else if (req.body.shard == 1) {

                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
                const ccp = JSON.parse(ccpJSON);
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'admin1', discovery: { enabled: true, asLocalhost: true } });


                const network = await gateway.getNetwork('shard2');


                const contract = network.getContract('VSIContract2');
                console.log("Compute VSI")
                result = await contract.submitTransaction('ComputeVSI', req.body.bus, req.body.branch, req.body.VSC, req.body.group, threshold[0], '123');

            }
            else {
                res.send("The group number is wrong");

            }

            // const gateway = new Gateway();
            // await gateway.connect(ccp, { wallet, identity: 'admin5', discovery: { enabled: true, asLocalhost: true } });


            // const network = await gateway.getNetwork('shard4');


            // const contract = network.getContract('VSIContract4');

            // console.log("g"+"3");

            // console.log("Compute VSI")
            // var result = await contract.submitTransaction('ComputeVSI', req.body.bus, req.body.branch, req.body.VSC, "3", 0.7, '123');

            console.log(`Transaction has been evaluated, result is: ${result}`);

            var VSI = JSON.parse(result);
            if (VSI.gc != 0) {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
                const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
                const ccp = JSON.parse(ccpJSON);
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'admin5', discovery: { enabled: true, asLocalhost: true } });


                const network = await gateway.getNetwork('mainchain');


                const contract = network.getContract('GlobalContract');
                if (VSI.gc == 1) {
                    console.log("global controller");

                    var result = await contract.submitTransaction('SearchForAvailableGroup', req.body.group);
                    VSI.merge = true;
                    VSI.merge_group = JSON.parse(result);

                }
                if (VSI.gc == 2) {
                    //update resources - local controller
                    var result = await contract.submitTransaction('UpdateResources', req.body.group, JSON.stringify(resources));

                }
            }

            res.send(JSON.stringify(VSI));





        });


        app.post('/initial', async (req, res) => {


            var data = req.body
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);

            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'admin5', discovery: { enabled: true, asLocalhost: true } });


            const network = await gateway.getNetwork('mainchain');


            const contract = network.getContract('GlobalContract');

            console.log("initial grouping-mainchain")
            var result = await contract.submitTransaction('InitialGrouping', req.body.Impedance_group1, req.body.Impedance_group2, req.body.Impedance_group3, req.body.Impedance_group1_2, req.body.Impedance_group1_3, req.body.Impedance_group2_3);

            console.log(`Transaction has been evaluated, result is: ${result}`);

            console.log("initial Local Controller-mainchain")
            var result = await contract.submitTransaction('InitialLocalControllers', req.body.PI_group1, req.body.J_group1, req.body.PI_group2, req.body.J_group2, req.body.PI_group3, req.body.J_group3);

            console.log(`Transaction has been evaluated, result is: ${result}`);

            console.log("initial Global Controller-mainchain")
            var result = await contract.submitTransaction('InitialGlobalControllers', req.body.PI_group1_2, req.body.J_group1_2, req.body.PI_group1_3, req.body.J_group1_3, req.body.PI_group2_3, req.body.J_group2_3);

            console.log(`Transaction has been evaluated, result is: ${result}`);

            //initialize resources
            var result = await contract.submitTransaction('UpdateResources', 'g1', '[1.5,0,1.5,1.5,1.5]');
            var result = await contract.submitTransaction('UpdateResources', 'g2', '[1.5,1.5,1.5,1.5,1.5,0,0,1.5,1.5,1.5,0,1.5,1.5,1.5]');
            var result = await contract.submitTransaction('UpdateResources', 'g3', '[1.5,1.5,0,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5]');




            await gateway.disconnect();

            const gateway1 = new Gateway();
            await gateway1.connect(ccp, { wallet, identity: 'admin5', discovery: { enabled: true, asLocalhost: true } });

            const network1 = await gateway1.getNetwork('shard4');


            const contract1 = network1.getContract('VSIContract4');

            console.log("initial group3 and adjacent group-VSIContract4")
            var result = await contract1.submitTransaction('InitialGrouping', 'g3', req.body.Impedance_group3, '[1,2]');
            var result = await contract1.submitTransaction('InitialGrouping', 'g1_3', req.body.Impedance_group1_3, '[2]');
            var result = await contract1.submitTransaction('InitialGrouping', 'g2_3', req.body.Impedance_group2_3, '[1]');




            console.log("initial Local Controller-VSIContract4")
            var result = await contract1.submitTransaction('InitialLocalController', 'lc3', req.body.PI_group3, req.body.J_group3);
            var result = await contract1.submitTransaction('InitialLocalController', 'lc1_3', req.body.PI_group1_3, req.body.J_group1_3);
            var result = await contract1.submitTransaction('InitialLocalController', 'lc2_3', req.body.PI_group2_3, req.body.J_group2_3);

            await gateway1.disconnect();


            const ccpPath2 = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
            const ccpJSON2 = fs.readFileSync(ccpPath2, 'utf8');
            const ccp2 = JSON.parse(ccpJSON2);

            const gateway2 = new Gateway();
            await gateway2.connect(ccp2, { wallet, identity: 'admin3', discovery: { enabled: true, asLocalhost: true } });

            const network2 = await gateway2.getNetwork('shard3');


            const contract2 = network2.getContract('VSIContract3');

            console.log("initial group2 and adjacent group-VSIContract3")
            var result = await contract2.submitTransaction('InitialGrouping', 'g2', req.body.Impedance_group2, '[1,3]');
            var result = await contract2.submitTransaction('InitialGrouping', 'g1_2', req.body.Impedance_group1_2, '[3]');
            var result = await contract2.submitTransaction('InitialGrouping', 'g2_3', req.body.Impedance_group2_3, '[1]');



            console.log("initial Local Controller-VSIContract3")
            var result = await contract2.submitTransaction('InitialLocalController', 'lc2', req.body.PI_group2, req.body.J_group2);
            var result = await contract2.submitTransaction('InitialLocalController', 'lc1_2', req.body.PI_group1_2, req.body.J_group1_2);
            var result = await contract2.submitTransaction('InitialLocalController', 'lc2_3', req.body.PI_group2_3, req.body.J_group2_3);

            await gateway2.disconnect();

            const ccpPath3 = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpJSON3 = fs.readFileSync(ccpPath3, 'utf8');
            const ccp3 = JSON.parse(ccpJSON3);

            const gateway3 = new Gateway();
            await gateway3.connect(ccp3, { wallet, identity: 'admin1', discovery: { enabled: true, asLocalhost: true } });

            const network3 = await gateway3.getNetwork('shard2');


            const contract3 = network3.getContract('VSIContract2');

            console.log("initial group1 and adjacent group-VSIContract2")
            var result = await contract3.submitTransaction('InitialGrouping', 'g1', req.body.Impedance_group1, '[2,3]');
            var result = await contract3.submitTransaction('InitialGrouping', 'g1_2', req.body.Impedance_group1_2, '[3]');
            var result = await contract3.submitTransaction('InitialGrouping', 'g2_3', req.body.Impedance_group2_3, '[1]');




            console.log("initial Local Controller-VSIContract3")
            var result = await contract3.submitTransaction('InitialLocalController', 'lc1', req.body.PI_group1, req.body.J_group1);
            var result = await contract3.submitTransaction('InitialLocalController', 'lc1_2', req.body.PI_group1_2, req.body.J_group1_2);
            var result = await contract3.submitTransaction('InitialLocalController', 'lc2_3', req.body.PI_group2_3, req.body.J_group2_3);

            await gateway3.disconnect();
            res.send('initialization was succesful');
        });



    } catch (error) {
        console.log('----->error\n');
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
main();
const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`app is listening on port ${port} ...`));