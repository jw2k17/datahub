import { Button, Collapse, Form, message } from 'antd';
import React from 'react';
import YAML from 'yamljs';
import styled from 'styled-components/macro';
import { jsonToYaml } from '../../utils';
import { RECIPE_FIELDS } from './constants';
import FormField from './FormField';

export const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
`;

const StyledCollapse = styled(Collapse)`
    margin-bottom: 24px;

    .ant-collapse-header {
        font-size: 14px;
        font-weight: bold;
        padding: 12px 0;
    }
`;

function getInitialValues(displayRecipe: string, allFields: any[]) {
    const initialValues = {};
    let recipeObj;
    try {
        recipeObj = YAML.parse(displayRecipe);
        console.log('recipeObj', recipeObj);
    } catch (e) {
        message.warn('Found invalid YAML. Please check your recipe configuration.');
        return {};
    }
    if (recipeObj) {
        allFields.forEach((field) => {
            initialValues[field.name] = field.getValueFromRecipe(recipeObj);
        });
    }

    return initialValues;
}

interface Props {
    type: string;
    isEditing: boolean;
    displayRecipe: string;
    setStagedRecipe: (recipe: string) => void;
    onClickNext: () => void;
    goToPrevious?: () => void;
}

function RecipeForm(props: Props) {
    const { type, isEditing, displayRecipe, setStagedRecipe, onClickNext, goToPrevious } = props;
    const { fields, advancedFields, filterFields } = RECIPE_FIELDS[type];
    const allFields = [...fields, ...advancedFields, ...filterFields];

    function updateFormValues(_changedValues: any, allValues: any) {
        let updatedValues = { source: { type } };
        allFields.forEach((field) => {
            updatedValues = field.setValueOnRecipe(updatedValues, allValues[field.name]);
        });
        const stagedRecipe = jsonToYaml(JSON.stringify(updatedValues));
        setStagedRecipe(stagedRecipe);
    }

    return (
        <Form
            layout="vertical"
            initialValues={getInitialValues(displayRecipe, allFields)}
            onFinish={onClickNext}
            onValuesChange={updateFormValues}
        >
            {fields.map((field) => (
                <FormField field={field} />
            ))}
            <StyledCollapse>
                <Collapse.Panel header="Filter" key="0">
                    {filterFields.map((field) => (
                        <FormField field={field} />
                    ))}
                </Collapse.Panel>
            </StyledCollapse>
            <StyledCollapse>
                <Collapse.Panel header="Advanced" key="1">
                    {advancedFields.map((field, i) => (
                        <FormField field={field} removeMargin={i === advancedFields.length - 1} />
                    ))}
                </Collapse.Panel>
            </StyledCollapse>
            <ControlsContainer>
                <Button disabled={isEditing} onClick={goToPrevious}>
                    Previous
                </Button>
                <Button htmlType="submit">Next</Button>
            </ControlsContainer>
        </Form>
    );
}

export default RecipeForm;
