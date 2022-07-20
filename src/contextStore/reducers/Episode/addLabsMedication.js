import {
    ASSESSMENT_STATE_CHANGE,
    NO_OF_MEDICATION,
    ASSESSMENT_ADD_INPUT,
    ASSESSMENT_REMOVE_INPUT,
    ASSESSMENT_EPISODE_NAME,
    ASSESSMENT_LABS,
    ASSESSMENT_MEDICATION,
    ASSESSMENT_DATE,
    ASSESSMENT_SUCCESS,
    ASSESSMENT_REQUEST,
    ASSESSMENT_FAILURE,
    ASSESSMENT_CLEAR_STATE
} from "../../actions/episode"
//Initial State
const labsAndMedicState = {
    date: "",
    episode: {
        pp_ed_id: "",
        episode_no: "",
        name: "",
        start_date: "",
        primary_complaint: ""
    },
    patient_name: "",
    patient_code: "",
    medicationList: [
        {
            id: 1,
            medication: "",
            no_of_medications:1,
            instructions: "",
            medic_notes: "",
        }
    ],
    labsList: [
        {
            id: 1,
            path: "",
            radiology: ""
        }
    ],
    labs_notes: "",
    isLoading: false,
    success: ""
}

const AddMedication = (list) => {
    if (list.length === 0) {
        return [{
            id: 1,
            medication: "",
            no_of_medications:1,
            instructions: "",
            medic_notes: "",
        }]
    } else {
        let newEntry = {
            id: list[list.length - 1].id + 1,
            medication: "",
            no_of_medications:1,
            instructions: "",
            medic_notes: ""
        }
        let newList = [...list, newEntry];
        return newList
    }
}
const RemoveMedication = (list) => {
    list.pop();
    return list;
}
const AddLabs = (list) => {
    if (list.length === 0) {
        return [{
            id: 1,
            path: "",
            radiology: ""
        }]
    } else {
        let newEntry = {
            id: list[list.length - 1].id + 1,
            path: "",
            radiology: ""
        }
        let newList = [...list, newEntry];
        return newList
    }
}
const RemoveLabs = (list) => {
    list.pop();
    return list;
}

const getNewLabList = (list, key, value, id) => {
    let newList = [...list];
    newList[id][key] = value;
    return newList;
}

export const labsAndMedicRedu = (state = labsAndMedicState, action) => {

    switch (action.type) {
        case ASSESSMENT_STATE_CHANGE:
            return {
                ...state,
                isLoading: false,
                success: "",
                [action.payload.key]: action.payload.value
            }
        case ASSESSMENT_ADD_INPUT:
            if (action.payload.type === "medication") {
                return {
                    ...state,
                    medicationList: AddMedication(state.medicationList)
                }
            } else {
                return {
                    ...state,
                    labsList: AddLabs(state.labsList)
                }
            }
        case ASSESSMENT_REMOVE_INPUT:
            if (action.payload.type === "medication") {
                return {
                    ...state,
                    medicationList: RemoveMedication(state.medicationList)
                }
            }
            else {
                return {
                    ...state,
                    labsList: RemoveLabs(state.labsList)
                }
            }
        case ASSESSMENT_LABS: {
            return {
                ...state,
                labsList: getNewLabList(state.labsList, action.payload.key, action.payload.value, action.payload.id)
            }
        }
        case ASSESSMENT_MEDICATION: {
            return {
                ...state,
                medicationList: getNewLabList(state.medicationList, action.payload.key, action.payload.value, action.payload.id)
            }
        }
        case ASSESSMENT_EPISODE_NAME:
            return {
                ...state,
                episode: {
                    ...state.episode,
                    [action.payload.key]: action.payload.value
                }
            }
            case NO_OF_MEDICATION:
                //aswin 10/27/2021 start removed alert 
                return {
                    ...state,
                    medicationList: getNewLabList(state.medicationList, action.payload.key, action.payload.value, action.payload.id)
                
                }

        case ASSESSMENT_DATE:
            return {
                ...state,
                date: action.payload.value
            }
        case ASSESSMENT_REQUEST:
            return {
                ...state,
                isLoading: true,
                success: ""
            }
        case ASSESSMENT_SUCCESS:
            return {
                date: "",
                episode: {
                    pp_ed_id: "",
                    episode_no: "",
                    name: "",
                    start_date: "",
                    primary_complaint: ""
                },
                patient_name: "",
                patient_code: "",
                medicationList: [
                    {
                        id: 1,
                        medication: "",
                        no_of_medications:1,
                        instructions: "",
                        medic_notes: "",
                    }
                ],
                labsList: [
                    {
                        id: 1,
                        path: "",
                        radiology: ""
                    }
                ],
                labs_notes: "",
                isLoading: false,
                success: "Presecreption Added Successfully."
            }
        case ASSESSMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                success: ""
            }
        case ASSESSMENT_CLEAR_STATE:
            return {
                date: "",
                episode: {
                    pp_ed_id: "",
                    episode_no: "",
                    name: "",
                    start_date: "",
                    primary_complaint: ""
                },
                patient_name: "",
                patient_code: "",
                medicationList: [
                    {
                        id: 1,
                        medication: "",
                        no_of_medications:1,
                        instructions: "",
                        medic_notes: "",
                    }
                ],
                labsList: [
                    {
                        id: 1,
                        path: "",
                        radiology: ""
                    }
                ],
                labs_notes: "",
                isLoading: false,
                success: ""
            }
        default:
            return {
                ...state
            }
    }
}
