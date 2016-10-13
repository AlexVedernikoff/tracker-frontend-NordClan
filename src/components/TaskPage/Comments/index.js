import React, { Component, PropTypes } from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/styles/typography';

export default class Comments extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      slideIndex: 0,
    };
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      tabsLabel: {
        backgroundColor: theme.rawTheme.palette.canvasColor
      },
      tabInkBar: {
        backgroundColor: theme.rawTheme.palette.primary1Color
      },
      tabsLabelText: {
        color: Typography.textDarkBlack
      },
    };
    return styles;
  }

  handleChangeTabs = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  render() {
    const styles = this.getStyles();

    return (
      <Tabs onChange={this.handleChangeTabs}
        value={this.state.slideIndex}
        tabItemContainerStyle={styles.tabsLabel}
        inkBarStyle={styles.tabInkBar}
        style={{width: '80%'}}>
        <Tab label="Комментарии" value={0} style={styles.tabsLabelText}>
          <List>
            <ListItem
              leftAvatar={<Avatar src="" />}
              primaryText="Brendan Lim"
              secondaryText={<p>Do you want to grab brunch?</p>}
              secondaryTextLines={2}
              key={1} />

            <ListItem
              leftAvatar={<Avatar src="" />}
              primaryText="Scott Jennifer"
              secondaryText={<p>Wish I could come.</p>}
              secondaryTextLines={2}
              initiallyOpen
              key={2}
              nestedItems={[
                <ListItem
                  leftAvatar={<Avatar src="" />}
                  primaryText="Brendan Lim"
                  secondaryText={<p>Do you want to grab brunch?</p>}
                  secondaryTextLines={2}
                />,
                <ListItem
                  leftAvatar={<Avatar src="" />}
                  primaryText="Scott Jennifer"
                  secondaryText={<p>Wish I could come, but I&apos;m out of town this weekend.</p>}
                  secondaryTextLines={2}
                  key={1}
                  nestedItems={[
                    <ListItem
                      leftAvatar={<Avatar src="" />}
                      primaryText="Brendan Lim"
                      secondaryText={<p>Do you want to grab brunch?</p>}
                      secondaryTextLines={2} />,
                    <ListItem
                      leftAvatar={<Avatar src="" />}
                      primaryText="Scott Jennifer"
                      key={2}
                      secondaryText={<p>Wish I could come.</p>}
                      secondaryTextLines={2}
                    />
                  ]}
                />
              ]}
            />
          </List>
        </Tab>
        <Tab label="История" value={1} style={styles.tabsLabelText} />
      </Tabs>
    );
  }
}
