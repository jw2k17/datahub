import {MockedProvider} from '@apollo/client/testing';
import {render} from '@testing-library/react';
import React from 'react';
import {mocks} from '../../../../../Mocks';
import TestPageContainer from '../../../../../utils/test-utils/TestPageContainer';
import {Preview} from '../Preview';
import {PreviewType} from "../../../Entity";

describe('Preview', () => {
    it('renders', () => {
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <TestPageContainer>
                    <Preview
                        urn="urn:li:businessAttribute:ba1"
                        name="name"
                        description="definition"
                        owners={null}
                        previewType={PreviewType.PREVIEW}
                    />
                </TestPageContainer>
            </MockedProvider>,
        );
        expect(getByText('definition')).toBeInTheDocument();
    });
});
