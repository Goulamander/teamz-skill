import { quizBuilderConstant } from '../constants/storeConstants'
import { QuizQuesTypesKey } from '../constants/appConstants'

const sampleData = [
  {
    question_type: 'WELCOME_TEXT',
    ques: '',
  },
  {
    question_type: 'RATING',
    ques: '',
  },
  {
    question_type: 'MULTIPLE_CHOICE',
    ques: '',
    options: [
      {
        option_title: 'option 1',
        option_value: 'option1',
        is_correct: false
      }
    ]
  },{
    question_type: 'CHECKBOXES',
    ques: '',
    options: [
      {
        option_title: 'option 1',
        option_value: 'option1',
        is_correct: false
      }
    ]
  },
  {
    question_type: 'DROPDOWN',
    ques: '',
    options: [
      {
        option_title: 'option 1',
        option_value: 'option1',
        is_correct: false
      }
    ]
  }
]

const initialState = {
  stepIndex: null,
  isOpenBuilder: false,
  isPreviewMode: false,
  currentQuesId: 0,
  welcome_text: null,
  isRatingQueGenerate: false,
  data: []
};

export default (state = initialState, action) => {
  switch (action.type) {

    case quizBuilderConstant.OPEN_Q_BUILDER:
      return {
        ...state,
        isOpenBuilder: true,
        stepIndex: action.payload,
        data: action.data,
        welcome_text: action.welcome_text
      }

    case quizBuilderConstant.CLOSE_Q_BUILDER:
      return {
        ...state,
        stepIndex: null,
        isOpenBuilder: false,
        isPreviewMode: false,
        currentQuesId: 0,
        data: []
      }
    case quizBuilderConstant.TOGGLE_PREVIEW_MODE:
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode
      }

    case quizBuilderConstant.SET_ACTIVE_QUES:
      return {
        ...state,
        currentQuesId: action.payload
      }

    case quizBuilderConstant.ADD_WELCOME_TEXT:
      return {
        ...state,
        welcome_text: '',
        currentQuesId: null
      }
    
    case quizBuilderConstant.EDIT_WELCOME_TEXT:
      return {
        ...state,
        welcome_text: action.payload,
        currentQuesId: null
      }

    case quizBuilderConstant.DEL_WELCOME_TEXT:
      return {
        ...state,
        welcome_text: null,
        currentQuesId: 0
      }

    case quizBuilderConstant.ADD_QUES:
      console.log(action.payload);
      return {
        ...state,
        isRatingQueGenerate: action.payload.question_type === QuizQuesTypesKey.RATING ? true : state.isRatingQueGenerate,
        currentQuesId: state.data.length,
        data: [...state.data, action.payload]
      }

    case quizBuilderConstant.EDIT_QUES:
      return {
        ...state,
        data: [...state.data.slice(0, state.currentQuesId), action.payload, ...state.data.slice(state.currentQuesId + 1)]
      }

    case quizBuilderConstant.DELETE_QUES:
      return {
        ...state,
        currentQuesId: action.currentQuesId,
        isRatingQueGenerate: action.ques.question_type === QuizQuesTypesKey.RATING ? false : state.isRatingQueGenerate,
        data: [...state.data.slice(0, action.targetId), ...state.data.slice(action.targetId + 1)]
      }
    
    case quizBuilderConstant.ADD_QUES_OPTION:
      return {
        ...state,
        data: [
          ...state.data.slice(0, state.currentQuesId), 
          {
            ...state.data[state.currentQuesId],
            options: [
              ...state.data[state.currentQuesId].options.slice(0, action.targetId+1),
              action.payload,
              ...state.data[state.currentQuesId].options.slice(action.targetId+1),
            ]
          },
          ...state.data.slice(state.currentQuesId + 1)
        ]
      }
    
    case quizBuilderConstant.EDIT_QUES_OPTION:
      return {
        ...state,
        data: [
          ...state.data.slice(0, state.currentQuesId), 
          {
            ...state.data[state.currentQuesId],
            options: [
              ...state.data[state.currentQuesId].options.slice(0, action.targetId),
              action.payload,
              ...state.data[state.currentQuesId].options.slice(action.targetId+1),
            ]
          },
          ...state.data.slice(state.currentQuesId + 1)
        ]
      }

      case quizBuilderConstant.DEL_QUES_OPTION:
        return {
          ...state,
          data: [
            ...state.data.slice(0, state.currentQuesId), 
            {
              ...state.data[state.currentQuesId],
              options: [
                ...state.data[state.currentQuesId].options.slice(0, action.targetId),
                ...state.data[state.currentQuesId].options.slice(action.targetId+1),
              ]
            },
            ...state.data.slice(state.currentQuesId + 1)
          ]
        }
    default:
      return state   
  }
};
