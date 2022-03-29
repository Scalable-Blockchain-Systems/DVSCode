# Exit on error
set -e

# Config
num_shards=6
num=6
num3=3
orgs=$(seq -s ',' 1 $num)
orgs3=$(seq -s ',' 1 3)
orgs3_2=$(seq -s ',' 4 6)
orgs2=$(seq -s ',' 1 2)
orgs2_1=$(seq -s ',' 3 4)
orgs2_2=$(seq -s ',' 5 6)
main_chain_channel="mainchain"
shards_channel_prefix="shard"
task_chaincode_name="GlobalContract"
shard_chaincode_name="VSIContract"
task_chaincode="../chaincode/GlobalContract"
shard_chaincode="../chaincode/VSIContract"

# Script Metrics
starttime=$(date +%s)

# Bring network up
./network.sh down # remove any containers from previous runs (optional)
./network.sh up -ca -orgs $orgs

# Create channels
./network.sh createChannel -c $main_chain_channel -orgs $orgs
# # for i in `seq 0 $(($num_shards - 1))`; do
#     ./network.sh createChannel -c $shards_channel_prefix$i -orgs $((i + 1))
# done

# ./network.sh createChannel -c shard0 -orgs $orgs3

# ./network.sh createChannel -c shard1 -orgs $orgs3_2

./network.sh createChannel -c shard2 -orgs $orgs2

./network.sh createChannel -c shard3 -orgs $orgs2_1

./network.sh createChannel -c shard4 -orgs $orgs2_2


# Deploy chaincode 
./network.sh deployCC \
    -c $main_chain_channel \
    -ccn $task_chaincode_name \
    -ccp $task_chaincode \
    -ccl javascript \
    -orgs $orgs


    # ./network.sh deployCC \
    #     -c shard0 \
    #     -ccn VSIContract0 \
    #     -ccp $shard_chaincode \
    #     -ccl javascript \
    #     -orgs $orgs3


    # ./network.sh deployCC \
    #     -c shard1 \
    #     -ccn VSIContract1 \
    #     -ccp $shard_chaincode \
    #     -ccl javascript \
    #     -orgs $orgs3_2


    ./network.sh deployCC \
        -c shard2 \
        -ccn VSIContract2 \
        -ccp $shard_chaincode \
        -ccl javascript \
        -orgs $orgs2


    ./network.sh deployCC \
        -c shard3 \
        -ccn VSIContract3 \
        -ccp $shard_chaincode \
        -ccl javascript \
        -orgs $orgs2_1


           ./network.sh deployCC \
        -c shard4 \
        -ccn VSIContract4 \
        -ccp $shard_chaincode \
        -ccl javascript \
        -orgs $orgs2_2
# for i in `seq 0 $(($num_shards - 1))`; do
#     ./network.sh deployCC \
#         -c $shards_channel_prefix$i \
#         -ccn $shard_chaincode_name$i \
#         -ccp $shard_chaincode \
#         -ccl javascript \
#         -orgs $((i + 1))
# done

export PATH=$(realpath ${PWD}/../bin):$PATH
export FABRIC_CFG_PATH=$(realpath ${PWD}/../config/)

# Set peer as org1
. scripts/envVar.sh
setGlobals 1

# init mainchain ledger
peer chaincode invoke \
    -n $task_chaincode_name \
    -C $main_chain_channel \
    -o localhost:7050 \
    --tls \
    --ordererTLSHostnameOverride orderer.example.com \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses localhost:7051 \
    --peerAddresses localhost:9051 \
    --peerAddresses localhost:11051 \
    --peerAddresses localhost:12051 \
    --peerAddresses localhost:13051 \
    --peerAddresses localhost:14051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt \
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt \
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt \
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org6.example.com/peers/peer0.org6.example.com/tls/ca.crt \
    -c '{"function":"initLedger","Args":[]}'

    # init shard0
    # setGlobals 1

#      peer chaincode invoke \
#     -n VSIContract0 \
#     -C shard0 \
#     -o localhost:7050 \
#     --tls \
#     --ordererTLSHostnameOverride orderer.example.com \
#     --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
#     --peerAddresses localhost:7051 \
#     --peerAddresses localhost:9051 \
#     --peerAddresses localhost:11051 \
#     --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
#     --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
#     --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt \
#     -c '{"function":"initLedger","Args":[]}'


# #         # init shard1
# #     # setGlobals 4

#      peer chaincode invoke \
#     -n VSIContract1 \
#     -C shard1 \
#     -o localhost:7050 \
#     --tls \
#     --ordererTLSHostnameOverride orderer.example.com \
#     --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
#     --peerAddresses localhost:12051 \
#     --peerAddresses localhost:13051 \
#     --peerAddresses localhost:14051 \
#  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt \
#  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt \
#  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org6.example.com/peers/peer0.org6.example.com/tls/ca.crt \
#     -c '{"function":"initLedger","Args":[]}'


# #             # init shard2
# #     # setGlobals $((2 + 1))
     peer chaincode invoke \
    -n VSIContract2 \
    -C shard2 \
    -o localhost:7050 \
    --tls \
    --ordererTLSHostnameOverride orderer.example.com \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses localhost:7051 \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c '{"function":"initLedger","Args":[]}'

# #             # init shard3
# #     # setGlobals $((3 + 1))
     peer chaincode invoke \
    -n VSIContract3 \
    -C shard3 \
    -o localhost:7050 \
    --tls \
    --ordererTLSHostnameOverride orderer.example.com \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses localhost:11051 \
    --peerAddresses localhost:12051 \
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt \
--tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt \
    -c '{"function":"initLedger","Args":[]}'


# #             # init shard4
# #     # setGlobals $((4 + 1))
     peer chaincode invoke \
    -n VSIContract4 \
    -C shard4 \
    -o localhost:7050 \
    --tls \
    --ordererTLSHostnameOverride orderer.example.com \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses localhost:13051 \
    --peerAddresses localhost:14051 \
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt \
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org6.example.com/peers/peer0.org6.example.com/tls/ca.crt \
    -c '{"function":"initLedger","Args":[]}'

# init shard ledger 
# for i in `seq 0 $(($num_shards - 1))`; do
#     setGlobals $(($i + 1))
    # peer chaincode invoke \
    #     -n $shard_chaincode_name$i \
    #     -C $shards_channel_prefix$i \
    #     -o localhost:7050 \
    #     --tls \
    #     --ordererTLSHostnameOverride orderer.example.com \
    #     --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    #     --peerAddresses $CORE_PEER_ADDRESS \
    #     --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org$((i + 1)).example.com/peers/peer0.org$((i + 1)).example.com/tls/ca.crt \
    #     -c '{"function":"initLedger","Args":[]}'
# done

echo "Setup time: $(($(date +%s) - starttime))s"