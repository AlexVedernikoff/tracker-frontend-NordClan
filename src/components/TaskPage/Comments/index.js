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

  mapListItem(data){
    let child = [];

    child = data.map((item,key) => {
      let nestedItems = [];
       if (item.nestedItems) {
         nestedItems = this.mapListItem(item.nestedItems);
       }
       return (<ListItem
           leftAvatar={<Avatar src="" />}
           primaryText={item.author}
           secondaryText={<p>{item.text}</p>}
           secondaryTextLines={2}
           initiallyOpen key={key}
           nestedItems={nestedItems} />);
    })
    return child;
  }

  render() {
    const styles = this.getStyles();
    const data = [
      {
        author: 'Brendan Lim',
        text: 'Do you want to grab brunch?'
      },
      {
        author: 'Scott Jennifer',
        text: 'Do you want to grab brunch?',
        nestedItems: [
          {
            author: 'Brendan Lim',
            text: 'Do you want to grab brunch?'
          },
          {
            author: 'Scott Jennifer',
            text: 'Do you want to grab brunch?',
            nestedItems: [
              {
                author: 'Scott Jennifer',
                text: 'Wish I could come, but I&apos;m out of town this weekend.'
              },
            ]
          },
          {
            author: 'Brendan Lim',
            text: 'Do you want to grab brunch?',
          },
        ]
      },
      {
        author: 'Brendan Lim',
        text: 'Wish I could come.'
      }
    ];
    return (
      <Tabs onChange={this.handleChangeTabs}
        value={this.state.slideIndex}
        tabItemContainerStyle={styles.tabsLabel}
        inkBarStyle={styles.tabInkBar}
        style={{width: '80%'}}>
        <Tab label="Комментарии" value={0} style={styles.tabsLabelText}>
          <List>
            {this.mapListItem(data)}
          </List>
        </Tab>
        <Tab label="История" value={1} style={styles.tabsLabelText} />
      </Tabs>
    );
  }
}
