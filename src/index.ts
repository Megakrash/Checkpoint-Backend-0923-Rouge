import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { CountriesResolver } from "./resolvers/Countries.resolvers";
import { dataSource } from "./datasource";
import { startStandaloneServer } from "@apollo/server/standalone";

async function start() {
  await dataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const schema = await buildSchema({
    resolvers: [CountriesResolver],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
  });

  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 5004 },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.error("Error starting the server", error);
  }
}

start();
