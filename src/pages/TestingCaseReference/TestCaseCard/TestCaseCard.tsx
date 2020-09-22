import React, { PureComponent, SyntheticEvent } from 'react';
import classnames from 'classnames';
import { bool, string, oneOf, number, exact, object, func } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib';
import { Link } from 'react-router';
import cn from 'classnames';
import localize from './TestCaseCard.json';
import * as css from './TestCaseCard.scss';
import Checkbox from '../../../components/Checkbox';

type TestCaseCardProp = {
  addToProject?: (id: number) => void,
  authorInfo: { fullNameEn: string, fullNameRu: string },
  card?: boolean,
  handleModalTestCaseEditing: (...args: any[]) => any,
  id: number,
  lang: 'en' | 'ru',
  prefix: string,
  priority?: number,
  removeFromProject?: (...args: any[]) => any,
  testCaseSeverity: { id: number, name: string, nameEn: string, },
  testSuiteInfo?: {title: string},
  title: string,
  selected?: boolean,
  changeSelected: () => void,
}

export default class TestCaseCard extends PureComponent<TestCaseCardProp, {}> {
  static propTypes = {
    addToProject: func,
    authorInfo: exact({
      fullNameEn: string,
      fullNameRu: string
    }),
    card: bool,
    handleModalTestCaseEditing: func.isRequired,
    id: number.isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    prefix: string.isRequired,
    priority: number,
    removeFromProject: func,
    testCaseSeverity: exact({
      id: number.isRequired,
      name: string.isRequired,
      nameEn: string.isRequired
    }),
    testSuiteInfo: object,
    title: string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      addToProject,
      removeFromProject,
      prefix,
      id,
      title,
      priority,
      authorInfo,
      testSuiteInfo,
      testCaseSeverity,
      selected,
      changeSelected,
      card,
      lang,
      handleModalTestCaseEditing
    } = this.props;

    const checked = (e: SyntheticEvent) => {
      if (changeSelected) changeSelected();
    }

    return (
      <div className={classnames(css.testCaseCard, css[`priority-${priority}`], { [css.card]: card })}  onClick={checked}>
        <Row>
          <Col xs={12} sm={6}>
            { changeSelected &&
              <div className={css.checkbox} >
                <Checkbox onChange={checked} checked={selected}/>
              </div>
            }
            <div>
              <div className={css.header}>
                <div>
                  <div className={css.priorityMarker} data-tip={`${localize[lang].PRIORITY} ${priority}`}>
                    {priority}
                  </div>
                </div>
                {testCaseSeverity && (
                  <div className={cn(css.severity, css[`severity_${testCaseSeverity?.id ?? ''}`])}>{lang === 'ru' ? testCaseSeverity.name : testCaseSeverity.nameEn}</div>
                )}
                {testSuiteInfo && <div className={css.suite}>{`${localize[lang].SUITE} ${testSuiteInfo.title}`}</div>}
                <div className={css.id}>{`${prefix}-${id}`}</div>
              </div>
              <Link
                to={`/test-case/${id}`}
                className={classnames([css.title, 'underline-link'])}
                onClick={e => {
                  e.preventDefault();
                  handleModalTestCaseEditing(id);
                }}
              >
                <h4>{title}</h4>
              </Link>
              {addToProject && (
                <Link
                  to={`/test-case/${id}`}
                  className={classnames([css.title, css.greenText, css.marginLeft, 'underline-link'])}
                  onClick={e => {
                    e.preventDefault();
                    addToProject(id);
                  }}
                >
                  <h4>{localize[lang].PROJECT}</h4>
                </Link>
              )}
              {removeFromProject && (
                <Link
                  to={`/test-case/${id}`}
                  className={classnames([css.title, css.redText, css.marginLeft, 'underline-link'])}
                  onClick={e => {
                    e.preventDefault();
                    removeFromProject(id);
                  }}
                >
                  <h4>{localize[lang].PROJECT_REMOVE}</h4>
                </Link>
              )}
            </div>
          </Col>
          <Col xs={12} sm={6}>
            {authorInfo && (
              <div className={css.metabox}>
                <p className={css.meta}>
                  <span className={css.metaKey}>{localize[lang].AUTHOR}</span>
                  <span>
                    {lang === 'ru'
                      ? authorInfo.fullNameRu || authorInfo.fullNameEn
                      : authorInfo.fullNameEn || authorInfo.fullNameRu}
                  </span>
                </p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
