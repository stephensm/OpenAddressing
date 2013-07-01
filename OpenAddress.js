var OpenAd=(function(){
    var maxCap=1000; //capacity of table
    var data={};//stores data
    var probe='linear';//type of probing used
    var ProbeDict={"linear":linearProbe, "dh":doubleProbe};//maps probe name to function
    var ActDict={"ins":insert,"del":remove,"find":find}//maps action name to function
    var savedVal;//value beinf observed
    var exp=[];//array of comments for explainations
    var added=[];//order of elements added
    var speed=500;//speed of animation
    
    //takes input of string and returns number between 0 and maxCap-1 inclusive
   function hash(str,size)
    {
        exp.push({"text":"Hashing inputed key "+ str,"color":"black"});
        var sum=0;
        var string="";
        for(var i=0;i<str.length;i++)
        {
            sum+=str.charCodeAt(i);
        }
        exp.push({"text":"Sum of the values of each letter is: "+sum,"color":'blue'});
        exp.push({"text":"Hash number is the sum mod the Size","color":'black'});
        exp.push({"text":sum + " mod " + size + " = "+sum%size, "color":'blue'});
        return sum%size; 
    }

    //linear probe technique
    function linearProbe(hashNum,key,hashFunc)
    {
        exp.push({"text":"linearly probing " +hashNum+ " to be "+ (hashNum+1)%maxCap,"color":'black'});
        return (hashNum+1)%maxCap;
        
    }

   
      //double probe technique
    function doubleProbe(hashNum, key,hashFunc)
    {
        a=hashFunc(hash(key,maxCap));
     
        exp.push({"text":"The second hash function gives a value of "+a,"color":'black'});
        exp.push({"text":"adding value "+a+ " to the hash number to get "+ (hashNum+a)%maxCap,"color":'black'});
        return (hashNum+a)%maxCap;
    }
    
    //insert a key with a given value using a probe function
    function insert(key,val,Probe,hashFunc)
    {
        var hashed=hash(key,maxCap);
        var hasbeen=[hashed];
        
        var found=false;
        var count=0;
        while(!found){
            exp.push({"text":"seeing if " +hashed+ " is available ","color":'black'});
            if (count>maxCap)
            {
                exp.push({"text":"No space available","color":'red'});
            }
            if(data[hashed]["key"]=='None'|| data[hashed]["key"]=='Empty'|| data[hashed]["key"]==key)
            {
             if(data[hashed]["key"]==key)
             {
                 exp.push({"text":key + "is already in hashtable. Replacing old value with " + val, "color":'black'});
             }
                data[hashed]={"key": key,"value": val, "places":hasbeen};
                added.push(data[hashed]);
                found=true;
                exp.push({"text":"Sucessfully inserted "+key + " at position " + hashed+" with value " +val,"color":'#99FA93'});
            }
            else
            {
                exp.push({"text":hashed+ " is not available. Trying the next position ","color":'red'});
                count++;
                hashed=Probe(hashed,key,hashFunc);
                hasbeen.push(hashed);
            }
            
        }
        return false;
    }
    
    //removes a key through using a probe function
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
                exp.push({"text": "Sucessfully removed " +key + " replaced with Empty instead of None","color":'#99FA93'});
                exp.push({"text":"This enables the search function to continue past this point","color":'#99FA93'});
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
    
    //finds a key using a probe function
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
                exp.push({"text": "Value of " + key + " is "+ savedVal,"color" : '#99FA93'});
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
    
    //resets data as all None
    function reset(val)
    {
          for (var i=0;i<val;i++)
        {
            data[i]={"key": 'None', "value": 'None'};
        }
        maxCap=val;
    }
    
    //draws data into table
    function drawTable(div,hbox,ht){
        
        $('div.ht').remove();
        var t=$('<div class="ht" ><div>');
        var tables=$('<table class="hashTable"><tr><td>Hash</td><td>Key</td><td>Value</td></tr</table>');
        for (var i=0;i<maxCap;i++)
        {  
            var newRows=$("<tr><td>"+i+"</td><td>"+data[i]["key"]+"</td><td>"+data[i]["value"]+"</td></tr>"); 
            tables.append(newRows);
        }
        t.append(tables);
        hbox.append(t);
    }
    
    //draws a blank table
    function drawBlankTable(table,size)
    {
        for(var i=0;i<size;i++)
        {
               var newRow=$("<tr><td>"+i+"</td><td>None</td><td>None</td></tr>"); 
                table.append(newRow);
        }
        return table;
    }
    
    //explains process through text
    function expl(exbox)
    {
        $('div.note').remove();
        $('.can').remove();
        $('.can2').remove();
        $('div.map').remove();
        $('table.left').remove();
        $('tabel.right').remove();
        exp.push({"text": "", color:"red"});
        
        for (var i=0;i<exp.length;i++)
        {
            var color=exp[i]["color"];
            var note=$('<div class="note"><label style="color:'+color+'">'+exp[i]["text"]+'</label></div class="note">');
            note.hide();
            note.delay(i).fadeIn(speed/2);
            exbox.append(note);
        }
    }
    
    //processes the action based on the key, value, and probe
    function process(probe,action,keyIn,valIn,hashFunc,hbox,ht,exbox,div){
        
        var probeType=ProbeDict[probe];
        var actType=ActDict[action];
        actType(keyIn,valIn,probeType,hashFunc);
        
        $('div.note').remove();
        $('.can').remove();
        $('.can2').remove();
        $('div.map').remove();
        $('table.left').remove();
        $('tabel.right').remove();
       
        mapData(exbox);
        drawTable(div,hbox,ht);
        
        
    }
   
//draws a visual representation of inputting data
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
            if(hNum[locs[0]]!=null)
            {
                hNum[locs[0]]=hNum[locs[0]]+","+added[i]["key"];
            }
            else
            {
                hNum[locs[0]]=added[i]["key"];
            }
        }
    var tableDiv=$("<div class='map'></div>");     
    var tablecontents = $("<table class='left'><tr><td>Key</td></tr></table>");
    var Rtablecontents = "<table class='right'><tr><td>Hash</td><td>Key</td></tr>";
        var keys=[];
        for(var k=0;k<added.length;k++)
        { 
            var key=added[k]["key"];
            keys.push(key);
            var row=$("<tr num="+k+"><td>"+key+"</td></tr>");
            row.on("mouseover",function(event)
                   {
                        var pos=keys.indexOf($(event.target).text());
                        var DOMcanvas = canvas2[0];    
                        var ctx = DOMcanvas.getContext('2d');
                        var DOMcanvas1 = canvas[0];    
                        var ctx1 = DOMcanvas1.getContext('2d');
                        draw(ctx1,ctx,pos, "#fa8072",0,1000); 
                    });
            row.on("mouseout",function(event)
                   {
                        var pos=keys.indexOf($(event.target).text());
                        var DOMcanvas = canvas2[0];    
                        var ctx = DOMcanvas.getContext('2d');
                        var DOMcanvas1 = canvas[0];    
                        var ctx1 = DOMcanvas1.getContext('2d');
                        draw(ctx1,ctx,pos, "blue",0,0);
                    });
            tablecontents.append(row);
        }
        for (var i = 0; i < maxCap; i ++)
           {
                Rtablecontents += "<tr>";
                if(hNum[i]!=undefined)
                {
                   Rtablecontents += "<td>"+hNum[i]+"</td>";
                }
               else
                {
                   Rtablecontents += "<td></td>";
                }
               Rtablecontents += "<td>"+i+"</td>";
           }
       
        Rtablecontents += "</table>";        
               
        tableDiv.append(tablecontents,$(Rtablecontents));
        exbox.append(tableDiv);
        
        var canvas=$('<canvas class= "can" id="art" height="'+maxCap*70+'"></canvas>');
        var canvas2=$('<canvas class= "can2" id="art" height="'+maxCap*62+'"></canvas>');
        exbox.append(canvas,canvas2);
        drawLines(canvas,canvas2);
    }   
    
    //clears canvas
    function clear(canvas)
    {
        var DOMcanvas = canvas[0];
        var ctx = DOMcanvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width(),canvas.height());
    }
    
    //animates lines in canvas
       function drawLines(canvas,canvas2)
    {
        clear(canvas2);
        var DOMcanvas = canvas2[0];    
        var ctx = DOMcanvas.getContext('2d');
  
    
        clear(canvas);
        var DOMcanvas1 = canvas[0];    
        var ctx1 = DOMcanvas1.getContext('2d');
        
        ctx1.lineCap="round";
        ctx1.lineJoin="round";
         
         for (var i=0;i<added.length;i++)
         {
             draw(ctx1,ctx,i,"blue",speed,speed);
         }
    
    }
    
    //draws lines for each element in data
    function draw(ctx,ctx2,i,color,pace,drawpace)
    {
        ctx.lineWidth = "2";
        ctx2.lineWidth = "2";
        setTimeout(function()
                   {
                        var size=53;
                        var offset=72;
                        var to=added[i]["places"][0];
                        ctx.strokeStyle=color;    
                        ctx.beginPath();
                        
                        canvas_arrow(ctx,0,i*size+offset, 300,to*size+offset+10);
                        ctx.stroke();
                        var lines2=[];
                        var locs=added[i]["places"];
                
                        lines2.push({"from":locs[0], "to":locs[0], "item": added[i]["key"]});
                
                        for (var j=0;j<locs.length;j++)
                        {
                            lines2.push ({"from":previous, "to":locs[j], "item": added[i]["key"]});
                            var previous=locs[j];
                        }
                        for(var x=0;x<lines2.length;x++)
                        {
                            animate(ctx2,lines2,x,color,drawpace);
                        }
                
                    },pace*i);
    }
    
    //handles animation
    function animate(ctx,lines,i,color,pace)
    {
        setTimeout(function()
                   {
                    var size=53;
                    var offset=72;
                    if(lines[i]["from"]==lines[i]["to"])
                        { 
                            ctx.strokeStyle=color;    
                            ctx.beginPath();
                            canvas_arrow(ctx,0,lines[i]["from"]*size+offset, 300,lines[i]["from"]*size+offset+10);
                            ctx.stroke();
                        }
                        else{
                            ctx.strokeStyle=color;  
                            var diff=lines[i]["to"]-lines[i]["from"];
                            ctx.beginPath();
                            ctx.moveTo(300,lines[i]["from"]*size+offset);
                            ctx.lineTo(300-20*i,lines[i]["from"]*size+offset+diff*size/2); 
                            canvas_arrow(ctx, 300-20*i,lines[i]["from"]*size+offset+diff*size/2, 300,lines[i]["to"]*size+offset)
                            ctx.stroke();
                    
                        }
                    
                   }, pace/2*i);
        }
  //draws an arrow from a point to another point  
function canvas_arrow(ctx, fromx, fromy, tox, toy)
    {
        var headlen = 10;   // length of head in pixels
        var angle = Math.atan2(toy-fromy,tox-fromx);
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    }
    
    //sets up layout
    function setup(div,features,text)
    {
        reset(1000);//resets div
        var hashFunc=function(k){return k%7+1;};//hashfunction for double hashing
        
        //title
        var head=$(" <h2 style='text-align: center; margin:10px;'>Open Addressing</h2>");
        
        var inputCol=$("<div class='inputDiv'  width=300px></div>"); //column with inputs

        var box=$("<div class='box' ></div>");//box with inputs
        
        var head1=$(" <div><h5 style='text-align: center; margin:10px;'>Action</h5></div>");
        var ins=$('<div><label>Key </label></div>');//div that handles insert factors
        var inskey=$('<input class="key"></input>');
        var insval=$("<label>Value</label>");
        var into=$("<input class='val'></input>");
        
        var insbut=$('<button>Insert</button>');
        
        //processes inputs on click
        insbut.on("click",function(){
                 var changed="false";
            
            if( $('input:radio[name=but]:checked').val()!=null)
            {
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
                drawTable(div,hbox,ht);
            }
            process(probe,action,keyIn,valIn,hashFunc, hbox,ht,exbox,div);
     
        });
        insval.append(into,insbut);
        ins.append(inskey,insval);
     
        var del=$('<div><label> Delete Key </label></div>');//div that handles delete inputs
        var keydel=$("<input class='key2'></input>");
        del.append(keydel);
        var delbut=$('<button> Delete</button>');
        
        //processes deletion on click
        delbut.on("click",function()
        {
                 var changed="false";
            
            if( $('input:radio[name=but]:checked').val()!=null)
            {
                if(probe!=$('input:radio[name=but]:checked').val())
                {
                    probe=$('input:radio[name=but]:checked').val();
                    changed=true;
                }
            }
    
            action= 'del';
            var keyIn=keydel.val();
         
            var valIn=0;
            if(max.val()!=null)
            {
                if(maxCap!=parseInt(max.val()))
                {
                    maxCap=parseInt(max.val());
                    changed=true;
                }
            }
            process(probe,action,keyIn,valIn,hashFunc, hbox,ht,exbox,div);
        });
        del.append(delbut);
       
        var find=$('<div><label>Find Key</label></div>');
        var keyfind=$('<input class="key3"></input>');
        find.append(keyfind);
        var findbut=$('<button>Find</button>');
        
        //processes find on click
        findbut.on("click",function()
                {
                     var changed="false";
                
                       if( $('input:radio[name=but]:checked').val()!=null)
                       {
                            if(probe!=$('input:radio[name=but]:checked').val())
                                {
                                    probe=$('input:radio[name=but]:checked').val();
                                    changed=true;
                                }
                        }
    
                    action= 'find';
                    var keyIn=keyfind.val();
                    
                    var valIn=0;
                    if(max.val()!=null)
                    {
                        if(maxCap!=parseInt(max.val()))
                        {
                            maxCap=parseInt(max.val());
                            changed=true;
                        }
                    }
                    process(probe,action,keyIn,valIn,hashFunc, hbox,ht,exbox,div);
                });
        
        find.append(findbut);
        var head2=$("<div> <h5 style='text-align: center; margin:10px;'>Probe Sequence</h5></div>");
        var linear=$('<input class="linear"  type="radio" name="but" value="linear" checked="checked" />Linear</input>'); 
        linear.checked="checked" ;
     
        var dh=$('<input id="dh" type="radio" name="but" value="dh" /> <label for="dh">Double Hash</label>');
        
        var head3=$(" <h5 style='text-align: center; margin:10px;'>Capacity</h5>");
        var mc=$("<label>Max Size</label>");
        var max=$("<input class='maxCap'></input>");
        mc.append(max);
        max.val(maxCap);
        var go=$("<button class='go'>update</button>");  
        go.on("click",function()
              {
               var changed=false;
                if(max.val()!=null)
                {
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
        clear.on("click",function()
                 {
                    reset(1000);
                    $('.can').remove();
                    $('.can2').remove();
                    $('.left').remove();
                    $('.right').remove();
                    $('.note').remove();
                    exp=[];
                    added=[];
                    drawTable(div,hbox,ht);});
        
        //determines what divs to include in setup
        var items=features;
        box.append(head1);   
     
        if(items.indexOf('insert') !== -1)
        {
           box.append(ins);
        }
        if(items.indexOf('delete') !== -1)
        {
           box.append(del);
        }
        if(items.indexOf('find') !== -1)
        {
           box.append(find);
        }
        box.append(head2);
        if(items.indexOf('linear') !== -1)
        {
           box.append(linear);
        }
        if(items.indexOf('doublehash') !== -1)
        {
           box.append(dh);
        }
        if(items.indexOf('hashFunc') !== -1)
        {
           box.append(hash);
        }
        
        box.append(head3,mc,go,clear);
        inputCol.append(head,box);
       
        //div that handles explanation and visualization
        var explain=$("<div class='explain'  width=500px></div>");
        var exbox=$("<div class='exbox' ></div>");
        var dataAd=$("<button class='add'>Insert Data Example</button>");  
        dataAd.on("click",function()
            {
                var inputData=[];
                //pre-loaded data in program    
                var file=$.get('city.txt');
                file.done(function(data)
                    {
                        input=data; 
                        var lines = input.split('\n');
                        for(var i = 0;i < 15;i++){
                        inputData.push(lines[i].split(','));}
                        maxCap=inputData[0][0];  
                
                        for(var i=1;i<inputData.length;i++)
                        {
                            process(probe,'ins',inputData[i][0],inputData[i][1],hashFunc,hbox,ht,exbox,div);
                        }
                    });
            
            }
        
        );
        
        //have explanation as visual and textual
        var texts=$("<button class='add'>View Text Explaination</button>");  
        texts.on("click",function(){expl(exbox);});
        var map=$("<button class='add'>Visualize Current Data</button>");  
        map.on("click",function(){mapData(exbox);});
        box.append(dataAd,texts,map);
        
        explain.append(exbox);
        
        //hash table div
        var htable=$("<div class='htable'  width=200px></div>");
        var hbox=$("<div class='hbox' ></div>");
        var table=$('<table class="hashTable"><tr><td>Hash</td><td>Key</td><td>Value</td></tr></table>');
        table=drawBlankTable(table,maxCap);
        var ht=$('<div class="ht" ><div>');
        ht.append(table);
        hbox.append(ht);
        htable.append(hbox);
        $(div).append(head, inputCol,explain,htable); 
        
        //process data inputted by teacher
        var inputData=[];
        if(text)
        {
            var file=$.get(text);
            file.done(function(data) 
                {
                    input=data; 
                    var lines = input.split('\n');
                    for(var i = 0;i < 10;i++)
                    {
                        inputData.push(lines[i].split(','));
                    }
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


//called when ready
$(document).ready(function(){
      
    $('.OpenAddress').each(function(){
     
        OpenAd.setup($(this),$(this).data("features"),$(this).data("file"));});
});