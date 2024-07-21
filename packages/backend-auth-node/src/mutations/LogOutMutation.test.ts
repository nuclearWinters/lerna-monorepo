import { main } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { UserMongo } from "../types";
import { createClient, RedisClientType } from "redis";
import TestAgent from "supertest/lib/agent";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { AccountClient } from "@lerna-monorepo/grpc-fintech-node";
import { jwt } from "../utils";
import { parse, serialize } from "cookie";

describe("LogOutMutation tests", () => {
    let client: MongoClient;
    let dbInstance: Db;
    let request: TestAgent<supertest.Test>;
    let grpcClient: AccountClient;
    let redisClient: RedisClientType;
    let startedRedisContainer: StartedRedisContainer;

    beforeAll(async () => {
        client = await MongoClient.connect(
            (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
            {}
        );
        dbInstance = client.db(
            (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
        );
        startedRedisContainer = await new RedisContainer().start();
        redisClient = createClient({
            url: startedRedisContainer.getConnectionUrl(),
        });
        await redisClient.connect();
        const server = await main(dbInstance, redisClient, grpcClient);
        request = supertest(server, { http2: true });
    });

    afterAll(async () => {
        await redisClient.disconnect();
        await startedRedisContainer.stop();
        await client.close();
    });

    it("LogOutMutation: user has refresh token and access token", async () => {
        const users = dbInstance.collection<UserMongo>("users");
        const _id = new ObjectId();
        const id = crypto.randomUUID();
        await users.insertOne({
            _id,
            email: "armandocorrect@hotmail.com",
            password: bcrypt.hashSync("correct", 12),
            isLender: true,
            isBorrower: false,
            isSupport: false,
            language: "en",
            mobile: "",
            name: "",
            CURP: "",
            RFC: "",
            apellidoMaterno: "",
            apellidoPaterno: "",
            clabe: "",
            id,
        });
        const refreshTokenExpireTime = new Date().getTime() / 1000 + 900;
        const accessTokenExpireTime = new Date().getTime() / 1000 + 180;
        const refreshToken = jwt.sign(
            {
                id,
                isBorrower: false,
                isLender: true,
                isSupport: false,
                refreshTokenExpireTime,
                exp: refreshTokenExpireTime,
            },
            "REFRESHSECRET",
        );
        const accessToken = jwt.sign(
            {
                id,
                isBorrower: false,
                isLender: true,
                isSupport: false,
                refreshTokenExpireTime,
                exp: accessTokenExpireTime,
            },
            "ACCESSSECRET",
        );
        const requestCookies = serialize("refreshToken", refreshToken);
        const response = await request
            .post("/graphql")
            .trustLocalhost()
            .send({
                extensions: {
                    doc_id: "62f48d6f993235723f255966785c11c1"
                },
                query: "",
                variables: {
                    input: {},
                },
                operationName: "logOutMutation",
            })
            .set("Accept", "text/event-stream")
            .set("Authorization", accessToken)
            .set("Cookie", requestCookies);
        const stream = response.text.split("\n");
        const data = JSON.parse(stream[3].replace("data: ", ""));
        expect(data.data.logOut.error).toBeFalsy();
        const responseCookies = response.headers["set-cookie"][0]
        expect(responseCookies).toBeTruthy();
        const parsedCookies = parse(responseCookies)
        expect(parsedCookies.refreshToken).toBe("");
        const authorization = response.headers["authorization"]
        expect(authorization).toBeFalsy();
    });
});
