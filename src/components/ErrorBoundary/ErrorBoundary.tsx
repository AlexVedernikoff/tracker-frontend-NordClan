import React, { Component, ErrorInfo } from 'react';
import { connect } from 'react-redux';
import { sendError } from '../../actions/ErrorsLog'

import Title from '../Title';
import css from './ErrorBoundary.scss';
import bg from '../../pages/Login/bg.jpg';
import localize from './ErrorBoundary.json';

class ErrorBoundary extends Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { sendError } = this.props;
        this.setState({
            hasError: true,
        });
        sendError({
            location: window.location.href,
            error: JSON.stringify({
                name: error.name ?? '',
                message: error?.message ?? '',
                stacktrace: error.stack ?? '',
            }),
            componentStack: errorInfo?.componentStack ?? '',
            state: JSON.stringify(this.props.state),
        })
    }

    render() {
        if (this.state.hasError) {
            const local = localize[this.props.lang];
            return (
                <div id="app error">
                    <div className={css.errorWrapper}  style={{ backgroundImage: `url(${bg})` }}>
                        <Title render={'[Epic] - ' + local.TITLE} />
                        <h1 className={css.errorTitle}>{local.TITLE}</h1>
                        <h2>{local.MESSAGE}</h2>
                    </div>
                </div>
            );

        }
        return this.props.children;
    }
}

const mapStateToProps = state => ({
    lang: state.Localize.lang,
    state
});

const mapDispatchToProps = {
    sendError
};


export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);