import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  category: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colorScale?: string[];
  title?: string;
  showLegend?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
  height = 400,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  colorScale = d3.schemeCategory10,
  title,
  showLegend = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Use predefined colors or generate from d3 color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(data.map((d, i) => d.color || colorScale[i % colorScale.length]));

    // Create pie layout
    const pie = d3.pie<DataPoint>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    const outerArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Create arcs
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add hover effect and transition
    arcs.append('path')
      .attr('d', d => arc(d) as string)
      .attr('fill', d => color(d.data.category) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(300)
          .style('opacity', 1)
          .attr('transform', function(d) {
            const centroid = arc.centroid(d);
            return `translate(${centroid[0] * 0.05}, ${centroid[1] * 0.05})`;
          });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(300)
          .style('opacity', 0.8)
          .attr('transform', 'translate(0, 0)');
      })
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) as string;
        };
      });

    // Add labels with lines
    const text = g.selectAll('.label')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('dy', '.35em')
      .style('opacity', 0)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(d => `${d.data.category} (${d.data.value})`);

    // Position labels and add connecting lines
    text.transition()
      .duration(1000)
      .style('opacity', function(d) {
        // Only show labels for slices with enough angle
        return (d.endAngle - d.startAngle) > 0.2 ? 1 : 0;
      })
      .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', function(d) {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      });

    // Add connecting lines
    const polyline = g.selectAll('.line')
      .data(pie(data))
      .enter()
      .append('polyline')
      .style('opacity', 0)
      .style('fill', 'none')
      .style('stroke', 'gray')
      .style('stroke-width', '1px');

    polyline.transition()
      .duration(1000)
      .style('opacity', function(d) {
        return (d.endAngle - d.startAngle) > 0.2 ? 0.5 : 0;
      })
      .attr('points', function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.98 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    // Add title if provided
    if (title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'text-sm font-medium text-gray-700')
        .text(title);
    }

    // Add legend if enabled
    if (showLegend) {
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`);

      const legendItem = legend.selectAll('.legend-item')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legendItem.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', d => color(d.category) as string);

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('class', 'text-xs')
        .text(d => d.category);
    }

  }, [data, width, height, margin, colorScale, title, showLegend]);

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height} 
      className="overflow-visible"
      style={{ maxHeight: '100%' }}
    ></svg>
  );
};

export default PieChart;