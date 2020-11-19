export default `
  type Document {
    _id: String
    isPublic: Boolean
    taskName: String
    createdAt: String
    updatedAt: String
    deadLine: String
    status: String
    remindingDate: String
    owner: String
    comments(sortBy: String): [Comment]
  }
`;
