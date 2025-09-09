import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/qmsApi';

export const fetchEvents = createAsyncThunk('qms/fetchEvents', async () => {
  const response = await api.getEvents();
  return response.data;
});

export const fetchEventById = createAsyncThunk('qms/fetchEventById', async (id) => {
  const response = await api.getEventById(id);
  return response.data;
});

export const addNewEvent = createAsyncThunk('qms/addNewEvent', async (eventData) => {
  const response = await api.createEvent(eventData);
  return response.data;
});

export const deleteEventsByIds = createAsyncThunk('qms/deleteEventsByIds', async (ids, { dispatch }) => {
  await api.deleteEvents(ids);
  dispatch(fetchEvents());
  return ids;
});

export const updateEventById = createAsyncThunk('qms/updateEventById', async ({ id, eventData }) => {
  const response = await api.updateEvent(id, eventData);
  return response.data;
});

export const submitAiPrompt = createAsyncThunk('qms/submitAiPrompt', async (prompt) => {
  const response = await api.postAiPrompt(prompt);
  return response.data.response;
});

const initialState = {
  events: [],
  currentEvent: null,
  status: 'idle',
  error: null,
  isFilterVisible: false,
  selectedEventIds: [],
  filters: {
    title: '',
    type: 'All',
    status: 'All',
    severity: 'All',
    reportedBy: '',
  },
  ai: { response: null, status: 'idle', error: null },
};

const qmsSlice = createSlice({
  name: 'qms',
  initialState,
  reducers: {
    toggleFilterVisibility: (state) => {
      state.isFilterVisible = !state.isFilterVisible;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    toggleEventSelection: (state, action) => {
      const id = action.payload;
      if (state.selectedEventIds.includes(id)) {
        state.selectedEventIds = state.selectedEventIds.filter(selectedId => selectedId !== id);
      } else {
        state.selectedEventIds.push(id);
      }
    },
    toggleSelectAllEvents: (state, action) => {
      const allIds = action.payload;
      if (state.selectedEventIds.length === allIds.length) {
        state.selectedEventIds = [];
      } else {
        state.selectedEventIds = allIds;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(addNewEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      .addCase(updateEventById.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) { state.events[index] = action.payload; }
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(deleteEventsByIds.fulfilled, (state) => {
        state.selectedEventIds = [];
      })
      .addCase(submitAiPrompt.pending, (state) => {
        state.ai.status = 'loading';
        state.ai.response = "Thinking...";
      })
      .addCase(submitAiPrompt.fulfilled, (state, action) => {
        state.ai.status = 'succeeded';
        state.ai.response = action.payload;
      })
      .addCase(submitAiPrompt.rejected, (state, action) => {
        state.ai.status = 'failed';
        state.ai.error = action.error.message;
        state.ai.response = "Sorry, an error occurred.";
      });
  },
});

export const { toggleFilterVisibility, setFilters, toggleEventSelection, toggleSelectAllEvents } = qmsSlice.actions;

export const selectFilteredEvents = (state) => {
  const { events, filters } = state.qms;
  if (!events) return []; 
  
  return events.filter(event => {
    const titleMatch = (event.title || '').toLowerCase().includes(filters.title.toLowerCase()) || 
                       (event.event_id_str || '').toLowerCase().includes(filters.title.toLowerCase());
    const typeMatch = filters.type === 'All' || event.event_type === filters.type;
    const statusMatch = filters.status === 'All' || event.status === filters.status;
    const severityMatch = filters.severity === 'All' || event.severity === filters.severity;
    const reportedByMatch = (event.reported_by || '').toLowerCase().includes(filters.reportedBy.toLowerCase());
    return titleMatch && typeMatch && statusMatch && severityMatch && reportedByMatch;
  });
};

export default qmsSlice.reducer;