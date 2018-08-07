import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from '../../Timesheets.scss';
import { IconComments, IconCheckAll } from '../../../../components/Icons';
import { updateSheetsArray } from '../../../../actions/Timesheets';
import localize from './totalComment.json';

class TotalComment extends React.Component {
  static propTypes = {
    isDisable: PropTypes.bool,
    items: PropTypes.array,
    startingDay: PropTypes.object,
    updateSheetsArray: PropTypes.func,
    userId: PropTypes.number
  };

  constructor(props) {
    super(props);
    const updatedComments = {};
    if (props.items.length) {
      props.items.forEach(tsh => {
        if (tsh.id) updatedComments[tsh.id] = tsh.comment;
      });
    }
    this.state = {
      isOpen: false,
      updatedComments
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.items.length) {
      const updatedComments = {};
      newProps.items.forEach(tsh => {
        if (tsh.id) updatedComments[tsh.id] = tsh.comment;
      });
      this.setState({
        updatedComments
      });
    }
  }

  handleClickOutside = () => {
    this.setState({
      isOpen: false
    });
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  save = () => {
    const { userId, startingDay } = this.props;
    const body = [];
    for (const sheetId in this.state.updatedComments) {
      body.push({
        sheetId,
        comment: this.state.updatedComments[sheetId]
      });
    }
    this.props.updateSheetsArray(body, userId, startingDay);
    this.toggle();
  };

  updateComment = (e, tsh) => {
    this.setState({
      updatedComments: {
        ...this.state.updatedComments,
        [tsh.id]: e.target.value
      }
    });
  };

  render() {
    const { items, isDisable, lang } = this.props;
    const filledTimeSheets = items.filter(el => {
      return el.id;
    });
    return (
      <div>
        <IconComments onClick={this.toggle} />
        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.state.isOpen ? (
            <div className={cn(css.totalComment)}>
              <div>
                {filledTimeSheets.map(tsh => (
                  <div key={tsh.id} className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      {moment(tsh.onDate).format('dd')}
                      <br />
                      {moment(tsh.onDate).format('DD.MM')}
                    </div>
                    {tsh.statusId === 1 || tsh.statusId === 2 ? (
                      <textarea
                        placeholder={localize[lang].ENTER_COMMENT_TEXT}
                        onChange={e => this.updateComment(e, tsh)}
                        value={this.state.updatedComments[tsh.id] || ''}
                      />
                    ) : (
                      <span>{this.state.updatedComments[tsh.id]}</span>
                    )}
                  </div>
                ))}
              </div>
              {!isDisable ? (
                <div className={css.checkAll} onClick={this.save}>
                  <IconCheckAll />
                </div>
              ) : null}
            </div>
          ) : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.Auth.user.id,
  startingDay: state.Timesheets.startingDay,
  lang: state.Localize.lang
});

const mapDispatchToProps = { updateSheetsArray };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onClickOutside(TotalComment));
