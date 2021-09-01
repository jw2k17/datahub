import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { BankOutlined, BarChartOutlined } from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import { useGetAuthenticatedUser } from './useGetAuthenticatedUser';
import { useAppConfig } from './useAppConfig';

/**
 * Container for all views behind an authentication wall.
 */
export const AdminConsole = (): JSX.Element => {
    const me = useGetAuthenticatedUser();

    const [adminConsoleOpen, setAdminConsoleOpen] = useState(false);
    const { config } = useAppConfig();

    const isAnalyticsEnabled = config?.analyticsConfig.enabled;
    const isPoliciesEnabled = config?.policiesConfig.enabled;

    const showAnalytics = (isAnalyticsEnabled && me && me.platformPrivileges.viewAnalytics) || false;
    const showPolicyBuilder = (isPoliciesEnabled && me && me.platformPrivileges.managePolicies) || false;
    const showAdminConsole = showAnalytics || showPolicyBuilder;

    const onMenuItemClick = () => {
        setAdminConsoleOpen(false);
    };

    const onCollapse = (collapsed) => {
        if (collapsed) {
            setAdminConsoleOpen(false);
        } else {
            setAdminConsoleOpen(true);
        }
    };

    return (
        <>
            {showAdminConsole && (
                <Sider
                    zeroWidthTriggerStyle={{ top: '20%' }}
                    collapsible
                    collapsed={!adminConsoleOpen}
                    onCollapse={onCollapse}
                    collapsedWidth="0"
                    style={{
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        backgroundColor: 'white',
                        zIndex: 10000000,
                    }}
                >
                    <Menu
                        selectable={false}
                        mode="inline"
                        theme="dark"
                        style={{ paddingTop: 28, height: '100%' }}
                        onSelect={onMenuItemClick}
                    >
                        <br />
                        <br />
                        {showAnalytics && (
                            <Menu.Item key="analytics" icon={<BarChartOutlined />}>
                                <Link onClick={onMenuItemClick} to="/analytics">
                                    Analytics
                                </Link>
                            </Menu.Item>
                        )}
                        {showPolicyBuilder && (
                            <Menu.Item key="policies" icon={<BankOutlined />}>
                                <Link onClick={onMenuItemClick} to="/policies">
                                    Policies
                                </Link>
                            </Menu.Item>
                        )}
                    </Menu>
                </Sider>
            )}
        </>
    );
};
