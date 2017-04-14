import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid/lib/index';
import NavCancel from 'material-ui/svg-icons/navigation/cancel';

export default class Slider extends Component {
  static propTypes = {
    css: PropTypes.object
  }
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      sliderRemoveIco: {
        cursor: 'pointer',
        fill: '#a5a5a5',
        border: '2px solid transparent',
        borderColor: theme.rawTheme.palette.backgroundColor,
        borderRadius: '50%',
        background: theme.rawTheme.palette.backgroundColor
      }
    };
    return styles;
  }

  handleSliderRemoveItem = () => {
    console.log('Remove slider item');
  };

  render() {
    const styles = this.getStyles();
    const { css } = this.props;
    // const sliderSettings = {
    //   dots: true,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 3,
    //   slidesToScroll: 1,
    //
    //   arrows: true,
    //   adaptiveHeight: true,
    //   draggable: true,
    //   lazyLoad: true,
    // };
    /*
     <Slider {...sliderSettings}>
     <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
     <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
     <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
     <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
     <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
     </Slider>
     */
    return (
      <Col sm={3}>
        <div className={css.sliderItem}>
          <img className={css.sliderItemImg} alt="" />
          <div className={css.sliderRemoveBtn}>
            <NavCancel
              style={styles.sliderRemoveIco}
              onClick={this.handleSliderRemoveItem}
            />
          </div>
        </div>
      </Col>
    );
  }
}

Slider.defaultProps = {
  css: require('./slider.scss')
};
