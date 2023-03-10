import React, { useContext } from 'react';
import { GenericEntityProperties } from './types';

export interface GlossaryEntityContextType {
    isInGlossaryContext: boolean;
    entityData: GenericEntityProperties | null;
    setEntityData: (entityData: GenericEntityProperties | null) => void;
    // Since we have glossary data in the profile and in the sidebar browser, we need to communicate to the
    // sidebar when to refetch for a given node or at the root level (if we're editing a term or node without a parent).
    // This will happen when you edit a name, move a term/group, create a new term/group, and delete a term/group
    urnsToUpdate: string[];
    setUrnsToUpdate: (updatdUrns: string[]) => void;
}

export const GlossaryEntityContext = React.createContext<GlossaryEntityContextType>({
    isInGlossaryContext: false,
    entityData: null,
    setEntityData: () => {},
    urnsToUpdate: [],
    setUrnsToUpdate: () => {},
});

export const useGlossaryEntityData = () => {
    const { isInGlossaryContext, entityData, setEntityData, urnsToUpdate, setUrnsToUpdate } =
        useContext(GlossaryEntityContext);
    return { isInGlossaryContext, entityData, setEntityData, urnsToUpdate, setUrnsToUpdate };
};
