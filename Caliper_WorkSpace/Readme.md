# Caliper-Test
we used [hyperledger caliper](https://github.com/hyperledger/caliper) to evaluate the performance of our model. Sample benchmarks can be found in [caliper-benchmarks](https://github.com/hyperledger/caliper-benchmarks)

You can follow this [tutorial](https://hyperledger.github.io/caliper/v0.4.2/fabric-tutorial/tutorials-fabric-existing/) to install the dependencies.

Caliper vesrion: Caliper 0.4.2
If you need to change the fabric version (from 2.2.0), bind caliper to the version of Fabric being used:
```
npx caliper bind --caliper-bind-sut fabric:2.2.0
```

Since we used the test-network, we do not need to generate  crypto configuration, but we need to to update the network file ```networks/fabric-config.yaml``` with the correct secret key path, e.g.
```
- mspid: Org*MSP
      identities:
          certificates:
              - name: "admin1"
                admin: "true"
                clientPrivateKey:
                    path: "../DVS/test-network/organizations/peerOrganizations/org*.example.com/users/Admin@org*.example.com/msp/keystore/[file_name]"
                clientSignedCert:
                    path: "../DVS/test-network/organizations/peerOrganizations/org*.example.com/users/Admin@org*.example.com/msp/signcerts/cert.pem"
      connectionProfile:
          path: "../DVS/test-network/organizations/peerOrganizations/org*.example.com/connection-org*.yaml"
          discover: true
```
When we setup the network with multiple independent channels, service discovery fails. Because of this we can manually define the network configurations using [connection profiles](https://hyperledger.github.io/caliper/v0.3.2/fabric-config/) and disable service discovery.[sample](https://hyperledger.github.io/caliper/v0.3.2/fabric-config/#connection-profile-example)

After we define the configuration file, we can run a test by this command:
```
cd $CALIPER_FOLDER_ROOT

npx caliper launch manager \
        --caliper-workspace . \
        --caliper-benchconfig benchmarks/ComputeVSI.yaml \
        --caliper-networkconfig networks/fabric-config.yaml \
        --caliper-progress-reporting-interval 2000 \
        --caliper-flow-only-test \
        --caliper-worker-pollinterval 250 \
        --caliper-fabric-gateway-enabled

```

