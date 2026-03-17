import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { request } from '@/util/request'; // adjust the path if needed

export const useEventStore = create(
  persist(
    (set, get) => ({
      events: [],
      loading: false,
      error: null,
      search: '',

      /* =========================
         Fetch all events
         ========================= */
      fetchEvents: async () => {
        // SWR: Only show loading if empty
        if (get().events.length === 0) {
          set({ loading: true });
        }
        set({ error: null });

        try {
          const res = await request('/events', 'GET', null, false);
          // Backend returns { success: true, data: [...] }
          const list = res?.data || (Array.isArray(res) ? res : []);
          set({ events: list, loading: false });
        } catch (e) {
          set({
            error: e.response?.data?.message || e.message || 'Failed to fetch events',
            loading: false,
          });
        }
      },

      /* =========================
         Fetch single event by slug/ID
         ========================= */
      fetchEventBySlug: async (idOrSlug) => {
        set({ loading: true, error: null });
        try {
          const res = await request(`/events/${idOrSlug}`, 'GET', null, false);
          const data = res?.data || res;
          set({ loading: false });
          return data;
        } catch (e) {
          set({
            error: e.response?.data?.message || e.message || 'Failed to fetch event',
            loading: false,
          });
          throw e;
        }
      },

      /* =========================
         Search
         ========================= */
      setSearch: (value) => set({ search: value }),

      /* =========================
         Create / Update event
         ========================= */
      saveEvent: async (eventData) => {
        try {
          let url = '/events';
          let method = 'POST';

          // If ID exists, we are updating. Using POST for multipart update is common
          if (eventData.id) {
            url = `/events/${eventData.id}`;
            method = 'POST';
          }

          const formData = new FormData();
          formData.append('promotion_id', eventData.promotion_id || '');
          formData.append('name', eventData.name);
          formData.append('description', eventData.description || '');
          formData.append('start_date', eventData.start_date || '');
          formData.append('end_date', eventData.end_date || '');
          formData.append('status', eventData.status || 'draft');

          if (eventData.event_image) {
            formData.append('event_image', eventData.event_image);
          }

          await request(url, method, formData);

          // refresh list
          await get().fetchEvents();
        } catch (err) {
          console.error('Failed to save event:', err);
          throw err;
        }
      },

      /* =========================
         Delete event
         ========================= */
      deleteEvent: async (id) => {
        set({ loading: true, error: null });
        try {
          await request(`/events/${id}`, 'DELETE');
          await get().fetchEvents();
          set({ loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || err.message || 'Failed to delete event',
            loading: false,
          });
          throw err;
        }
      },

      /* =========================
         Toggle status
         ========================= */
      toggleEventStatus: async (id) => {
        try {
          await request(`/events/${id}/toggle-status`, 'PATCH');
          await get().fetchEvents();
        } catch (err) {
          console.error('Failed to toggle event status:', err);
          throw err;
        }
      },
    }),
    {
      name: 'saby-tinh-events',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
