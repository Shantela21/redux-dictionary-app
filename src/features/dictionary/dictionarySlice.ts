// A simplified interface for the API response
export interface Definition {
  definition: string;
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface WordEntry {
  word: string;
  phonetic: string;
  meanings: Meaning[];
}

export interface DictionaryState {
  entries: WordEntry[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DictionaryState = {
  entries: [],
  loading: 'idle',
  error: null,
};

//  Async Thunk
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// ... import interfaces from above

export const fetchWordDefinition = createAsyncThunk(
  'dictionary/fetchWordDefinition',
  async (word: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<WordEntry[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.title || 'Could not find definition.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// Slice
export const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    // Standard reducers can go here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWordDefinition.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchWordDefinition.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entries = action.payload;
      })
      .addCase(fetchWordDefinition.rejected, (state, action) => {
        state.loading = 'failed';
        state.entries = [];
        state.error = action.payload as string;
      });
  },
});

export const {} = dictionarySlice.actions;

export default dictionarySlice.reducer;
