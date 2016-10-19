import React, {PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import {AccountSwitch} from '../../components/Icons/Icons';
import AutoCompleteDialog from '../../components/Dialog/AutoCompleteDialog';

class TaskReassignWidget extends React.Component {
  static propTypes = {
    taskName: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    taskExpertise: PropTypes.string
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      users: []
    };
  }

  handleTouchTap = () => {
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  handleUpdateInput = (value) => {
    this.setState({
      users: [
        value,
        value + value,
        value + value + value,
      ],
    });
  }

  render() {
    const {taskName, projectName, taskExpertise} = this.props;
    const theme = this.context.muiTheme;
    const headerColor = {
      color: theme.rawTheme.palette.primary1Color
    };
    const styles = require('./reassignWidget.scss');

    const header = (
      <div>
        <span style={headerColor}>{taskName}</span>
        <span className={styles.subheader}>{projectName}, {taskExpertise}</span>
      </div>
    );

    return (
      <div>
        <IconButton onTouchTap={this.handleTouchTap}>
          <AccountSwitch/>
        </IconButton>
        <AutoCompleteDialog
          open={this.state.open}
          header={header}
          openHandler={this.handleTouchTap}
          closeHandler={this.handleClose}
          changeHandler={this.handleUpdateInput}
          data={this.state.users}
        />
      </div>
    );
  }
}

export default TaskReassignWidget;
