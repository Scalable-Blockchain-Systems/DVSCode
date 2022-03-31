

'use strict';



class Jacobian {
	constructor(J_matrix,voltages,group_l,group_t) {
          this.J_matrix=J_matrix;
          this.voltages=voltages;
 
          this.group_l=group_l;
          this.group_t=group_t;
          this.J= new Array(group_l).fill(undefined).map(() => new Array(group_l).fill(undefined));
          //console.log(this.J);
            
    }


    getJacobianDiagonalValue(index){
       
        //console.log("insideeeeeeeeee jacobian --------------------------");
        if (this.J[index][index]!= undefined){
            return this.J[index][index];
        }

        var dq_dv=0;

        var voltage_m=this.voltages[index][0];
        var voltage_a=this.voltages[index][1];
       
                 
        for(let j=0; j< (this.group_l+this.group_t);j++){
            if(this.J_matrix[index][j][0]==0){
                            continue;
               }
           if(this.voltages[j][2]==2 || this.voltages[j][2]==3){
                continue;
            }
            
                    
            if (index==j){
                
                dq_dv+=this.J_matrix[index][index][0]*voltage_m;
                
                    continue;
            }
                       
            var virtual_vm=0;
            var virtual_va=0;
       
            if (j> (this.group_l-1))
            {      
                virtual_vm=(voltage_m+this.voltages[j][0])/2;
                virtual_va=voltage_a-((voltage_a+this.voltages[j][1])/2);
   
            }
            else {
                        
                virtual_vm=this.voltages[j][0];
                virtual_va=voltage_a-this.voltages[j][1];
          

            }
            var jac=(this.J_matrix[index][j][0]*virtual_vm*Math.sin(virtual_va*Math.PI/180)-this.J_matrix[index][j][1]*virtual_vm*Math.cos(virtual_va*Math.PI/180));
       
                    
            dq_dv+=jac;



         }
         this.J[index][index]=dq_dv;
        // console.log(this.J);
        // console.log("end jacobian --------------------------");
        return dq_dv;

    }

    getJacobianValue(i,j,n){
        
       // console.log("insideeeeeeeeee jacobian --------------------------");
        if (this.J[i][j]!= undefined){
            return this.J[i][j];
        }
        
        var v=this.voltages[i][0];
        var a=this.voltages[i][1]-this.voltages[j][1];
        // console.log(v)
        if(this.J_matrix[i][j][0]!=0){
           this.J[i][j]=(this.J_matrix[i][j][0]*v*Math.sin(a*Math.PI/180)-this.J_matrix[i][j][1]*v*Math.cos(a*Math.PI/180));
        }
        else{
        
            this.J[i][j]=this.getJacobianValue(i,n,-1)*(1/this.getJacobianDiagonalValue(n))*this.getJacobianValue(n,j,-1);
            

        }
       // console.log(this.J);
       // console.log("end jacobian --------------------------");
        return this.J[i][j];
    }

}

module.exports=Jacobian;
