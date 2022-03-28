mpc=case30

ad=makeYbus(mpc.baseMVA, mpc.bus, mpc.branch);
addmitance=full(ad)
S=full(ad);

%prepare Y matrix
sl=size(addmitance)
% Y_matrix=zeros(sl(1),sl(2),2)


%keep the bus number in each group
group1=[2,3,4,5]
group2=[6,7,8,9,11,22,23,24,25,26,27,28,29,30]
group3=[10,12,13,14,15,16,17,18,19,20,21]
%keep the buses that connect the group to each other --> for changing the
%value of addmitance
group1_tie=[6,7,12]
group2_tie=[2,4,5,10,15,21]
group3_tie=[4,6,9,22,23]
% connections= [[2,6];[4,6];[5,7];[6,10];[9,10];[4,12];[10,22]; [23,15];[22,21]]
group1_2_tie=[12,10,15,21]
group1_3_tie=[6,7,9,22,23]
group2_3_tie=[2,4,5]

g1_tie_gc12=[6]
g2_tie_gc12=[17,18,19]

g1_tie_gc13=[4,5]
g3_tie_gc13=[13,14,15]

g2_tie_gc23=[14,15,16]
g3_tie_gc23=[]
%split the Y matrix 
group1_addmitance=zeros(7,7)
g1=[group1 group1_tie]
for i=1:7
    r=g1(i);
    for j=1:7
       c=g1(j);
       group1_addmitance(i,j)=S(r,c); 
        
    end
end


g2=[group2 group2_tie]
l=length(g2)
group2_addmitance=zeros(l,l)
for i=1:l
    r=g2(i);
    for j=1:l
       c=g2(j);
       group2_addmitance(i,j)=S(r,c); 
        
    end
end
% group2_addmitance=S([group2 group2_tie],[group2 group2_tie])
% group3_addmitance=S([group3 group3_tie],[group3 group3_tie])
g3=[group3 group3_tie]
l=length(g3)
group3_addmitance=zeros(l,l)
for i=1:l
    r=g3(i);
    for j=1:l
       c=g3(j);
       group3_addmitance(i,j)=S(r,c); 
        
    end
end

% group1 addmitance matrix formation
group1_addmitance_old=group1_addmitance
group1_dim=[group1 group1_tie];
for k=1: length(group1_tie)
    idx=find(group1_dim==group1_tie(k))
    group1_addmitance(idx,idx)=0
    for m=1:length(group1_dim)
        if (m==idx)
            continue;
        end
        if (group1_addmitance(idx,m)~= 0)
            group1_addmitance(m,m)=group1_addmitance(m,m)-group1_addmitance(idx,m)
            group1_addmitance(idx,m)=group1_addmitance(idx,m)*2;
            group1_addmitance(m,idx)=group1_addmitance(m,idx)*2;
            group1_addmitance(idx,idx)=group1_addmitance(idx,idx)-group1_addmitance(idx,m)
        end
    end
    
end

%group1 base of Jacobian matrix
l=length(group1_dim);
Jacobian_matrix1=zeros(l,l,2);


for i=1:l
    for j=1:l
         theta= angle(group1_addmitance(i,j)) 
%         theta=180/pi*theta
        
        if (i==j)
            Jacobian_matrix1(i,j,1)= -1*sin(theta)*abs(group1_addmitance(i,j));
         continue;  
        end
        if (group1_addmitance(i,j)~=0)
            Jacobian_matrix1(i,j,1)=cos(theta)*abs(group1_addmitance(i,j));
            Jacobian_matrix1(i,j,2)=sin(theta)*abs(group1_addmitance(i,j));
        end
        
    end
end



%group 1 Zth formation
gen=mpc.gen(:,1)
Y_LL=group1_addmitance
dim=group1_dim

for k = 1:length(gen)
cr=gen(k,1)

for j=1:length(dim)
     if (cr==dim(j) && ~ismember(cr,group1_tie))
       Y_LL(j,:)=[]
       Y_LL(:,j)=[]
       dim(j)=[]
       break;
     end
end
 
end
load_buses=[]
for k=1:length(dim)-length(group1_tie)
    load_buses=[load_buses dim(k)]
end
tie_size=length(group1_tie)-1
Y_TT=Y_LL([end-tie_size:end], [end-tie_size:end])
Y_LT=Y_LL([1:end-tie_size-1],[end-tie_size:end])
Y_TL=transpose(Y_LT)
Y_LL=Y_LL([1:end-tie_size-1],[1:end-tie_size-1])

Z_TH=inv((Y_LL-(Y_LT*inv(Y_TT)*Y_TL)))
SZ=size(Z_TH)
Impedance_group1=zeros(SZ(1),4);
m=0
for k = 1:SZ(1)
    Impedance_group1(k,1)=k;
    Impedance_group1(k,2)=real(Z_TH(k,k))
    Impedance_group1(k,3)=imag(Z_TH(k,k))
    Impedance_group1(k,4)=load_buses(k);
 end



% group2 addmitance matrix formation
group2_addmitance_old=group2_addmitance
group2_dim=[group2 group2_tie];
for k=1: length(group2_tie)
    idx=find(group2_dim==group2_tie(k))
    group2_addmitance(idx,idx)=0
    for m=1:length(group2_dim)
        if (m==idx)
            continue;
        end
        if (group2_addmitance(idx,m)~= 0)
            group2_addmitance(m,m)=group2_addmitance(m,m)-group2_addmitance(idx,m)
            group2_addmitance(idx,m)=group2_addmitance(idx,m)*2;
            group2_addmitance(m,idx)=group2_addmitance(m,idx)*2;
            group2_addmitance(idx,idx)=group2_addmitance(idx,idx)-group2_addmitance(idx,m)
        end
    end
    
end

%group2 base of Jacobian matrix
l=length(group2_dim);
Jacobian_matrix2=zeros(l,l,2);


for i=1:l
    for j=1:l
        theta= angle(group2_addmitance(i,j)) 
%         theta=180/pi*theta
        
        if (i==j)
            Jacobian_matrix2(i,j,1)= -1*sin(theta)*abs(group2_addmitance(i,j));
            continue;
        end
        if (group2_addmitance_old(i,j)~=0)
            Jacobian_matrix2(i,j,1)=cos(theta)*abs(group2_addmitance(i,j));
            Jacobian_matrix2(i,j,2)=sin(theta)*abs(group2_addmitance(i,j));
        end
        
    end
end


%group2 Zth formation
gen=mpc.gen(:,1)
Y_LL=group2_addmitance
dim=group2_dim

for k = 1:length(gen)
cr=gen(k,1)

for j=1:length(dim)
     if (cr==dim(j) && ~ismember(cr,group2_tie))
       Y_LL(j,:)=[]
       Y_LL(:,j)=[]
       dim(j)=[]
       break;
     end
end
 
end
load_buses=[]
for k=1:length(dim)-length(group2_tie)
    load_buses=[load_buses dim(k)]
end
tie_size=length(group2_tie)-1
Y_TT=Y_LL([end-tie_size:end], [end-tie_size:end])
Y_LT=Y_LL([1:end-tie_size-1],[end-tie_size:end])
Y_TL=transpose(Y_LT)
Y_LL=Y_LL([1:end-tie_size-1],[1:end-tie_size-1])

Z_TH=inv((Y_LL-(Y_LT*inv(Y_TT)*Y_TL)))
SZ=size(Z_TH)
Impedance_group2=zeros(SZ(1),4);
m=0
for k = 1:SZ(1)
    Impedance_group2(k,1)=k;
    Impedance_group2(k,2)=real(Z_TH(k,k))
    Impedance_group2(k,3)=imag(Z_TH(k,k))
    Impedance_group2(k,4)=load_buses(k);
end


 % group3 addmitance matrix formation
group3_addmitance_old=group3_addmitance
group3_dim=[group3 group3_tie];
for k=1: length(group3_tie)
    idx=find(group3_dim==group3_tie(k))
    group3_addmitance(idx,idx)=0
    for m=1:length(group3_dim)
        if (m==idx)
            continue;
        end
        if (group3_addmitance(idx,m)~= 0)
            group3_addmitance(m,m)=group3_addmitance(m,m)-group3_addmitance(idx,m)
            group3_addmitance(idx,m)=group3_addmitance(idx,m)*2;
            group3_addmitance(m,idx)=group3_addmitance(m,idx)*2;
            group3_addmitance(idx,idx)=group3_addmitance(idx,idx)-group3_addmitance(idx,m)
        end
    end
    
end

%group3 base of Jacobian matrix
l=length(group3_dim);
Jacobian_matrix3=zeros(l,l,2);


for i=1:l
    for j=1:l
        theta= angle(group3_addmitance(i,j)) 
%         theta=180/pi*theta
        
        if (i==j)
            Jacobian_matrix3(i,j,1)= -1*sin(theta)*abs(group3_addmitance(i,j));
            continue;
        end
        if (group3_addmitance(i,j)~=0)
            Jacobian_matrix3(i,j,1)=cos(theta)*abs(group3_addmitance(i,j));
            Jacobian_matrix3(i,j,2)=sin(theta)*abs(group3_addmitance(i,j));
        end
        
    end
end


%group 3 Zth formation
gen=mpc.gen(:,1)
Y_LL=group3_addmitance
dim=group3_dim

for k = 1:length(gen)
cr=gen(k,1)

for j=1:length(dim)
     if (cr==dim(j) && ~ismember(cr,group3_tie))
       Y_LL(j,:)=[]
       Y_LL(:,j)=[]
       dim(j)=[]
       break;
     end
end
 
end
load_buses=[]
for k=1:length(dim)-length(group3_tie)
    load_buses=[load_buses dim(k)]
end
tie_size=length(group3_tie)-1
Y_TT=Y_LL([end-tie_size:end], [end-tie_size:end])
Y_LT=Y_LL([1:end-tie_size-1],[end-tie_size:end])
Y_TL=transpose(Y_LT)
Y_LL=Y_LL([1:end-tie_size-1],[1:end-tie_size-1])

Z_TH=inv((Y_LL-(Y_LT*inv(Y_TT)*Y_TL)))
SZ=size(Z_TH)
Impedance_group3=zeros(SZ(1),4);
m=0
for k = 1:SZ(1)
    Impedance_group3(k,1)=k;
    Impedance_group3(k,2)=real(Z_TH(k,k))
    Impedance_group3(k,3)=imag(Z_TH(k,k))
    Impedance_group3(k,4)=load_buses(k);
 end




%Priority index matrix
l=length(group1_tie)
PI_group1=group1_addmitance_old(1:end-l, 1:end-l)
 
for i=1: length(group1)
     for j=1:length(group1)
        if (i==j)
             PI_group1(i,j)=0
         else
             PI_group1(i,j)=abs(PI_group1(i,j))
         end
     end
 end
% 
PI_group2=S(group2,group2)
 
 for i=1: length(group2)
     for j=1:length(group2)
         if (i==j)
             PI_group2(i,j)=0
         else
             PI_group2(i,j)=abs(PI_group2(i,j))
         end
     end
 end
% 
 PI_group3=S(group3,group3)
 
 for i=1: length(group3)
     for j=1:length(group3)
         if (i==j)
             PI_group3(i,j)=0
         else
           PI_group3(i,j)=abs(PI_group3(i,j))
         end   
    end
 end
% 
% %create PI for group1_2
 PI_group1_2=S([group1 group2],[group1,group2])
 
 for i=1: length([group1 group2])
     for j=1:length([group1 group2])
         if (i==j)
             PI_group1_2(i,j)=0
         else
           PI_group1_2(i,j)=abs(PI_group1_2(i,j))
         end   
     end
 end

% %create PI for group1_3
 PI_group1_3=S([group1 group3],[group1,group3])
 
 for i=1: length([group1 group3])
     for j=1:length([group1 group3])
         if (i==j)
             PI_group1_3(i,j)=0
         else
           PI_group1_3(i,j)=abs(PI_group1_3(i,j))
         end   
     end
 end
 
 % %create PI for group2_3
 PI_group2_3=S([group2 group3],[group2,group3])
 
 for i=1: length([group2 group3])
     for j=1:length([group2 group3])
         if (i==j)
             PI_group2_3(i,j)=0
         else
           PI_group2_3(i,j)=abs(PI_group2_3(i,j))
         end   
     end
 end
 %-------------------------------------merging group
group1_2_addmitance=S([group1 group2 group1_2_tie],[group1 group2 group1_2_tie])
group1_3_addmitance=S([group1 group3 group1_3_tie],[group1 group3 group1_3_tie])
group2_3_addmitance=S([group2 group3 group2_3_tie],[group2 group3 group2_3_tie])

% % group1_2 addmitance matrix formation
 group1_2_addmitance_old=group1_2_addmitance
 group1_2_dim=[group1 group2 group1_2_tie];
 for k=1: length(group1_2_tie)
     idx=find(group1_2_dim==group1_2_tie(k))
     group1_2_addmitance(idx,idx)=0
     for m=1:length(group1_2_dim)
        if (m==idx)
             continue;
         end
         if (group1_2_addmitance(idx,m)~= 0)
             group1_2_addmitance(m,m)=group1_2_addmitance(m,m)-group1_2_addmitance(idx,m)
             group1_2_addmitance(idx,m)=group1_2_addmitance(idx,m)*2;
             group1_2_addmitance(m,idx)=group1_2_addmitance(m,idx)*2;
            group1_2_addmitance(idx,idx)=group1_2_addmitance(idx,idx)-group1_2_addmitance(idx,m)
        end
     end
     
 end

%group1_2 base of Jacobian matrix
l=length(group1_2_dim);
Jacobian_matrix1_2=zeros(l,l,2);


for i=1:l
    for j=1:l
        theta= angle(group1_2_addmitance(i,j)) 
%         theta=180/pi*theta
        
        if (i==j)
            Jacobian_matrix1_2(i,j,1)= -1*sin(theta)*abs(group1_2_addmitance(i,j));
            continue;
        end
        if (group1_2_addmitance(i,j)~=0)
            Jacobian_matrix1_2(i,j,1)=cos(theta)*abs(group1_2_addmitance(i,j));
            Jacobian_matrix1_2(i,j,2)=sin(theta)*abs(group1_2_addmitance(i,j));
        end
        
    end
end



%group 1_2 Zth formation
gen=mpc.gen(:,1)
Y_LL=group1_2_addmitance
dim=group1_2_dim

for k = 1:length(gen)
cr=gen(k,1)

for j=1:length(dim)
     if (cr==dim(j) && ~ismember(cr,group1_2_tie))
       Y_LL(j,:)=[]
       Y_LL(:,j)=[]
       dim(j)=[]
       break;
     end
end
 
end
load_buses=[]
for k=1:length(dim)-length(group1_2_tie)
    load_buses=[load_buses dim(k)]
end
tie_size=length(group1_2_tie)-1
Y_TT=Y_LL([end-tie_size:end], [end-tie_size:end])
Y_LT=Y_LL([1:end-tie_size-1],[end-tie_size:end])
Y_TL=transpose(Y_LT)
Y_LL=Y_LL([1:end-tie_size-1],[1:end-tie_size-1])

Z_TH=inv((Y_LL-(Y_LT*inv(Y_TT)*Y_TL)))
SZ=size(Z_TH)
Impedance_group1_2=zeros(SZ(1),4);
m=0
for k = 1:SZ(1)
    Impedance_group1_2(k,1)=k;
    Impedance_group1_2(k,2)=real(Z_TH(k,k))
    Impedance_group1_2(k,3)=imag(Z_TH(k,k))
    Impedance_group1_2(k,4)=load_buses(k);
 end





% % group1_3 addmitance matrix formation
 group1_3_addmitance_old=group1_3_addmitance
 group1_3_dim=[group1 group3 group1_3_tie];
 for k=1: length(group1_3_tie)
     idx=find(group1_3_dim==group1_3_tie(k))
     group1_3_addmitance(idx,idx)=0
     for m=1:length(group1_3_dim)
         if (m==idx)
             continue;
         end
         if (group1_3_addmitance(idx,m)~= 0)
             group1_3_addmitance(m,m)=group1_3_addmitance(m,m)-group1_3_addmitance(idx,m)
             group1_3_addmitance(idx,m)=group1_3_addmitance(idx,m)*2;
             group1_3_addmitance(m,idx)=group1_3_addmitance(m,idx)*2;
             group1_3_addmitance(idx,idx)=group1_3_addmitance(idx,idx)-group1_3_addmitance(idx,m)
         end
     end
     
 end

%group1_3 base of Jacobian matrix
l=length(group1_3_dim);
Jacobian_matrix1_3=zeros(l,l,2);


for i=1:l
    for j=1:l
        theta= angle(group1_3_addmitance(i,j)) 
%         theta=180/pi*theta
        
        if (i==j)
            Jacobian_matrix1_3(i,j,1)= -1*sin(theta)*abs(group1_3_addmitance(i,j));
            continue;
        end
        if (group1_3_addmitance(i,j)~=0)
            Jacobian_matrix1_3(i,j,1)=cos(theta)*abs(group1_3_addmitance(i,j));
            Jacobian_matrix1_3(i,j,2)=sin(theta)*abs(group1_3_addmitance(i,j));
        end
        
    end
end

% 
%group 1_3 Zth formation
gen=mpc.gen(:,1)
Y_LL=group1_3_addmitance
dim=group1_3_dim

for k = 1:length(gen)
cr=gen(k,1)

for j=1:length(dim)
     if (cr==dim(j) && ~ismember(cr,group1_3_tie))
       Y_LL(j,:)=[]
       Y_LL(:,j)=[]
       dim(j)=[]
       break;
     end
end
 
end
load_buses=[]
for k=1:length(dim)-length(group1_3_tie)
    load_buses=[load_buses dim(k)]
end
tie_size=length(group1_3_tie)-1
Y_TT=Y_LL([end-tie_size:end], [end-tie_size:end])
Y_LT=Y_LL([1:end-tie_size-1],[end-tie_size:end])
Y_TL=transpose(Y_LT)
Y_LL=Y_LL([1:end-tie_size-1],[1:end-tie_size-1])

Z_TH=inv((Y_LL-(Y_LT*inv(Y_TT)*Y_TL)))
SZ=size(Z_TH)
Impedance_group1_3=zeros(SZ(1),4);
m=0
for k = 1:SZ(1)
    Impedance_group1_3(k,1)=k;
    Impedance_group1_3(k,2)=real(Z_TH(k,k))
    Impedance_group1_3(k,3)=imag(Z_TH(k,k))
    Impedance_group1_3(k,4)=load_buses(k);
 end











 % group2_3 addmitance matrix formation
 group2_3_addmitance_old=group2_3_addmitance
 group2_3_dim=[group2 group3 group2_3_tie];
 for k=1: length(group2_3_tie)
     idx=find(group2_3_dim==group2_3_tie(k))
     group2_3_addmitance(idx,idx)=0
     for m=1:length(group2_3_dim)
         if (m==idx)
             continue;
         end
         if (group2_3_addmitance(idx,m)~= 0)
             group2_3_addmitance(m,m)=group2_3_addmitance(m,m)-group2_3_addmitance(idx,m)
             group2_3_addmitance(idx,m)=group2_3_addmitance(idx,m)*2;
             group2_3_addmitance(m,idx)=group2_3_addmitance(m,idx)*2;
             group2_3_addmitance(idx,idx)=group2_3_addmitance(idx,idx)-group2_3_addmitance(idx,m)
         end
     end
     
 end

%group2_3 base of Jacobian matrix
l=length(group2_3_dim);
Jacobian_matrix2_3=zeros(l,l,2);


for i=1:l
    for j=1:l
        theta= angle(group2_3_addmitance(i,j)) 
%         theta=180/pi*theta
        
        if (i==j)
            Jacobian_matrix2_3(i,j,1)= -1*sin(theta)*abs(group2_3_addmitance(i,j));
            continue;
        end
        if (group2_3_addmitance(i,j)~=0)
            Jacobian_matrix2_3(i,j,1)=cos(theta)*abs(group2_3_addmitance(i,j));
            Jacobian_matrix2_3(i,j,2)=sin(theta)*abs(group2_3_addmitance(i,j));
        end
        
    end
end
 
%group 2_3 Zth formation
gen=mpc.gen(:,1)
Y_LL=group2_3_addmitance
dim=group2_3_dim

for k = 1:length(gen)
cr=gen(k,1)

for j=1:length(dim)
     if (cr==dim(j) && ~ismember(cr,group2_3_tie))
       Y_LL(j,:)=[]
       Y_LL(:,j)=[]
       dim(j)=[]
       break;
     end
end
 
end
load_buses=[]
for k=1:length(dim)-length(group2_3_tie)
    load_buses=[load_buses dim(k)]
end
tie_size=length(group2_3_tie)-1
Y_TT=Y_LL([end-tie_size:end], [end-tie_size:end])
Y_LT=Y_LL([1:end-tie_size-1],[end-tie_size:end])
Y_TL=transpose(Y_LT)
Y_LL=Y_LL([1:end-tie_size-1],[1:end-tie_size-1])

Z_TH=inv((Y_LL-(Y_LT*inv(Y_TT)*Y_TL)))
SZ=size(Z_TH)
Impedance_group2_3=zeros(SZ(1),4);
m=0
for k = 1:SZ(1)
    Impedance_group2_3(k,1)=k;
    Impedance_group2_3(k,2)=real(Z_TH(k,k))
    Impedance_group2_3(k,3)=imag(Z_TH(k,k))
    Impedance_group2_3(k,4)=load_buses(k);
 end




body.Impedance_group1=Impedance_group1;
body.PI_group1=PI_group1;
body.J_group1=Jacobian_matrix1;


body.Impedance_group2=Impedance_group2;
body.PI_group2=PI_group2;
body.J_group2=Jacobian_matrix2;



body.Impedance_group3=Impedance_group3;
body.PI_group3=PI_group3;
body.J_group3=Jacobian_matrix3;


body.Impedance_group1_2=Impedance_group1_2
body.PI_group1_2=PI_group1_2;
body.J_group1_2=Jacobian_matrix1_2;

body.Impedance_group1_3=Impedance_group1_3
body.PI_group1_3=PI_group1_3;
body.J_group1_3=Jacobian_matrix1_3;

body.Impedance_group2_3=Impedance_group2_3
body.PI_group2_3=PI_group2_3;
body.J_group2_3=Jacobian_matrix2_3;

url='http://localhost:8081/initial';
options = weboptions('RequestMethod','post', 'MediaType','application/json');
%  
Body = ConvertStructToJson(body)
 
%  
response= webwrite(url,Body,options);
 

