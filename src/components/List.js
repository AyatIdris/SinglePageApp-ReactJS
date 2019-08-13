import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchControls } from '../actions/controlsActions';
import {
  faCheckCircle,
  faQuestionCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

library.add(faCheckCircle, faQuestionCircle, faTimesCircle);
class List extends Component {
  componentDidMount() {
    const { controls } = this.props;

    if (_.isEmpty(controls)) {
      this.props.dispatch(fetchControls());
    }
  }

  render() {
    const { loading, controls, states } = this.props;

    if (loading) {
      return <p>{'Loading ...'}</p>;
    }
    const getStateIcon = state => {
      if (state === undefined) return { icon: faQuestionCircle, color: 'grey' };
      switch (state.isImplemented) {
        case true:
          return { icon: faCheckCircle, color: 'green' };
        default:
          return { icon: faTimesCircle, color: 'red' };
      }
    };

    const renderList = controls.map(control => {
      const controlState = states.find(state => state.controlId === control.id);
      return (
        <div key={control.id} className="row border-grey-lighter">
          <div className="w-1/4 cell">
            <Link
              to={{
                pathname: `/${control.id}`,
                state: {
                  controlId: control.id,
                  name: control.name,
                  text: control.text,
                  isImplemented:
                    controlState !== undefined
                      ? controlState.isImplemented
                      : 'Unknown'
                }
              }}
              key={control.id}
            >
              {control.name}
            </Link>
          </div>
          <div className="w-1/2 cell">{control.text}</div>
          <div className="w-1/4 cell">
            {
              <FontAwesomeIcon
                icon={getStateIcon(controlState).icon}
                style={{ color: getStateIcon(controlState).color }}
              />
            }
          </div>
        </div>
      );
    });

    const renderHeader = (
      <div className="row row--header">
        <div className="w-1/4 cell">Control</div>
        <div className="w-1/2 cell">Description</div>
        <div className="w-1/4 cell">State</div>
      </div>
    );

    return (
      <div>
        {renderHeader}
        <div />
        <div>{renderList}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  controls: state.controls.controls,
  loading: state.controls.loading,
  states: state.states.states
});

export default connect(mapStateToProps)(List);
