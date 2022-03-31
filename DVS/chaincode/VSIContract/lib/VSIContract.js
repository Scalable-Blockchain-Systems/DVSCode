/*
SPDX-License-Identifier: Apache-2.0
*/



'use strict';

const { Contract, Context } = require('fabric-contract-api');
//use library of complex.js
const Complex = require("./complex");
const List = require("./List");
const Jacobian = require("./Jacobian");



class VSIContext extends Context {
    constructor() {
        super();
    }
}
//  EVENT
const EVENT_TYPE = "bcpocevent";
/**
 * Define  smart contract by extending Fabric Contract class
 */
class VSIContract extends Contract {



    /**
     * Define a custom context 
    */
    createContext() {
        return new VSIContext();
    }


    async initLedger(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.info('Instantiate the VSI contract');

    }


    /* paper: Gong, Y., &amp; Schulz, N. (2006, October). Synchrophasor-based real-time voltage stability index. In
    2006 IEEE PES Power Systems Conference and Exposition (pp. 1029-1036). IEEE.
       use above paper to calculate the VSI
        
    */


    async ComputeVSI(ctx, bus, branch, sources, group_Id, threshold, ID_s) {

        var bus = JSON.parse(bus);
        var branch = JSON.parse(branch);
        var resources = JSON.parse(sources);
        var IDs = JSON.parse(group_Id);
        //console.log("here");
        // var orderAsBytes = await ctx.stub.getState(`s${group_Id}`);
        // if (!orderAsBytes || orderAsBytes.length === 0) {
        //     throw new Error(`Error Message from ConfirmOrder: Order with orderId = ${group_Id} does not exist.`);
        // }
        // var status = JSON.parse(orderAsBytes);
        // console.log(sources);
        // console.log(status.sources);
        // console.log(status.sources!=sources);
        group_Id = "";
        var merge = false;
        for (let i = 0; i < IDs.length; i++) {
            if (i == 0) {
                group_Id = group_Id + IDs[i];
            } else {
                group_Id = group_Id + "_" + IDs[i];
                merge = true;
            }
        }


        var orderAsBytes = await ctx.stub.getState("g" + group_Id);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            //throw new Error(`Error Message from ComputeVSI: group with groupId = ${group_Id} does not exist.`);
            return 'Group Not exist'
        }
        // console.log(orderAsBytes);
        // Convert order so we can modify fields
        var group = JSON.parse(orderAsBytes);
        var Impedance = JSON.parse(group.Impedance);
        // var threshold=group.threshold;
        // var VSC=JSON.parse(req.body.VSC);
        // console.log(Impedance);

        //    console.log(branch)

        //delete the columns that no longer need, and keep the data we need to calculate the VSI
        for (let i = 0; i < bus.length; i++) {
            bus[i].splice(4, 3);
            bus[i].splice(6, 5);
        }
        /*
        Bus matrix:
        1st column: number of the bus
        2nd column: type of the bus -->
            PQ bus          = 1
            PV bus          = 2
            reference bus   = 3
            isolated bus    = 4
        3rd column: P load
        4th column: Q load
        5th column: 
        Vm, voltage magnitude (p.u.)
        
        6th column:
        Va, voltage angle (degrees)
        */

        for (let i = 0; i < branch.length; i++) {
            branch[i].splice(4, 9);
            // branch[i].splice(4,6);
        }
        /*
        Branch Matrix:
        1st column: f, from bus number
        2nd column:  t, to bus number 
        
        3rd column:  r, resistance (p.u.)
        4th column:  x, reactance (p.u.)
        
        From Bus injection:
        5th column:  P (MW)
        6th column:  Q(MWAr)
        
        To Bus injection:
        7th column:  P (MW)
        8th column:  Q(MWAr)
        
        */



        console.log("----------------compute complex power flowing out of the load bus:----------------------------");
        /*
          used the branch matrix to compute the  power flowing out of the load bus.
            
        */
        /* create an array (Power) to keep the power flowing out for each bus:
        1st column: bus index
        2nd column: P
        3rd column:  Q
        */
        const power = [];
        var flag = 0;
        var voltages = [];

        for (let i = 0; i < bus.length; i++) {
            const item = [];
            const v = [];

            v.push(bus[i][4]);
            v.push(bus[i][5]);
            v.push(bus[i][1]);
            v.push(bus[i][0]);
            voltages.push(v);


            // if it is not a load bus -> skip
            //   if (bus[i][1]==2 || bus[i][1]==3){
            //     if( bus[i][2]==0 && bus[i][3]==0 ){
            //       continue;
            //     }
            //   }
            if (bus[i][1] != 1) {
                continue;
            }

            //define variables
            var index = bus[i][0];
            //console.log(index);
            var P = 0.0000;
            var Q = 0.0000;

            var P1 = 0.0000;
            var Q1 = 0.0000;

            item.push(index);

            flag = 0;
            for (let j = 0; j < branch.length; j++) {

                if (branch[j][0] == bus[i][0]) {

                    if (branch[j][4] > 0) {
                        P += branch[j][4];

                        flag = 1;
                    }
                    if (branch[j][5] > 0) {
                        Q += branch[j][5];

                        flag = 1;
                    }
                }

                if (branch[j][1] == bus[i][0]) {

                    if (branch[j][7] > 0) {
                        P += branch[j][4];

                        flag = 1;
                    }
                    if (branch[j][8] > 0) {
                        Q += branch[j][5];

                        flag = 1;
                    }
                }


            }


            if (flag == 1) {
                item.push(P);
                item.push(Q);
            }

            else {
                item.push(P1);
                item.push(Q1);
            }

            item.push(bus[i][4]);
            item.push(bus[i][5]);
            item.push(bus[i][2]);
            item.push(bus[i][3]);
            item.push(i);
            power.push(item);
        }
        // console.log(voltages);
        //  console.log(power)






        console.log("----------------equivalent Voltage Source:----------------------------");

        /*
   
        To find an equivalent Voltage Source for each load bus- I used the following equation that represented in paper:
           Vr= voltage of load bus = Vm
           S= the complex powers flowing out of the load bus
           Y= addmitance value
           Vs= equivalant voltage source
   
           equation in the paper: if i represent the bus index
   
           (Vs_i - Vr_i / Z_i)* = S_i / Vr_i 
   
           I used : Vs_i= ((S_i/Vr_i)*   * Z_i ) + Vr_i
       
   
          Voltage_source array:
          1st column: bus index
          2nd column: equivalant voltage source
        */
        var Voltage_source = [];

        for (let i = 0; i < power.length; i++) {

            var item = [];

            var load_index = power[i][0];
            item.push(load_index);

            var Vm = power[i][3];
            var Va = power[i][4] * Math.PI / 180;
            var VL = new Complex(Vm * Math.cos(Va), Vm * Math.sin(Va));
            var S = new Complex(power[i][1], power[i][2]);

            S = S.div(VL)
            var Z = new Complex(Impedance[i][1], Impedance[i][2]);

            var Vs = S.conjugate().mul(Z).add(VL);

            var a = Vs.re;
            var b = Vs.im;
            var teta = 0;
            if (a > 0) {
                teta = Math.atan(b / a);
            }

            if (a < 0) {
                teta = Math.atan(b / a) + Math.PI;
            }

            var r = a / Math.cos(teta);
            item.push(r)

            Voltage_source.push(item);

        }
        // console.log(Voltage_source);

        console.log("----------------compute VSI for each load bus:----------------------------");

        /*
    
        used available equations in the paper to calculate Pmax, Qmax, and Smax
    
        get the value of P, Q, and S from the power array (first step)
    
        VSI array:
        1st column: Bus index
        2nd column : VSI1=P_margin/P_max
        3rd column : VSI2= Q_margin/Q_max
        4th column : VSI3= S_margin/S_max
    
        VSI= min(VSI1,VSI2,VSI3)
        
        */
        var VSI = [];

        for (let i = 0; i < power.length; i++) {

            var item = [];
            var it = [];
            var Vs = Voltage_source[i][1];
            var load_index = power[i][0];
            var P = power[i][5] / 100;
            var Q = power[i][6] / 100;
            var teta = 0;
            var X = Impedance[i][2];


            if (P > 0) {
                teta = Math.atan(Q / P);
            }
            if (P < 0) {
                teta = Math.atan(Q / P) + Math.PI;
            }

            var S = P / Math.cos(teta);




            var step1 = Math.pow(Vs, 4);
            var d = Math.pow(X, 2);
            d = d * 4;
            step1 = step1 / d;

            d = Math.pow(Vs, 2) / X;
            var step2 = Q * d;

            step2 = step1 - step2;
            var Pmax = Math.sqrt(step2);

            var Pmargin = Pmax - P;
            var VSI1 = Pmargin / Pmax;




            step1 = Math.pow(Vs, 2) / (X * 4);

            step2 = Math.pow(P, 2) * X;
            d = Math.pow(Vs, 2);
            step2 = step2 / d;
            step2 = step1 - step2;
            var Qmax = step2;

            var Qmargin = Qmax - Q;
            var VSI2 = Qmargin / Qmax;

            var teta = 0;
            if (Q != 0) {

                teta = Math.atan(Q / P);
            }
            step1 = (1 - Math.sin(teta)) * d;
            step2 = 2 * Math.cos(teta) * Math.cos(teta) * X;
            var Smax = step1 / step2

            var Smargin = Smax - S;
            var VSI3 = Smargin / Smax;
            var minVSI = Math.min(VSI1, VSI2, VSI3);

            item.push(load_index);
            item.push(minVSI);

            item.push(power[i][7]);
            VSI.push(item);

        }

        ///////sort algorithm
        let len = VSI.length;

        //      //Heap sort

        //    for (let i = 1; i < len; i++)
        //    {
        //    // if child is bigger than parent

        //    if (VSI[i][1] > VSI[Math.floor((i - 1) / 2)][1])
        //    {
        //      var j = i;
        //      var m=Math.floor((j - 1) / 2);
        //      // swap child and parent until
        //      // parent is smaller
        //      while (VSI[j][1] > VSI[m][1])
        //      {
        //          var tmp=VSI[j];
        //          VSI[j]=VSI[m];
        //          VSI[m]=tmp;

        //           j = m;
        //      }
        //    }
        //   }

        //  for (let i = len - 1; i > 0; i--)
        //  {
        //    // swap value of first indexed
        //    // with last indexed
        //    var tmp=VSI[0];
        //    VSI[0]=VSI[i];
        //    VSI[i]=tmp;

        //    // maintaining heap property
        //    // after each swapping
        //    var j = 0;
        //    var index=0;

        //    do
        //    {
        //      index = (2 * j + 1);

        //      // if left child is smaller than
        //      // right child point index variable
        //      // to right child
        //      if (index < (i - 1) && VSI[index][1] < VSI[index + 1][1]){
        //        index++;
        //      }
        //      // if parent is smaller than child
        //      // then swapping parent with child
        //      // having higher value
        //      if (index < i && VSI[j][1] < VSI[index][1]){
        //      var tmp=VSI[j];
        //      VSI[j]=VSI[index];
        //      VSI[index]=tmp;
        //      }

        //      j = index;

        //    } while (index < i);
        // }


        //ShellSort
        for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {

            // Do a gapped insertion sort for this gap size.
            // The first gap elements a[0..gap-1] are already
            // in gapped order keep adding one more element
            // until the entire array is gap sorted
            for (let i = gap; i < len; i += 1) {

                // add a[i] to the elements that have been gap
                // sorted save a[i] in temp and make a hole at
                // position i
                let temp = VSI[i];

                // shift earlier gap-sorted elements up until
                // the correct location for a[i] is found
                let j;
                for (j = i; j >= gap && VSI[j - gap][1] > temp[1]; j -= gap) {
                    VSI[j] = VSI[j - gap];

                }
                // put temp (the original a[i]) in its correct
                // location
                VSI[j] = temp;

            }
        }

        var result = {};

        if (VSI[0][1] < threshold) {

            var all_resources = resources.reduce((a, b) => a + b, 0);
            if (all_resources == 0) {
                result = { 'resources': resources, 'gc': 1, "vsi": VSI, "split": 0 };
            } else {

                result = await this.localController(ctx, VSI, voltages, resources, group_Id, ID_s);

            }
        }
        else {
            if (merge) {
                result = { 'resources': resources, 'gc': 0, "vsi": VSI, "split": 1 };
            }
            else {
                result = { 'resources': resources, 'gc': 0, "vsi": VSI, "split": 0 };
            }
        }

        return result;
    }
    /* paper:  H. Lee, A. K. Srivastava, V. V. Krishnan, S. Niddodi, and D. E. Bakken,
        “Decentralized voltage stability monitoring and control with distributed
       computing coordination,” IEEE Systems Journal, 2021
      
  */
    async localController(ctx, VSI, voltages, resources, group_Id, ID_s) {


        var orderAsBytes = await ctx.stub.getState("lc" + group_Id);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from localController: group with groupId = ${group_Id} does not exist.`);
        }

        var group = JSON.parse(orderAsBytes);
        var PI = JSON.parse(group.PI);
        var J_group = JSON.parse(group.J);


        var group_l = PI.length;
        var group_t = J_group.length - group_l;
        var jacobian = new Jacobian(J_group, voltages, group_l, group_t);



        var voltage_m = voltages[index][0];
        var dq_dv = Math.abs(jacobian.getJacobianDiagonalValue(index));
        var Q_requested = dq_dv * (0.98 - voltage_m);
        

        index=VSI[0][2];
        var log = {};
        log.grou_id=group_Id;
        log.pre = JSON.stringify(resources);
        if (resources[index] == 0) {

            var ll = new List(group_l, index);
            ll.addFirstRow(PI[index]);
            //ll.printSortedList();

            while (!ll.isEmpty()) {

                var VSC_index = ll.getFirstElement();
                if (resources[VSC_index.bus] == 0) {
                    ll.ReplaceFirstNode(PI[VSC_index.bus]);
                    //ll.printSortedList();
                    continue;
                }


                //console.log(VSC_index.bus);
                dq_dv = Math.abs(jacobian.getJacobianValue(VSC_index.bus, index, VSC_index.parent));
                Q_requested = dq_dv * (0.98 - voltage_m);


                if (resources[VSC_index] < Q_requested) {
                    console.log("source of the bus is not enough");
                    resources[VSC_index.bus] = 0;
                    //  console.log(resources);
                    break;
                }
                else {
                    resources[VSC_index.bus] = resources[VSC_index.bus] - (Q_requested);
                    Q_requested = 0;
                    // console.log(resources);
                    break;
                }



            }

        }
        else if (resources[index] < (Q_requested)) {
            //console.log("source of the week bus is not enough");
            var ll = new List(group_l, index);
            ll.addFirstRow(PI[index]);
            // ll.printSortedList();
            resources[index] = 0;


        }
        else {


            resources[index] = resources[index] - (Q_requested);
            // console.log(resources)

        }







        log.after = JSON.stringify(resources);
        await ctx.stub.putState(ID_s, Buffer.from(JSON.stringify(log)));

        return { 'resources': resources, 'gc': 2 , "vsi": VSI, "split": 0};

    }

    //    async InitialGlobalControllers(ctx,PI1,J1,PI2,J2,PI3,J3){
    // var global1_2={};
    //     global1_2.Id='lc12';
    //     global1_2.PI=PI1;
    //     global1_2.J=J1;

    //     await ctx.stub.putState('lc12', Buffer.from(JSON.stringify(global1_2)));


    //     return 1;
    //    }
    async InitialLocalController(ctx, ID, PI, J) {
        var localController = {};
        localController.Id = ID;
        localController.PI = PI;
        localController.J = J;
        console.log(localController);
        await ctx.stub.putState(ID, Buffer.from(JSON.stringify(localController1)));


        return 1;
    }
    async InitialGrouping(ctx, ID, data, adjacent) {

        var group = {};
        group.Id = ID;
        group.Impedance = data;
        group.adjacent = adjacent;
        console.log(group);
        await ctx.stub.putState(ID, Buffer.from(JSON.stringify(group)));

        return 1;
    }



    async getCurrentUserId(ctx) {

        let id = [];
        console.info(ctx.clientIdentity.getID());
        id.push(ctx.clientIdentity.getID());
        var begin = id[0].indexOf("/CN=");
        var end = id[0].lastIndexOf("::/C=");
        let userid = id[0].substring(begin + 4, end);
        return userid;
    }


    async getlog(ctx, ID) {
        var orderAsBytes = await ctx.stub.getState(ID);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from GetLog: Log with ID = ${ID} does not exist.`);
        }

        return JSON.parse(orderAsBytes);

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

module.exports = VSIContract;