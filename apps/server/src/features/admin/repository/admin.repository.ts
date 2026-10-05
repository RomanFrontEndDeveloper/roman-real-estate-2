import Property from "../../property/models/Property.js";

export const deletePropertyByAdmin = async (id: string) => {
  return Property.findByIdAndDelete(id);
};