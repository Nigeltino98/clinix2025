import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import authReducer from './auth'
import residentReducer from './resident'
import staffReducer from './staff'
import appointmentReducer from './appointment'
import noteReducer from './note'
import transactionReducer from './transaction'
import pettyReducer from './petty'
import homeReducer from './home'
import attachmentReducer from './attachment'
import suggestionReducer from './suggestion'
import bathReducer from './bath'
import weightReducer from './weight'
import fluidIntakeReducer from './fluidIntake'
import moodReducer from './mood'
import sleepReducer from './sleep'
import careReducer from './care'
import assessmentReducer from './assessment'
import questionReducer from './question'
import notificationReducer from './notification'
import evaluationReducer from './evaluation'
import answerReducer from './answer'
import choiceReducer from './choice'
import afternoonRoutineReducer from './afternoonRoutine'
import morningRoutineReducer from './morningRoutine'
import incidentReducer from './incident'
import paymentReducer from './payments'
import riskReducer from './riskAssessment'
import planReducer from './supportPlans'
import familyReducer from './family'
import permissionReducer from './permission'
import groupReducer from './group'
import paymentshandoverReducer from './paymentshandover'
import rotaReducer from './rota'
import riskschedulerschedulerReducer from './riskScheduler'
import planSchedulerReducer from './supportPlanScheduler'
import evaluationSchedulerReducer from './evaluationScheduler'
import acciddentSchedulerReducer from './acciddentScheduler'
import bodyMaprReducer from './bodyMap'
import dischargeReducer from './discharge'

const reducers = combineReducers({
    auth: authReducer,
    resident: residentReducer,
    staff: staffReducer,
    appointment: appointmentReducer,
    note: noteReducer,
    transaction: transactionReducer,
    petty: pettyReducer,
    home: homeReducer,
    attachment: attachmentReducer,
    suggestion: suggestionReducer,
    bath: bathReducer,
    weight: weightReducer,
    fluidIntake: fluidIntakeReducer,
    sleep: sleepReducer,
    mood: moodReducer,
    care: careReducer,
    assessment: assessmentReducer,
    question: questionReducer,
    notification: notificationReducer,
    evaluation: evaluationReducer,
    answer: answerReducer,
    choice: choiceReducer,
    afternoonRoutine: afternoonRoutineReducer,
    morningRoutine: morningRoutineReducer,
    incident: incidentReducer,
    payment: paymentReducer,
    plan: planReducer,
    risk: riskReducer,
    family: familyReducer,
    permission: permissionReducer,
    group: groupReducer,
    paymentshandover: paymentshandoverReducer,
    rota: rotaReducer,
    riskschedulerscheduler: riskschedulerschedulerReducer,
    planscheduler: planSchedulerReducer,
    evaluationscheduler: evaluationSchedulerReducer,
    accidentscheduler: acciddentSchedulerReducer,
    bodymap: bodyMaprReducer,
    discharge: dischargeReducer,
});
const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({

    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})


export default store