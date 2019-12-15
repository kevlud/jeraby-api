import express from "express";
import multer from "multer";
import "reflect-metadata";
import "dotenv/config";
import {ApolloServer} from "apollo-server-express";
import session from "express-session";
import {typeDefs} from "./app/graphql/typeDefs";
import {createConnection} from "typeorm";
import UserRepository from "./database/repository/user/UserRepository";
import PermissionRepository from "./database/repository/user/PermissionRepository";
import GraphQLResolver from "./app/graphql/GraphQLResolver";
import AuthService from "./core/service/AuthService";
import DIContainer from "./utils/DIContainer";
import {IProductRepository} from "./core/data/IProductRepository";
import {PopulateDatabase} from "./database/PopulateDatabase";
import cors = require("cors");


const upload = multer({dest: 'uploads/'});

function loggerMiddleware(request: express.Request, response: express.Response, next: any) {
    console.log(request.headers);
    next();
}


const startServer = async () => {
    const databaseConnection = await createConnection();
    console.log("Connected to persistent storage");


    const userRepository: UserRepository = DIContainer.get<UserRepository>("IUserRepository");
    const permissionRepository: PermissionRepository = DIContainer.get<PermissionRepository>("IPermissionRepository");
    const productRepository = DIContainer.get<IProductRepository>("IProductRepository");
    console.log("Inicialized repositories");


    //const priceListService: PriceListService = new PriceListService(priceListRepository, materialRepository, priceItemRepository, typeRepository, qualityRepository, authService);
    //const assemblyListService: AssemblyListService = new AssemblyListService(productRepository, assemblyListRepository, partRepository, purchasedItemRepository, subassemblyItemRespository, materialRepository, typeRepository, qualityRepository, authService);
    //const authService: AuthService = new AuthService(userRepository, permissionRepository, tokenRepository);
    const authService = DIContainer.resolve<AuthService>(AuthService);


    console.log("Inicialized application services");


    //const graphQLResolver = new GraphQLResolver(permissionRepository, userRepository, authService, materialRepository);
    const graphQLResolver = DIContainer.resolve<GraphQLResolver>(GraphQLResolver);


    const corsOpt = {
        origin: "http://localhost:4200",
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        //exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }


    const app = express();

    app.use(
        session({
            secret: "Motor Lučina spol. s.r.o exportér roku 2012",
            resave: false,
            saveUninitialized: false
        })
    );

    app.use(cors(corsOpt))

    app.use(function (req: any, res: any, next: any) {
        //res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        //res.header('Access-Control-Allow-Credentials', 'true');
//
        next();

    });

    app.listen({port: 4001}, () =>
        console.log(`🚀 Server ready at http://localhost:4001/graphql`)
    );

    app.post('/uploadFile', upload.single('file'), async (req, res) => {
        console.log(req.file.path);
        if (req.file)
            res.status(200).send({filePath: req.file.path});
        else
            res.status(401).send("No file provided")
    });

    app.get('/downloadProductPrices', function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const file = `${__dirname}/../uploads/exportProduktu.xlsx`;
        res.download(file); // Set disposition and send it.
    });


    let populateDatabase = DIContainer.resolve<PopulateDatabase>(PopulateDatabase);
    await populateDatabase.populate();

    //await userRepository.GetByEmail(admin.email)
    //console.log(userPermissions)

    //console.log(await permissionRepository.Find({name: 'ADMIN'}))


    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        typeDefs,
        resolvers: graphQLResolver.resolvers,
        context: ({req, res}: any) => ({req, res}),
    });

    server.applyMiddleware({
        app,
        cors: false
    }); //

};

startServer();
