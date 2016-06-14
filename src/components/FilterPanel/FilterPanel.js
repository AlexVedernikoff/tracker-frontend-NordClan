/* Панель выбора полей фильтрации
 * Параметры:
 * label - подпись перед панелью
*/
import React, { PropTypes } from 'react';

const FilterPanel = (props, context) => {
  const { label } = props;
  const { muiTheme } = context;
  const styles = {
    block: {
      marginBottom: 50,
      display: 'flex',
      padding: '0px 20px',
      justifyContent: 'flex-start'
    },
    label: {
      fontSize: 12,
      color: muiTheme.rawTheme.palette.accent3Color,
      padding: 5
    }
  };

  return (
    <div style={styles.block}>
      <span style={styles.label}>{label}</span>
      {props.children}
    </div>
  );
};

FilterPanel.propTypes = {
  children: PropTypes.array,
  label: PropTypes.string
};

FilterPanel.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default FilterPanel;
