const {
  getAllInstructors,
  getInstructorById
} = require('../controllers/instructorController');

const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

jest.mock('../data/database'); 

describe('Instructor Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllInstructors', () => {
    it('should return all instructors with status 200', async () => {
      const mockInstructors = [
        {
          _id: new ObjectId(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          specialty: 'Math'
        }
      ];

      const mockCursor = { toArray: jest.fn().mockResolvedValue(mockInstructors) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getAllInstructors(req, res);

      expect(mongodb.getDb).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInstructors);
    });
  });

  describe('getInstructorById', () => {
    it('should return instructor if found', async () => {
      const instructorId = new ObjectId();
      req.params.id = instructorId.toString();

      const mockInstructor = [{
        _id: instructorId,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        specialty: 'Science'
      }];

      const mockCursor = { toArray: jest.fn().mockResolvedValue(mockInstructor) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getInstructorById(req, res);

      expect(mockCollection.find).toHaveBeenCalledWith({ _id: new ObjectId(req.params.id) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInstructor[0]);
    });

    it('should return 404 if instructor not found', async () => {
      req.params.id = new ObjectId().toString();

      const mockCursor = { toArray: jest.fn().mockResolvedValue([]) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getInstructorById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Instructor not found' });
    });
  });
});
