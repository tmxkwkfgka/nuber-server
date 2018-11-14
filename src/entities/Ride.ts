import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm"
import { rideStatus } from "../types/types";
import User from "./User";
import Chat from "./Chat";

@Entity()
class Ride extends BaseEntity{
    @PrimaryGeneratedColumn() id: number;
    @Column({
     type: "text",
     enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
     default: "REQUESTING"
   })
   status: rideStatus;
    @Column({ type: "text" })
   pickUpAddress: string;
    @Column({ type: "double precision", default: 0 })
    pickUpLat: number;
    @Column({ type: "double precision", default: 0 })
    pickUpLng: number;
    @Column({ type: "text" })
    dropOffAddress: string;
    @Column({ type: "double precision", default: 0 })
    dropOffLat: number;
    @Column({ type: "double precision", default: 0 })
    dropOffLng: number;
    @Column({ type: "double precision", default: 0 })
    price: number;
    @Column({ type: "text" })
    distance: string;
    @Column({ type: "text" })
    duration: string;
    //typeorm이 자동으로 데이터베이스 보지않고 id 반환
    @Column({ nullable: true })
    passengerId: number;
    @ManyToOne(type=>User, user=>user.ridesAsPassenger)
    passenger: User;
    //ride요청할때는 아직 드라이버가 할당된 상태가 아님
    @ManyToOne(type=>User, user=>user.ridesAsDriver, {nullable:true})
    driver: User;

    @Column({ nullable: true })
    driverId: number;
   //하나에 라이드는 하나에 챗에 속해야하는데 처음에는 없으니까 널에블 트루
    @OneToOne(tye=>Chat, chat=> chat.ride, {nullable:true})
    @JoinColumn()
    chat: Chat

    @Column({ nullable: true })
    chatId: number;

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;

}

export default Ride;