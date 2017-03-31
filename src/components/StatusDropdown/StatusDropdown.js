import React from 'react';

export default class StatusDropdown extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    // Dropdown block is inactive & hidden by default
    this.state = {
      dropdownIsActive: false,
      dropdownIsVisible: false,
    };

    // We should bind `this` to click event handler right here
    this._hideDropdown = this._hideDropdown.bind(this);
  }

  componentDidMount() {
    // Hide dropdown block on click outside the block
    window.addEventListener('click', this._hideDropdown, false);
  }

  componentWillUnmount() {
    // Remove click event listener on component unmount
    window.removeEventListener('click', this._hideDropdown, false);
  }

  _stopPropagation(e) {
    // Stop bubbling of click event on click inside the dropdown content
    e.stopPropagation();
  }

  _toggleDropdown() {
    const { dropdownIsVisible } = this.state;

    // Toggle dropdown block visibility
    this.setState({ dropdownIsVisible: !dropdownIsVisible });
  }

  _hideDropdown() {
    const { dropdownIsActive } = this.state;

    // Hide dropdown block if it's not active
    if (!dropdownIsActive) {
      this.setState({ dropdownIsVisible: false });
    }
  }

  _handleFocus() {
    // Make active on focus
    this.setState({ dropdownIsActive: true });
  }

  _handleBlur() {
    // Clean up everything on blur
    this.setState({
      dropdownIsVisible: false,
      dropdownIsActive: false,
    });
  }

  _doSomething() {
    // Do something on click inside the dropdown block...
    window.alert('Done something!');
  }

  _renderDropdown() {
    const dropdownId = this.props.id;
    const { dropdownIsVisible } = this.state;

    return (
      <div
        className="wrapper"
        tabIndex={dropdownId}
        onFocus={::this._handleFocus}
        onBlur={::this._handleBlur}
        onClick={::this._toggleDropdown}
      >
        <span className="toggler">
          Dropdown {dropdownId}
        </span>
        {
          dropdownIsVisible &&
          <div className="content">
            <div className="item" onClick={::this._doSomething}>
              Do something!
            </div>
          </div>
        }
      </div>
    );
  }

  render() {
    return (
      <div className="dropdown">
        {/* Some content */}
        {::this._renderDropdown()}
      </div>
    );
  }

}