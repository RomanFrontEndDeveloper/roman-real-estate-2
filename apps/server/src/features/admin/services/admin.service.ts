import * as adminRepository from "../repository/admin.repository.js";

export const deletePropertyByAdmin = async (id: string) => {
  return adminRepository.deletePropertyByAdmin(id);
};

