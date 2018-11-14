import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";
//with filter에 두번쨰 파라미터에 페이로드 담김
//위치보고한 드라이버와 리스닝하고 있는 유저를 알고있음
//메시지에 채팅방 id가 있고 그게 user에 속한다면 true
//asyncIterator를 리턴
const resolvers = {
    Subscription: {
      DriversSubscription: {
        subscribe: withFilter(
          (_, __, { pubSub }) => pubSub.asyncIterator("driverUpdate"),
          (payload, _, { context }) => {
            const user: User = context.currentUser;
            const {
              DriversSubscription: {
                lastLat: driverLastLat,
                lastLng: driverLastLng
              }
            } = payload;
            const { lastLat: userLastLat, lastLng: userLastLng } = user;
            return (
              driverLastLat >= userLastLat - 0.05 &&
              driverLastLat <= userLastLat + 0.05 &&
              driverLastLng >= userLastLng - 0.05 &&
              driverLastLng <= userLastLng + 0.05
            );
          }
        )
      }
    }
  };
  export default resolvers;