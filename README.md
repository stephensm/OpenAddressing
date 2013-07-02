OpenAddressing
==============
To use this open addressing widget, download the following files:
OpenAddress.js
OpenAddress.css
city.txt

To view the demo html also download
test.txt
OpenAddress.html

To insert a Open Addressing div in your page, use the following line of html into a div:

"div class="OpenAddress" data-features="'insert','delete','find','linear','doublehash'"data-file="test.txt"

You can choose to include various user input features by deleteing them from the data-features category
If you want to include a file to upload immediately when the program is loaded, replace "test.txt" with the desired text file. 

Make sure your text file has the first line as the capacity of the hash table and that each subsequent lines are in the form key,value

credits:
Marissa Stephens

