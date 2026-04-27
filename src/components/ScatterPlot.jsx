import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxSize = d3.max(data, d => d.size) || 1;
    const maxResponseTime = d3.max(data, d => d.responseTime) || 1;

    const maxRatio = d3.max(data, d => d.ratio) || 1;
    const getColor = (ratio) => {
      const normalized = ratio / maxRatio;
      if (normalized > 0.66) return '#ef4444';  // rouge - anormal
      if (normalized > 0.33) return '#f59e0b';  // orange - moyen
      return '#10b981';                          // vert - normal
    };

    const x = d3.scaleLinear()
      .domain([0, maxSize])
      .nice()
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, maxResponseTime])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', '#6b7280');

    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#6b7280');

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.size))
      .attr('cy', d => y(d.responseTime))
      .attr('r', 7)
      .attr('fill', d => getColor(d.ratio))
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 10).attr('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 7).attr('opacity', 0.8);
      })
      .append('title')
      .text(d => `${d.title}\nTaille: ${d.size} octets\nTemps: ${d.responseTime.toFixed(2)}ms\nRatio: ${(d.ratio * 1000).toFixed(2)}`);

    // Légende couleurs
    const legend = [
      { color: '#ef4444', label: 'Anormal' },
      { color: '#f59e0b', label: 'Moyen' },
      { color: '#10b981', label: 'Normal' }
    ];
    legend.forEach((item, i) => {
      svg.append('circle').attr('cx', width - 120 + i * 45).attr('cy', -5).attr('r', 6).attr('fill', item.color);
      svg.append('text').attr('x', width - 110 + i * 45).attr('y', -1).style('font-size', '11px').style('fill', '#6b7280').text(item.label);
    });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('fill', '#6b7280')
      .style('font-size', '12px')
      .text('Taille de la page (octets)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .style('fill', '#6b7280')
      .style('font-size', '12px')
      .text('Temps de réponse (ms)');

  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#d7492a">
            <path d="M280-280q-33 0-56.5-23.5T200-360q0-33 23.5-56.5T280-440q33 0 56.5 23.5T360-360q0 33-23.5 56.5T280-280Zm200-160q-33 0-56.5-23.5T400-520q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520q0 33-23.5 56.5T480-440Zm200-160q-33 0-56.5-23.5T600-680q0-33 23.5-56.5T680-760q33 0 56.5 23.5T760-680q0 33-23.5 56.5T680-600Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Taille vs Temps de Chargement
        </h3>
      </div>
      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <svg ref={svgRef}></svg>
        </div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#9ca3af" className="mb-3">
            <path d="M280-280q-33 0-56.5-23.5T200-360q0-33 23.5-56.5T280-440q33 0 56.5 23.5T360-360q0 33-23.5 56.5T280-280Zm200-160q-33 0-56.5-23.5T400-520q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520q0 33-23.5 56.5T480-440Zm200-160q-33 0-56.5-23.5T600-680q0-33 23.5-56.5T680-760q33 0 56.5 23.5T760-680q0 33-23.5 56.5T680-600Z"/>
          </svg>
          <p className="text-gray-600 font-medium">Aucune donnée disponible</p>
          <p className="text-gray-400 text-sm mt-1">Le nuage de points apparaîtra ici</p>
        </div>
      )}
    </div>
  );
};

export default ScatterPlot;
