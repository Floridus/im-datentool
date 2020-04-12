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

export const getOceansCount = gql`
    query {
        oceansCount
    }
`;