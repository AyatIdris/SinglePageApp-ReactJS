import {
  FETCH_STATES_BEGIN,
  FETCH_STATES_SUCCESS,
  REPLACE_STATE
} from '../actions/statesActions';

const initialState = {
  states: [],
  loading: false
};

const statesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STATES_BEGIN:
      return { ...state, loading: true };
    case FETCH_STATES_SUCCESS:
      return { loading: false, states: action.payload.states };
    case REPLACE_STATE: {
      let updateStates = [];
      if (
        state.states.find(
          controlState =>
            controlState.controlId === action.payload.controlState.controlId
        )
      ) {
        updateStates = state.states.map(controlState => {
          if (
            controlState.controlId === action.payload.controlState.controlId
          ) {
            return {
              ...controlState,
              isImplemented: action.payload.controlState.isImplemented
            };
          } else {
            return controlState;
          }
        });
      } else {
        updateStates = [action.payload.controlState, ...state.states];
      }
      return {
        ...state,
        states: updateStates
      };
    }
    default:
      return state;
  }
};

export default statesReducer;
