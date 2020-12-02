import React, { FC } from "react";
import { Col, Row } from "react-flexbox-grid";
import Button from "~/components/Button";
import InlineHolder from "~/components/InlineHolder";
import Title from "~/components/Title";
import localize from '../testRuns.json'

type LoadingMockupProp = {
    lang: 'en' | 'ru',
}

const LoadingMockup: FC<LoadingMockupProp> = ({lang}) => {
    const local = localize[lang];

    return (
        <div>
            <Title render={localize[lang].TITLE} />
            <Row>
                <Col xs={2}>
                <Button
                    type="primary"
                    text={localize[lang].START_NEW_TEST_RUN}
                    icon="IconPlay"
                    name="right"
                    loading={true}
                />
                &nbsp;
                </Col>
                <Col xs={10}>
                    <InlineHolder length="60%" />
                </Col>
            </Row>

        </div>
    )

}

export default LoadingMockup;