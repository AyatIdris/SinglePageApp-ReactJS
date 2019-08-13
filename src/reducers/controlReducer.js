import {
  FETCH_CONTROL_BEGIN,
  FETCH_CONTROL_SUCCESS,
  UPDATE_CONTROL_STATE
} from '../actions/controlActions';

const initialState = {
  control: {},
  loading: false
};

const controlReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTROL_BEGIN:
      return { ...state, loading: true };
    case FETCH_CONTROL_SUCCESS:
      return {
        loading: false,
        control: action.payload.control
      };
    case UPDATE_CONTROL_STATE: {
      return {
        ...state,
        control: {
          ...state.control,
          ...action.payload.control
        }
      };
    }
    default:
      return state;
  }
};

export default controlReducer;
