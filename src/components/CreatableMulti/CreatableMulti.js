import React, { Component } from 'react';
import Select, { Value } from 'react-select';
import './CreatableMulti.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './CreatableMulti.json';
import ReactTooltip from 'react-tooltip';

class CreatableMulti extends Component {
  static propTypes = {
    hint: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array
  };

  componentDidUpdate = () => {
    ReactTooltip.rebuild();
  };

  render() {
    const { options, onChange, value, lang, ...other } = this.props;

    return (
      <div>
        <Select.Creatable
          multi
          showNewOptionAtTop
          options={options}
          onChange={onChange}
          value={value}
          promptTextCreator={label => `${localize[lang].CREATE_NEW_OPTION}: ${label}`}
          noResultsText={localize[lang].NO_RESULTS}
          valueComponent={props => {
            return (
              <div data-tip={props.value.label} className="tagWrapper">
                <Value {...props} />
              </div>
            );
          }}
          {...other}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(CreatableMulti);
