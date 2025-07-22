import mockSalesComments from "@/services/mockData/salesComments.json";

class SalesCommentService {
  constructor() {
    this.data = [...mockSalesComments];
  }

  async getByAppId(appId) {
    await this.delay(250);
    const numericAppId = parseInt(appId);
    return this.data.filter(comment => comment.AppId === numericAppId);
  }

  async create(comment) {
    await this.delay(300);
    const newComment = {
      ...comment,
      Id: Math.max(...this.data.map(d => d.Id), 0) + 1,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };
    this.data.push(newComment);
    return { ...newComment };
  }

  async update(id, data) {
    await this.delay(300);
    const numericId = parseInt(id);
    const index = this.data.findIndex(comment => comment.Id === numericId);
    if (index !== -1) {
      this.data[index] = { 
        ...this.data[index], 
        ...data, 
        UpdatedAt: new Date().toISOString() 
      };
      return { ...this.data[index] };
    }
    throw new Error("Comment not found");
  }

  async delete(id) {
    await this.delay(250);
    const numericId = parseInt(id);
    const index = this.data.findIndex(comment => comment.Id === numericId);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Comment not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new SalesCommentService();