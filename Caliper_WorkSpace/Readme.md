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


