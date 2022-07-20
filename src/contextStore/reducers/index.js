import { signupReducer, loginReducer, Validation, BasicDetails } from "./userAuth/authReducer.js";
import { scheduleReducer } from "./Scheduling/scheduleReducer.js";
import { physioRegisterReducer } from "./Physio/regiReducer.js";
import { episodeReducer, PateintConsentReducer } from "./Episode/addEpisode.js";
import { combineReducers } from "redux";
import { clinicReg } from './Physio/clinicReg';
import { labsAndMedicRedu } from './Episode/addLabsMedication';
import { FirstAssesment } from "./Assesment/Assesment1"
import { carePlanRedcucer } from './care-plan/care-plan-reducer';
import { patCurrentEpisode } from './PatientSchedule/PateintSchedule';
import jointReducer from "./joint-reducer.js";
import questionAnswerReducer from "./question-reducer";
import organizationReducer from "./organization-reducer";
import Calender from "./newVisit/calender";
import month from "./newVisit/month";
import weekReducer from './newVisit/weekReducer'
import dayReducer from "./newVisit/dayReducer";

export const rootReducer = combineReducers({
    signupReducer: signupReducer,
    loginReducer: loginReducer,
    BasicDetails: BasicDetails,
    Validation: Validation,
    scheduleReducer: scheduleReducer,
    physioRegisterReducer: physioRegisterReducer,
    episodeReducer: episodeReducer,
    clinicReg: clinicReg,
    labsAndMedicRedu: labsAndMedicRedu,
    FirstAssesment: FirstAssesment,
    PateintConsentReducer: PateintConsentReducer,
    carePlanRedcucer: carePlanRedcucer,
    patCurrentEpisode: patCurrentEpisode,
    jointReducer:jointReducer,
    questionAnswerReducer,
    organizationReducer,
    Calender,
    month,
    weekReducer,
    dayReducer
});

