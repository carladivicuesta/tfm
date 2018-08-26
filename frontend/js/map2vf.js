var data2;
var year1 = 2000;
var year2 = 2017;
var family = ["A","B","C","D","E","F","G","H","I"];
	var width2  = 500,
    	height2 = 250,
	      projection2 = d3.geoMercator(),
	      catalonia2 = void 0;
	var path2 = d3.geoPath().projection(projection);

	var svg2 = d3.select("#chart-map2")
	          .append("svg")
	          .attr("width", width)
	          .attr("height", height);

	/* The scale */	  
	var color2 = d3.scaleThreshold() 
		.domain([1,2,3,5,10,20,80,150])
		.range(["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]) //extracted from d3.schemeBuPu
	var color2b = d3.scaleThreshold() 
		.domain([0,0.1,1,1.5,2,5,10,20])
		.range(["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]) //extracted from d3.schemeBuPu

  	var AjaxMap2 = function(name,comarca,y1,y2,families) {
        year1 = y1;
        year2 = y2;
        family = families;
  		$(function () {
		    //-----------------------------------------------------------------------
		    // 2) Send a http request with AJAX http://api.jquery.com/jQuery.ajax/
		    //-----------------------------------------------------------------------
		    $.ajax({                                      
		      url: name+'.php',                  //the script to call to get data          
                data: {'param' : comarca, 'param2': year1, 'param3': year2, 'param4': family},  		                                       //for example "id=5&parent=6"
		      dataType: 'json',                //data format      
		      success: function(data)          //on recieve of reply
		      {
		      	data2 = data;
		      	console.log("map2 year:",year1,year2);

		        } 
		    });
		});
  	};

  	var Map2 = function(name) {
  		
		  /* The legend */
		  svg2.append("g")
			.attr("class", "legendQuant")
			.attr("transform", "translate(30,30)");

		  var legend2 = d3.legendColor()
			.labelFormat(d3.format(".0f")) //0 decimals
			.labels(d3.legendHelpers.thresholdLabels)
			.scale(color2) //reference to our Threshold scale
			
		  svg2.select(".legendQuant")
		    .call(legend2);
		  /* end of legend */	
		  if (name.includes("comarques")) {
		  	  d3.queue()
				.defer(d3.json,"mapes/"+name)
				.await(function(error,topo,data){ //this will await in queue
					process2(topo,data)			//topo for topographic info, data for metadata

				});
		  }
		  else {
		  	d3.queue()
				.defer(d3.json,"mapes/"+name)
				.await(function(error,topo,data){ //this will await in queue
					processMun2(topo,data);
				});
		  }
		
  	}
     
	  
      function process2(topo,data){ 
		//topo holds info from comarques.topojson; data holds info from població.csv
		
		topo.objects['com']
			.geometries.forEach(function(d) { d.id = d.properties.NOMCOMAR;});
		// CODICOMAR as id

		data2.forEach ( function(d) { 
			//first we create an object with all the values
			d['COMARCA'] = d['COMARCA'],
			d['QUANTITAT'] = +d['QUANTITAT'];
		});
		var dataKV2 = data2.reduce(function(res,el) { 
			res[el.COMARCA] = el; 
			return res; },{});
		// then we create a dictionary, with CODICOMAR as key
	    var comarques = topojson.feature(topo, topo.objects.com); 
		
        // Setup the scale and translate
        var b, s, t;
        projection2.scale(1).translate([0, 0]); //setup scale and translation
        var b = path2.bounds(comarques); //box of min/max coordinates of geographic data
		var widthMap =b[1][0] - b[0][0];
		var heightMap = b[1][1] - b[0][1];
		var maxScale = Math.max( widthMap / width, heightMap / height);

        var s = .95 / maxScale; //scales every state with svg sizes .95 to left some margin
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2]; //return the map to the center of the screen
        projection2.scale(s).translate(t); //reset scale and translation

        var map2 = svg2.append('g').attr('class', 'boundary');
        catalonia2 = map2.selectAll(".comarca") 
					.data(comarques.features);


		var changemap2 = function(d) {
            funcajax("test2",d.id);
            d3.selectAll(".boundary").remove();

            setTimeout(function(){
                funcMap(d.id+".json");
                Map2(d.id+".json");
            },500);
		};
		
				
        //Enter
        catalonia2.enter()
         .append('path')
		   .attr('class',"comarca")
           .attr('d', path2)
           .style("stroke", "#000")
		   .attr('id',function(d){return "cid-" +d.id})
		   .on("click",changemap2)
		   .attr("fill", function(d) {
				return color2(dataKV2[d.id].QUANTITAT/d.properties.HABITANTS);
			});

      };

      function processMun2(topo,data){ 
		//topo holds info from comarques.topojson; data holds info from població.csv
		console.log("data1",data2);
		topo.objects['com']
			.geometries.forEach(function(d) { d.id = +d.properties.MUNICIPI;});
		// CODICOMAR as id

		data2.forEach ( function(d) { 
			//first we create an object with all the values
			d['MUNICIPI'] = +d['MUNICIPI'],
			d['QUANTITAT'] = +d['QUANTITAT'];
		});
		var dataKV2 = data2.reduce(function(res,el) { 
			res[el.MUNICIPI] = el; 
			return res; },{});

		
		// then we create a dictionary, with CODICOMAR as key
	    var comarques = topojson.feature(topo, topo.objects.com); 
		
        // Setup the scale and translate
        var b, s, t;
        projection2.scale(1).translate([0, 0]); //setup scale and translation
        var b = path2.bounds(comarques); //box of min/max coordinates of geographic data
		var widthMap =b[1][0] - b[0][0];
		var heightMap = b[1][1] - b[0][1];
		var maxScale = Math.max( widthMap / width, heightMap / height);

        var s = .95 / maxScale; //scales every state with svg sizes .95 to left some margin
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2]; //return the map to the center of the screen
        projection2.scale(s).translate(t); //reset scale and translation

        var map2 = svg2.append('g').attr('class', 'boundary');
        catalonia2 = map2.selectAll(".comarca") 
					.data(comarques.features);

				
        //Enter
        catalonia2.enter()
         .append('path')
		   .attr('class',"comarca")
           .attr('d', path2)
		   .attr('id',function(d){return "cid-" +d.id})
		   .style("stroke", "#000")
		   .attr("fill", function(d) {
		   		if(dataKV2[d.id]) {
		   			console.log("hab",dataKV2[+d.id].QUANTITAT,d.properties.HABITANTS);
                    return color2b(dataKV2[+d.id].QUANTITAT/d.properties.HABITANTS);
                }

		   		else return color2b(0);
			});

      };


   AjaxMap2("test");
   Map2("comarques.json");
