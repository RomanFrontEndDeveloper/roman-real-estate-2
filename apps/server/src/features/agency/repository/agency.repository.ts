import Agency from "../models/AgencyModel.js";
import AgencyMember from "../models/AgencyMemberModel.js";
import User from "../../auth/models/User.js";

export const createAgency = async (data: { name: string; owner: string }) => {
  return Agency.create(data);
};

export const findAgencyByOwner = async (owner: string) => {
  return Agency.findOne({
    owner,
  })
    .populate("owner", "name email phone bio avatar role")
    .lean();
};

export const updateAgencyByOwner = async (
  owner: string,
  data: {
    name?: string;
  },
) => {
  return Agency.findOneAndUpdate({ owner }, data, {
    new: true,
    runValidators: true,
  })
    .populate("owner", "name email phone bio avatar role")
    .lean();
};

export const findMyAgencyMembership = async (agentId: string) => {
  return AgencyMember.findOne({
    agent: agentId,
    status: "active",
  })
    .populate("agency", "_id name")
    .lean();
};

export const removeMyAgencyMembership = async (agentId: string) => {
  return AgencyMember.findOneAndDelete({
    agent: agentId,
  });
};

export const findAllAgencies = async () => {
  const blockedUsers = await User.find({
    isBlocked: true,
  })
    .select("_id")
    .lean();

  const blockedOwnerIds = blockedUsers.map((user) => user._id);

  const agencies = await Agency.find({
    owner: { $nin: blockedOwnerIds },
  })
    .populate("owner", "name email phone bio avatar")
    .sort({ createdAt: -1 })
    .lean();

  const agenciesWithAgentCount = await Promise.all(
    agencies.map(async (agency) => {
      const activeMembers = await AgencyMember.find({
        agency: agency._id,
        status: "active",
      })
        .select("agent")
        .lean();

      const agentIds = activeMembers.map((member) => member.agent);

      const agentsCount = await User.countDocuments({
        _id: { $in: agentIds },
        role: "agent",
        isBlocked: { $ne: true },
      });

      return {
        ...agency,
        agentsCount,
      };
    }),
  );

  return agenciesWithAgentCount;
};

export const findAgencyById = async (agencyId: string) => {
  const agency = await Agency.findById(agencyId)
    .populate({
      path: "owner",
      select: "name email phone bio avatar",
      match: { isBlocked: { $ne: true } },
    })
    .lean();

  console.log("Agency ID:", agencyId);
  console.log("Agency found:", Boolean(agency));
  console.log("Owner after populate:", agency?.owner);

  // Не показуємо публічно агенцію, якщо її власник заблокований.
  if (!agency || !agency.owner) {
    return null;
  }

  const members = await AgencyMember.find({
    agency: agency._id,
    status: "active",
  })
    .populate({
      path: "agent",
      select: "_id name email phone bio avatar",
      match: { isBlocked: { $ne: true } },
    })
    .lean();

  const activeMembers = members.filter((member) => member.agent !== null);

  return {
    ...agency,
    members: activeMembers,
  };
};
