import { Resolvers } from "../../../types/resolvers";
import { EmailSignInMutationArgs, EmailSignInResponse } from "src/types/graph";
import User from "src/entities/User";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignIn: async(_, args:EmailSignInMutationArgs): Promise<EmailSignInResponse>=>{
            const {email, password} = args;
            try{
                const user = await User.findOne({email})
                if(!user){
                    return{
                        ok:false,
                        error:"No User Found with that email",
                        token:null
                    }
                }
                const checkPassword = await user.comparePassword(password);
                if(checkPassword){
                    return {
                        ok:true,
                        error: null,
                        token:"Comming soon"
                    }
                }else{
                    return {
                        ok:false,
                        error: "Wrong pasword",
                        token:null
                    }

                }

            }catch(error){
                return{
                    ok:false,
                    error:error.message,
                    token:null
                }
            }
        }
    }
}

export default resolvers;