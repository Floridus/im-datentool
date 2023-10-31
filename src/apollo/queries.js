import gql from 'graphql-tag';

export const getIslands = gql`
    query ($pagination: Pagination, $sorting: Sorting, $world: Int) {
        islands(pagination: $pagination, sorting: $sorting, world: $world) {
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
    query ($pagination: Pagination, $sorting: Sorting, $world: Int) {
        alliances(pagination: $pagination, sorting: $sorting, world: $world) {
            id
            code
            name
            points
            islands
            alliancePointsIncreases {
                id
                pointsIncrease
                islandsIncrease
                dailyDate
            }
            world {
              id
              number
            }
        }
    }
`;

export const getPlayers = gql`
    query ($pagination: Pagination, $sorting: Sorting, $world: Int) {
        players(pagination: $pagination, sorting: $sorting, world: $world) {
            id
            name
            points
            islands {
                id
            }
            playerPointsIncreases {
                id
                pointsIncrease
                islandsIncrease
                dailyDate
            }
            alliance {
                id
                code
            }
        }
    }
`;

export const getAllianceChanges = gql`
    query ($pagination: Pagination, $sorting: Sorting, $world: Int) {
        allianceChanges(pagination: $pagination, sorting: $sorting, world: $world) {
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
    query ($pagination: Pagination, $sorting: Sorting, $world: Int) {
        islandChanges(pagination: $pagination, sorting: $sorting, world: $world) {
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
    query ($world: Int) {
        oceansCount(world: $world)
    }
`;

export const getPlayersCount = gql`
    query ($world: Int, $perPage: Int) {
        playersCount(world: $world, perPage: $perPage)
    }
`;