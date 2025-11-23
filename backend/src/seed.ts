import "reflect-metadata";
import { DataSource } from "typeorm";
import { databaseConfig } from "./config/database.config";
import { runSeeder } from "./seeders/database.seeder";

async function bootstrap() {
  try {
    const dataSource = new DataSource({
      ...(databaseConfig as AnyType), // Type assertion to bypass type checking
      type: "postgres",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    });

    await dataSource.initialize();
    console.log("Database connection established");

    await runSeeder(dataSource);
    console.log("Seeding completed successfully");

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
}

bootstrap();
