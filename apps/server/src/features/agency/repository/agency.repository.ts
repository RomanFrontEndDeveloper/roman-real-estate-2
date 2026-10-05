import Agency from "../models/AgencyModel.js";
import AgencyMember from "../models/AgencyMemberModel.js";

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
  const agencies = await Agency.find()
    .populate("owner", "name email phone bio avatar")
    .sort({ createdAt: -1 })
    .lean();

  const agenciesWithAgentCount = await Promise.all(
    agencies.map(async (agency) => {
      const agentsCount = await AgencyMember.countDocuments({
        agency: agency._id,
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
    .populate("owner", "name email phone bio avatar")
    .lean();

  if (!agency) {
    return null;
  }

  const members = await AgencyMember.find({
    agency: agency._id,
  })
    .populate("agent", "_id name email phone bio avatar")
    .lean();

  return {
    ...agency,
    members,
  };
};
