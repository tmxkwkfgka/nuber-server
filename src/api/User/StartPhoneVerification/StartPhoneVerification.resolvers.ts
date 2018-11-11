import Verification from "../../../entities/Verification";
import {
  StartPhoneVerificationMutationArgs,
  StartPhoneVerificationResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { sendVerificationSMS } from "../../../utils/sendSMS";

const resolvers: Resolvers = {
  Mutation: {
    StartPhoneVerification: async (
      _,
      args: StartPhoneVerificationMutationArgs
    ): Promise<StartPhoneVerificationResponse> => {
      console.log("start!!")
      const { phoneNumber } = args;
      try {
        const existingVerification = await Verification.findOne({
          payload: phoneNumber
        });
        if (existingVerification) {
          existingVerification.remove();
        }
        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: "PHONE"
        }).save();
        try{
          await sendVerificationSMS(newVerification.payload, newVerification.key);
        }catch(err){
          return {
            ok: false,
            error: err.message
          };

        }
        
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
  }
};

export default resolvers;