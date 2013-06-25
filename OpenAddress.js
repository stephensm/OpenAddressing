var OpenAd=(function(){
    var maxCap=1000;
    var data={};
    var probe='linear';
    var size=0;
    var ProbeDict={"linear":linearProbe, "dh":doubleProbe};
    var ActDict={"ins":insert,"del":remove,"find":find}
    var savedVal;
    var exp=[];
    
    //takes input of string and returns number between 0 and maxCap-1 inclusive
    function hash(str,size)
    {
        exp.push({"text":"Hashing inputed key "+ str,"color":"white"});
        var sum=0;
        for(var i=0;i<str.length;i++)
        {
            sum+=str.charCodeAt(i);
          exp.push({"text":"Value of " +str.charAt(i) +" is "+str.charCodeAt(i), "color":'yellow'});
            exp.push({"text":"Sum is now "+ sum,"color":'yellow'});
        }
        exp.push({"text":"Hash number is the sum mod the Size","color":'white'});
        exp.push({"text":sum + " mod " + size + " = "+sum%size, "color":'yellow'});
        return sum%size;
        
    }
    
   
    
    
    //linear probe technique
    function linearProbe(hashNum,hashFunc)
    {
        exp.push({"text":"linearly probing " +hashNum+ " to be "+ (hashNum+1)%maxCap,"color":'white'});
        return (hashNum+1)%maxCap;
        
    }

   
      //double probe technique
    function doubleProbe(hashNum,hashFunc)
    {
        
        a=hashFunc(hashNum);

        exp.push({"text":"probing the sum of the hash numbers " +hashNum + " and "+ a + " to be "+ (hashNum+a)%maxCap,"color":'white'});
        return (hashNum+a)%maxCap;
    }
    
    function insert(key,val,Probe,hashFunc)
    {
        var hashed=hash(key,maxCap);
        var found=false;
        var count=0;
        while(!found){
            exp.push({"text":"seeing if " +hashed+ " is available ","color":'white'});
            if (count>maxCap)
            {
                exp.push({"text":"No space available","color":'red'});
            }
            
            
            if(data[hashed]["key"]=='None'|| data[hashed]["key"]=='Empty'|| data[hashed]["key"]==key)
            {
             if(data[hashed]["key"]==key){
                 exp.push({"text":key + "is already in hashtable. Replacing old value with " + val, "color":'white'});
             }
                data[hashed]={"key": key,"value": val};
                found=true;
                exp.push({"text":"Sucessfully inserted "+key + " at position " + hashed+" with value " +val,"color":'green'});
            }
            else{
                exp.push({"text":hashed+ " is not available. Trying the next position ","color":'red'});
               hashed=Probe(hashed,hashFunc);
            }
            count++;
        }
        return false;
    }
    function remove(key,val,Probe,hashFunc)
    {
        var hashed=hash(key,maxCap);
        var found=false;
        var count=0;
        while(!found){
            if (count>maxCap)
            {
                exp.push({"text":"Unable to find " + key,"color":'red'});
                found=true;
            }
            if(data[hashed]["key"]==key)
            {
                data[hashed]={"key": 'Empty', "value": "None"}
                exp.push({"text": "Sucessfully removed " +key + "replaced with Empty instead of None to enable the search function to continue past this point","color":'green'});
            found=true;
            }
            else{
            exp.push({"text":key+ " is not at "+ hashed +". Trying the next position ","color":'red'});    
               hashed=Probe(hashed,hashFunc);
            }
            count++;
        }
        return false;
    }
    function find(key,val, Probe,hashFunc)
    {
        var hashed=hash(key,maxCap);
        var found=false;
        var count=0;
        while(!found){
          if(count>maxCap)
          {
              exp.push({"text":"unable to find "+key, "color":'red'});
              found=true;
          }
            if(data[hashed]["key"]==key)
            {
                savedVal=data[hashed]["value"];
                 exp.push({"text": "Value of " + key + " is "+ savedVal,"color" : 'green'});
                found=true;
            }
             if(data[hashed]["key"]=='None')
            {
                 exp.push({"text":"Unable to find " + key,"color":'red'});
                found=true;
            }
            
               console.log("check2");
               hashed=Probe(hashed,hashFunc);
            
            console.log(count);
            count++;
        }
        
        
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
    function process(probe,action,keyIn,valIn,hashFunc,div){
        
        var probeType=ProbeDict[probe];
        var actType=ActDict[action];
        actType(keyIn,valIn,probeType,hashFunc);
        
        
        $('div.note').remove();
        
        exp.push({"text": "", color:"red"});
        
        
        for (var i=0;i<exp.length;i++)
        {
            var color=exp[i]["color"];
            var note=$('<div class="note"><label style="color:'+color+'">'+exp[i]["text"]+'</label></div class="note">');
    
            $('div.note').hide();
            $('div.exbox').append(note);
            
           $('div.note').delay(1000*i).fadeIn(500);
            
        }
      
        dothingswithsleep(0,div);
        exp=[];
        
    }
   
function dothingswithsleep( part,div ) {
    if( part == 0 ) {
        console.log( "before sleep" );
        setTimeout( function() { dothingswithsleep( 1 ,div); }, 1000*exp.length);
    } else if( part == 1 ) {
        drawTable(div);
        console.log( "after sleep" );
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
        var dh=$('<div><input id="dh" type="radio" name="but" value="dh" /> <label for="dh">Double Hash</label></div>');
        var hash=$("<label>Hash function 2</label><input class='hashfunc'></input>");
        
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
                var hashFunc=function(k){return k%7+1;}
                
            }
            console.log(changed);
            if(changed)
            {//reset();
            drawTable(div);}
            process(probe,action,keyIn,valIn,hashFunc, div);
        
        });
        box.append(head1,ins,del,find,key,val,head2,linear,dh,hash,head3,mc,go);
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
        OpenAd.setup($(this),$(this).data("features"));});
});