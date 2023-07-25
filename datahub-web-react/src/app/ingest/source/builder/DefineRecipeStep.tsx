import React, { useEffect, useState } from 'react';
import { Alert, Button, message, Space, Typography } from 'antd';
import styled from 'styled-components';
import { StepProps } from './types';
import { getPlaceholderRecipe, getSourceConfigs, jsonToYaml } from '../utils';
import { YamlEditor } from './YamlEditor';
import { ANTD_GRAY } from '../../../entity/shared/constants';
import { IngestionSourceBuilderStep } from './steps';
import RecipeBuilder from './RecipeBuilder';
import { CONNECTORS_WITH_FORM } from './RecipeForm/constants';
import { getRecipeJson } from './RecipeForm/TestConnection/TestConnectionButton';

const LOOKML_DOC_LINK = 'https://datahubproject.io/docs/generated/ingestion/sources/looker#module-lookml';

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
`;

const BorderedSection = styled(Section)`
    border: solid ${ANTD_GRAY[4]} 0.5px;
`;

const SelectTemplateHeader = styled(Typography.Title)`
    && {
        margin-bottom: 8px;
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
`;

/**
 * The step for defining a recipe
 */
export const DefineRecipeStep = ({ state, updateState, goTo, prev, ingestionSources }: StepProps) => {
    const existingRecipeJson = state.config?.recipe;
    const existingRecipeYaml = existingRecipeJson && jsonToYaml(existingRecipeJson);
    const { type } = state;
    const sourceConfigs = getSourceConfigs(ingestionSources, type as string);
    const placeholderRecipe = getPlaceholderRecipe(ingestionSources, type);

    const [stagedRecipeYml, setStagedRecipeYml] = useState(existingRecipeYaml || placeholderRecipe);
    const [stagedRecipeName, setStagedRecipeName] = useState(state.name);

    useEffect(() => {
        if (existingRecipeYaml) {
            setStagedRecipeName(state.name);
            setStagedRecipeYml(existingRecipeYaml);
        }
    }, [existingRecipeYaml, state.name]);

    const [stepComplete, setStepComplete] = useState(false);

    const isEditing: boolean = prev === undefined;
    const displayRecipe = stagedRecipeYml || placeholderRecipe;
    const sourceDisplayName = sourceConfigs?.displayName;
    const sourceDocumentationUrl = sourceConfigs?.docsUrl;

    // TODO: Delete LookML banner specific code
    const isSourceLooker: boolean = sourceConfigs?.name === 'looker';
    const [showLookerBanner, setShowLookerBanner] = useState(isSourceLooker && !isEditing);

    useEffect(() => {
        if (stagedRecipeYml && stagedRecipeYml.length > 0 && !showLookerBanner) {
            setStepComplete(true);
        }
    }, [stagedRecipeYml, showLookerBanner]);

    const onClickNext = () => {
        const recipeJson = getRecipeJson(stagedRecipeYml);
        if (!recipeJson) return;

        if (!JSON.parse(recipeJson).source?.type) {
            message.warning({
                content: `Please add valid ingestion type`,
                duration: 3,
            });
            return;
        }

        const newState = {
            ...state,
            config: {
                ...state.config,
                recipe: recipeJson,
            },
            type: JSON.parse(recipeJson).source.type,
        };
        updateState(newState);

        goTo(IngestionSourceBuilderStep.CREATE_SCHEDULE);
    };

    if (type && CONNECTORS_WITH_FORM.has(type)) {
        return (
            <RecipeBuilder
                key={stagedRecipeName}
                state={state}
                isEditing={isEditing}
                displayRecipe={displayRecipe}
                sourceConfigs={sourceConfigs}
                setStagedRecipe={setStagedRecipeYml}
                onClickNext={onClickNext}
                goToPrevious={prev}
            />
        );
    }

    return (
        <>
            <Section>
                <SelectTemplateHeader level={5}>配置 {sourceDisplayName} 脚本</SelectTemplateHeader>
                {showLookerBanner && (
                    <Alert
                        type="warning"
                        banner
                        message={
                            <>
                                <big>
                                    <i>
                                        <b>You must acknowledge this message to proceed!</b>
                                    </i>
                                </big>
                                <br />
                                <br />
                                To get complete Looker metadata integration (including Looker views and lineage to the
                                underlying warehouse tables), you must <b>also</b> use the{' '}
                                <a href={LOOKML_DOC_LINK} target="_blank" rel="noopener noreferrer">
                                    DataHub lookml module
                                </a>
                                .
                                <br />
                                <br />
                                LookML ingestion <b>cannot</b> currently be performed via UI-based ingestion. This is a
                                known problem the DataHub team is working to solve!
                                <br />
                                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Button type="ghost" size="small" onClick={() => setShowLookerBanner(false)}>
                                        I have set up LookML ingestion!
                                    </Button>
                                </Space>
                            </>
                        }
                        afterClose={() => setShowLookerBanner(false)}
                    />
                )}
                <Typography.Text>
                    {showLookerBanner && <br />}
                    For more information about how to configure a recipe, see the{' '}
                    <a href={sourceDocumentationUrl} target="_blank" rel="noopener noreferrer">
                        {sourceDisplayName} source docs.
                    </a>
                </Typography.Text>
            </Section>
            <BorderedSection>
                <YamlEditor initialText={displayRecipe} onChange={setStagedRecipeYml} />
            </BorderedSection>
            <ControlsContainer>
                <Button disabled={isEditing} onClick={prev}>
                    上一步
                </Button>
                <Button disabled={!stepComplete} onClick={onClickNext}>
                    下一步
                </Button>
            </ControlsContainer>
        </>
    );
};
