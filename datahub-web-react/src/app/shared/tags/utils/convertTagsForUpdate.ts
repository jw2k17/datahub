import { TagAssociation, TagAssociationUpdate, EntityType } from '../../../../types.generated';

export function convertTagsForUpdate(tags: TagAssociation[]): TagAssociationUpdate[] {
    return tags.map((tag) => ({
        tag: { urn: tag.tag.urn, name: tag.tag.name, description: tag.tag.description, type: EntityType.Tag },
    }));
}
