import React, {PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle/Toggle';
import IconToggle from '../../components/IconToggle/IconToggle';
import ActionViewList from 'material-ui/svg-icons/action/view-list';
import ActionViewModule from 'material-ui/svg-icons/action/view-module';

class TasksListViewSettings extends React.Component {
  static propTypes = {
    showGroups: PropTypes.bool.isRequired,
    tableLayout: PropTypes.bool.isRequired,
    onGroupVisibilityToggle: PropTypes.func.isRequired,
    onLayoutToggle: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    const {showGroups, tableLayout, onGroupVisibilityToggle, onLayoutToggle} = this.props;
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <IconButton style={{paddingTo: 20, paddingBottom: 0}} onTouchTap={this.handleTouchTap} >
          <MoreVertIcon style={{marginBottom: -4}} color={"rgba(0, 0, 0, 0.54)"}/>
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <List>
            <ListItem
              primaryText="Отображение задач"
              rightToggle={<IconToggle name="view-mode-grid"
                stateOnIcon={<ActionViewModule/>} stateOffIcon={<ActionViewList/>}
                toggled={tableLayout} onChange={onLayoutToggle}
              />}
              innerDivStyle={{paddingRight: 130}}
            />
            <ListItem
              primaryText="Группировка по проектам"
              rightToggle={<Toggle toggled={showGroups} onToggle={onGroupVisibilityToggle}/>}
            />
          </List>
        </Popover>
      </div>
    );
  }
}

export default TasksListViewSettings;
