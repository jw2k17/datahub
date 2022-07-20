import { Button, Checkbox, Dropdown, Form, Input, Menu, Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components/macro';
import { CaretDownOutlined, MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FieldType, RecipeField } from './utils';
import { ANTD_GRAY } from '../../../../entity/shared/constants';

const Label = styled.div`
    font-weight: bold;
    padding-bottom: 8px;
`;

const StyledButton = styled(Button)`
    color: ${ANTD_GRAY[7]};
    width: 80%;
`;

const StyledQuestion = styled(QuestionCircleOutlined)`
    color: rgba(0, 0, 0, 0.45);
    margin-left: 4px;
`;

const StyledRemoveIcon = styled(MinusCircleOutlined)`
    font-size: 14px;
    margin-left: 10px;
`;

const StyledFormItem = styled(Form.Item)<{ alignLeft: boolean; removeMargin: boolean }>`
    margin-bottom: ${(props) => (props.removeMargin ? '0' : '16px')};

    ${(props) =>
        props.alignLeft &&
        `
        .ant-form-item {
            flex-direction: row;

        }

        .ant-form-item-label {
            padding: 0;
            margin-right: 10px;
        }
    `}
`;

const ListWrapper = styled.div<{ removeMargin: boolean }>`
    margin-bottom: ${(props) => (props.removeMargin ? '0' : '16px')};
`;

const DropdownWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

interface ListFieldProps {
    field: RecipeField;
    removeMargin?: boolean;
}

interface DropdownProps {
    field: RecipeField;
    removeMargin?: boolean;
}

function ListField({ field, removeMargin }: ListFieldProps) {
    return (
        <Form.List name={field.name}>
            {(fields, { add, remove }) => (
                <ListWrapper removeMargin={!!removeMargin}>
                    <Label>
                        {field.label}
                        <Tooltip overlay={field.tooltip}>
                            <StyledQuestion />
                        </Tooltip>
                    </Label>
                    {fields.map((item) => (
                        <Form.Item key={item.fieldKey} style={{ marginBottom: '10px' }}>
                            <Form.Item {...item} noStyle>
                                <Input style={{ width: '80%' }} />
                            </Form.Item>
                            <StyledRemoveIcon onClick={() => remove(item.name)} />
                        </Form.Item>
                    ))}
                    <StyledButton type="dashed" onClick={() => add()} style={{ width: '80%' }} icon={<PlusOutlined />}>
                        Add pattern
                    </StyledButton>
                </ListWrapper>
            )}
        </Form.List>
    );
}

function DropdownField({ field, removeMargin }: DropdownProps) {
    console.log('field', field, removeMargin);
    return (
        <Form.Item name={field.name}>
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item key="0">stl_scan_based</Menu.Item>
                        <Menu.Item key="1">sql_based</Menu.Item>
                        <Menu.Item key="1">mixed</Menu.Item>
                    </Menu>
                }
                trigger={['click']}
            >
                <DropdownWrapper>
                    <CaretDownOutlined />
                </DropdownWrapper>
            </Dropdown>
        </Form.Item>
    );
}

interface Props {
    field: RecipeField;
    removeMargin?: boolean;
}

function FormField(props: Props) {
    const { field, removeMargin } = props;

    if (field.type === FieldType.LIST) return <ListField field={field} removeMargin={removeMargin} />;

    if (field.type === FieldType.SELECT) return <DropdownField field={field} removeMargin={removeMargin} />;

    const isBoolean = field.type === FieldType.BOOLEAN;
    const input = isBoolean ? <Checkbox /> : <Input />;
    const valuePropName = isBoolean ? 'checked' : 'value';
    const getValueFromEvent = isBoolean ? undefined : (e) => (e.target.value === '' ? null : e.target.value);

    return (
        <StyledFormItem
            style={isBoolean ? { flexDirection: 'row', alignItems: 'center' } : {}}
            label={field.label}
            name={field.name}
            tooltip={field.tooltip}
            rules={field.rules || undefined}
            valuePropName={valuePropName}
            getValueFromEvent={getValueFromEvent}
            alignLeft={isBoolean}
            removeMargin={!!removeMargin}
        >
            {input}
        </StyledFormItem>
    );
}

export default FormField;
