// __tests__/studentController.test.js
const { getAllStudents, getStudentById } = require('../controllers/studentController');
const mongodb = require('../data/database'); // Esto se va a mockear
const { ObjectId } = require('mongodb');

jest.mock('../data/database'); // Mockea el módulo que accede a la DB

describe('Student Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllStudents', () => {
    it('should return all students with status 200', async () => {
      const mockStudents = [
        {
            _id: new ObjectId("68882f1f81a46581d5d8b760"),
            firstName: "Ezequiel",
            lastName: "Gimenez",
            email: "ezegimenez@example.com",
            dateOfBirth: "1992-07-06",
            phone: "+5493411234567",
            address: "street 123, Rosario, Santa Fe",
            registrationDate: "2025-07-29"
        }
      ];

      // Simular el comportamiento de mongodb.getDb().db().collection().find().toArray()
      const mockCursor = { toArray: jest.fn().mockResolvedValue(mockStudents) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getAllStudents(req, res);

      expect(mongodb.getDb).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStudents);
    });
  });

  describe('getStudentById', () => {
    it('should return student if found', async () => {
      const studentId = new ObjectId("68882f1f81a46581d5d8b760");
      req.params.id = studentId.toString();

    const mockStudent = [{
      _id: studentId,
      firstName: "Ezequiel",
      lastName: "Gimenez",
      email: "ezegimenez@example.com",
      dateOfBirth: "1992-07-06",
      phone: "+5493411234567",
      address: "street 123, Rosario, Santa Fe",
      registrationDate: "2025-07-29"
    }];

      const mockCursor = { toArray: jest.fn().mockResolvedValue(mockStudent) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getStudentById(req, res);

      expect(mongodb.getDb).toHaveBeenCalled();
      expect(mockCollection.find).toHaveBeenCalledWith({ _id: new ObjectId(req.params.id) });
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStudent[0]);
    });

    it('should return 404 if student not found', async () => {
      const studentId = new ObjectId();
      req.params.id = studentId.toString();

      const mockCursor = { toArray: jest.fn().mockResolvedValue([]) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });
  });
});
