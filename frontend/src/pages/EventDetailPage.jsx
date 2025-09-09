import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../features/qms/qmsSlice';
import { ArrowLeft, GitFork, ShieldAlert, Thermometer, User, Calendar, Flag, FileText, MapPin, Clock, Edit } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const { currentEvent: event } = useSelector((state) => state.qms);

    useEffect(() => {
        if (eventId) {
            dispatch(fetchEventById(eventId));
        }
    }, [eventId, dispatch]);

    // This check is crucial. It shows a loading message while data is being fetched.
    if (!event) {
        return <div className="text-center p-8 text-text-secondary">Loading event details...</div>;
    }

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/events" className="btn btn-secondary">
                    <ArrowLeft size={16} /> Back to Event List
                </Link>
                <Link to={`/events/edit/${event.id}`} className="btn btn-primary">
                    <Edit size={16} /> Edit Event
                </Link>
            </div>

            <div className="card p-6 sm:p-8">
                {/* Header Section */}
                <div className="border-b border-border pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">{event.event_id_str}: {event.title}</h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary mt-4">
                        <span className="flex items-center gap-1.5"><GitFork size={14} /><strong>Type:</strong>&nbsp;{event.event_type}</span>
                        <span className="flex items-center gap-1.5"><Flag size={14} /><strong>Status:</strong>&nbsp;<StatusBadge status={event.status} /></span>
                        <span className="flex items-center gap-1.5"><ShieldAlert size={14} /><strong>Risk:</strong>&nbsp;<StatusBadge status={event.risk} /></span>
                        <span className="flex items-center gap-1.5"><Thermometer size={14} /><strong>Severity:</strong>&nbsp;<StatusBadge status={event.severity} /></span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h3 className="flex items-center gap-2 text-xl font-semibold mb-4"><FileText size={20} /> Description</h3>
                        <p className="text-text-secondary leading-relaxed">{event.description}</p>
                    </div>
                    
                    <div className="md:col-span-1">
                        <h3 className="flex items-center gap-2 text-xl font-semibold mb-4"><User size={20} /> Key Information</h3>
                        <dl className="space-y-4 text-sm">
                            <div className="flex flex-col">
                                <dt className="text-text-secondary flex items-center gap-1.5"><MapPin size={14}/> Location</dt>
                                <dd className="text-text-primary font-medium">{event.location}</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-text-secondary flex items-center gap-1.5"><User size={14}/> Reported By</dt>
                                <dd className="text-text-primary font-medium">{event.reported_by}</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-text-secondary flex items-center gap-1.5"><Clock size={14}/> Occurrence Date</dt>
                                <dd className="text-text-primary font-medium">{formatDate(event.occurrence_date)}</dd>
                            </div>
                             <div className="flex flex-col">
                                <dt className="text-text-secondary flex items-center gap-1.5"><Calendar size={14}/> Date Logged</dt>
                                <dd className="text-text-primary font-medium">{formatDate(event.created_at)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;