import User from "../../auth/models/User.js";
import Property from "../../property/models/Property.js";

export const updateUserAvatar = async (
  userId: string,
  avatar: {
    url: string;
    publicId: string;
  },
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserEmail = async (userId: string, email: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      email,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserPassword = async (userId: string, password: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      password,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserProfile = async (
  userId: string,
  data: {
    name: string;
    phone?: string;
    bio?: string;
  },
) => {
  return User.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
    runValidators: true,
  }).select("-password");
};

export const removeUserAvatar = async (userId: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        avatar: 1,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const findAgents = async () => {
  const agents = await User.find({
    role: "agent",
    isVerified: true,
  })
    .select("_id name email phone bio avatar")
    .lean();

  const agentsWithProperties = await Promise.all(
    agents.map(async (agent) => {
      const propertiesCount = await Property.countDocuments({
        owner: agent._id,
      });

      return {
        ...agent,
        propertiesCount,
      };
    }),
  );

  return agentsWithProperties;
};

export const findAgentById = async (agentId: string) => {
  const agent = await User.findOne({
    _id: agentId,
    role: "agent",
    isVerified: true,
  })
    .select("_id name email phone bio avatar")
    .lean();

  if (!agent) {
    return null;
  }

  const properties = await Property.find({
    owner: agent._id,
  })
    .select(
      "_id title description price currency listingType location latitude longitude propertyType bedrooms kitchenArea area owner mainImage images createdAt updatedAt",
    )
    .sort({ createdAt: -1 })
    .lean();

  return {
    agent,
    properties,
  };
};
