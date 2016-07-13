import React, {PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog/Dialog';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AutoComplete from 'material-ui/AutoComplete/AutoComplete';

const AutoCompleteDialog = (props) => {
  const {open, header, closeHandler, changeHandler, data} = props;

  const styles = {
    closeIcon: {
      position: 'absolute',
      top: 0,
      right: 0
    }
  };

  return (
    <Dialog
      title={header}
      actions={[
        <FlatButton label="OK" primary onTouchTap={closeHandler} />
      ]}
      modal={false}
      open={open}
      onRequestClose={closeHandler}
    >
      <IconButton onTouchTap={closeHandler} style={styles.closeIcon} >
        <NavigationClose />
      </IconButton>
      <AutoComplete
        hintText="Choose a victim..."
        dataSource={data}
        onUpdateInput={changeHandler}
        fullWidth
      />
    </Dialog>
  );
};

AutoCompleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  header: PropTypes.object,
  closeHandler: PropTypes.func,
  changeHandler: PropTypes.func,
  data: PropTypes.array
};

export default AutoCompleteDialog;
