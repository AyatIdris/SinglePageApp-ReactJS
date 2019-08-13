import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchControl, updateControl } from '../actions/controlActions';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faQuestionCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

library.add(faCheckCircle, faQuestionCircle, faTimesCircle);

class Details extends Component {
  componentDidMount() {
    const { controlId, controlDetails, loadControlDetails } = this.props;

    if (_.isEmpty(controlDetails)) {
      loadControlDetails(controlId);
    }
  }

  renderButtons() {
    const { controlDetails, controlId, updateControlState } = this.props;

    const implementedButton = (
      <button
        className={
          'button text-white bg-blue hover:bg-blue-dark ' +
          (controlDetails.isImplemented === true ? 'button--disabled' : '')
        }
        disabled={controlDetails.isImplemented === true}
        onClick={() => updateControlState(controlId, true)}
      >
        Mark Implemented
      </button>
    );

    const notImplelementedButton = (
      <button
        className={
          'button text-white bg-red hover:bg-red-dark ' +
          (controlDetails.isImplemented === false ? 'button--disabled' : '')
        }
        disabled={controlDetails.isImplemented === false}
        onClick={() => updateControlState(controlId, false)}
      >
        Mark Not Implemented
      </button>
    );

    return (
      <div className="mt-2">
        {implementedButton}
        {notImplelementedButton}
      </div>
    );
  }

  render() {
    const { loading, controlDetails } = this.props;
    if (loading) return <p>{'Loading..'}</p>;

    const getStateIcon = () => {
      switch (controlDetails.isImplemented) {
        case true:
          return { icon: faCheckCircle, color: 'green' };
        case false:
          return { icon: faTimesCircle, color: 'red' };
        default:
          return { icon: faQuestionCircle, color: 'grey' };
      }
    };

    return (
      <div className="flex-col">
        <div>
          <div className="flex">
            <div className="mr-2">{controlDetails.name}</div>
            <div className="mr-2">{controlDetails.text}</div>
            <div className="mr-2">
              {
                <FontAwesomeIcon
                  icon={getStateIcon().icon}
                  style={{ color: getStateIcon().color }}
                />
              }
            </div>
          </div>
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let selectedControlDetails = Object.assign(
    {},
    ownProps.location.state || state.control.control
  );

  //the location state with the updated states
  if (
    !_.isEmpty(selectedControlDetails) &&
    !_.isEmpty(state.control.control) &&
    selectedControlDetails.controlId === state.control.control.controlId &&
    selectedControlDetails.isImplemented !== state.control.control.isImplemented
  ) {
    selectedControlDetails.isImplemented = state.control.control.isImplemented;
  }

  return {
    controlDetails: selectedControlDetails || state.control.control,
    loading: state.control.loading,
    controlId: ownProps.match.params.id
  };
};

const mapDispatchToProps = dispatch => ({
  loadControlDetails: controlId => dispatch(fetchControl(controlId)),
  updateControlState: (controlId, isImplemented) =>
    dispatch(updateControl(controlId, isImplemented))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);
