import bcrypt from "bcrypt"
import { IsEmail } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany
} from "typeorm";
import Chat from "./Chat";
import Message from "./Message";
import Place from './Place';
import Ride from "./Ride";




const BCRYPT_ROUND = 10;

 @Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
   @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;
   @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;
   @Column({ type: "text"})
  firstName: string;
   @Column({ type: "text" })
  lastName: string;
   @Column({ type: "int", nullable:true })
  age: number;
   @Column({ type: "text", nullable:true })
  password: string;
   @Column({ type: "text", nullable:true })
  phoneNumber: string;
   @Column({ type: "boolean", default: false })
   verifiedPhoneNumber: boolean;
   @Column({ type: "text" })
  profilePhoto: string;

  @Column({ type: "boolean", default: false })
  isDriving: boolean;
   @Column({ type: "boolean", default: false })
  isRiding: boolean;
   @Column({ type: "boolean", default: false })
  isTaken: boolean;
   @Column({ type: "double precision", default: 0 })
  lastLng: number;
   @Column({ type: "double precision", default: 0 })
  lastLat: number;
   @Column({ type: "double precision", default: 0 })
  lastOrientation: number;
//float 지원 안됌 테스트할떄 에러생겼다함
  @Column({ type: "text", nullable: true })
  fbId: string;
  

   @CreateDateColumn() createdAt: string;
   @UpdateDateColumn() updatedAt: string;

   @ManyToOne(type=>Chat, chat=>chat.participants)
   chat: Chat;

   @OneToMany(type=>Message, message=>message.user)
   messages: Message[]

   @OneToMany(type=>Place, place=>place.user)
   places: Place[]


   @OneToMany(type=>Ride, ride=>ride.passenger)
   ridesAsPassenger: Ride[]

   @OneToMany(type=>Ride, ride=>ride.driver)
   ridesAsDriver: Ride[]

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  public comparePassword(password: string): Promise<boolean>{
      return bcrypt.compare(password, this.password)
  }

  //이거 요청하려면 업데이트하기전에 user의 인스턴스가 있어야 한다.
  @BeforeInsert()
  @BeforeUpdate()
  async savePassword() : Promise<void>  {
      if(this.password){
        const hashedPassword = await this.hashPassword(this.password)
        this.password = hashedPassword
      }
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUND);
  }



}
 export default User;