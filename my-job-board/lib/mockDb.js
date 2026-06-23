// lib/mockDb.js
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data", "db.json");

// Helper to generate a 24-character hexadecimal string similar to Mongoose ObjectIds
function generateObjectId() {
  const chars = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * 16)];
  }
  return id;
}

// Helper to read database
function readDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], jobs: [], applications: [] }, null, 2));
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (e) {
    console.error("Error reading mock DB:", e);
    return { users: [], jobs: [], applications: [] };
  }
}

// Helper to write database
function writeDb(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error writing mock DB:", e);
  }
}

class MockQuery {
  constructor(data, modelName) {
    this.data = data;
    this.modelName = modelName;
    this._sortField = null;
    this._sortOrder = -1;
    this._limit = null;
    this._populateField = null;
  }

  sort(sortObj) {
    if (sortObj && typeof sortObj === "object") {
      const keys = Object.keys(sortObj);
      if (keys.length > 0) {
        this._sortField = keys[0];
        this._sortOrder = sortObj[keys[0]];
      }
    } else if (typeof sortObj === "string") {
      if (sortObj.startsWith("-")) {
        this._sortField = sortObj.substring(1);
        this._sortOrder = -1;
      } else {
        this._sortField = sortObj;
        this._sortOrder = 1;
      }
    }
    return this;
  }

  limit(num) {
    this._limit = num;
    return this;
  }

  populate(field) {
    this._populateField = field;
    return this;
  }

  execute() {
    let result = [...this.data];

    // Sort
    if (this._sortField) {
      result.sort((a, b) => {
        let valA = a[this._sortField];
        let valB = b[this._sortField];
        
        // Handle dates
        const timeA = valA instanceof Date ? valA.getTime() : Date.parse(valA);
        const timeB = valB instanceof Date ? valB.getTime() : Date.parse(valB);
        if (!isNaN(timeA) && !isNaN(timeB)) {
          valA = timeA;
          valB = timeB;
        }
        
        if (valA < valB) return -1 * this._sortOrder;
        if (valA > valB) return 1 * this._sortOrder;
        return 0;
      });
    }

    // Limit
    if (this._limit !== null) {
      result = result.slice(0, this._limit);
    }

    // Populate
    if (this._populateField) {
      const db = readDb();
      if (this._populateField === "jobId") {
        result = result.map(item => {
          const jobIdStr = item.jobId ? String(item.jobId._id || item.jobId) : "";
          const job = db.jobs.find(j => String(j._id) === jobIdStr || String(j.id) === jobIdStr);
          return {
            ...item,
            jobId: job ? { ...job } : item.jobId
          };
        });
      }
    }

    return result;
  }

  // Thenable interface so await works directly on find()
  then(resolve, reject) {
    try {
      resolve(this.execute());
    } catch (e) {
      if (reject) reject(e);
    }
  }
}

class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  getCollection() {
    const db = readDb();
    return db[this.collectionName] || [];
  }

  saveCollection(items) {
    const db = readDb();
    db[this.collectionName] = items;
    writeDb(db);
  }

  find(query = {}) {
    let items = this.getCollection();
    
    if (query && Object.keys(query).length > 0) {
      items = items.filter(item => {
        for (const key of Object.keys(query)) {
          const queryVal = query[key];
          
          if (queryVal && typeof queryVal === "object" && "$in" in queryVal) {
            const list = queryVal["$in"].map(String);
            const itemVal = item[key] ? String(item[key]._id || item[key]) : "";
            if (!list.includes(itemVal)) {
              return false;
            }
          } else {
            const itemVal = item[key] && typeof item[key] === "object" ? String(item[key]._id || item[key]) : String(item[key]);
            if (itemVal !== String(queryVal)) {
              return false;
            }
          }
        }
        return true;
      });
    }

    return new MockQuery(items, this.collectionName);
  }

  async findOne(query = {}) {
    const queryHelper = this.find(query);
    const results = queryHelper.execute();
    return results[0] || null;
  }

  async findById(id) {
    const items = this.getCollection();
    const idStr = String(id);
    const item = items.find(i => String(i._id) === idStr || String(i.id) === idStr);
    return item || null;
  }

  async create(data) {
    const items = this.getCollection();
    const newItems = Array.isArray(data) ? data : [data];
    const createdItems = [];

    for (const item of newItems) {
      const newId = item._id || item.id || generateObjectId();
      const newItem = {
        id: newId,
        _id: newId,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        ...item
      };
      items.push(newItem);
      createdItems.push(newItem);
    }

    this.saveCollection(items);
    return Array.isArray(data) ? createdItems : createdItems[0];
  }

  async countDocuments(query = {}) {
    const queryHelper = this.find(query);
    return queryHelper.execute().length;
  }

  async deleteMany(query = {}) {
    if (!query || Object.keys(query).length === 0) {
      this.saveCollection([]);
      return { deletedCount: 0 };
    }
    
    let items = this.getCollection();
    const originalCount = items.length;
    
    items = items.filter(item => {
      for (const key of Object.keys(query)) {
        if (String(item[key]) === String(query[key])) {
          return false;
        }
      }
      return true;
    });

    this.saveCollection(items);
    return { deletedCount: originalCount - items.length };
  }

  async insertMany(itemsList) {
    return this.create(itemsList);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this.getCollection();
    const idStr = String(id);
    const idx = items.findIndex(i => String(i._id) === idStr || String(i.id) === idStr);
    if (idx === -1) return null;

    const setFields = update.$set || update;
    items[idx] = {
      ...items[idx],
      ...setFields,
      updatedAt: new Date().toISOString()
    };

    this.saveCollection(items);
    return items[idx];
  }
}

export function getModel(name, RealModel) {
  const collectionName = name.toLowerCase() + "s";
  
  return new Proxy(RealModel, {
    get(target, prop, receiver) {
      if (global.useMockDb) {
        if (!global.mockModels) {
          global.mockModels = {};
        }
        if (!global.mockModels[name]) {
          global.mockModels[name] = new MockModel(collectionName);
        }
        const mockModel = global.mockModels[name];
        const value = Reflect.get(mockModel, prop, mockModel);
        if (typeof value === "function") {
          return value.bind(mockModel);
        }
        return value;
      }
      
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "function") {
        return value.bind(target);
      }
      return value;
    }
  });
}
