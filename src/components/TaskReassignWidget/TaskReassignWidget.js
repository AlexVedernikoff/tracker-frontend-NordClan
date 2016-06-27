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
    const styles = {
      header: {
        color: theme.rawTheme.palette.primary1Color
      },
      subheader: {
        display: 'block',
        fontSize: 12
      }
    };

    const header = (
      <div>
        <span style={styles.header}>{taskName}</span>
        <span style={styles.subheader}>{projectName}, {taskExpertise}</span>
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
