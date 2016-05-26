/* Панель выбора полей фильтрации
 * Параметры:
 * label - подпись перед панелью
*/
import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Search from 'material-ui/svg-icons/action/search';

const FilterSearchBar = (props, context) => {
  const { muiTheme } = context;
  const styles = {
    paper: {
      marginTop: 50,
      backgroundColor: 'white',
      height: 50,
      display: 'flex'
    },
    search: {
      margin: '12px 20px'
    },
    input: {
      width: '100%',
      border: 'none',
      boxShadow: 'none',
      outline: 'none'
    }
  };

  return (
    <Paper zDepth={1} style={styles.paper}>
      <Search color={muiTheme.rawTheme.palette.primary1Color} style={styles.search}/>
      <input type="text" style={styles.input}
             placeholder="Введите текст"></input>
    </Paper>
  );
};

FilterSearchBar.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default FilterSearchBar;
