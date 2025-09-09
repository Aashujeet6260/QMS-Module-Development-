import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents, toggleFilterVisibility, deleteEventsByIds, selectFilteredEvents } from '../features/qms/qmsSlice';
import { PlusCircle, Filter, Trash2 } from 'lucide-react';
import AiAssistant from '../components/ai/AiAssistant';
import EventTable from '../components/event_list/EventTable';
import EventFilters from '../components/event_list/EventFilters';

const EventListPage = () => {
  const dispatch = useDispatch();
  const filteredEvents = useSelector(selectFilteredEvents);
  const { status, error, isFilterVisible, selectedEventIds = [] } = useSelector((state) => state.qms);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedEventIds.length} event(s)?`)) {
        dispatch(deleteEventsByIds(selectedEventIds));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1>Event Management</h1>
            <p className="text-text-secondary mt-1">View, manage, and analyze quality events.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => dispatch(toggleFilterVisibility())} className="btn btn-secondary">
              <Filter size={16} /> Filters
            </button>
            <Link to="/events/new" className="btn btn-primary">
              <PlusCircle size={16} /> Log New Event
            </Link>
          </div>
        </div>
        
        {isFilterVisible && <EventFilters />}

        <div className="card overflow-hidden">
          {selectedEventIds.length > 0 && (
              <div className="bg-primary-50 p-3 flex justify-between items-center border-b border-border">
                  <span className="text-sm font-semibold text-primary-700">{selectedEventIds.length} event(s) selected</span>
                  <button onClick={handleDelete} className="btn btn-danger py-1.5 px-3">
                      <Trash2 size={16} /> Delete
                  </button>
              </div>
          )}
          {status === 'loading' && <p className="text-center p-8 text-text-secondary">Loading events...</p>}
          {status === 'succeeded' && <EventTable events={filteredEvents} />}
          {status === 'failed' && <p className="text-center text-danger p-8">Error: {error}</p>}
        </div>
      </div>

      <div className="lg:col-span-1 lg:sticky lg:top-24">
        <AiAssistant />
      </div>
    </div>
  );
};

export default EventListPage;