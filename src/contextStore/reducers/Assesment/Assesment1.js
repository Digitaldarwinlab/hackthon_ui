import {
    STATECHANGE,
    STATE_ARRAY_CHANGE,
    FETCH_DATA,
    RECEIVED_DATA,
    ASSESMENT_CLEARSTATE,
    ASSESSMENT_ADD_SUB_INPUT,
    ASSESSMENT_REMOVE_SUB_INPUT,
    ASSESSMENT_SUBJECTIVE,
} from "../../actions/Assesment"


const FirstAssesmentIniState ={
    Date:"",
    AI_data:"",
    Anterior_AI_Data:'',
    LeftLateral_AI_Data:'',
    RightLateral_AI_Data:'',
    AI_screenshot:"",
    Exercise_Name:"",
    episode_id:"",
    Complaint:"",
    EspiStart:"",
    joint1score:10,
    joint2score:20,
    ScareFile:[],
    TraumaFile:"",
    // aswin 10/24/2021 start
    Type:"First",
    // aswin 10/24/2021 stop
    Scars:"",
    Arom_M:false,
    Arom_Ai:false,
    checkState:false,
    // gaurav
    chiefCom:"",
    occupation:"",
    Duration:"",
    Built:"",
    History:"",
    Medication:'',
    Others:'',
    medicCheck:false,
    othCheck:false,
    Surgical_History_Notes_check:false,
    past_medical_history:[],
    frontChecks:{},
    sideChecks:{},
    FrontCheck:[],
    SideCheck:[],
    Surgical_History_Notes:'',
    Surgical_History_Notes1:[],
    any_other_details:'',
//     Diabetes:"false",
//     HYN: "false",
//     COPD: "false",
//     Cardiac: "false",
//     Medication: "false",
//     Other: "false",
// ],



    //
    allJoints:[], 
    quest:true,
    pain1:true,
    special:true,
    pose:true,
    romAssAi:true,
    romAss:true,
    Swelling:"no pain",
    pain_scars:"",
    subjective:[{
        id:1,
        occupation:'',
        duration:''
    }],
    posture:{},
    Medication1:[],
    Others1:[],
    pain_swelling:"",
    Numbness:"no pain",
    pain_state:false,
    PainMeter:0,
    RecentHistory:"",
    Trauma:"",
    Test:"",
    body_image:"",
    nature_of_pain_here:"",
    pain_aggravating_here:[],
    pain_relieving_here:[],
    nature_of_pain:{},
    pain_scale:0,
    pain_aggravating:{},
    pain_relieving:{},
    superficial:'',
    deep:'',
    cortial:'',
    special_visibility:'none',
    question_heading:[],
    // Symptoms:{score:[],question:[],answer:[]},
    // Stiffness:{score:[],question:[],answer:[]},
    // pain:{score:[],question:[],answer:[]},
    // DailyLiving:{score:[],question:[],answer:[]},
    // Sports:{score:[],question:[],answer:[]},
    // Life:{score:[],question:[],answer:[]},
    // Difficulty:{score:[],question:[],answer:[]},
    KOOS:"",
    Questionnaire:"",
    success:"",
}

const handleIndexValue = (arr,value,index,ques,ans) => {
    // console.log('arr ',arr)
    // console.log('arr ',value)
    // console.log('arr ',index)
    // console.log('arr ',ques)
    // console.log('arr ',ans)
    const newArr = {...arr};
    if(index+1>newArr.length){
        newArr.score.push(value)
    }else{
        newArr.score[index] = value;
    }
    if(!arr.question.includes(ques)){
        newArr.question.push(ques)
    }
    // if(!arr.answer.includes(ans)){
    // }
    newArr.answer[index] = ans
  //  setTimeout(()=>console.log('abc '),10)
    return newArr;
}
const Addsubjective = (list) => {
    if (list.length === 0) {
        return [{
            id:1,
            occupation:'',
            duration:'',
            Sports_type:''
        }]
    } else {
        let newEntry = {
            id: list[list.length - 1].id + 1,
            occupation:'',
            duration:'',
            Sports_type:''
        }
        let newList = [...list, newEntry];
        return newList
    }
}
const Removesubjective = (list) => {
    list.pop();
   
    return list;
}
const getNewLabList = (list, key, value, id) => {
    let newList = [...list];
    newList[id][key] = value;
    return newList;
}
export const FirstAssesment =( state=FirstAssesmentIniState , action) => {
    switch(action.type){
        case STATECHANGE: 
            return{ 
                ...state, 
                isLoading:false,
                success:"",
                [action.payload.key]:action.payload.value
            }
        case STATE_ARRAY_CHANGE: 
            return {
                ...state,
                isLoading:false,
                success:"",
                [action.payload.key]:handleIndexValue(
                    state[action.payload.key],
                    action.payload.value,
                    action.payload.index,
                    action.payload.ques,
                    action.payload.ans)
                }   
        case FETCH_DATA:
            return{
                ...state,
                isLoading:true,
                success:""
            }
        case RECEIVED_DATA:
            return{
                ...state, 
                isLoading:true,
                success:"Assesment Added"
            }
         case ASSESSMENT_ADD_SUB_INPUT:
                return {
                    ...state,
                    subjective : Addsubjective(state.subjective)
                }
        case ASSESSMENT_REMOVE_SUB_INPUT:
                return {
                    ...state,
                    subjective : Removesubjective(state.subjective)
                } 
        case ASSESSMENT_SUBJECTIVE: {
            return {
                ...state,
                labsList: getNewLabList(state.subjective, action.payload.key, action.payload.value, action.payload.id)
            }
        }
        case ASSESMENT_CLEARSTATE:
            return {
                ...FirstAssesmentIniState,
                subjective:[{
                    id:1,
                    occupation:'',
                    duration:''
                }]
            }
        case "PAIN_ASSESMENT_CLEARSTATE":
            return {
                ...state,
                nature_of_pain:{},
                pain_scale:1,
                pain_aggravating:{},
                pain_relieving:{},
                superficial:'',
                deep:'',
                cortial:'',
            }    
        case "SPECIAL_TEST_CLEARSTATE":
            return {
                ...state
            }    
        case "QUESTION_CLEARSTATE"            :
            return {
                ...state,
                Symptoms:{score:[],question:[],answer:[]},
                Stiffness:{score:[],question:[],answer:[]},
                pain:{score:[],question:[],answer:[]},
                DailyLiving:{score:[],question:[],answer:[]},
                Sports:{score:[],question:[],answer:[]},
                Life:{score:[],question:[],answer:[]},
                Difficulty:{score:[],question:[],answer:[]},
            }
        default:
            return state;
    }
}