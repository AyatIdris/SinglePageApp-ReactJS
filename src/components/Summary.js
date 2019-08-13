import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchStates } from '../actions/statesActions';
import { fetchControls } from '../actions/controlsActions';

class Summary extends Component {
  componentDidMount() {
    this.props.dispatch(fetchStates());
    this.props.dispatch(fetchControls());
  }

  render() {
    const { states, controls, loading } = this.props;

    if (loading) return <p>{'Wating on data ...'}</p>;

    const summaryTotals = states
      .map(({ isImplemented }) => isImplemented)
      .reduce(
        (stateTotals, isImplemented) => {
          if (isImplemented) stateTotals.implemntedTotals++;
          else stateTotals.notImplementedTotals++;
          return stateTotals;
        },
        {
          implemntedTotals: 0,
          notImplementedTotals: 0,
          unknownTotals: controls.length - states.length
        }
      );

    return (
      <p>
        {summaryTotals.implemntedTotals +
          ' implemented, ' +
          summaryTotals.notImplementedTotals +
          ' not implemented, ' +
          summaryTotals.unknownTotals +
          ' unknown'}
      </p>
    );
  }
}

const mapStateToProps = state => ({
  controls: state.controls.controls,
  loading: state.states.loading,
  states: state.states.states
});

export default connect(mapStateToProps)(Summary);
