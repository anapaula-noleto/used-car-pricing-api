import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "reports" })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;
}
