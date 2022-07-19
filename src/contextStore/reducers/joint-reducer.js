const jointReducer = (state = { joints: [] }, action) => {
    if (action.type === "ADD") {
      const existingJointIndex = state.joints.findIndex(
        (joint) => joint.id === action.joint.id
      );
      const existingJoint = state.joints[existingJointIndex];
      let updatedState;
  
      if (existingJoint) {
        const updatedJoint = action.joint;
        updatedState = [...state.joints];
        updatedState[existingJointIndex] = updatedJoint;
      } else {
        updatedState = state.joints.concat(action.joint);
      }
      return {
        joints: updatedState,
      };
    }
  
    if (action.type === "REMOVE") {
      const updatedState = state.joints.filter((joint) => joint.id !== action.id);
      return {
        joints: updatedState,
      };
    }
    if(action.type === "JOINT_CLEARSTATE"){
      return {
        joints : []
      }
    }
  
    return state;
  };

  export default jointReducer;