import { useMemo } from 'react';
import * as QueryString from 'query-string';

import { FILTER_URL_PREFIX } from './constants';
import { FacetFilterInput, SearchCondition } from '../../../types.generated';
import { decodeComma } from '../../entity/shared/utils';

export default function useFilters(params: QueryString.ParsedQuery<string>): Array<FacetFilterInput> {
    return useMemo(() => {
        return (
            Object.entries(params)
                // select only the ones with the `filter_` prefix
                .filter(([key, _]) => key.indexOf(FILTER_URL_PREFIX) >= 0)
                // transform the filters currently in format [key, [value1, value2]] to [{key: key, value: value1}, { key: key, value: value2}] format that graphql expects
                .map(([key, value]) => {
                    // remove the `filter_` prefix
                    const fieldIndex = key.replace(FILTER_URL_PREFIX, '');
                    const fieldParts = fieldIndex.split('___');
                    const field = fieldParts[0];
                    const negated = fieldParts[1] === 'true';
                    if (!value) return null;

                    console.log({ negated, field });

                    if (Array.isArray(value)) {
                        return {
                            field,
                            condition: SearchCondition.Equal,
                            negated,
                            values: value.map((distinctValue) => decodeComma(distinctValue)),
                        };
                    }
                    return { field, condition: SearchCondition.Equal, values: [decodeComma(value)], negated };
                })
                .filter((val) => !!val) as Array<FacetFilterInput>
        );
    }, [params]);
}
