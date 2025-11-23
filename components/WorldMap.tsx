
import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry } from 'geojson';
import { CountryStatus, CountryData } from '../types';
import { COLORS, COUNTRY_STATUS_MAP, getMockCountryData } from '../constants';
import { Loader2, Plus, Minus, RotateCcw } from 'lucide-react';

interface WorldMapProps {
  onCountryClick: (geoId: string, name: string) => void;
  className?: string;
  countries: CountryData[];
}

const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick, className, countries }) => {
  const [geographies, setGeographies] = useState<FeatureCollection<Geometry> | null>(null);
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{x: number, y: number, data: CountryData} | null>(null);
  const [loading, setLoading] = useState(true);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch standard world topology
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const geoData = topojson.feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry>;
        setGeographies(geoData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load map data", err);
        setLoading(false);
      });
  }, []);

  // D3 Zoom Behavior
  const zoom = useMemo(() => d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 8])
    .on('zoom', (event) => {
      if (gRef.current) {
        d3.select(gRef.current).attr('transform', event.transform);
      }
    }), []);

  // Attach zoom behavior to SVG
  useEffect(() => {
    if (!loading && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.call(zoom);
    }
  }, [loading, zoom]);

  // Zoom Controls
  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoom.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoom.scaleBy, 0.6);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    }
  }

  // Helper to map ISO numeric code to Alpha-3
  const getCountryCodeAndStatus = (id: string): { code: string, status: CountryStatus } => {
    const isoMap: Record<string, string> = {
      '300': 'GRC', // Greece
      '724': 'ESP', // Spain
      '380': 'ITA', // Italy
      '250': 'FRA', // France
      '276': 'DEU', // Germany
      '620': 'PRT', // Portugal
      '100': 'BGR', // Bulgaria
      '826': 'GBR', // UK
      '840': 'USA', // USA
      '792': 'TUR', // Turkey
      '191': 'HRV', // Croatia
      // New Additions
      '040': 'AUT', // Austria
      '642': 'ROU', // Romania
      '705': 'SVN', // Slovenia
      '458': 'MYS', // Malaysia
      '196': 'CYP', // Cyprus
      '440': 'LTU', // Lithuania
      '616': 'POL', // Poland
      '392': 'JPN'  // Japan
    };
    
    // Pad ID with leading zeros if needed (topojson IDs are usually numbers, but keys in map are strings)
    const paddedId = id.toString().padStart(3, '0');
    const alpha3 = isoMap[paddedId];
    
    // Lookup status from props
    const countryData = countries.find(c => c.id === alpha3);
    const status = countryData ? countryData.status : CountryStatus.NONE;

    return { code: alpha3 || paddedId, status };
  };

  const getStatusColor = (status: CountryStatus): string => {
    switch (status) {
      case CountryStatus.AMBASSADOR: return COLORS.AMBASSADOR;
      case CountryStatus.SIGNED: return COLORS.SIGNED;
      case CountryStatus.DEVELOPMENT: return COLORS.DEVELOPMENT;
      case CountryStatus.OPERATING: return COLORS.OPERATING;
      case CountryStatus.PROPOSED: return COLORS.PROPOSED;
      default: return COLORS.NONE;
    }
  };
  
  const getCountryName = (feature: any) => {
      return feature.properties.name; 
  };

  // Mouse Event Handlers
  const handleMouseEnter = (event: React.MouseEvent, feature: any) => {
    const countryId = feature.id?.toString().padStart(3, '0') || '';
    const name = getCountryName(feature);
    const { code, status } = getCountryCodeAndStatus(countryId);
    
    setHoveredCountryId(countryId);
    
    // Find data from props or fallback to basic info
    const foundData = countries.find(c => c.id === code);
    const data = foundData || getMockCountryData(code, name, status);
    
    // Calculate position relative to container
    if (containerRef.current) {
       const rect = containerRef.current.getBoundingClientRect();
       const x = event.clientX - rect.left;
       const y = event.clientY - rect.top;
       setTooltipData({ x, y, data });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (containerRef.current && tooltipData) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setTooltipData(prev => prev ? { ...prev, x, y } : null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountryId(null);
    setTooltipData(null);
  };

  // Map Dimensions
  const width = 960;
  const height = 500;

  const projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

  const pathGenerator = d3.geoPath().projection(projection);

  if (loading) {
    return <div className="flex items-center justify-center h-full w-full text-gold"><Loader2 className="animate-spin w-10 h-10"/></div>;
  }

  return (
    <div 
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
    >
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm p-3 rounded-lg border border-gray-700 z-10 shadow-lg pointer-events-none select-none">
        <h3 className="text-sm font-semibold text-gold mb-2">Legend</h3>
        <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: COLORS.NONE}}></div> <span className="text-typography-grey">Available</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: COLORS.PROPOSED}}></div> <span className="text-typography-grey">Land Proposed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: COLORS.AMBASSADOR}}></div> <span className="text-white">Ambassador</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: COLORS.SIGNED}}></div> <span className="text-white">Land Signed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: COLORS.DEVELOPMENT}}></div> <span className="text-white">In Development</span></div>
        </div>
      </div>

       {/* Zoom Controls */}
       <div className="absolute bottom-6 left-4 flex flex-col gap-2 z-10">
        <button onClick={handleZoomIn} className="p-2 bg-primary/90 border border-gray-700 rounded-lg hover:bg-primary-light text-white transition-colors shadow-lg" title="Zoom In">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-primary/90 border border-gray-700 rounded-lg hover:bg-primary-light text-white transition-colors shadow-lg" title="Zoom Out">
          <Minus className="w-4 h-4" />
        </button>
         <button onClick={handleResetZoom} className="p-2 bg-primary/90 border border-gray-700 rounded-lg hover:bg-primary-light text-white transition-colors shadow-lg" title="Reset Map">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tooltip */}
      {tooltipData && (
        <div 
            className="absolute z-50 pointer-events-none" 
            style={{ 
                left: tooltipData.x + 15, 
                top: tooltipData.y + 15,
            }}
        >
            <div className="bg-primary/95 backdrop-blur-md border border-gray-700 p-3 rounded-xl shadow-2xl min-w-[200px] animate-fade-in">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                        <div className="text-white font-bold text-sm">{tooltipData.data.name}</div>
                        <div className="text-xs text-typography-grey">
                            {tooltipData.data.ambassador ? tooltipData.data.ambassador.name : "Open Position"}
                        </div>
                    </div>
                    {/* Circular Progress */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-gold" strokeDasharray={`${tooltipData.data.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        <div className="absolute text-[9px] font-bold text-white">{tooltipData.data.progress}%</div>
                    </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: getStatusColor(tooltipData.data.status) }}>
                    {tooltipData.data.status === 'none' ? 'Available' : tooltipData.data.status}
                </div>
            </div>
        </div>
      )}

      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full cursor-move"
        style={{ display: 'block' }}
      >
        <g ref={gRef}>
          {geographies?.features.map((feature, i) => {
            const d = pathGenerator(feature);
            const countryId = feature.id?.toString().padStart(3, '0') || '';
            const { status } = getCountryCodeAndStatus(countryId);
            const fillColor = getStatusColor(status);
            const isHovered = hoveredCountryId === countryId;

            return (
              <path
                key={`country-${i}`}
                d={d || undefined}
                fill={fillColor}
                stroke={isHovered ? '#F2F2F2' : '#151725'}
                strokeWidth={isHovered ? 0.5 : 0.25} // Thinner stroke as requested
                className="transition-all duration-200 ease-in-out"
                onMouseEnter={(e) => handleMouseEnter(e, feature)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                    e.stopPropagation();
                    onCountryClick(countryId, getCountryName(feature));
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default WorldMap;
