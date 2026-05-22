import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableBooksCustomerRental1779439588914 implements MigrationInterface {
    name = 'CreateTableBooksCustomerRental1779439588914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "address" text, "profilePictureUrl" character varying, "role" "public"."customers_role_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying NOT NULL, "isbn" character varying NOT NULL, "availabilityCount" integer NOT NULL DEFAULT '0', "totalCount" integer NOT NULL DEFAULT '0', "description" text, "price" numeric(10,2) NOT NULL DEFAULT '0', "publicationDate" date, "imageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_54337dc30d9bb2c3fadebc69094" UNIQUE ("isbn"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_rentals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rentalDate" TIMESTAMP NOT NULL DEFAULT now(), "dueDate" TIMESTAMP NOT NULL, "returnDate" TIMESTAMP, "status" "public"."book_rentals_status_enum" NOT NULL DEFAULT 'ACTIVE', "lateFee" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" uuid NOT NULL, "book_id" uuid NOT NULL, CONSTRAINT "PK_03cad2f6c27bc56601a343e9213" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book_rentals" ADD CONSTRAINT "FK_e4dc91aa816c18a7e453997e806" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_rentals" ADD CONSTRAINT "FK_fb04ce708dea7d24adcf16dcd79" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_rentals" DROP CONSTRAINT "FK_fb04ce708dea7d24adcf16dcd79"`);
        await queryRunner.query(`ALTER TABLE "book_rentals" DROP CONSTRAINT "FK_e4dc91aa816c18a7e453997e806"`);
        await queryRunner.query(`DROP TABLE "book_rentals"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
