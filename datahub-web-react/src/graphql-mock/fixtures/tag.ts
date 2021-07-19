import * as faker from 'faker';
import { EntityType, Ownership, OwnershipType, Tag, TagUpdate } from '../../types.generated';
import { getActor } from '../helper';
import { findUserByURN } from './searchResult/userSearchResult';

export const tagDb: Tag[] = [];

export const generateTag = (ownership?: Ownership): Tag => {
    const name = `${faker.company.bsNoun()}`;
    const description = `${faker.commerce.productDescription()}`;
    const tag: Tag = {
        urn: `urn:li:tag:${name}`,
        name,
        description,
        type: EntityType.Tag,
        ownership,
        __typename: 'Tag',
    };

    tagDb.push(tag);

    return tag;
};

export const createTag = ({ name, urn, description }: TagUpdate): Tag => {
    const user = findUserByURN(getActor());
    const tag: Tag = {
        urn,
        name,
        description,
        type: EntityType.Tag,
        ownership: {
            owners: [
                {
                    owner: user,
                    type: OwnershipType.Dataowner,
                    __typename: 'Owner',
                },
            ],
            lastModified: { time: Date.now(), __typename: 'AuditStamp' },
            __typename: 'Ownership',
        },
        __typename: 'Tag',
    };

    tagDb.push(tag);

    return tag;
};
