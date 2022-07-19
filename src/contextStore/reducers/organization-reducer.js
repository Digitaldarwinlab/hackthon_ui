const organizationReducer = (state={org:''}, action) => {

    if(action.type === "ADD ORGANIZATION"){
        return {org:action.org};
    }
    else if(action.type === "CLEAR ORGANIZATION"){
        return {org:''};
    }
    
    return state;
}

export default organizationReducer;