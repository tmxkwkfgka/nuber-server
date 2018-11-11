import User from "../../../entities/User";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import cleanNullArgs from "../../../utils/cleanNullArg";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (_, args: UpdateMyProfileMutationArgs, { req }): Promise<UpdateMyProfileResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);
        try{
          //만약 일치하는 id없으면 user instance 요청 안함
          if(args.password !== null){
            user.password = args.password;
            user.save();
            //save가 user update하는데 씀
          }
          await User.update({ id: user.id }, { ...notNull });
          return {
            ok: true,
            error: null
          }
        }catch(error){
          return {
            ok:false,
            error: error.message,


          }
        }
        
      }
    )
  }
};
export default resolvers;