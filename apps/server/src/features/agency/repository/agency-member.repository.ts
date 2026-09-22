import AgencyMember from "../models/AgencyMemberModel.js";

import Property from "../../property/models/Property.js";
import mongoose from "mongoose";

export const findMembership = async (agencyId: string, agentId: string) => {
  return AgencyMember.findOne({
    agency: agencyId,
    agent: agentId,
  }).lean();
};

export const createMembership = async (data: {
  agency: string;
  agent: string;
}) => {
  return AgencyMember.create({
    ...data,
    status: "pending",
  });
};

export const updateMembershipStatus = async (
  membershipId: string,
  status: "active" | "rejected",
) => {
  return AgencyMember.findByIdAndUpdate(
    membershipId,
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
};

export const findAgencyMembers = async (agencyId: string) => {
  const members = await AgencyMember.find({
    agency: agencyId,
    status: "active",
  })
    .populate("agent", "_id name email phone bio avatar role")
    .lean();

  const membersWithProperties = await Promise.all(
    members.map(async (member) => {
      const agent = member.agent as {
        _id: {
          toString(): string;
        };
      };

      const propertiesCount = await Property.countDocuments({
        owner: new mongoose.Types.ObjectId(agent._id.toString()),
      });

      return {
        ...member,
        propertiesCount,
      };
    }),
  );

  return membersWithProperties;
};

export const findIncomingRequests = async (agentId: string) => {
  return AgencyMember.find({
    agent: agentId,
    status: "pending",
  })
    .populate("agency", "name owner createdAt")
    .lean();
};

export const findOutgoingRequests = async (agencyId: string) => {
  return AgencyMember.find({
    agency: agencyId,
    status: "pending",
  })
    .populate("agent", "_id name email phone bio avatar role")
    .lean();
};

export const findMembershipById = async (membershipId: string) => {
  return AgencyMember.findById(membershipId).lean();
};

export const deleteMembership = async (agencyId: string, agentId: string) => {
  return AgencyMember.findOneAndDelete({
    agency: agencyId,
    agent: agentId,
    status: "active",
  }).lean();
};
