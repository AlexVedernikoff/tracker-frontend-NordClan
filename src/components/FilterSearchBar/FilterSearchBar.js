/* Поле ввода поискового запроса
 * Параметры:
 * label - подпись перед панелью
*/
import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Search from 'material-ui/svg-icons/action/search';

const FilterSearchBar = (props, context) => {
  const { onSearchStringChange, css } = props;
  const { muiTheme } = context;

  return (
    <Paper zDepth={1} className={css.paper}>
      <Search color={muiTheme.rawTheme.palette.primary1Color} className={css.search} />
      <TextField
        id="search-field"
        hintText="Введите текст"
        onChange={onSearchStringChange}
        className={css.input}
      />
    </Paper>
  );
};

FilterSearchBar.propTypes = {
  onSearchStringChange: PropTypes.func.isRequired,
  css: PropTypes.object
};

FilterSearchBar.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

FilterSearchBar.defaultProps = {
  css: require('./filterSearchBar.scss')
};

export default FilterSearchBar;
