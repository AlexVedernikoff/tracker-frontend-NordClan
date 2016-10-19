/* Поле ввода поискового запроса
 * Параметры:
 * label - подпись перед панелью
*/
import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Search from 'material-ui/svg-icons/action/search';

const FilterSearchBar = (props, context) => {
  const { onSearchStringChange } = props;
  const { muiTheme } = context;
  const styles = {
    paper: {
      marginTop: 50,
      backgroundColor: 'white',
      height: 50,
      display: 'flex'
    },
    search: {
      margin: '12px 20px',
      verticalAlign: 'top'
    },
    input: {
      width: 'calc(100% - 64px)',
      verticalAlign: 'top',
      boxSizing: 'border-box'
      // border: 'none',
      // boxShadow: 'none',
      // outline: 'none'
    }
  };

  return (
    <Paper zDepth={1} style={styles.paper}>
      <Search color={muiTheme.rawTheme.palette.primary1Color} style={styles.search}/>
      <TextField
        id="search-field"
        hintText="Введите текст"
        onChange = {onSearchStringChange}
        style = {styles.input}
      />
    </Paper>
  );
};

FilterSearchBar.propTypes = {
  onSearchStringChange: PropTypes.func.isRequired
};

FilterSearchBar.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default FilterSearchBar;
