import User from "../../../entities/User";
import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { req, pubSub }
      ): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);
        try {
          //이거는 이전에 레퍼런스한놈은 바뀌지 않고 디비가 바뀜
          //수정 요청만 보내고 기존에 놈이 있는지는 신겨안씀
          await User.update({ id: user.id }, { ...notNull });
          const updatedUser = await User.findOne({id: user.id});
          pubSub.publish("driverUpdate", { DriversSubscription: updatedUser });
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};
export default resolvers;