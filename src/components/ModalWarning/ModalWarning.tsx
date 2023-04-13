import React from 'react';
import ReactModal from 'react-modal';
import Button from '../Button';
import localize from './ModalWarning.json';
import { connect } from 'react-redux';
import classes from './ModalWarning.module.scss';
import css from '../CreateTaskModal/CreateTaskModal.scss';

const ReactModalWarningStyles = {
    overlay: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
        overflow: 'auto',
        backgroundColor: 'rgba(43, 62, 80, 0.8)',
    },
    content: {
        position: 'relative',
        top: 'initial',
        bottom: 'initial',
        left: 'initial',
        right: 'initial',
        boxSizing: 'border-box',
        border: 'none',
        background: 'white',
        overflow: 'visible',
        WebkitOverflowScrolling: 'touch',
        outline: 'none',
        padding: 0,
        maxWidth: '100%',
        maxHeight: '100%',
        fontSize: '15px',
        width: '400px',
        height: 'auto',
        borderRadius: '0px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center'
    }
};

const ModalWarning = props => {
    const { isOpen, onRequestClose, closeModalWarning, lang } = props;
    return (
        <ReactModal isOpen={isOpen}
            style={ReactModalWarningStyles}
        >
            <div className={classes.modalWarningTextContainer}>
                <div>{localize[lang].INFO_TEXT.split('*')[0]}</div>
                <div>{localize[lang].INFO_TEXT.split('*')[1]}</div>
            </div>
            <div className={css.buttonsContainer}>
                <Button
                    text={localize[lang].CLOSE_MODAL}
                    type="green"
                    htmlType="submit"
                    onClick={onRequestClose}
                />
                <Button
                    text={localize[lang].CONTINUE}
                    type="primary"
                    htmlType="submit"
                    onClick={closeModalWarning}
                />
            </div>
        </ ReactModal >
    );
};

const mapStateToProps = state => ({
    lang: state.Localize.lang
});

export default connect(
    mapStateToProps
)(ModalWarning);
