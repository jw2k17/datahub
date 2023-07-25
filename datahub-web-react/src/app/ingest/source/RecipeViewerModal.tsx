import Editor from '@monaco-editor/react';
import { Button, Modal } from 'antd';
import React from 'react';
import styled from 'styled-components/macro';
import { jsonToYaml } from './utils';

const YamlWrapper = styled.div`
    padding: 24px;
`;

interface Props {
    recipe?: string;
    onCancel: () => void;
}

function RecipeViewerModal({ recipe, onCancel }: Props) {
    const formattedRecipe = recipe ? jsonToYaml(recipe) : '';

    return (
        <Modal
            visible
            onCancel={onCancel}
            width={800}
            title="查看接入脚本"
            footer={<Button onClick={onCancel}>完成</Button>}
        >
            <YamlWrapper>
                <Editor
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollbar: {
                            vertical: 'hidden',
                            horizontal: 'hidden',
                        },
                    }}
                    height="55vh"
                    defaultLanguage="yaml"
                    value={formattedRecipe}
                />
            </YamlWrapper>
        </Modal>
    );
}

export default RecipeViewerModal;
