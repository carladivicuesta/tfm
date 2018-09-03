var data1;
var year1 = 2000;
var year2 = 2017;
var family = ["A","B","C","D","E","F","G","H","I"];
	var width  = 600,
    	height = 290,
	      projection = d3.geoMercator(),
	      catalonia = void 0;
	var path = d3.geoPath().projection(projection);

	var svg = d3.select("#chart-map1")
	          .append("svg")
	          .attr("width", width)
	          .attr("height", height);

	/* The scale */	  
	var color1 = d3.scaleThreshold()
		//.domain([10000,20000,30000,50000,100000,200000,800000,1500000])
		.range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]) //extracted from d3.schemeBuPu

  	var funcajax = function(name,comarca,y1,y2,families) {
		year1 = y1;
		year2 = y2;
		family = families;
  		$(function () {
		    //-----------------------------------------------------------------------
		    // 2) Send a http request with AJAX http://api.jquery.com/jQuery.ajax/
		    //-----------------------------------------------------------------------
		    $.ajax({
		      url: name+'.php',                  //the script to call to get data
				data: {'param' : comarca, 'param2': year1, 'param3': year2, 'param4': family},                                 //for example "id=5&parent=6"
		      dataType: 'json',                //data format      
		      success: function(data)          //on recieve of reply
		      {
		      	data1 = data;

		        } 
		    });
		});
  	};

  	var funcMap = function(name) {
  		
		  /* The legend */
		  svg.append("g")
			.attr("class", "legendQuant")
			.attr("transform", "translate(400,100)");

		  /* end of legend */	
		  if (name.includes("comarques")) {
              d3.queue()
                  .defer(d3.json, "mapes/" + name)
                  .await(function (error, topo, data) { //this will await in queue
                      process(topo, data)			//topo for topographic info, data for metadata

                  });
          }

		  else {

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
		  var quantmax = 0;
		data1.forEach ( function(d) {
			if(+d['QUANTITAT'] > quantmax) quantmax = +d['QUANTITAT'];
			//first we create an object with all the values
			//d['CODICOMAR'] = +d['CODICOMAR'],
			d['COMARCA'] = d['COMARCA'],
			d['QUANTITAT'] = +d['QUANTITAT'];
		});
		color1.domain([quantmax/1000,quantmax/500,quantmax/100,quantmax/50,quantmax/5,quantmax/3,quantmax/2,quantmax/2+quantmax/3]);
          var legend = d3.legendColor()
              .labelFormat(d3.format(".0f")) //0 decimals
              .labels(d3.legendHelpers.thresholdLabels)
              .scale(color1) //reference to our Threshold scale

          svg.select(".legendQuant")
              .call(legend);
          /* end of legend */
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

        var map = svg.append('g').attr('class', 'boundary').attr("transform", "translate(-70,0)");
        catalonia = map.selectAll(".comarca") 
					.data(comarques.features);


		var changemap = function(d) {
            var str = d.id.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();

            funcajax("test2",str,year1,year2,families);
            AjaxMap2("test2",str,year1,year2,families);
            addBreadcrumb(d.id);
            d3.selectAll(".boundary").remove();
            d3.selectAll(".chartline").remove();
			setTimeout(function(){
				funcMap(str+".json");

                Map2(str+".json");
			},500);

            linechartAjax("linechart",str,families);

            setTimeout(function(){
                linechartDraw();
            },500);

            waffleAjax("waffle2",str,year1,year2,families);

            setTimeout(function(){
                waffleDraw();
            },500);

            waffle2Ajax("wafflePersones",year1,year2,str);

            setTimeout(function(){
                waffle2Draw();
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
				return color1(dataKV[d.id].QUANTITAT);
			});

          $( function() {
              $('text').each(function () {

                  if ($(this).text().includes("Less")) {
                      $(this).text($(this).text().replace("Less than", "Menys que"));
                  }
                  if ($(this).text().includes("to")) {
                      $(this).text($(this).text().replace("to", "a"));
                  }
                  if ($(this).text().includes("more")) {
                      $(this).text($(this).text().replace("or more", "o més"));
                  }

              });
          });

      };

      function processMun(topo,data){ 
		//topo holds info from comarques.topojson; data holds info from població.csv
		topo.objects['com']
			.geometries.forEach(function(d) { console.log("map",d); d.id = +d.properties.MUNICIPI;});
		// CODICOMAR as id
		var quantmax2 = 0;
		data1.forEach ( function(d) {
            if(+d['QUANTITAT'] > quantmax2) quantmax2 = +d['QUANTITAT'];
			//first we create an object with all the values
			d['MUNICIPI'] = +d['MUNICIPI'],
			d['QUANTITAT'] = +d['QUANTITAT'];
		});

          color1.domain([quantmax2/1000,quantmax2/500,quantmax2/100,quantmax2/50,quantmax2/5,quantmax2/3,quantmax2/2,quantmax2/2+quantmax2/3]);
          var legend = d3.legendColor()
              .labelFormat(d3.format(".0f")) //0 decimals
              .labels(d3.legendHelpers.thresholdLabels)
              .scale(color1) //reference to our Threshold scale

          svg.select(".legendQuant")
              .call(legend);
          /* end of legend */
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

        var map = svg.append('g').attr('class', 'boundary').attr("transform", "translate(-70,0)");
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
		   		if(dataKV[d.id]) return color1(dataKV[+d.id].QUANTITAT);
		   		else return color1(0);
			});
          $( function() {
              $('text').each(function () {

                  if ($(this).text().includes("Less")) {
                      $(this).text($(this).text().replace("Less than", "Menys que"));
                  }
                  if ($(this).text().includes("to")) {
                      $(this).text($(this).text().replace("to", "a"));
                  }
                  if ($(this).text().includes("more")) {
                      $(this).text($(this).text().replace("or more", "o més"));
                  }

              });
          });

      };

     function returnMap(y1,y2,fam) {
        funcajax("test","",y1,y2,fam);
        AjaxMap2("test","",y1,y2,fam);
        d3.selectAll(".boundary").remove();

        setTimeout(function(){
            funcMap("comarques.json");

            Map2("comarques.json");
        },500);



     };


   funcajax("test");
   funcMap("comarques.json");
