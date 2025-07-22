import mockData from "@/services/mockData/apps.json";

class AppService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await this.delay(350);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(200);
    const numericId = parseInt(id);
    return this.data.find(item => item.Id === numericId) || null;
  }

  async create(item) {
    await this.delay(450);
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id)) + 1,
      CreatedAt: new Date().toISOString(),
      LastMessageAt: new Date().toISOString(),
      LastAIScanDate: new Date().toISOString(),
      TotalMessages: 0,
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  async update(id, data) {
    await this.delay(300);
    const numericId = parseInt(id);
    const index = this.data.findIndex(item => item.Id === numericId);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return { ...this.data[index] };
    }
    throw new Error("App not found");
  }

  async delete(id) {
    await this.delay(300);
    const numericId = parseInt(id);
    const index = this.data.findIndex(item => item.Id === numericId);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("App not found");
  }

  async getByCategory(category) {
    await this.delay(250);
    return this.data.filter(app => app.AppCategory.toLowerCase() === category.toLowerCase());
  }

  async getByStatus(status) {
    await this.delay(250);
    return this.data.filter(app => app.LastChatAnalysisStatus === status);
  }

  async searchByName(query) {
    await this.delay(250);
    return this.data.filter(app => 
      app.AppName.toLowerCase().includes(query.toLowerCase()) ||
      app.AppCategory.toLowerCase().includes(query.toLowerCase())
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppService();