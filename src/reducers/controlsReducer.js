import {
  FETCH_CONTROLS_BEGIN,
  FETCH_CONTROLS_SUCCESS
} from '../actions/controlsActions';

const initialState = {
  controls: [],
  loading: false
};

const controlsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTROLS_BEGIN:
      return { ...state, loading: true };
    case FETCH_CONTROLS_SUCCESS:
      return {
        ...state,
        loading: false,
        controls: action.payload.controls
      };
    default:
      return state;
  }
};

export default controlsReducer;
