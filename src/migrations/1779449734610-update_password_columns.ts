import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePasswordColumns1779449734610 implements MigrationInterface {
    name = 'UpdatePasswordColumns1779449734610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "passwordHash" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "password" TO "passwordHash"`);
    }

}
