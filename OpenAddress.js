var OpenAd=(function(){
    var maxCap=1000;
    var data={};
    var probe='linear';
    var size=0;
    var ProbeDict={"linear":linearProbe, "dh":doubleProbe};
    var ActDict={"ins":insert,"del":remove,"find":find}
    var savedVal;
    var exp=[];
    var added=[];
    var speed=100;
    
    //takes input of string and returns number between 0 and maxCap-1 inclusive
   function hash(str,size)
    {
        exp.push({"text":"Hashing inputed key "+ str,"color":"white"});
        var sum=0;
        var string="";
        for(var i=0;i<str.length;i++)
        {
            sum+=str.charCodeAt(i);
         
         
        }
        exp.push({"text":"Sum of the values of each letter is: "+sum,"color":'yellow'});
        exp.push({"text":"Hash number is the sum mod the Size","color":'white'});
        exp.push({"text":sum + " mod " + size + " = "+sum%size, "color":'yellow'});
        return sum%size;
        
    }
    
   
    
    
    //linear probe technique
    function linearProbe(hashNum,key,hashFunc)
    {
        exp.push({"text":"linearly probing " +hashNum+ " to be "+ (hashNum+1)%maxCap,"color":'white'});
        return (hashNum+1)%maxCap;
        
    }

   
      //double probe technique
    function doubleProbe(hashNum, key,hashFunc)
    {
        
        a=hashFunc(key);

        exp.push({"text":"adding "+a+ "to the hash number to get"+ (hashNum+a)%maxCap,"color":'white'});
        return (hashNum+a)%maxCap;
    }
    
    function insert(key,val,Probe,hashFunc)
    {
        var hashed=hash(key,maxCap);
        var hasbeen=[hashed];
        
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
                data[hashed]={"key": key,"value": val, "places":hasbeen};
                added.push(data[hashed]);
                found=true;
                exp.push({"text":"Sucessfully inserted "+key + " at position " + hashed+" with value " +val,"color":'green'});
            }
            else{
                exp.push({"text":hashed+ " is not available. Trying the next position ","color":'red'});
                count++;
               hashed=Probe(hashed,key,hashFunc);
                hasbeen.push(hashed);
            }
            
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
                count++;
               hashed=Probe(hashed,key,hashFunc);
            }
            
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
            
               count++;
               hashed=Probe(hashed,key,hashFunc);
            
        
            
        }
        
        
    }
    
    
    function reset(val)
    {
          for (var i=0;i<val;i++)
        {
            data[i]={"key": 'None', "value": 'None'};
        }
        maxCap=val;
    }
    function drawTable(div,hbox,ht){
        
         $('div.ht').remove();

      
        var t=$('<div class="ht" ><div>');
        var tables=$('<table class="hashTable"></table>');
        for (var i=0;i<maxCap;i++)
        {
            
            var newRows=$("<tr><td>"+i+"</td><td>"+data[i]["key"]+"</td><td>"+data[i]["value"]+"</td></tr>"); 
            tables.append(newRows);
           
        }
        t.append(tables);
   
        hbox.append(t);
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
    function process(probe,action,keyIn,valIn,hashFunc,hbox,ht,exbox,div){
        
        var probeType=ProbeDict[probe];
        var actType=ActDict[action];
        actType(keyIn,valIn,probeType,hashFunc);
        
        
             $('div.note').remove();
        $('div.can').remove();
        $('div.map').remove();
        $('table.left').remove();
        $('tabel.right').remove();
        exp.push({"text": "", color:"red"});
        
        
        for (var i=0;i<exp.length;i++)
        {
            var color=exp[i]["color"];
            var note=$('<div class="note"><label style="color:'+color+'">'+exp[i]["text"]+'</label></div class="note">');
    
            note.hide();
            note.delay(speed*i).fadeIn(speed/2);
            exbox.append(note);
            
           
            
        }
      
        dothingswithsleep(0,div,hbox);
        exp=[];
        
    }
   
function dothingswithsleep( part,div,hbox,ht ) {
    if( part == 0 ) {
        
        setTimeout( function() { dothingswithsleep( 1 ,div,hbox,ht); }, speed*exp.length);
    } else if( part == 1 ) {
        drawTable(div,hbox,ht);
    
    }
}

    function mapData(exbox)
    {
  
        $('div.note').remove();
        $('div.can').remove();
        $('div.map').remove();
        $('table.left').remove();
        $('tabel.right').remove();
        var hNum={};
        var lines=[];
        for(var i=0;i<added.length;i++)
        {
            var locs=added[i]["places"];
            if(hNum[locs[0]]!=null){
                hNum[locs[0]]=hNum[locs[0]]+","+added[i]["key"];
            }
            else{hNum[locs[0]]=added[i]["key"];}
           
           
        }
   var tableDiv=$("<div class='map'></div>");     
    var tablecontents = "<table class='left'><tr><td>Key</td></tr>";
    var Rtablecontents = "<table class='right'><tr><td>Hash</td><td>Key</td></tr>";
        for(var k=0;k<added.length;k++)
        {
                 tablecontents += "<tr>";
            var key=added[k]["key"];
      tablecontents += "<td>"+key+"</td>";

      tablecontents += "</tr>";
        }
    for (var i = 0; i < maxCap; i ++)
   {
       
        Rtablecontents += "<tr>";
      Rtablecontents += "<td>"+i+"</td>";
      if(hNum[i]!=undefined)
      {Rtablecontents += "<td>"+hNum[i]+"</td>";}
       else{Rtablecontents += "<td></td>";}
   }
   tablecontents += "</table>";
   Rtablecontents += "</table>";        
               
  tableDiv.append($(tablecontents),$(Rtablecontents));
        exbox.append(tableDiv);
        
        var canvas=$('<canvas class= "can" id="art" height="'+maxCap*70+'"></canvas>');
        var canvas2=$('<canvas class= "can2" id="art" height="'+maxCap*62+'"></canvas>');
        exbox.append(canvas,canvas2);
        drawLines(canvas,canvas2);
    }   
    function clear(canvas){
        var DOMcanvas = canvas[0];
        var ctx = DOMcanvas.getContext('2d');
       
    ctx.clearRect(0,0,canvas.width(),canvas.height());
    }
    
    
       function drawLines(canvas,canvas2)
    {
        clear(canvas2);
        var DOMcanvas = canvas2[0];    
        var ctx = DOMcanvas.getContext('2d');
  
    
        clear(canvas);
        var DOMcanvas1 = canvas[0];    
        var ctx1 = DOMcanvas1.getContext('2d');
        ctx1.strokeStyle="white";
        ctx1.lineCap="round";
        ctx1.lineJoin="round";
         for (var i=0;i<added.length;i++){

        draw(ctx1,ctx,i);
        }
    
    }
    function draw(ctx,ctx2,i){
       ctx.lineWidth = "5";
        ctx2.lineWidth = "5";
        setTimeout(function(){
            var size=60;
            var offset=65;
            var to=added[i]["places"][0];
        ctx.strokeStyle="white";    
            ctx.beginPath();
            
                canvas_arrow(ctx,0,i*size+offset, 300,to*size+offset+10);
             ctx.stroke();
            var lines2=[];
            var locs=added[i]["places"];
    
            lines2.push({"from":locs[0], "to":locs[0], "item": added[i]["key"]});
            //console.log("yay");
           
            
            for (var j=0;j<locs.length;j++){
               lines2.push ({"from":previous, "to":locs[j], "item": added[i]["key"]});
                var previous=locs[j];
            }
            for(var x=0;x<lines2.length;x++)
            {
                animate(ctx2,lines2,x);
            }
        
        },speed*i);
    }
    function animate(ctx,lines,i){
    setTimeout(function(){
          var size=61;
                var offset=60;
        if(lines[i]["from"]==lines[i]["to"])
            { 
           
            ctx.strokeStyle="white";    
            ctx.beginPath();
            
                canvas_arrow(ctx,0,lines[i]["from"]*size+offset, 300,lines[i]["from"]*size+offset+10);
             ctx.stroke();
            }
            else{
           // console.log("bounce");
            ctx.strokeStyle="red";   
            var diff=lines[i]["to"]-lines[i]["from"];
           ctx.beginPath();
            
           ctx.moveTo(300,lines[i]["from"]*size+offset);
             ctx.lineTo(300-5*i,lines[i]["from"]*size+offset+diff*size/2); 
              canvas_arrow(ctx, 300-5*i,lines[i]["from"]*size+offset+diff*size/2, 300,lines[i]["to"]*size+offset)
             ctx.stroke();
        
            }
        console.log();}, speed/2*i);
        }
    
function canvas_arrow(ctx, fromx, fromy, tox, toy){
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}
    function setup(div,features,text){
       
        //var items=features.split(",")
        reset(1000);
        
        var action='ins';
        var probe='linear';
        var hashFunc=function(k){return k%7+1;};
        var head=$(" <h2 style='text-align: center; margin:10px;'>Open Addressing</h2>");
        var inputCol=$("<div class='inputDiv'  width=300px></div>");
        var box=$("<div class='box' ></div>");
        var head1=$(" <div><h5 style='text-align: center; margin:10px;'>Action</h5></div>");
        var ins=$('<div><label>Key </label></div>');
        var inskey=$('<input class="key"></input>');
        var insval=$("<label>Value</label>");
        var into=$("<input class='val'></input>");
        insval.append(into);
        var insbut=$('<button>Insert</button>');
        insbut.on("click",function(){
                 var changed="false";
            
            if( $('input:radio[name=but]:checked').val()!=null){
                if(probe!=$('input:radio[name=but]:checked').val())
                {
                     probe=$('input:radio[name=but]:checked').val();
                    changed=true;
                }
               }
    
            action= 'ins';
            var keyIn=inskey.val();
            var valIn=into.val();
            
            if(max.val()!=null){
                if(maxCap!=parseInt(max.val()))
                {
                maxCap=parseInt(max.val());
                
                    changed=true;
                }
                
                
            }
            
            if(changed)
            {
                drawTable(div,hbox,ht);}
            process(probe,action,keyIn,valIn,hashFunc, hbox,ht,exbox,div);
     
        });
        ins.append(inskey,insval,insbut);
     
        var del=$('<div><label> Delete Key </label></div>');
        var keysel=$("<input class='key2'></input>");
        del.append(keysel);
        var delbut=$('<button> Delete</button>');
        
        delbut.on("click",function(){
                 var changed="false";
            
            if( $('input:radio[name=but]:checked').val()!=null){
                if(probe!=$('input:radio[name=but]:checked').val())
                {
                     probe=$('input:radio[name=but]:checked').val();
                    changed=true;
                }
               }
    
            action= 'del';
            var keyIn=keysel.val();
            
            var valIn=0;
            if(max.val()!=null){
                if(maxCap!=parseInt(max.val()))
                {
                maxCap=parseInt(max.val());
                
                    changed=true;
                }
            }
                
            });
        del.append(delbut);
       
        var find=$('<div><label>Find Key</label></div>');
        var keyfind=$('<input class="key3"></input>');
        find.append(keyfind);
        var findbut=$('<button>Find</button>');
         findbut.on("click",function(){
                 var changed="false";
            
            if( $('input:radio[name=but]:checked').val()!=null){
                if(probe!=$('input:radio[name=but]:checked').val())
                {
                     probe=$('input:radio[name=but]:checked').val();
                    changed=true;
                }
               }
    
            action= 'find';
            var keyIn=keyfind.val();
            
            var valIn=0;
            if(max.val()!=null){
                if(maxCap!=parseInt(max.val()))
                {
                maxCap=parseInt(max.val());
                
                    changed=true;
                }
            }
                
            });
        
        find.append(findbut);
        var head2=$("<div> <h5 style='text-align: center; margin:10px;'>Probe Sequence</h5></div>");
        var linear=$('<input class="linear"  type="radio" name="but" value="linear" />Linear</input>'); 
        linear.checked="checked" ;
        
        
  
        
        var dh=$('<div><input id="dh" type="radio" name="but" value="dh" /> <label for="dh">Double Hash</label></div>');
        
        var head3=$(" <h5 style='text-align: center; margin:10px;'>Capacity</h5>");
            var mc=$("<label>Max Size</label>");
        var max=$("<input class='maxCap'></input>");
        mc.append(max);
        max.val(maxCap);
        var go=$("<button class='go'>update</button>");  
        go.on("click",function(){
           var changed=false;
            console.log(max.val());
            if(max.val()!=null){
                if(maxCap!=parseInt(max.val()))
                {
                maxCap=parseInt(max.val());
                
                    changed=true;
                }
                
                
            }
            
            if(changed)
            {
                reset(maxCap);
                added=[];
    
                drawTable(div,hbox,ht);}
        
        });
        
        var clear=$("<button class='clear'>Clear All Data</button>");  
        clear.on("click",function(){reset(1000);
                                    $('.can').remove();
                                    $('.can2').remove();
                                    $('.left').remove();
                                     $('.right').remove();
                                    $('.note').remove();
                                    added=[];
                                    drawTable(div,hbox,ht);});
        
        
        
        
        var items=features;
        box.append(head1);   
     
       if(items.indexOf('insert') !== -1){
           box.append(ins);
       }
        if(items.indexOf('delete') !== -1){
           box.append(del);
       }
        if(items.indexOf('find') !== -1){
           box.append(find);
       }
        box.append(head2);
        if(items.indexOf('linear') !== -1){
           box.append(linear);
       }
        if(items.indexOf('doublehash') !== -1){
           box.append(dh);
       }
        if(items.indexOf('hashFunc') !== -1){
           box.append(hash);
       }
        
        
        box.append(head3,mc,go,clear);
        inputCol.append(head,box);
       
        
        
        
        var explain=$("<div class='explain'  width=500px></div>");
        var exbox=$("<div class='exbox' ></div>");
        var dataAd=$("<button class='add'>Insert Data Visualization</button>");  
        dataAd.on("click",function(){
            var inputData=[];
        
        var file=$.get('test.txt');
            file.done(function(data) {
            input=data; 
            var lines = input.split('\n');
            for(var i = 0;i < 8;i++){
            inputData.push(lines[i].split(','));}
            maxCap=inputData[0][0];  
          
            
            for(var i=1;i<inputData.length;i++){
                process(probe,'ins',inputData[i][0],inputData[i][1],hashFunc,hbox,ht,exbox,div);
                }
            });
            
                  }
        
        );
        var map=$("<button class='add'>Visualize Current Data</button>");  
        map.on("click",function(){mapData(exbox);});
        box.append(dataAd,map);
        
        
        explain.append(exbox);
        
        
        var htable=$("<div class='htable'  width=200px></div>");
         var hbox=$("<div class='hbox' ></div>");
      
       var tablehead=$(' <table class="headTable" ><tr><td>Hash</td><td>Key</td><td>Value</td></tr></table>');
        var table=$('<table class="hashTable"></table>');
        table=drawBlankTable(table,maxCap);
        var ht=$('<div class="ht" ><div>');
        ht.append(table);
        hbox.append(tablehead,ht);
        
        
        htable.append(hbox);

        $(div).append(head, inputCol,explain,htable); 
         var inputData=[];
        if(text){
        var file=$.get(text);
        file.done(function(data) {
            input=data; 
            
            var lines = input.split('\n');
            for(var i = 0;i < 10;i++){
  inputData.push(lines[i].split(','));}
            
            maxCap=inputData[0][0];  
          
            
   for(var i=1;i<inputData.length;i++)
   {
      
       process(probe,'ins',inputData[i][0],inputData[i][1],hashFunc,hbox,ht,exbox,div);
   }
            });
            
                  }
     exbox.append(hbox);
    }
    
    return {setup: setup};
}());

$(document).ready(function(){
    
    
    $('.OpenAddress').each(function(){
     
        OpenAd.setup($(this),$(this).data("features"),$(this).data("file"));});
});