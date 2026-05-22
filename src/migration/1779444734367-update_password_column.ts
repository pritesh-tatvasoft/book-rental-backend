import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePasswordColumn1779444734367 implements MigrationInterface {
    name = 'UpdatePasswordColumn1779444734367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "passwordHash" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "password" TO "passwordHash"`);
    }

}
