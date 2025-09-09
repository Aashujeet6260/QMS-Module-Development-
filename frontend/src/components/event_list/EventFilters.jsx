import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../features/qms/qmsSlice';
import { X, Search } from 'lucide-react';

const EventFilters = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector(state => state.qms.filters);

  const initialFilterState = {
    title: '', type: 'All', status: 'All', severity: 'All', reportedBy: '',
  };

  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
  };

  const handleReset = () => {
    setLocalFilters(initialFilterState);
    dispatch(setFilters(initialFilterState));
  };

  return (
    <div className="card p-4 animate-fade-in-down mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">Title / ID</label>
          <input type="text" name="title" value={localFilters.title} onChange={handleInputChange} className="form-input" placeholder="Search..."/>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">Type</label>
          <select name="type" value={localFilters.type} onChange={handleInputChange} className="form-input">
            <option>All</option><option>Deviation</option><option>Audit</option><option>CAPA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">Status</label>
          <select name="status" value={localFilters.status} onChange={handleInputChange} className="form-input">
            <option>All</option><option>Open</option><option>Investigation</option><option>Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">Severity</label>
          <select name="severity" value={localFilters.severity} onChange={handleInputChange} className="form-input">
            <option>All</option><option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">Reported By</label>
          <input type="text" name="reportedBy" value={localFilters.reportedBy} onChange={handleInputChange} className="form-input" placeholder="Enter name..."/>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
          <button onClick={handleReset} className="btn btn-secondary">
              <X size={16}/> Reset
          </button>
          <button onClick={handleApply} className="btn btn-primary">
              <Search size={16}/> Apply Filters
          </button>
      </div>
    </div>
  );
};

export default EventFilters;