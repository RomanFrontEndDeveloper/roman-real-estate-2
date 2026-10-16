import Property from "../../property/models/Property.js";
import User from "../../auth/models/User.js";

export const deletePropertyByAdmin = async (id: string) => {
  return Property.findByIdAndDelete(id);
};

export const getUsersForAdmin = async () => {
  return User.find()
    .select("_id name email role isBlocked createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean,
) => {
  return User.findByIdAndUpdate(
    userId,
    { isBlocked },
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .select("_id name email role isBlocked")
    .lean();
};
