function plot_lines(){

d3.json("revenue.json", function(data) {

  sub_data = []
  for (i in data) {
    if (data[i].name.indexOf(current_country) != -1) {
      sub_data.push(data[i])
    }
  }
  console.log(sub_data)
  var ordinalScale = d3.scale.ordinal()
          .domain([2004,2005,2006,2007])
          .range(['a', 'b', 'c', 'd', 'e']);
  lc = new LineChart({
    parent: '#multiple',
    all_series: sub_data,
    x_axis_text: "year",
    y_axis_text: "Milion €"
  });
  lc.plot();
})
}
