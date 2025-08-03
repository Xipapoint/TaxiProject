import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClients1754210043512 implements MigrationInterface {
    name = 'CreateClients1754210043512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("clientId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_59c1e5e51addd6ebebf76230b3" UNIQUE ("userId"), CONSTRAINT "PK_c8526f623c0beed53b60cb31bf5" PRIMARY KEY ("clientId"))`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_59c1e5e51addd6ebebf76230b37" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_59c1e5e51addd6ebebf76230b37"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
