import React, { Component, PropTypes } from 'react';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import FilterSwitch from '../../components/FilterSwitch/FilterSwitch';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import Helmet from 'react-helmet';
import FilterSearchBar from '../../components/FilterSearchBar/FilterSearchBar';
import Typography from 'material-ui/styles/typography';
import Add from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class Project extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };
  onFilterChange = value => console.log(value);
  render() {
    const { css } = this.props;
    const theme = this.context.muiTheme;
    const h1 = {
      color: theme.rawTheme.palette.primary1Color,
      fontWeight: Typography.fontWeightMedium
    };
    const renderFilterProject = (
      <FilterPanel label="Фильтр:" onFilterChange={this.onFilterChange} >
        <FilterSwitch active={1} value="name" label="название" />
        <FilterSwitch active={2} value="project" label="проект" />
        <FilterSwitch active={3} value="noProject" label="не проект" />
        <FilterSwitch active={4} value="status" label="статус" />
        <FilterSwitch active={5} value="date" label="дата" />
        <FilterSwitch active={6} value="owner" label="владелец" />
        <FilterSwitch active={7} value="developer" label="разработчик" />
      </FilterPanel>
    );
    return (
      <div>
        <Helmet title="My Project"/>
        <Grid>
          <Row>
            <Col xs={12} lg={12}>
              <h1 className={css.h1} style={h1}>Мои проекты!</h1>
              <FilterSearchBar />
              {renderFilterProject}
            </Col>
          </Row>
        </Grid>
        <FloatingActionButton className={css.actionButton} backgroundColor="#F06292">
          <Add />
        </FloatingActionButton>
      </div>
    );
  }
}

Project.propTypes = {
  css: PropTypes.object
};

Project.defaultProps = {
  css: require('./project.scss')
};
