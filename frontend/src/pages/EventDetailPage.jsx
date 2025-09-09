import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../features/qms/qmsSlice';
import { ArrowLeft, Edit } from 'lucide-react'; // Add Edit Icon
// ... (keep other imports) ...

const EventDetailPage = () => {
    // ... (keep existing logic) ...
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
            {/* ... (rest of the component) ... */}
        </div>
    );
};

export default EventDetailPage;