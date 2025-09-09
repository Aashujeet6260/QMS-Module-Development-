import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEventSelection, toggleSelectAllEvents } from '../../features/qms/qmsSlice';
import { Eye, Edit } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const EventTable = ({ events }) => {
    const dispatch = useDispatch();
    const { selectedEventIds } = useSelector(state => state.qms);
    
    if (!events || events.length === 0) {
        return <p className="text-center p-8 text-text-secondary">No events found.</p>;
    }

    const allEventIds = events.map(event => event.id);
    const isAllSelected = selectedEventIds.length === allEventIds.length && allEventIds.length > 0;

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left table-striped">
                <thead className="text-xs text-text-secondary uppercase">
                    <tr className="border-b border-border">
                        <th scope="col" className="p-4">
                           <input 
                             type="checkbox"
                             className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                             checked={isAllSelected}
                             onChange={() => dispatch(toggleSelectAllEvents(allEventIds))}
                           />
                        </th>
                        <th scope="col" className="px-6 py-3">Event ID</th>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Severity</th>
                        <th scope="col" className="px-6 py-3">Reported By</th>
                        <th scope="col" className="px-6 py-3">Occurrence Date</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {events.map((event) => (
                        <tr key={event.id} className={`transition-colors duration-200 ${selectedEventIds.includes(event.id) ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                            <td className="p-4">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                    checked={selectedEventIds.includes(event.id)}
                                    onChange={() => dispatch(toggleEventSelection(event.id))}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <Link to={`/events/${event.id}`} className="font-semibold text-primary-600 hover:underline">
                                    {event.event_id_str}
                                </Link>
                            </td>
                            <td className="px-6 py-4 text-text-primary">{event.title}</td>
                            <td className="px-6 py-4 text-text-secondary">{event.event_type}</td>
                            <td className="px-6 py-4"><StatusBadge status={event.status} /></td>
                            <td className="px-6 py-4"><StatusBadge status={event.severity} /></td>
                            <td className="px-6 py-4 text-text-secondary">{event.reported_by}</td>
                            <td className="px-6 py-4 text-text-secondary">{formatDate(event.occurrence_date)}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <Link to={`/events/${event.id}`} className="p-2 text-text-secondary hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors" title="View">
                                        <Eye size={16} />
                                    </Link>
                                    <Link to={`/events/edit/${event.id}`} className="p-2 text-text-secondary hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors" title="Edit">
                                        <Edit size={16} />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;