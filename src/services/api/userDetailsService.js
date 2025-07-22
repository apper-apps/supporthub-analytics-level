import mockData from "@/services/mockData/userDetails.json";

class UserDetailsService {
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

  async create(item) {
    await this.delay(400);
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id)) + 1,
      PlatformSignupDate: new Date().toISOString(),
      ApperSignupDate: new Date().toISOString(),
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
    throw new Error("User not found");
  }

  async delete(id) {
    await this.delay(300);
    const numericId = parseInt(id);
    const index = this.data.findIndex(item => item.Id === numericId);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("User not found");
  }

  async searchByName(query) {
    await this.delay(250);
    return this.data.filter(user => 
      user.Name.toLowerCase().includes(query.toLowerCase()) ||
      user.Email.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getByPlan(plan) {
    await this.delay(250);
    return this.data.filter(user => user.Plan.toLowerCase() === plan.toLowerCase());
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new UserDetailsService();