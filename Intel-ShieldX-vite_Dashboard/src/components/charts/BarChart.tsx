import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  category: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  barColor?: string;
  highlightColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 300,
  margin = { top: 20, right: 30, bottom: 60, left: 60 },
  barColor = '#3b82f6',
  highlightColor = '#1e40af',
  xAxisLabel,
  yAxisLabel,
  title,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .nice()
      .range([innerHeight, 0]);

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

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr('class', 'text-xs')
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('class', 'text-xs');

    // Add axis labels if provided
    if (xAxisLabel) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .attr('class', 'text-xs text-gray-500')
        .text(xAxisLabel);
    }

    if (yAxisLabel) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'text-xs text-gray-500')
        .text(yAxisLabel);
    }

    // Add the bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category) as number)
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', barColor)
      .on('mouseover', function() {
        d3.select(this).attr('fill', highlightColor);
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', barColor);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .delay((d, i) => i * 100);
    
    // Add value labels
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.category) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium')
      .attr('fill', 'gray')
      .text(d => d.value)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .delay((d, i) => i * 100 + 300);

  }, [data, width, height, margin, barColor, highlightColor, xAxisLabel, yAxisLabel, title]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible"></svg>
  );
};

export default BarChart;