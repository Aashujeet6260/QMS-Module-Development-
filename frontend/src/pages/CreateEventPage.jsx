import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addNewEvent, fetchEventById, updateEventById } from '../features/qms/qmsSlice';
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from 'lucide-react';

const CreateEventPage = () => {
    const { eventId } = useParams();
    const isEditMode = Boolean(eventId);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const eventToEdit = useSelector(state => 
        isEditMode ? (state.qms.currentEvent && state.qms.currentEvent.id === parseInt(eventId) ? state.qms.currentEvent : null) : null
    );

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '', event_type: 'Deviation', description: '',
        occurrence_date: '', reported_by: '', location: '',
        severity: 'Low', risk: 'Low', status: 'Open',
    });

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchEventById(eventId));
        }
    }, [eventId, isEditMode, dispatch]);

    useEffect(() => {
        if (isEditMode && eventToEdit) {
            const formattedDate = eventToEdit.occurrence_date 
                ? new Date(new Date(eventToEdit.occurrence_date).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
                : "";
            setFormData({ ...eventToEdit, occurrence_date: formattedDate });
        }
    }, [isEditMode, eventToEdit]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // THE FIX IS HERE: Add a validation check for the date.
        if (!formData.occurrence_date) {
            alert("Please select a valid Occurrence Date & Time.");
            return;
        }

        const { id, event_id_str, created_at, ...payload } = formData;
        try {
            if (isEditMode) {
                await dispatch(updateEventById({ id: eventId, eventData: payload })).unwrap();
                alert('Event updated successfully!');
            } else {
                await dispatch(addNewEvent(payload)).unwrap();
                alert('Event created successfully!');
            }
            navigate('/events');
        } catch (error) {
            alert('Operation failed: ' + (error?.detail || error.message));
        }
    };

    const steps = [
        { num: 1, title: 'Definition' }, { num: 2, title: 'Identification' },
        { num: 3, title: 'Assessment' }, { num: 4, title: 'Review & Log' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/events" className="btn btn-secondary mb-6">
                <ArrowLeft size={16} /> Back to Event List
            </Link>
             <div className="card p-6 sm:p-8">
                <div className="mb-8">
                    <h1>{isEditMode ? `Edit Event: ${formData.event_id_str || ''}` : 'New QMS Event Wizard'}</h1>
                    <ol className="flex items-center w-full mt-4">
                        {steps.map((s, index) => (
                            <React.Fragment key={s.num}>
                                <li className={`flex items-center ${step >= s.num ? 'text-primary-600 font-bold' : 'text-text-secondary'}`}>
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mr-2 ${step >= s.num ? 'bg-primary-600 text-white' : 'bg-border text-text-secondary'}`}>
                                        {step > s.num ? <CheckCircle2 size={16}/> : s.num}
                                    </span>
                                    {s.title}
                                </li>
                                {index < steps.length - 1 && <li className="flex-auto border-b-2 border-border mx-4"></li>}
                            </React.Fragment>
                        ))}
                    </ol>
                </div>
            
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in-down">
                            <h3 className="border-b border-border pb-2 mb-4">Step 1: Event Definition</h3>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Title*</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Event Type*</label>
                                <select name="event_type" value={formData.event_type} onChange={handleChange} className="form-input">
                                    <option>Deviation</option><option>CAPA</option><option>Audit</option><option>Change Control</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Description*</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="form-input" required></textarea>
                            </div>
                        </div>
                    )}
                     {step === 2 && (
                        <div className="animate-fade-in-down">
                            <h3 className="border-b border-border pb-2 mb-4">Step 2: Identification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Occurrence Date & Time*</label>
                                    <input type="datetime-local" name="occurrence_date" value={formData.occurrence_date} onChange={handleChange} className="form-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Reported By*</label>
                                    <input type="text" name="reported_by" value={formData.reported_by} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-text-secondary">Location / Department*</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" required />
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="animate-fade-in-down">
                             <h3 className="border-b border-border pb-2 mb-4">Step 3: Initial Assessment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                    <label className="block text-sm font-medium text-text-secondary">Severity*</label>
                                     <select name="severity" value={formData.severity} onChange={handleChange} className="form-input">
                                        <option>Low</option><option>Medium</option><option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Risk*</label>
                                     <select name="risk" value={formData.risk} onChange={handleChange} className="form-input">
                                        <option>Low</option><option>Medium</option><option>High</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-text-secondary">Initial Status*</label>
                                     <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                                        <option>Open</option><option>Investigation</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="animate-fade-in-down">
                            <h3 className="border-b border-border pb-2 mb-4">Step 4: Review & Log</h3>
                            <div className="space-y-4 text-sm border border-border rounded-lg p-4 bg-background">
                                {Object.entries(formData).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 gap-4 border-b border-border/50 pb-2 last:border-b-0">
                                        <p className="font-semibold text-text-secondary capitalize col-span-1">{key.replace('_', ' ')}</p>
                                        <p className="text-text-primary col-span-2 break-words">{value.toString() || "N/A"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-8 pt-5 border-t border-border flex justify-between">
                        <button type="button" onClick={handlePrev} disabled={step === 1} className="btn btn-secondary">
                            <ArrowLeft size={16} /> Previous
                        </button>
                        {step < 4 && (
                            <button type="button" onClick={handleNext} className="btn btn-primary">
                                Next <ArrowRight size={16} />
                            </button>
                        )}
                        {step === 4 && (
                            <button type="submit" className="btn btn-primary bg-success hover:bg-green-600">
                               <Save size={16} /> {isEditMode ? 'Save Changes' : 'Log New Event'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;