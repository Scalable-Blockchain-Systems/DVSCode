

mpc=case30
%one step
% mpc.bus(3,3)=mpc.bus(3,3)*50
% mpc.bus(3,4)=mpc.bus(3,4)*50

% %one step group1 -threshold=0.915
%    mpc.bus(3,3)=mpc.bus(3,3)*22
%    mpc.bus(3,4)=mpc.bus(3,4)*22 
% 
%  mpc.bus(4,4)=mpc.bus(4,4)-55.35002089586425 -6.357681854588881
% %one step group2
%      mpc.bus(30,3)=mpc.bus(24,3)*1.3
%      mpc.bus(30,4)=mpc.bus(24,4)*1.3 
%     - 8.220514057978963


% %one step group3
%      mpc.bus(14,3)=mpc.bus(14,3)*4
%      mpc.bus(14,4)=mpc.bus(14,4)*4  
%      
% mpc.bus(15,4)=mpc.bus(15,4)
% - 7.341455832851773  - 6.243750153281506  - 5.313680241933815



%keep the bus number in each group
groups={}
group1=[1,2,3,4,5]
group2=[6,7,8,9,11,22,23,24,25,26,27,28,29,30]
group3=[10,12,13,14,15,16,17,18,19,20,21]
groups={group1;group2;group3}
%keep the buses that connect the group to each other --> for changing the
%value of addmitance
group1_tie=[6,7,12]
group2_tie=[2,4,5,10,15,21]
group3_tie=[4,6,9,22,23]

threshold=[0.915,0.765,0.846]
group1_2_tie=[12,10,15,21]
group1_3_tie=[6,7,9,22,23]
group2_3_tie=[2,4,5]
groups_tie={group1_tie;group2_tie;group3_tie;group1_2_tie;group1_3_tie;group2_3_tie}



while 1
type=1
prompt = "please pick one group? enter 1 for group1, 2 for group2 and 3 for group3 ";
group_n = input(prompt)
group_m=1
prompt = " 1-calculate the VSI: enter 1 \n 2-merge groups: enter 2 \n 3-change loads: enter 3 \n 4-exit: enter 4 ";
command = input(prompt)
if (command==1)
    type=1
end
if (command==2)
    prompt = "please pick one group to merge? enter 1 for group1, 2 for group2 and 3 for group3 ";
    group_m = input(prompt)
    prompt = " 1-calculate the VSI: enter 2 \n 2-change loads: enter 3 \n 4-exit: enter 4 ";
    command = input(prompt)
end

if (command==2)
     type=2
end
if (command==3)
    prompt = "please pick one bus from 1 to 30 ";
    bus_n = input(prompt)
    prompt = "How many percentage you want to increase the load? (For example : 22 or 120 or 160 , ... percent) ";
    bus_p = input(prompt)
     mpc.bus(bus_n,3)=mpc.bus(bus_n,3)*bus_p     
     mpc.bus(bus_n,4)=mpc.bus(bus_n,4)*bus_p
end
if (command==4)
    break
end
    
    
result=runpf(mpc)




g=[]
group=[]
group_tie=[]
g_num=[0];
g_threshold=[1];
if (type==1)
    
   
    group=cell2mat(groups(group_n))
    group_tie=cell2mat(groups_tie(group_n))
    g=[group group_tie]
    g_num=[g_num group_n]
    g_threshold=[g_threshold threshold(group_n)]
    
end
if (type==2)
    
    group=[cell2mat(groups(group_n)) cell2mat(groups(group_m))]
    group_tie=cell2mat(groups_tie(group_n+group_m+1))
    g=[group group_tie]
    if (group_n <group_m) 
    g_num=[g_num group_n group_m]
    else
        g_num=[g_num group_m group_n]
    end
    g_threshold=[g_threshold min(threshold(group_n), threshold(group_m))]
end

bus=result.bus(g,:)
bus(end-length(group_tie)+1:end,2)=4

SZ=size(result.branch)

branch=[]

for i=1:SZ(1)
    from=result.branch(i,1)
    To=result.branch(i,2)
    
    if ( (ismember(from,g) && ismember(To,group)) || (ismember(from,group) && ismember(To,group_tie)) )
         branch=[branch;result.branch(i,:)];
        
    end
        
end




VSC=[]
SZ=size(bus)
for k=1:SZ(1)
    
    if (bus(k,2)==4 )
        continue;
    end
    if (bus(k,2)==2 )
        VSC=[VSC; 0]
    else
          VSC=[VSC; 150/100]
    end
end


if (group_n==1)
    bus(1,:)=[]
end

b.bus=bus
b.shard=group_n
b.branch=branch
b.group=g_num;
b.threshold=[g_threshold]
b.VSC=VSC;



url='http://localhost:8081/VSI';
options = weboptions('RequestMethod','post', 'MediaType','application/json');
Body = ConvertStructToJson(b)
 
 response= webwrite(url,Body,options);
 type=jsondecode(response).gc
end
