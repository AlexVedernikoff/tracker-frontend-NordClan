import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from '../../Timesheets.scss';
import { IconComments, IconCheckAll } from '../../../../components/Icons';

class TotalComment extends React.Component {
  static propTypes = {
    items: PropTypes.array
  }

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = evt => {
    this.setState({
      isOpen: false
    });
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    const { items } = this.props;
    const filledTimeSheets = items.filter((el) => { return el.id; });
    return (
      <div>
        <IconComments onClick={this.toggle}/>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isOpen
            ? <div className={cn(css.totalComment)}>
                <div>
                  {
                    filledTimeSheets.map(
                      tsh => (
                        <div key={tsh.id} className={css.totalCommentPart}>
                          <div className={css.commentDay}>
                            {moment(tsh.onDate).format('dd')}<br/>
                            {moment(tsh.onDate).format('DD.MM')}
                          </div>
                          <textarea placeholder="Введите текст комментария" value={tsh.comment} />
                        </div>
                      )
                    )
                  }
                </div>
                <div className={css.checkAll} onClick={this.toggle}>
                  <IconCheckAll/>
                </div>
              </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default TotalComment = onClickOutside(TotalComment);
