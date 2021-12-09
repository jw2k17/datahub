import { Button, Form, Input, Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { SecretBuilderState } from './types';

type Props = {
    initialState?: SecretBuilderState;
    visible: boolean;
    onSubmit?: (source: SecretBuilderState) => void;
    onCancel?: () => void;
};

export const SecretBuilderModal = ({ initialState, visible, onSubmit, onCancel }: Props) => {
    const [secretBuilderState, setSecretBuilderState] = useState<SecretBuilderState>({});
    useEffect(() => {
        if (initialState) {
            setSecretBuilderState(initialState);
        }
    }, [initialState, setSecretBuilderState]);

    const setName = (name: string) => {
        setSecretBuilderState({
            ...secretBuilderState,
            name,
        });
    };

    const setValue = (value: string) => {
        setSecretBuilderState({
            ...secretBuilderState,
            value,
        });
    };

    const setDescription = (description: string) => {
        setSecretBuilderState({
            ...secretBuilderState,
            description,
        });
    };

    return (
        <Modal
            width={540}
            title={<Typography.Text>Create a new Secret</Typography.Text>}
            visible={visible}
            onCancel={onCancel}
            footer={
                <>
                    <Button onClick={onCancel} type="text">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onSubmit?.(secretBuilderState)}
                        disabled={
                            !secretBuilderState.name ||
                            secretBuilderState.name === '' ||
                            !secretBuilderState.value ||
                            secretBuilderState.value === ''
                        }
                    >
                        Create
                    </Button>
                </>
            }
        >
            <Form layout="vertical">
                <Form.Item name="name" label={<Typography.Text strong>Name</Typography.Text>}>
                    <Typography.Paragraph>
                        Give your secret a name. This is what you&apos;ll use to reference the secret from your recipes.
                    </Typography.Paragraph>
                    <Input
                        placeholder="A name for your secret"
                        value={secretBuilderState.name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Form.Item>
                <Form.Item name="value" label={<Typography.Text strong>Value</Typography.Text>}>
                    <Typography.Paragraph>
                        The value of your secret, which will be encrypted and stored securely within DataHub.
                    </Typography.Paragraph>
                    <Input
                        placeholder="The value of your secret"
                        value={secretBuilderState.value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </Form.Item>
                <Form.Item name="value" label={<Typography.Text strong>Description</Typography.Text>}>
                    <Typography.Paragraph>
                        An optional description to help keep track of your secret.
                    </Typography.Paragraph>
                    <Input
                        placeholder="The value of your secret"
                        value={secretBuilderState.description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
