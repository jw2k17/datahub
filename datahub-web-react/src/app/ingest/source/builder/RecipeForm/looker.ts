import { RecipeField, FieldType, setListValuesOnRecipe } from './common';

export const LOOKER_BASE_URL: RecipeField = {
    name: 'base_url',
    label: 'Base URL',
    tooltip: 'The URL where your Looker instance is hosted.',
    type: FieldType.TEXT,
    fieldPath: 'source.config.base_url',
    placeholder: 'https://looker.company.com',
    required: true,
    rules: null,
};

export const LOOKER_CLIENT_ID: RecipeField = {
    name: 'client_id',
    label: 'Client ID',
    tooltip: 'Looker API Client ID.',
    type: FieldType.SECRET,
    fieldPath: 'source.config.client_id',
    placeholder: 'client_id',
    required: true,
    rules: null,
};

export const LOOKER_CLIENT_SECRET: RecipeField = {
    name: 'client_secret',
    label: 'Client Secret',
    tooltip: 'Looker API Client Secret.',
    type: FieldType.SECRET,
    fieldPath: 'source.config.client_secret',
    placeholder: 'client_secret',
    required: true,
    rules: null,
};

const chartAllowFieldPath = 'source.config.chart_pattern.allow';
export const CHART_ALLOW: RecipeField = {
    name: 'chart_pattern.allow',
    label: 'Allow Patterns',
    tooltip:
        'Inclua apenas gráficos específicos, fornecendo o ID numérico de um gráfico ou uma expressão regular (REGEX). Se não for fornecido, todos os gráficos serão incluídos.',
    type: FieldType.LIST,
    buttonLabel: 'Add pattern',
    fieldPath: chartAllowFieldPath,
    rules: null,
    section: 'Gráficos',
    placeholder: '12',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, chartAllowFieldPath),
};

const chartDenyFieldPath = 'source.config.chart_pattern.deny';
export const CHART_DENY: RecipeField = {
    name: 'chart_pattern.deny',
    label: 'Deny Patterns',
    tooltip:
        'Exclua gráficos específicos fornecendo o ID numérico de um gráfico ou uma expressão regular (REGEX). Se não for fornecido, todos os gráficos serão incluídos. Os padrões de negação sempre têm precedência sobre os padrões de permissão.',
    type: FieldType.LIST,
    buttonLabel: 'Add pattern',
    fieldPath: chartDenyFieldPath,
    rules: null,
    section: 'Gráficos',
    placeholder: '12',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, chartDenyFieldPath),
};

const dashboardAllowFieldPath = 'source.config.dashboard_pattern.allow';
export const DASHBOARD_ALLOW: RecipeField = {
    name: 'dashboard_pattern.allow',
    label: 'Permitir padrões',
    tooltip:
        'Inclua apenas painéis específicos, fornecendo o ID numérico de um painel ou uma expressão regular (REGEX). Se não for fornecido, todos os painéis serão incluídos.',
    type: FieldType.LIST,
    buttonLabel: 'Adicionar padrão',
    fieldPath: dashboardAllowFieldPath,
    rules: null,
    section: 'Painéis',
    placeholder: '1232',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, dashboardAllowFieldPath),
};

const dashboardDenyFieldPath = 'source.config.dashboard_pattern.deny';
export const DASHBOARD_DENY: RecipeField = {
    name: 'dashboard_pattern.deny',
    label: 'Negar padrões',
    tooltip:
        'Exclua painéis específicos fornecendo o ID numérico de um painel ou uma expressão regular (REGEX). Se não for fornecido, todos os painéis serão incluídos. Os padrões de negação sempre têm precedência sobre os padrões de permissão.',
    type: FieldType.LIST,
    buttonLabel: 'Adicionar padrão',
    fieldPath: dashboardDenyFieldPath,
    rules: null,
    section: 'Dashboards',
    placeholder: '1232',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, dashboardDenyFieldPath),
};