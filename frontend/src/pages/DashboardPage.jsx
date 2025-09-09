import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../features/qms/qmsSlice';
import { AlertTriangle, ListChecks, CheckCircle, Clock } from 'lucide-react';
import EventsByTypePieChart from '../components/dashboard/EventsByTypePieChart';
import EventsByMonthBarChart from '../components/dashboard/EventsByMonthBarChart';

const StatCard = ({ title, value, icon, color }) => (
  <div className="card p-4 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary">{title}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  
  // THE FIX IS HERE: We add `= []` as a fallback.
  // This ensures `events` is always an array, even if it's momentarily unavailable from the state.
  const { events = [], status } = useSelector(state => state.qms);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  const openEvents = events.filter(e => e.status !== 'Closed').length;
  const highSeverityEvents = events.filter(e => e.severity === 'High' && e.status !== 'Closed').length;
  const closedEvents = events.filter(e => e.status === 'Closed').length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-text-secondary mt-1">An overview of the Quality Management System.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Open Events" value={openEvents} icon={<ListChecks />} color="bg-blue-100 text-blue-600" />
        <StatCard title="High Severity Open" value={highSeverityEvents} icon={<AlertTriangle />} color="bg-red-100 text-red-600" />
        <StatCard title="Events Closed (All Time)" value={closedEvents} icon={<CheckCircle />} color="bg-green-100 text-green-600" />
        <StatCard title="Overdue Events" value="0" icon={<Clock />} color="bg-orange-100 text-orange-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventsByTypePieChart events={events} />
        <EventsByMonthBarChart events={events} />
      </div>
    </div>
  );
};

export default DashboardPage;