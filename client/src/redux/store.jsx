import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import authReducer from "./authSlice.jsx";
import jobReducer from "./jobSlice.jsx";
import appliedJobsSlice from "./appliedJobsSlice.jsx";
import companySlice from "./companySlice.jsx";
import applicantSlice from "./applicantSlice.jsx";

// 1️⃣ Create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  appliedJobs: appliedJobsSlice,
  company: companySlice,
  application: applicantSlice,
});

// 2️⃣ Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["application", "appliedJobs"], // only persist these slices
};

// 3️⃣ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5️⃣ Persistor
export const persistor = persistStore(store);
