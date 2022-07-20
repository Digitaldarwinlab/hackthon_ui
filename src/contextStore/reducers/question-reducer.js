
const questionAnswerReducer = (state = { questionAnswers: [] }, action) => {
    if (action.type === "SELECT") {
      // console.log(action.questionAnswer);
      const existingQuestionAnswerIndex = state.questionAnswers.findIndex(
        (qAns) => (qAns.question === action.questionAnswer.question)
      );
      const existingQuestionAnswer =
        state.questionAnswers[existingQuestionAnswerIndex];
      let updateState;
  
      if (existingQuestionAnswer) {
        const updatedQuestionAnswer = action.questionAnswer;
        updateState = [...state.questionAnswers]
        updateState[existingQuestionAnswerIndex] = updatedQuestionAnswer;
      } else {
        updateState = state.questionAnswers.concat(action.questionAnswer);
        console.log(updateState);
      }
  
      return {
        questionAnswers: updateState,
      };
    }
  
    if(action.type === 'CLEAR'){
      return {
        questionAnswers : []
      }
    }
  
    return state;
  };

  export default questionAnswerReducer;