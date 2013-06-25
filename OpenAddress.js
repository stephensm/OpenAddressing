var OpenAd=(function(){
    var maxCap=1000;
    var data={};
    var probe='linear';
    var size=0;
    var ProbeDict={"linear":linearProbe,"quad":quadProbe, "dh":doubleProbe};
    var ActDict={"ins":insert,"del":remove,"find":find}
    var savedVal;
    var exp=[];
    
    //takes input of string and returns number between 0 and maxCap-1 inclusive
    function hash(str)
    {
        exp.push("Hashing inputed key "+ str);
        var sum=0;
        for(var i=0;i<str.length;i++)
        {
            sum+=str.charCodeAt(i);
          exp.push("Value of " +str.charAt(i) +" is "+str.charCodeAt(i));
            exp.push("Sum is now "+ sum);
        }
        exp.push("Hash number is the sum mod the Max Size");
        exp.push(sum + " mod " + maxCap + " = "+sum%maxCap);
        return sum%maxCap;
        
    }
    
    
    //linear probe technique
    function linearProbe(hashNum)
    {
        exp.push("linearly probing " +hashNum+ " to be "+ (hashNum+1)%maxCap);
        return (hashNum+1)%maxCap;
        
    }
    //quadratic probe technique
    function quadProbe(hashNum)
    {
        exp.push("Quadratic probing" +hashNum+ " to be "+ (hashNum*hashNum)%maxCap);
        return (hashNum*hashNum)%maxCap;
    }
      //quadratic probe technique
    function doubleProbe(hashNum)
    {
        
        a=hash(hashNum);
        exp.push("hashing again" +hashNum+ " to give second hash number "+ a);
        
        exp.push("probing the sum of the hash numbers " +hashNum +a + " to be "+ (hashNum+a)%maxCap);
        return (hashNum+a)%maxCap;
    }
    
    function insert(key,val,Probe)
    {
        var hashed=hash(key);
        var found=false;
        var count=0;
        while(!found){
            exp.push("seeing if " +hashed+ " is available ");
            if (count>maxCap)
            {
                return "No space available";
            }
            
            
            if(data[hashed]["key"]=='None'|| data[hashed]["key"]=='Empty')
            {
               
                data[hashed]={"key": key,"value": val};
                found=true;
                return "Sucessfully inserted "+key + " at position " + hashed+" with value " +val ;
            }
            else{
                exp.push(hashed+ " is not available. Trying the next position ");
               hashed=Probe(hashed);
            }
            count++;
        }
        return false;
    }
    function remove(key,val,Probe)
    {
        var hashed=hash(key);
        var found=false;
        var count=0;
        while(!found){
            if (count>maxCap)
            {
                return "Unable to find " + key;
            }
            if(data[hashed]["key"]==key)
            {
                data[hashed]={"key": 'Empty', "value": "None"}
                return "Sucessfully removed " +key;
            }
            else{
               hashed=Probe(hashed);
            }
            count++;
        }
        return false;
    }
    function find(key,val, Probe)
    {
        var hashed=hash(key);
        var found=false;
        var count=0;
        while(!found){
            if (count>maxCap)
            {
                return "unable to find "+key;
            }
            if(data[hashed]["key"]==key)
            {
                savedVal=data[hashed]["value"];
                return "Value of " + key + " is "+ savedVal;
                
            }
             if(data[hashed]["key"]=='None')
            {
                return "Unable to find " + key;
                
            }
            else{
               hashed=Probe(hashed);
            }
            count++;
        }
        return false;
    }
    
    function reset()
    {
          for (var i=0;i<maxCap;i++)
        {
            data[i]={"key": 'None', "value": 'None'};
        }
        maxCap=1000;
    }
    function drawTable(div){
        
         $('div.ht').remove();
        var t=$('<div class="ht" ><div>');
        var tables=$('<table class="hashTable"></table>');
        for (var i=0;i<maxCap;i++)
        {
            
            var newRows=$("<tr><td>"+i+"</td><td>"+data[i]["key"]+"</td><td>"+data[i]["value"]+"</td></tr>"); 
            tables.append(newRows);
           
        }
        t.append(tables);
   
        $('div.hbox').append(t);
    }
    
    function drawBlankTable(table,size)
    {
        for(var i=0;i<size;i++)
        {
               var newRow=$("<tr><td>"+i+"</td><td>None</td><td>None</td></tr>"); 
                table.append(newRow);
        }
        return table;
    }
    function process(probe,action,keyIn,valIn,div){
        var probeType=ProbeDict[probe];
        var actType=ActDict[action];
        
        var message=actType(keyIn,valIn,probeType);
        exp.push(message);
        drawTable(div);
        var memmo=null;
        $('div.memmo').remove();
        for (var i=0;i<exp.length;i++)
        {
            memmo=$('<div class="memmo"><label>'+exp[i]+'</label></memo>');
        $('div.exbox').append(memmo);

        }
        
        
    }
   
    

    function setup(div){
        reset();
        
        var action='ins';
       
        
        var head=$(" <h2 style='text-align: center; margin:10px;'>Open Addressing</h2>");
        
      
        var inputCol=$("<div class='inputDiv'  width=300px></div>");
        var title=$(" <h2 style='text-align: center; margin:10px;'>Controlls</h2>");
       
        var box=$("<div class='box' ></div>");
        var head1=$(" <h5 style='text-align: center; margin:10px;'>Action</h5>");
        var ins=$('<div><input id="ins" type="radio" name="actbut" value="ins" /> <label for="linear">Insert</label></div>');
        var del=$('<div><input id="del" type="radio" name="actbut" value="del" /> <label for="qdel">Delete</label></div>');
        var find=$('<div><input id="find" type="radio" name="actbut" value="find" /> <label for="find">Find</label></div>');
        
        var key=$("<label>Key </label><input class='key'></input>");
        var val=$("<label>Value</label><input class='val'></input>");
        
        
        var head2=$(" <h5 style='text-align: center; margin:10px;'>Probe Sequence</h5>");
        var linear=$('<div><input id="linear" type="radio" name="but" value="linear" /> <label for="linear">Linear</label></div>');
        var quad=$('<div><input id="quad" type="radio" name="but" value="quad" /> <label for="quad">Quadratic</label></div>');
        var dh=$('<div><input id="dh" type="radio" name="but" value="dh" /> <label for="dh">Double Hash</label></div>');
        var head3=$(" <h5 style='text-align: center; margin:10px;'>Capacity</h5>");
            var mc=$("<label>Max Size</label><input class='maxCap'></input>");
        var go=$("<button class='go'>Go!</button>");  
        go.on("click",function(){
           var changed="false";
            
            if( $('input:radio[name=but]:checked').val()!=null){
                if(probe!=$('input:radio[name=but]:checked').val())
                {
                     probe=$('input:radio[name=but]:checked').val();
                    changed=true;
                }
               }
            if($('input:radio[name=actbut]:checked').val()!=null){
            action= $('input:radio[name=actbut]:checked').val();}
            var keyIn=$('.key').val();
            var valIn=$('.val').val();
            
            if($('.maxCap').val()!=null){
                if(maxCap!=parseInt($('.maxCap').val()))
                {
                maxCap=parseInt($('.maxCap').val());
                
                    changed=true;
                }
            }
            console.log(changed);
            if(changed)
            {//reset();
            drawTable(div);}
            process(probe,action,keyIn,valIn,div);
        
        });
        box.append(head1,ins,del,find,key,val,head2,linear,quad,dh,head3,mc,go);
        inputCol.append(head,title,box);
       
        
        var explain=$("<div class='explain'  width=500px></div>");
        var exbox=$("<div class='exbox' ></div>");
        var etitle=$(" <h2 style='text-align: center; margin:10px;'>Explanation</h2>");
        explain.append(etitle,exbox);
        
        
        var htable=$("<div class='htable'  width=200px></div>");
         var hbox=$("<div class='hbox' ></div>");
        var htitle=$(" <h2 style='text-align: center; margin:10px;'>Hash Table</h2>");
       var tablehead=$(' <table class="headTable" ><tr><td>Number</td><td>Key</td><td>Value</td></tr></table>');
        var table=$('<table class="hashTable"></table>');
        table=drawBlankTable(table,maxCap);
        var t=$('<div class="ht" ><div>');
        t.append(table);
        hbox.append(tablehead,t);
        var clear=$("<button class='clear'>Clear!</button>");  
        clear.on("click",function(){reset();drawTable(div);});
        
        htable.append(htitle,hbox,clear);

        $(div).append(head, inputCol,explain,htable); 
    }
    
    
    return {setup: setup};
}());
$(document).ready(function(){
    $('.OpenAddress').each(function(){
        OpenAd.setup($(this));});
});