# Scalable-Blockchain-DVS
A Scalable Blockchain-based Smart Contract model for Decentralized Voltage Stability Using Sharding Technique
This study implementing a [decentralized voltage stability algorithm](https://ieeexplore.ieee.org/abstract/document/9366788) using blockchain-based smart contracts for evaluating the performance of blockchains in real-time control.This project also investigate sharding mechanisms as a means of improving the system’s scalability. 





we used [Hyperledger Fabric](https://www.hyperledger.org/use/fabric) as our blockchain platform, the [Matpower](https://matpower.org/about/get-started/) library in MATLAB as our power system simulator, and [Hyperledger Caliper](https://www.hyperledger.org/use/caliper) as our performance evaluation tool. For simulationg the sharding behaviour we used channel concept.(getting help from [this project](https://github.com/blockchain-systems/ScaleSFL))


## Getting Started
Make sure you have the proper Hyperledger Fabric [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html). we used following docker versions for implementing this project:
```
Docker version 20.10.12
docker-compose version 1.17.0

```

To get the binaries required to run the project, you can run this command in the root folder of DVS project. this command will install binaries and related docker images:

```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.3.3 1.5.2

```
Next check the commands available by running:

```
cd test-network
./network.sh -h
```
Now we can bring up the network by running:

```
./start.sh

```

## Testing the system

For testing the Blockchain based DVS system, we simulate the network using Matpower library, and develop a client server application (Restful API) to establish a communication between Matlab and Hyperledger Fabric.

you can run the nodejs server by:
```
cd EnergyMarket/javascript

node enrollAdmin.js

node server.js

```

At the Matlab, first we need to initialize the grouping and constant values of our grid and then runing the clientServer application: (we used IEEE30 bus system)
```
cd Matlab

Matlab command window:

Initialize_grouping



```


