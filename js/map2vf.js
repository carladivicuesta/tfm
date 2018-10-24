var data2;

var family = ["A","B","C","D","E","F","G","H","I"];
	var width2  = 600,
    	height2 = 290,
	      projection2 = d3.geoMercator(),
	      catalonia2 = void 0;
	var path2 = d3.geoPath().projection(projection);

	var svg2 = d3.select("#chart-map2")
	          .append("svg")
	          .attr("width", width)
	          .attr("height", height);

	/* The scale */	  
	var color2 = d3.scaleThreshold() 
		//.domain([1,2,3,4,7,9,12,15])
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
			.attr("transform", "translate(400,100)");


		  /* end of legend */	
		  if (name.includes("comarques")) {

		  	  d3.queue()
				.defer(d3.json,"mapes/"+name)
				.await(function(error,topo,data){ //this will await in queue
					process2(topo,data)			//topo for topographic info, data for metadata

				});
		  }
		  else {
              var legend2 = d3.legendColor()
                  //.labelFormat(d3.format(".0f")) //0 decimals
                  .labels(d3.legendHelpers.thresholdLabels)
                  .scale(color2) //reference to our Threshold scale

              svg2.select(".legendQuant")
                  .call(legend2);

		  	d3.queue()
				.defer(d3.json,"mapes/"+name)
				.await(function(error,topo,data){ //this will await in queue
					processMun2(topo,data);
				});
		  }
		
  	}
     
	  
      function process2(topo,data){ 
		//topo holds info from comarques.topojson; data holds info from població.csv
          var quantmax3 = 0;
          var comarcaquant = "";
          data2.forEach ( function(d) {
              if (quantmax3 < +d['QUANTITAT']) {
                  quantmax3 = +d['QUANTITAT'];
                  comarcaquant = d['COMARCA'];
              }
              d['COMARCA'] = d['COMARCA'],
			  d['QUANTITAT'] = +d['QUANTITAT'];
          });

		var habmax1 = 0;
		topo.objects['com']
			.geometries.forEach(function(d) { d.id = d.properties.NOMCOMAR;
			if (comarcaquant == d.properties.NOMCOMAR) {
                habmax1 = +d.properties.HABITANTS;
            } });


		quantmax3 = quantmax3/habmax1;
          color2.domain([quantmax3/10,quantmax3/8,quantmax3/6,quantmax3/5,quantmax3/4,quantmax3/3,quantmax3/2,quantmax3/2+quantmax3/4,quantmax3/2+quantmax3/3]);
          var legend2 = d3.legendColor()
              .labels(d3.legendHelpers.thresholdLabels)
              .scale(color2) //reference to our Threshold scale

          svg2.select(".legendQuant")
              .call(legend2);

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

        var map2 = svg2.append('g').attr('class', 'boundary').attr("transform", "translate(-70,0)");
        catalonia2 = map2.selectAll(".comarca") 
					.data(comarques.features);


		var changemap2 = function(d) {
            var str = d.id.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();

            funcajax("mapmunicipi",str,year1,year2,families);
            AjaxMap2("mapmunicipi",str,year1,year2,families);
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
            waffleTotAjax("waffle",str,year1,year2);
            waffleAjax("waffle2",str,year1,year2,families);

            setTimeout(function(){
                waffleDraw();
            },500);

            waffle2Ajax("wafflePersones",year1,year2,str);

            setTimeout(function(){
                waffle2Draw();
            },500);
		};

          var focusm2 = function(d){
              var div = document.getElementById('tooltipmap2');
              div.style.display="block"; //this will show the element
              div.style.left = event.pageX -350 + 'px'; //we position it near the area
              div.style.top = event.pageY -350 + 'px';
              div.innerHTML = "<b>" + dataKV2[d.id].COMARCA+ "</b><br>" +  (Math.round(dataKV2[d.id].QUANTITAT/d.properties.HABITANTS  * 100) / 100).toLocaleString() + " Kg/habitants";
          };
          var focusoutm2 = function(d){
              document.getElementById('tooltipmap2')
                  .style.display="none"; //this will hide the element
          }
				
        //Enter
        catalonia2.enter()
         .append('path')
		   .attr('class',"comarca")
           .attr('d', path2)
           .style("stroke", "#000")
            .style("cursor","pointer")
		   .attr('id',function(d){return "cid-" +d.id})
            .on("mouseover",focusm2)
            .on("focus",focusm2)
            .on("mouseout",focusoutm2)
            .on("blur",focusoutm2)
		   .on("click",changemap2)
		   .attr("fill", function(d) {
				return color2(dataKV2[d.id].QUANTITAT/d.properties.HABITANTS);
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

      function processMun2(topo,data){

          var quantmax4 = 0;
          var mun = 0;
          data2.forEach ( function(d) {
              if(quantmax4 < +d['QUANTITAT']){
                  quantmax4 = +d['QUANTITAT'];
                  mun = +d['MUNICIPI'];
			  }
              d['MUNICIPI'] = +d['MUNICIPI'],
                  d['QUANTITAT'] = +d['QUANTITAT'];
          });

          var habmax2 = 0;

		topo.objects['com']
			.geometries.forEach(function(d) { d.id = +d.properties.MUNICIPI;
			if (mun == +d.properties.MUNICIPI){
                habmax2 = d.properties.HABITANTS;
			} });


          quantmax4 = quantmax4/habmax2;
          color2.domain([quantmax4/10,quantmax4/8,quantmax4/6,quantmax4/5,quantmax4/4,quantmax4/3,quantmax4/2,quantmax4/2+quantmax4/4,quantmax4/2+quantmax4/3]);
          var legend2 = d3.legendColor()
              .labels(d3.legendHelpers.thresholdLabels)
              .scale(color2) //reference to our Threshold scale
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

        var map2 = svg2.append('g').attr('class', 'boundary').attr("transform", "translate(-70,0)");
        catalonia2 = map2.selectAll(".comarca") 
					.data(comarques.features);

          var focusm21 = function(d){
              var div = document.getElementById('tooltipmap2');
              div.style.display="block"; //this will show the element
              div.style.left = event.pageX -350 + 'px'; //we position it near the area
              div.style.top = event.pageY -350 + 'px';
              var muni, kilos;
              if (d.properties.NOM_MUNI == "Barcelona") muni = d.properties.N_Distri;
              else muni = d.properties.NOM_MUNI;
              if(dataKV2[d.id]) kilos = (Math.round(dataKV2[d.id].QUANTITAT/d.properties.HABITANTS * 100) / 100).toLocaleString();
              else kilos = 0
              div.innerHTML = "<b>" + muni + "</b><br>" + kilos  + " Kg/habitants";
          };
          var focusoutm21 = function(d){
              document.getElementById('tooltipmap2')
                  .style.display="none"; //this will hide the element
          }

				
        //Enter
        catalonia2.enter()
         .append('path')
		   .attr('class',"comarca")
           .attr('d', path2)
		   .attr('id',function(d){return "cid-" +d.id})
		   .style("stroke", "#000")
            .on("mouseover",focusm21)
            .on("focus",focusm21)
            .on("mouseout",focusoutm21)
            .on("blur",focusoutm21)
		   .attr("fill", function(d) {
		   		if(dataKV2[d.id]) {
                    return color2(dataKV2[+d.id].QUANTITAT/d.properties.HABITANTS);
                }

		   		else return color2(0);
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


   AjaxMap2("mapcomarca","",year1,year2,families);
   Map2("comarques.json");
