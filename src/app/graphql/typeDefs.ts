import {gql} from "apollo-server-express";

export const typeDefs = gql`

    type Permission {
        id: ID!
        name: String!
    }
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        permissions: [Permission]!
        currentToken: String
    }

    type Product {
        id: ID!
        name: String!
        model: String!
        buyer: String!
        sellPrice: Float!
        manufacturePrice: Float!
        weight: Float!
        assemblyLists: [AssemblyList]
    }

    type AssemblyList {
        id: ID
        name: String
        manufacturePrice: Float
        parts: [Part]
    }

    type Part {
        id: ID
        weight: Float
        height: Float
        width: Float
        length: Float
        thickness: Float

        price: Float

        material: Material
    }


    type PriceList {
        id: ID

        itemsCount: Int!
        description: String

        importDate: String!
        createdAt: String!

        creator: User
        priceItems: [PriceItem]
    }

    type PriceItem {
        id: ID
        pricePerMeter: Float!
        pricePerKilo: Float!

        priceList: PriceList
        material: Material
    }

    type Material {
        id: ID,

        type: String

        weight: Float
        height: Float
        width: Float
        length: Float
        thickness: Float

        pricePerMeter: Float
        pricePerKilo: Float

        priceItems: [PriceItem]
    }



    type Query {
        me: User

        getProduct(id:ID): Product
        getProducts(id:ID): [Product]


        getAssemblyList(id:ID, idnr:Int): AssemblyList
        getAssemblyLists(first: Int,offset: Int): [AssemblyList]


        getPriceList(id:ID): PriceList
        getPriceLists: [PriceList]


        getAllMaterials: [Material]
        getAllMaterialsWithoutPriceItem: [Material]
    }
    type Mutation {
        #AUTH
        register(email: String!, password: String!, firstName: String!, lastName: String!): Boolean!
        login(email: String!, password: String!): User
        logout: Boolean!
        addPermission(userEmail:String!, targetPermission: String!): Boolean!
        removePermission(userEmail:String!, targetPermission: String!): Boolean!

        #PRICE LIST
        parsePriceListXLSX(filename: String!): Boolean!

        #ASSEMBLY LIST
        parseAssemblyListXLSX(filename: String!): Boolean!


        exportProductPrices: String!

    }
`;
