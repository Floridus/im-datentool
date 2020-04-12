import gql from 'graphql-tag';

export const getIslands = gql`
    query ($pagination: Pagination) {
        islands(pagination: $pagination) {
            id
            number
            name
            points
            player {
                id
                name
                alliance {
                    id
                    code
                    name
                }
            }
            islandChanges {
                id
                island {
                  id
                  number
                }
                newOwner {
                    id
                    name
                    alliance {
                        id
                        code
                        name
                    }
                }
                oldOwner {
                    id
                    name
                    alliance {
                        id
                        code
                        name
                    }
                }
                createdAt
            }
        }
    }
`;

export const getAlliances = gql`
    query ($pagination: Pagination) {
        alliances(pagination: $pagination) {
            id
            code
            name
        }
    }
`;

export const getAllianceChanges = gql`
    query ($pagination: Pagination, $sorting: Sorting) {
        allianceChanges(pagination: $pagination, sorting: $sorting) {
            id
            player {
                id
                name
            }
            oldAlly {
                id
                code
                name
            }
            newAlly {
                id
                code
                name
            }
            createdAt
        }
    }
`;

export const getIslandChanges = gql`
    query ($pagination: Pagination, $sorting: Sorting) {
        islandChanges(pagination: $pagination, sorting: $sorting) {
            id
            island {
                id
                number
            }
            oldOwner {
                id
                name
                alliance {
                    id
                    code
                }
            }
            newOwner {
                id
                name
                alliance {
                    id
                    code
                }
            }
            createdAt
        }
    }
`;

export const getOceansCount = gql`
    query {
        oceansCount
    }
`;