import * as adminRepository from "../repository/admin.repository.js";

export const deletePropertyByAdmin = async (id: string) => {
  return adminRepository.deletePropertyByAdmin(id);
};


export const getUsersForAdmin = async () => {
  return adminRepository.getUsersForAdmin();
};

export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean,
) => {
  if (userId.trim().length === 0) {
    throw new Error("User ID is required");
  }

  return adminRepository.updateUserBlockStatus(userId, isBlocked);
};
