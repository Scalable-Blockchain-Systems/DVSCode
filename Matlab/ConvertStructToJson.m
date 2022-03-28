function [results] = ConvertStructToJson(input)
% this function convert struct object to JSON object
%we need to convert the data to JSON format to send it over HTTP request to Blockchain
results=input;

fields=fieldnames(results);

for i = 1:numel(fields)
    
 
  
  if isa(results.(fields{i}),'double')
    if  (size(results.(fields{i}),1)>1 || size(results.(fields{i}),2)>1) ||(size(results.(fields{i}),1)==0 )
          results.(fields{i})=jsonencode(full(results.(fields{i})));
    end
 
  elseif isa(results.(fields{i}),'struct') 
    if  (size(results.(fields{i}),1)>1 || size(results.(fields{i}),2)>1)
        results.(fields{i})=jsonencode(full(results.(fields{i})));
    else
         results.(fields{i})=ConvertStructToJson(results.(fields{i}));
       
    end
    
  elseif   isa(results.(fields{i}),'opf_model')
      results.(fields{i})=struct(results.(fields{i}));
      results.(fields{i})=ConvertStructToJson(results.(fields{i}));
      
    
  elseif   isa(results.(fields{i}),'function_handle')
      
      results.(fields{i})=func2str(results.(fields{i}));
      
  end

end

return


end

