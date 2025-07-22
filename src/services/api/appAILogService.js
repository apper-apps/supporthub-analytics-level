import mockData from "@/services/mockData/appAILogs.json";

class AppAILogService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(200);
    const numericId = parseInt(id);
    return this.data.find(item => item.Id === numericId) || null;
  }

  async getByAppId(appId) {
    await this.delay(250);
    const numericAppId = parseInt(appId);
    return this.data.filter(log => log.AppId === numericAppId);
  }

  async create(item) {
    await this.delay(400);
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id)) + 1,
      CreatedAt: new Date().toISOString(),
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
    throw new Error("Log not found");
  }

  async delete(id) {
    await this.delay(300);
    const numericId = parseInt(id);
    const index = this.data.findIndex(item => item.Id === numericId);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Log not found");
  }

  async getByStatus(status) {
    await this.delay(250);
    return this.data.filter(log => log.ChatAnalysisStatus === status);
  }

  async getRecent(limit = 10) {
    await this.delay(200);
    return [...this.data]
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
      .slice(0, limit);
  }

  async getBySentimentRange(min, max) {
    await this.delay(250);
    return this.data.filter(log => log.SentimentScore >= min && log.SentimentScore <= max);
  }

  async getByFrustrationLevel(level) {
    await this.delay(250);
    return this.data.filter(log => log.FrustrationLevel === level);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppAILogService();