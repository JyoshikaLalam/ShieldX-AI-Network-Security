import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatMapData {
  x: string;
  y: string;
  value: number;
}

interface HeatMapProps {
  data: HeatMapData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colorScale?: string[];
  title?: string;
}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 40, right: 50, bottom: 80, left: 80 },
  colorScale = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  title,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Get unique x and y values
    const xDomain = Array.from(new Set(data.map(d => d.x)));
    const yDomain = Array.from(new Set(data.map(d => d.y)));

    // Create scales
    const x = d3.scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.05);

    const y = d3.scaleBand()
      .domain(yDomain)
      .range([0, innerHeight])
      .padding(0.05);

    const color = d3.scaleQuantile<string>()
      .domain([0, d3.max(data, d => d.value) as number])
      .range(colorScale);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add title if provided
    if (title) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'text-sm font-medium text-gray-700')
        .text(title);
    }

    // Add cells
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.x) as number)
      .attr('y', d => y(d.y) as number)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.value))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .delay((d, i) => i * 10);

    // Add tooltip behavior
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '5px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    g.selectAll('rect')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke', '#555').attr('stroke-width', 2);
        tooltip
          .style('opacity', 0.9)
          .html(`${d.x}, ${d.y}: <strong>${d.value}</strong>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 0.5);
        tooltip.style('opacity', 0);
      });

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr('class', 'text-xs')
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .attr('class', 'text-xs');

    // Add color legend
    const legendWidth = 20;
    const legendHeight = innerHeight / 2;
    
    const legendScale = d3.scaleQuantile<number>()
      .domain([0, d3.max(data, d => d.value) as number])
      .range(d3.range(colorScale.length).map(i => i * (legendHeight / colorScale.length)));
    
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right + 10}, ${margin.top})`);
    
    legend.selectAll('rect')
      .data(colorScale)
      .enter()
      .append('rect')
      .attr('y', (d, i) => i * (legendHeight / colorScale.length))
      .attr('width', legendWidth)
      .attr('height', legendHeight / colorScale.length)
      .style('fill', d => d);
    
    const legendAxis = d3.axisRight(d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([0, legendHeight]));
    
    legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .attr('class', 'text-xs');
    
    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs text-gray-500')
      .text('Value');

  }, [data, width, height, margin, colorScale, title]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible"></svg>
  );
};

export default HeatMap;