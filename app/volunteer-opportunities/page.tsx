'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, X } from 'lucide-react';
import { OpportunityCard } from '@/components/volunteer/OpportunityCard';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function VolunteerOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState('');

  // Fetch opportunities from API
  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Add type filter to API call if not 'all'
        if (typeFilter !== 'all') {
          params.append('type', typeFilter);
        }

        // Add location filter to API call if provided
        if (locationFilter.trim()) {
          params.append('location', locationFilter.trim());
        }

        const response = await fetch(`/api/volunteer-opportunities?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }

        const data = await response.json();
        setOpportunities(data);
        setFilteredOpportunities(data);
      } catch (error) {
        console.error('Error fetching volunteer opportunities:', error);
        setOpportunities([]);
        setFilteredOpportunities([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, [typeFilter, locationFilter]);

  // Filter opportunities locally by search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOpportunities(opportunities);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = opportunities.filter((opp) => {
        return (
          opp.title.toLowerCase().includes(searchLower) ||
          opp.description.toLowerCase().includes(searchLower) ||
          opp.requiredSkills.some((skill) => skill.toLowerCase().includes(searchLower))
        );
      });
      setFilteredOpportunities(filtered);
    }
  }, [searchTerm, opportunities]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setLocationFilter('');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
            Make a Difference
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Volunteer{' '}
            <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Join our community and contribute to meaningful causes. Find the perfect opportunity
            that matches your skills and availability.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, description, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter Dropdown */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Location Filter Input */}
            <div className="lg:w-64 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {locationFilter && (
                <button
                  onClick={() => setLocationFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || typeFilter !== 'all' || locationFilter) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(searchTerm || typeFilter !== 'all' || locationFilter) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  Search: &quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-blue-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm">
                  Type: {typeFilter}
                  <button
                    onClick={() => setTypeFilter('all')}
                    className="hover:text-violet-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {locationFilter && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  Location: &quot;{locationFilter}&quot;
                  <button
                    onClick={() => setLocationFilter('')}
                    className="hover:text-emerald-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400">Loading opportunities...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredOpportunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6">
              <Search className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Opportunities Found</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {searchTerm || typeFilter !== 'all' || locationFilter
                ? 'Try adjusting your filters or search terms to find more opportunities.'
                : 'Check back soon for new volunteer opportunities.'}
            </p>
            {(searchTerm || typeFilter !== 'all' || locationFilter) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && filteredOpportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-between"
          >
            <p className="text-slate-400">
              Showing <span className="text-white font-semibold">{filteredOpportunities.length}</span>{' '}
              {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
            </p>
          </motion.div>
        )}

        {/* Opportunities Grid */}
        {!loading && filteredOpportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <OpportunityCard opportunity={opportunity} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
