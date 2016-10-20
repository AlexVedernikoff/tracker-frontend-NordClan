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
  const css = require('./filterSearchBar.scss');
  const { muiTheme } = context;

  return (
    <Paper zDepth={1} className={css.paper}>
      <Search color={muiTheme.rawTheme.palette.primary1Color} className={css.search}/>
      <TextField
        id="search-field"
        hintText="Введите текст"
        onChange = {onSearchStringChange}
        className={css.input}
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
