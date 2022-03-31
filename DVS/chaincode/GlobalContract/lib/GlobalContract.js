/*
SPDX-License-Identifier: Apache-2.0
*/



'use strict';

const { Contract, Context } = require('fabric-contract-api');




class GlobalContext extends Context {
    constructor() {
        super();
    }
}
//  EVENT
const EVENT_TYPE = "bcpocevent";
/**
 * Define  smart contract by extending Fabric Contract class
 */
class GlobalContract extends Contract {



    /**
     * Define a custom context 
    */
    createContext() {
        return new GlobalContext();
    }


    async initLedger(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.info('Instantiate the Global contract');

    }

    async SearchForAvailableGroup(ctx, ID) {
        var ID = JSON.parse(ID);
        if (ID.length > 1)
            throw new Error(`Error Message from SearchForAvailableGroup: for group with groupId = ${ID} no adjacent group available.`);
        var orderAsBytes = await ctx.stub.getState("g" + ID[0]);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from SearchForAvailableGroup: group with groupId = ${ID} does not exist.`);
        }

        var group = JSON.parse(orderAsBytes);
        var adjacent = JSON.parse(group.adjacent);

        for (let i = 0; i < adjacent.length; i++) {
            var orderAsBytes = await ctx.stub.getState("g" + adjacent[i]);
            if (!orderAsBytes || orderAsBytes.length === 0) {
                throw new Error(`Error Message from UpdateResources: group with groupId = ${adjacent[i]} does not exist.`);
            }
            var resources = JSON.parse(group.resources);
            var all_resources = resources.reduce((a, b) => a + b, 0);
            if (all_resources > 0)
                return adjacent[i];
        }

        return -1;

    }
    async UpdateResources(ctx, ID, resources) {
        var ID = JSON.parse(ID);
        // if (!split) {
        //     var orderAsBytes = await ctx.stub.getState("g" + ID[0]);
        //     if (!orderAsBytes || orderAsBytes.length === 0) {
        //         throw new Error(`Error Message from UpdateResources: group with groupId = ${ID[0]} does not exist.`);
        //     }
        //     var group = JSON.parse(orderAsBytes);
        //     group.resources = resources;
        //     await ctx.stub.putState("g" + ID[0], Buffer.from(JSON.stringify(group)));
        //     return 1;
        // }
        // else {
            for (let i = 0; i < ID.length; i++) {
                if (resources.length == 0)
                    break;
                var orderAsBytes = await ctx.stub.getState("g" + ID[i]);
                if (!orderAsBytes || orderAsBytes.length === 0) {
                    throw new Error(`Error Message from UpdateResources: group with groupId = ${ID[i]} does not exist.`);
                }
                var group = JSON.parse(orderAsBytes);
                var res = JSON.parse(group.resources);
                group.resources = resources.splice(0, res.length);
                await ctx.stub.putState("g" + ID[i], Buffer.from(JSON.stringify(group)));
            }
        // }
    }


    async InitialGlobalControllers(ctx, PI1, J1, PI2, J2, PI3, J3) {
        var global1_2 = {};
        global1_2.Id = 'lc1_2';
        global1_2.PI = PI1;
        global1_2.J = J1;

        await ctx.stub.putState('lc1_2', Buffer.from(JSON.stringify(global1_2)));

        var global1_3 = {};
        global1_3.Id = 'lc1_3';
        global1_3.PI = PI2;
        global1_3.J = J2;

        await ctx.stub.putState('lc1_3', Buffer.from(JSON.stringify(global1_3)));

        var global2_3 = {};
        global2_3.Id = 'lc2_3';
        global2_3.PI = PI3;
        global2_3.J = J3;

        await ctx.stub.putState('lc2_3', Buffer.from(JSON.stringify(global2_3)));


        return 1;
    }
    async InitialLocalControllers(ctx, PI1, J1, PI2, J2, PI3, J3) {
        var localController1 = {};
        localController1.Id = 'lc1';
        localController1.PI = PI1;
        localController1.J = J1;

        await ctx.stub.putState('lc1', Buffer.from(JSON.stringify(localController1)));

        var localController2 = {};
        localController2.Id = 'lc2';
        localController2.PI = PI2;
        localController2.J = J2;
        await ctx.stub.putState('lc2', Buffer.from(JSON.stringify(localController2)));

        var localController3 = {};
        localController3.Id = 'lc3';
        localController3.PI = PI3;
        localController3.J = J3;
        await ctx.stub.putState('lc3', Buffer.from(JSON.stringify(localController3)));

        return 1;
    }
    async InitialGrouping(ctx, data1, data2, data3, data12, data13, data23) {

        var group1 = {};
        group1.Id = 'g1';
        group1.Impedance = data1;
        group1.adjacent = '[2,3]';
        group1.resources='[]';

        await ctx.stub.putState('g1', Buffer.from(JSON.stringify(group1)));
        var group2 = {};
        group2.Id = 'g2';
        group2.Impedance = data2;
        group2.adjacent = '[1,3]';
        group2.resources='[]';

        await ctx.stub.putState('g2', Buffer.from(JSON.stringify(group2)));
        var group3 = {};
        group3.Id = 'g3';
        group3.Impedance = data3;
        group3.adjacent = '[1,3]';
        group3.resources='[]';
        await ctx.stub.putState('g3', Buffer.from(JSON.stringify(group3)));

        var group12 = {};
        group12.Id = 'g1_2';
        group12.Impedance = data12;
        group12.adjacent = '[3]';
        group12.resources='[]';
        await ctx.stub.putState('g12', Buffer.from(JSON.stringify(group12)));

        var group13 = {};
        group13.Id = 'g1_3';
        group13.Impedance = data13;
        group13.adjacent = '[2]';
        group13.resources='[]';
        await ctx.stub.putState('g13', Buffer.from(JSON.stringify(group13)));

        var group23 = {};
        group23.Id = 'g1_2';
        group23.Impedance = data23;
        group23.adjacent = '[1]';
        group23.resources='[]';
        await ctx.stub.putState('g23', Buffer.from(JSON.stringify(group23)));

        return 1;
    }


    async getCurrentUserType(ctx) {

        const userid = await this.getCurrentUserId(ctx);
        console.info(userid);
        //  check user id;  if admin, return type = admin;
        //  else return value set for attribute "type" in certificate;
        if (userid == "admin") {
            return userid;
        }
        return ctx.clientIdentity.getAttributeValue("usertype");
    }
}

module.exports = GlobalContract;