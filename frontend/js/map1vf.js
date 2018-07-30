var data1;
	var width  = 500,
    	height = 250,
	      projection = d3.geoMercator(),
	      catalonia = void 0;
	var path = d3.geoPath().projection(projection);

	var svg = d3.select("#chart-map1")
	          .append("svg")
	          .attr("width", width)
	          .attr("height", height);

	/* The scale */	  
	var color1 = d3.scaleThreshold() 
		.domain([10000,20000,30000,50000,100000,200000,800000,1500000])
		.range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]) //extracted from d3.schemeBuPu
	var color2 = d3.scaleThreshold() 
		.domain([0,1,3,5,10,20,80,150])
		.range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]) //extracted from d3.schemeBuPu

  	var funcajax = function(name) {
  		$(function () {
		    //-----------------------------------------------------------------------
		    // 2) Send a http request with AJAX http://api.jquery.com/jQuery.ajax/
		    //-----------------------------------------------------------------------
		    $.ajax({                                      
		      url: name+'.php',                  //the script to call to get data          
		      data: "",                        //you can insert url argumnets here to pass to api.php
		                                       //for example "id=5&parent=6"
		      dataType: 'json',                //data format      
		      success: function(data)          //on recieve of reply
		      {
		      	data1 = data;
		        console.log("Json data",data1);

		        } 
		    });
		});
  	};

  	var funcMap = function(name) {
  		
		  /* The legend */
		  svg.append("g")
			.attr("class", "legendQuant")
			.attr("transform", "translate(30,30)");

		  var legend = d3.legendColor()
			.labelFormat(d3.format(".0f")) //0 decimals
			.labels(d3.legendHelpers.thresholdLabels)
			.scale(color1) //reference to our Threshold scale
			
		  svg.select(".legendQuant")
		    .call(legend);
		  /* end of legend */	
		  if (name.includes("comarques")) {
		  	  d3.queue()
				.defer(d3.json,"mapes/"+name)
				.await(function(error,topo,data){ //this will await in queue
					process(topo,data)			//topo for topographic info, data for metadata

				});
		  }
		  else {
		  	console.log("proces",data1);
		  	d3.queue()
				.defer(d3.json,"mapes/"+name)
				.await(function(error,topo,data){ //this will await in queue
					processMun(topo,data);
				});
		  }
		
  	}
     
	  
      function process(topo,data){ 
		//topo holds info from comarques.topojson; data holds info from població.csv
		
		topo.objects['com']
			.geometries.forEach(function(d) { d.id = d.properties.NOMCOMAR;});
		// CODICOMAR as id

		data1.forEach ( function(d) { 
			//first we create an object with all the values
			d['CODICOMAR'] = +d['CODICOMAR'],
			d['COMARCA'] = d['COMARCA'],
			d['QUANTITAT'] = +d['QUANTITAT'];
		});
		var dataKV = data1.reduce(function(res,el) { 
			res[el.COMARCA] = el; 
			return res; },{});
		// then we create a dictionary, with CODICOMAR as key
	    var comarques = topojson.feature(topo, topo.objects.com); 
		
        // Setup the scale and translate
        var b, s, t;
        projection.scale(1).translate([0, 0]); //setup scale and translation
        var b = path.bounds(comarques); //box of min/max coordinates of geographic data
		var widthMap =b[1][0] - b[0][0];
		var heightMap = b[1][1] - b[0][1];
		var maxScale = Math.max( widthMap / width, heightMap / height);

        var s = .95 / maxScale; //scales every state with svg sizes .95 to left some margin
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2]; //return the map to the center of the screen
        projection.scale(s).translate(t); //reset scale and translation

        var map = svg.append('g').attr('class', 'boundary');
        catalonia = map.selectAll(".comarca") 
					.data(comarques.features);


		var changemap = function(d) {
		  alert("Hola");
		  funcajax("test2");
		  d3.select(".boundary").remove();

			setTimeout(function(){
			    funcMap("bages.json");
			},500);
		  
		};
		
				
        //Enter
        catalonia.enter()
         .append('path')
		   .attr('class',"comarca")
           .attr('d', path)
           .style("stroke", "#000")
		   .attr('id',function(d){return "cid-" +d.id})
		   .on("click",changemap)
		   .attr("fill", function(d) {
				return color1(dataKV[d.id].QUANTITAT/10);
			});

      };

      function processMun(topo,data){ 
		//topo holds info from comarques.topojson; data holds info from població.csv
		console.log("data1",data1);
		topo.objects['com']
			.geometries.forEach(function(d) { d.id = +d.properties.MUNICIPI;});
		// CODICOMAR as id

		data1.forEach ( function(d) { 
			//first we create an object with all the values
			d['MUNICIPI'] = +d['MUNICIPI'],
			d['QUANTITAT'] = +d['QUANTITAT'];
		});
		var dataKV = data1.reduce(function(res,el) { 
			res[el.MUNICIPI] = el; 
			return res; },{});

		
		// then we create a dictionary, with CODICOMAR as key
	    var comarques = topojson.feature(topo, topo.objects.com); 
		
        // Setup the scale and translate
        var b, s, t;
        projection.scale(1).translate([0, 0]); //setup scale and translation
        var b = path.bounds(comarques); //box of min/max coordinates of geographic data
		var widthMap =b[1][0] - b[0][0];
		var heightMap = b[1][1] - b[0][1];
		var maxScale = Math.max( widthMap / width, heightMap / height);

        var s = .95 / maxScale; //scales every state with svg sizes .95 to left some margin
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2]; //return the map to the center of the screen
        projection.scale(s).translate(t); //reset scale and translation

        var map = svg.append('g').attr('class', 'boundary');
        catalonia = map.selectAll(".comarca") 
					.data(comarques.features);

				
        //Enter
        catalonia.enter()
         .append('path')
		   .attr('class',"comarca")
           .attr('d', path)
		   .attr('id',function(d){return "cid-" +d.id})
		   .style("stroke", "#000")
		   .attr("fill", function(d) {
		   		if(dataKV[d.id]) return color2(dataKV[+d.id].QUANTITAT/10);
		   		else return color2(0);
			});

      };


   funcajax("test");
   funcMap("comarques.json");